'use strict';

const getCandidatesByPages = require('../../database-helpers/elasticsearch/csv_list/get_candidates_per_pages');
const getPageNumber = require('./helpers/get_page_number');
const lastEmailDate = require('../../helpers/last_email_date.js');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const getBlacklistCompanies = require('../../helpers/get_blacklist_companies');
const blacklist = require('../../helpers/blacklist.js');
const sortByLevelSkill = require('../../helpers/sort_by_level_skill.js');
const Stage = require('../../database-helpers/mongo/models/stage');
const Candidate = require('../../database-helpers/mongo/models/candidate');


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

      profile.lastEmail = lastEmailDate(profile.emails);
      //filter on emails to take out emails that has been sent within last month
      profile.listSkills = sortByLevelSkill(profile.skills || []).slice(0,6);
      candidates.push(profile);

    });

    getBlacklistCompanies(function(error, clientList){
      candidates.forEach(function(profile) {
        blacklist(profile, clientList);
    });

    var promises = [];
      candidates.forEach(c => {
        promises.push(
            Stage.find({candidateId:c.id})
              .then(s => {
                c.stages = s;
              })
        );
      });

      candidates.forEach(c => {
        promises.push(
          Candidate.findOne({indexId:c.id})
            .then(cm => {
              if (cm) { cm.merge(c); }
            })
        );
      });

    Promise.all(promises).then( () => {

      listClients(function (errClients, clients) {

          listStages(function (errStages, stages) {

            reply.view('search', {
              candidates: candidates,
              pages: pages,
              page: (pageNumber + 1),
              clients: clients,
              stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
              listSearchBar: true,
              listName: request.params.listName,
              request: request

            });

          });

        });

      });
    });
  });
}
