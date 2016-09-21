'use strict';

/**
* Return list of candidates
*/

const Underscore = require('underscore')

const getBlacklistCompanies = require('../../helpers/get_blacklist_companies');
const blacklist = require('../../helpers/blacklist.js');
const lastEmailDate = require('../../helpers/last_email_date.js');
const lastEmail30 = require('../../helpers/lastEmail30.js');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const listCandidates = require('../../database-helpers/elasticsearch/home/list_candidates');
const sortByLevelSkill = require('../../helpers/sort_by_level_skill.js');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('login');
  }

  var myId = request.auth.credentials.id;
  var pageNum = request.params.page || 1;
  var perPage = Number(process.env.RESULTS_PER_PAGE);

  if( !Number(request.params.page) && request.params.page !== undefined ) {
    return reply.view('404').code(404);
  }

  if(Number(pageNum) < 1) {
    return reply.redirect('/');
  }

  listCandidates(pageNum, function (resultCandidates) {

    var results = [];
    resultCandidates.candidates.forEach(function(profile) {
      var contact = {};

      contact = Underscore.extend(contact, profile)
      // tweaking some values
      contact.firstName = contact.fullname.split(' ')[0];
      contact.connectedTo = contact.connectedTo || [];
      contact.viewedBy = profile.viewedBy || [];
      contact.lastEmail = lastEmailDate(contact.emails);
      //filter on emails to take out emails that has been sent within last month
      contact.emailLast30 = lastEmail30(contact.emails);
      contact.listSkills = sortByLevelSkill(profile.skills || []).slice(0,6);
      results.push(contact);

    });

      var nbPages = Math.ceil(resultCandidates.totalCandidates / perPage);

      if( Number(pageNum) > nbPages ) {
         return reply.redirect('/');
      }

      getBlacklistCompanies(function(error, clientList){

        results.forEach(function(profile) {
          blacklist(profile, clientList);
        });

        listClients(function (errClients, clients) {

          listStages(function (errStages, stages) {

            return reply.view('home', {
                candidates: results,
                page_url_prev: page_url_prev,
                page_url_next: page_url_next,
                page: request.params.page || 1,
                pages: nbPages,
                clients: clients,
                stages: (() => { let r = {}; stages.forEach(s => { r[s.id] = s }); return r; })()
            });
          });
        });
      });
    });
}
