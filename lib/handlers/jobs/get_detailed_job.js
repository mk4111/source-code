'use strict';

const getJob = require('../../database-helpers/elasticsearch/get_jobs');
const getClients = require('../../database-helpers/elasticsearch/list_clients');
const getCountries = require('../../database-helpers/elasticsearch/get_countries');
const multigetSectors = require('../../database-helpers/elasticsearch/multiget_sectors');
const getCandidatesJob = require('../../database-helpers/elasticsearch/get_candidates_job');
const mulitgetCategories = require('../../database-helpers/elasticsearch/multiget_categories');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {

    //JOB
    getJob(request.params.id, function (err, job) {
      //COUNTRY
      getCountries(job.address.countryID, function (errCountries, country) {
        // $lab:coverage:off$
        if (errCountries) {
          console.log(errCountries);
        }
        // $lab:coverage:on$

        job.countryLabel = country.label;

        //CLIENT
        getClients(function (errClients, clients) {

          const client = clients.filter(function (client) {

            return client.jobs.indexOf(job.id) > -1;
          })

          job.client = client[0];

          //SECTOR
          //create an array of ids sectors
          const idsSector = job.businessSectors.data.map( sectorObj => sectorObj.id);
            multigetSectors(idsSector, function(errorSectors, responseSectors) {

              job.sectors = responseSectors;

              //CANDIDATES
              getCandidatesJob(request.params.id, function(errorCandidates, candidates) {
                job.candidates = candidates;

                //CATEGORIES
                const idsCategories = job.categories.data.map( category => category.id);
                mulitgetCategories(idsCategories, function(errorCategories, responseCategories) {

                  job.categories = responseCategories;
                  return reply.view('jobDetailedView', {job:job, request: request});

                })

              })

            })

        });

      });

    });
  }
}
