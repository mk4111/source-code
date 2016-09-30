'use strict';

const getCandidatesByPages = require('../../database-helpers/elasticsearch/csv_list/get_candidates_per_pages');
const getPageNumber = require('./helpers/get_page_number');
const lastEmailDate = require('../../helpers/last_email_date.js');
const lastEmail30 = require('../../helpers/lastEmail30.js');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const getBlacklistCompanies = require('../../helpers/get_blacklist_companies');
const blacklist = require('../../helpers/blacklist.js');
const sortByLevelSkill = require('../../helpers/sort_by_level_skill.js');


module.exports = function (request, reply) {

/**
* Extract the page mumber
* the pageNumber start from 0 with ES!
*/
  const pageNumber = getPageNumber(request.params.pageNumber);

  getCandidatesByPages(decodeURIComponent(request.params.listName), pageNumber, function (result) {

/**
* Define value for the pagination
*/
    const pages = Math.ceil(result.totalCandidates / Number(process.env.RESULTS_PER_PAGE_CSV));

/**
* Define candidates
*/
    const myId = request.auth.credentials.id;
    const candidates = [];

    result.candidates.forEach(profile => {

      // @TODO @speedingdeer: it's copied ove everywhere
      // first stop doing it, abstract somehow the whole thing
      // it's not flexible at all.
      const contact = {};
      contact.id = profile.id;
      contact.fullname = profile.fullname;
      contact.firstName = contact.fullname.split(' ')[0];
      contact.headline = profile.headline;
      contact.current = profile.current;
      contact.picture = profile.picture;
      contact.location = profile.location;
      contact.connectedTo = profile.connectedTo;
      contact.viewedBy = profile.viewedBy;
      const emails = profile.emails;
      contact.emails = emails;
      contact.lastEmail = lastEmailDate(emails);

      //status
      contact.statusCurrent = profile.statusCurrent;
      //filter on emails to take out emails that has been sent within last month
      contact.emailLast30 = lastEmail30(contact.emails);
      contact.listSkills = sortByLevelSkill(profile.skills || []).slice(0,6);
      candidates.push(contact);

    });

    getBlacklistCompanies(function(error, clientList){
      candidates.forEach(function(profile) {
        blacklist(profile, clientList);
    });

    listClients(function (errClients, clients) {

        listStages(function (errStages, stages) {

          reply.view('home', {
            candidates: candidates,
            pages: pages,
            page: (pageNumber + 1),
            clients: clients,
            stages: stages,
            listSearchBar: true,
            listName: request.params.listName
          });
        });
      });
    });
  });
}
