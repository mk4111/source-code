'use strict';

/**
* Return list of candidates matching search query on fields:
* fullname, location, current job, company, skills
*/

const deleteSpaces = require('../../helpers/delete_spaces');
const escapeValue = require('../../helpers/escape_search_value');
const matchTerms = require('../../helpers/match_terms.js');
const completeListSkills = require('../../helpers/list_searched_skills.js');
const getBlacklistCompanies = require('../../helpers/get_blacklist_companies');
const blacklist = require('../../helpers/blacklist.js');
const lastEmailDate = require('../../helpers/last_email_date.js');
const lastEmail30 = require('../../helpers/lastEmail30.js');
const saveAnalytics = require('../../database-helpers/elasticsearch/save_analytics');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const listSearchedCandidates = require('../../database-helpers/elasticsearch/query/list_candidates_per_search');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  }

  var myId = request.auth.credentials.id;
  var pageNum = Number(request.params.page) || 1;
  var perPage = Number(process.env.RESULTS_PER_PAGE);
  var page = Number(request.params.page) || 1;

  var headline = deleteSpaces(escapeValue(request.query.job));
  var fullname = deleteSpaces(escapeValue(request.query.fullname));
  var current = deleteSpaces(escapeValue(request.query.current));
  var location = deleteSpaces(escapeValue(request.query.location));

  var skills = request.query.skills.split(',');
  skills = skills.map(deleteSpaces);
  skills = skills.filter(a => a !== '');
  skills = skills.map(function(skill) {
    return skill.toLowerCase();
  });

  var keywords = deleteSpaces(headline)
                 + ' ' + deleteSpaces(fullname)
                 + ' ' + deleteSpaces(current)
                 + ' ' + deleteSpaces(location)
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

  if (headline !== '') {
    numberTerms += headline.split(' ').length;
    mustClause.push({match: {headline: headline}});

    analytics.query.headline = headline;
  }
  if (fullname !== '') {
    numberTerms += fullname.split(' ').length;
    mustClause.push({match: {fullname: fullname}});

    analytics.query.fullname = fullname;
  }
  if (current !== '') {
    numberTerms += current.split(' ').length;
    mustClause.push({match: {current: current}});

    analytics.query.current = current;
  }
  if (location !== '') {
    numberTerms += location.split(' ').length;
    mustClause.push({match: {location: location}});

    analytics.query.location = location;
  }
  if (skills.length > 0) {
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

        contact.listSkills = completeListSkills(skills, contact.skills);
        contact.firstName = contact.fullname.split(' ')[0];

        contact.listFavourite = contact.favourite;
        contact.favourite = false;
        if(contact.listFavourite.indexOf(myId) !== -1) {
          contact.favourite = true;
        }
        contact.email = contact.contacts.email;
        contact.id = contact.id;
        contact.connectedTo = contact.connectedTo || [];
        //status
        contact.statusCurrent = contact.statusCurrent;

        var emails = contact.emails || [];
        contact.lastEmail = lastEmailDate(emails);

        //filter on emails to take out emails that has been sent within last month
        contact.emailLast30 = lastEmail30(emails);

        //create match percentage
        numberTermsMatch += matchTerms(location, contact.location);
        numberTermsMatch += matchTerms(current, contact.current);
        numberTermsMatch += matchTerms(fullname, contact.fullname);
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

      //define paginations for search results
      var nbPages = Math.ceil(resCandidates.totalCandidates / perPage);

      if( pageNum > nbPages && nbPages > 0) {
         return reply.redirect('/');
      }

      if( nbPages === 0 ) {
          pageNum = 0;
      }

      var page_url_prev = 1;
      var page_url_next = Math.ceil(resCandidates.totalCandidates / perPage);

      if (pageNum > 1) {
        page_url_prev = '/query/' + (pageNum - 1)
                                  + '?job='+ encodeURIComponent(request.query.job)
                                  +  '&fullname=' + encodeURIComponent(request.query.fullname)
                                  +  '&current=' + encodeURIComponent(request.query.current)
                                  + '&location=' + encodeURIComponent(request.query.location)
                                  + '&skills=' + encodeURIComponent(request.query.skills);
      }
      if (pageNum < page_url_next) {
        pageNum++;
        page_url_next = '/query/' + pageNum
                                  + '?job='+ encodeURIComponent(request.query.job)
                                  +  '&fullname=' + encodeURIComponent(request.query.fullname)
                                  +  '&current=' + encodeURIComponent(request.query.current)
                                  + '&location=' + encodeURIComponent(request.query.location)
                                  + '&skills=' + encodeURIComponent(request.query.skills);
      }


      getBlacklistCompanies(function(error, clientList) {
        results.forEach(function(canProfile) {
          blacklist(canProfile, clientList);
        });

        saveAnalytics(analytics, function (errorAnalytics, responseAnalytics) {
          //$lab:coverage:off$
           if(errorAnalytics) {
             console.log('error save analytics', errorAnalytics);
           } else {
             console.log('save analytics');
           }
           // $lab:coverage:on$
        });

        listClients(function (errClients, clients) {
          listStages(function (errStages, stages) {
            return reply.view('home',
              {
                candidates: results,
                page_url_prev: page_url_prev,
                page_url_next: page_url_next,
                page: page,
                pages: nbPages,
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

  } else {
    return reply.redirect('/');
  }
}
