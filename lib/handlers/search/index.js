'use strict';

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

const es = require('../../es');
const Stage = require('../../database-helpers/mongo/models/stage');
const Candidate = require('../../database-helpers/mongo/models/candidate');


module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); }

  var myId = request.auth.credentials.id;
  var pageNum = Number(request.params.page) || 1;
  var perPage = Number(process.env.RESULTS_PER_PAGE);
  var queryString = (request.query.q) ? request.query.q : "";

  var filter = {
    bool: {
      must: [],
      must_not: []
    }
  };
  // build filters
  if (request.query.req_sent_application) {
    filter.bool.must_not.push( { missing: { field: "jobApplications" } } )
  }
  if (request.query.req_cv) {
    filter.bool.must.push({ regexp : { "cvDocumentLink": ".+" } });
  }
  if (request.query.req_email) {
    filter.bool.must.push( {
      or: [ 
        { regexp : { "contacts.email": ".+" } }, 
        { regexp : { "contacts.edited_email": ".+" } }
      ]
    } );
  }
  if (request.query.req_phone) {
    filter.bool.must.push( { regexp : { "contacts.phone": ".+" } } );
  }
  if (request.query.req_salary) {
    filter.bool.must.push( { regexp : { "info.sexpected": ".+" } } );
  }
  // build query
  var query = {  match_all: {} }; // default
  if (request.query.q) {
    // query string
    query = { 
      multi_match: {
        query: request.query.q,
        type: "cross_fields",
        fields: ["headline", "fullname", "location", "current", "skills.skill", "contacts.edited_email", "contacts.email", "languages.lang"]
      }
    };
  }

  // check on advance search if any
  var matchAdvanced = [];
  if (request.query.headline) {
        matchAdvanced.push({match: {headline: request.query.headline}});
  }
  if (request.query.company) {
        matchAdvanced.push({match: {current: request.query.company}});
  }
  if (request.query.fullname) {
        matchAdvanced.push({match: {fullname: request.query.fullname}});
  }
  if (request.query.location) {
        matchAdvanced.push({match: {location: request.query.location}});
  }
  if (request.query.skills) {
    var skills = request.query.skills.split(",").map( s => { return s.trim() });
    skills = skills.filter(s => s !== '');

    skills.forEach(function (skill) {
      matchAdvanced.push( { match: { "skills.skill": skill } } );
    });
  }
  if (request.query.languages) {
    var languages = request.query.languages.split(",").map( s => { return s.trim() });
    languages = languages.filter(s => s !== '');
    languages.forEach(function (language) {
      matchAdvanced.push( { match: { "languages.lang": language } } );
    });
  }

  if (matchAdvanced.length) {
    query = { bool: { must: matchAdvanced } }
  }


  es.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    from: (pageNum - 1) * perPage,
    size: perPage,
    _source: ['id', 'info', 'url', 'jobApplications', 'cvDocumentLink', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts', 'headline', 'emails', 'viewedBy', 'skills'],
    body: {
      query: query,
      filter: filter,
      sort: [
        {_score: {"order": "desc"} },
        { date: {"order": "desc"} }
      ]
    }
  }).then(response => {
    
    var candidates = [];
    var totalCandidates = response.hits.total;
    var results = [];

    response.hits.hits.forEach(function (candidate) {
      candidate._source.id = candidate._id;
      candidates.push(candidate._source);
    });

    candidates.forEach(function (profile) {

        var contact = profile;
        if (matchAdvanced.length) {
          contact.listSkills = listIntersectedSkills(skills || [], contact.skills);
        } else {
          contact.listSkills = listIntersectedSkills(queryString.toLowerCase().split(','), contact.skills);
        }
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
        results.push(contact);

      });

      var promises = [];
      results.forEach(c => {
        promises.push(
            Stage.find({candidateId:c.id})
              .then(s => {
                c.stages = s;
              })
        );
      });

      results.forEach(c => {
        promises.push(
          Candidate.findOne({indexId:c.id})
            .then(cm => {
              if (cm) { cm.merge(c); }
            })
        );
      });

      Promise.all(promises).then( () => {

        //define paginations for search results
        var nbPages = Math.ceil(totalCandidates / perPage);

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

          // @TODO: doesn't make sense at to provide such a long document to parse here,
          // should list only there clients which are needed to generate state if any.
          // What's more it's actually the home page candidates listing just without any paramters
          // doesn't make sense to keep both - home and query
          listClients(function (errClients, clients) {

            listStages(function (errStages, stages) {
              return reply.view('search',
                {
                  candidates: results,
                  q: queryString,
                  page: pageNum,
                  pages: nbPages,
                  request: request,
                  //keywords: keywords,
                  headlineValue: request.query.job,
                  fullnameValue: request.query.fullname,
                  currentValue: request.query.current,
                  locationValue: request.query.location,
                  skillsValue: request.query.skills,
                  clients: clients,
                  stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })()
                });
            });
          });
        });
      });
    });

}
