'use strict';

/**
* Return list of candidates matching search query on fields:
* fullname, location, current job, company, skills
*/

const Underscore = require("underscore");
const Querystring = require('querystring');

const matchTerms = require('../../helpers/match_terms.js');
const listIntersectedSkills = require('../../helpers/intersection.js');
const sortByLevelSkill = require('../../helpers/sort_by_level_skill.js');
const getBlacklistCompanies = require('../../helpers/get_blacklist_companies');
const blacklist = require('../../helpers/blacklist.js');
const lastEmailDate = require('../../helpers/last_email_date.js');
const saveAnalytics = require('../../database-helpers/elasticsearch/save_analytics');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const listSearchedCandidates = require('../../database-helpers/elasticsearch/query/list_candidates_per_search');

const Stage = require('../../database-helpers/mongo/models/stage');
const Candidate = require('../../database-helpers/mongo/models/candidate');


module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  }

  var myId = request.auth.credentials.id;
  var pageNum = Number(request.params.page) || 1;
  var perPage = Number(process.env.RESULTS_PER_PAGE);
  var page = Number(request.params.page) || 1;

  var headline = request.query.job;
  var fullname = request.query.fullname;
  var current = request.query.current;
  var location = request.query.location;

  var skills = (request.query.skills) ? request.query.skills.split(',') : [];
  skills = skills.filter(a => a !== '');
  skills = skills.map(function(skill) {
    return skill.toLowerCase();
  });

  var keywords = headline
                 + ' ' + fullname
                 + ' ' + current
                 + ' ' + location
                 + ' ' + skills.join(' ');

  var numberTerms = 0;

  if( !Number(request.params.page) && request.params.page !== undefined ) {
    return reply.view('404').code(404);
  }

  if(Number(pageNum) < 1) {
    return reply.redirect('/');
  }

  var mustClause = [];

  var analytics = {
    idUser: myId,
    queryUrl: request.url.path,
    timestamp: Date.now(),
    query: {
      headline: '',
      fullname: '',
      current: '',
      location: '',
      skills: []
    },
    nbResults: 0
  };

  if (! Underscore.isEmpty(headline)) {
    numberTerms += headline.split(' ').length;
    mustClause.push({match: {headline: headline}});

    analytics.query.headline = headline;
  }
  if (! Underscore.isEmpty(fullname)) {
    numberTerms += fullname.split(' ').length;
    mustClause.push({match: {fullname: fullname}});

    analytics.query.fullname = fullname;
  }
  if (! Underscore.isEmpty(current)) {
    numberTerms += current.split(' ').length;
    mustClause.push({match: {current: current}});

    analytics.query.current = current;
  }
  if (! Underscore.isEmpty(location)) {
    numberTerms += location.split(' ').length;
    mustClause.push({match: {location: location}});

    analytics.query.location = location;
  }
  if (! Underscore.isEmpty(skills)) {
    numberTerms += 1;
    skills.forEach(function (skill) {
      mustClause.push({match: {"skills.skill": skill}});
    })
    analytics.query.skills = skills;
  }

  if ( mustClause.length > 0 ) {

    listSearchedCandidates(mustClause, pageNum, function (resCandidates) {

      analytics.nbResults = resCandidates.totalCandidates;

      var results = [];

      resCandidates.candidates.forEach(function (profile) {

        var numberTermsMatch = 0;
        var contact = profile;

        contact.listSkills = listIntersectedSkills(skills, contact.skills);
        contact.listSkills = contact.listSkills.slice(0,6); // make sure there are not more than 6 skills in list

        var listSkillsFlattened = (() => { let r = []; Underscore.each(contact.listSkills, (s) => { r.push(s.skill.toLowerCase()); s.matched = true; }); return r; })();
        var allSkillSorted = sortByLevelSkill(profile.skills || []);
        Underscore.each(allSkillSorted, (s) => {
          if (contact.listSkills.length >= 6) { return true; } // break we don't need more
          if (Underscore.contains(listSkillsFlattened, s.skill.toLowerCase())) { return false; } // continue - try the next one
          listSkillsFlattened.push(s.skill.toLowerCase());
          contact.listSkills.push(s);
        });
        contact.listSkills = sortByLevelSkill(contact.listSkills || [])
        contact.firstName = contact.fullname.split(' ')[0];

        if(profile.contacts) {
          profile.email = profile.contacts.email;
          profile.phone = profile.contacts.phone;
        }

        var emails = contact.emails || [];
        contact.lastEmail = lastEmailDate(emails);

        //create match percentage
        if (! Underscore.isEmpty(location)) {
          numberTermsMatch += matchTerms(location, contact.location);
        }
        if (! Underscore.isEmpty(current)) {
        numberTermsMatch += matchTerms(current, contact.current);
        }
        if (! Underscore.isEmpty(fullname)) {
        numberTermsMatch += matchTerms(fullname, contact.fullname);
        }
        numberTermsMatch += matchTerms(headline, contact.headline);
        //if the skills are define we increment the match to keep a good match percentage
        if(skills.length > 0){
          numberTermsMatch += 1;
        }
        contact.percentageMatch = Math.round(numberTermsMatch / numberTerms * 100);

        // avoid empty profile.
        if(contact.fullname !== '') {
          results.push(contact);
        }

      });

      var promises = [];
      results.forEach(c => {
        promises.push(
          //new Promise((resolve, reject) => {
            Stage.find({candidateId:c.id})
              .then(s => {
                c.stages = s;
                //resolve();
              })
          //})
        );
      });

      results.forEach(c => {
        promises.push(
          //new Promise((resolve, reject) => {
          Candidate.findOne({indexId:c.id})
            .then(cm => {
              if (cm) { cm.merge(c); }
              //resolve();
            })
          //})
        );
      });

      Promise.all(promises).then( () => {

        //define paginations for search results
        var nbPages = Math.ceil(resCandidates.totalCandidates / perPage);

        if( pageNum > nbPages && nbPages > 0) {
           return reply.redirect('/');
        }

        if( nbPages === 0 ) {
            pageNum = 0;
        }

        getBlacklistCompanies(function(error, clientList) {
          results.forEach(function(canProfile) {
            blacklist(canProfile, clientList);
          });

          saveAnalytics(analytics, function (errorAnalytics, responseAnalytics) {
            // @TODO: what is this whole logging here for?
            //$lab:coverage:off$
             if(errorAnalytics) {
               console.log('error save analytics', errorAnalytics);
             } else {
               console.log('save analytics');
             }
             // $lab:coverage:on$
          });

          // @TODO: doesn't make sense at to provide such a long document to parse here,
          // should list only there clients which are needed to generate state if any.
          // What's more it's actually the home page candidates listing just without any paramters
          // doesn't make sense to keep both - home and query
          listClients(function (errClients, clients) {
            listStages(function (errStages, stages) {
              return reply.view('home',
                {
                  candidates: results,
                  queryString: '?' + Querystring.stringify(request.url.query),
                  page: page,
                  pages: nbPages,
                  request: request,
                  keywords: keywords,
                  headlineValue: request.query.job,
                  fullnameValue: request.query.fullname,
                  currentValue: request.query.current,
                  locationValue: request.query.location,
                  skillsValue: request.query.skills,
                  pathUrl: request.url.path,
                  clients: clients,
                  stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })()
                });
            });
          });
        });
      });
    });

  } else {
    return reply.redirect('/');
  }
}