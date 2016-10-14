'use strict';

/**
* Search candidates by skills
*/

const deleteSpaces = require('../../helpers/delete_spaces');
const getPageNumber = require('./helpers/get_page_number');
const searchCandidatesBySkills = require('../../database-helpers/elasticsearch/csv_list/search_candidates_by_skills');
const lastEmailDate = require('../../helpers/last_email_date.js');
const lastEmail30 = require('../../helpers/lastEmail30.js');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const getBlacklistCompanies = require('../../helpers/get_blacklist_companies');
const blacklist = require('../../helpers/blacklist.js');
const completeListSkills = require('../../helpers/list_searched_skills.js');

module.exports = function (request, reply) {

  const myId = request.auth.credentials.id;

  /**
  * Define skills keywords
  */
  let skills = request.query.skills.split(',');
  skills = skills.map(deleteSpaces);
  skills = skills.filter(a => a !== '');
  skills = skills.map(function(skill) {
    return skill.toLowerCase();
  });
  const keywords = skills.join(' ');

  /**
  * Define value for the pagination
  */
  const pageNumber = getPageNumber(request.params.pageNumber);

  searchCandidatesBySkills(decodeURIComponent(request.params.listName), skills, pageNumber, function(result){

    const pages = Math.ceil(result.totalCandidates / Number(process.env.RESULTS_PER_PAGE_CSV));


    const candidates = [];

    result.candidates.forEach(profile => {

      const contact = {};
      contact.listFavourite = profile.favourite;
      contact.favourite = false;

      if(contact.listFavourite.indexOf(myId) !== -1) {

        contact.favourite = true;
      }

      contact.id = profile.id;
      contact.fullname = profile.fullname;
      contact.firstName = contact.fullname.split(' ')[0];
      contact.headline = profile.headline;
      contact.current = profile.current;
      contact.picture = profile.picture;
      contact.location = profile.location;
      contact.connectedTo = profile.connectedTo;
      contact.listSkills = completeListSkills(skills, profile.skills);
      contact.viewedBy = profile.viewedBy;
      const emails = profile.emails;
      contact.emails = emails;
      contact.lastEmail = lastEmailDate(emails);

      //status
      contact.statusCurrent = profile.statusCurrent;
      //filter on emails to take out emails that has been sent within last month
      contact.emailLast30 = lastEmail30(contact.emails);

      if (profile.contacts.email) {
        contact.email = profile.contacts.email;
      } else {
        contact.email = '';
      }

      candidates.push(contact);
    });

    getBlacklistCompanies(function(error, clientList){
      candidates.forEach(function(profile) {
        blacklist(profile, clientList);
      });

      listClients(function (errClients, clients) {

        listStages(function (errStages, stages) {

          return  reply.view('search', {
            candidates: candidates,
            pages: pages,
            page: (pageNumber + 1),
            clients: clients,
            stages: stages,
            listSearchBar: true,
            listName: request.params.listName,
            keywords: keywords,
            skillsValue: request.query.skills,
            request: request,
            pathUrl: request.url.path,
          });
        });
      });
    });
  });
}
