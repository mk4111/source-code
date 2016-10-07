'use strict';

const clientES = require('../../es.js');
const getJob = require('../../database-helpers/elasticsearch/get_jobs');
const listCountries = require('../../database-helpers/elasticsearch/list_countries');
const listSectors = require('../../database-helpers/elasticsearch/list_sectors');
const listCategories = require('../../database-helpers/elasticsearch/list_categories');
const listClients = require('../../database-helpers/elasticsearch/list_clients');
// const listOwners = require('../../database-helpers/elasticsearch/get_owners');
const listUsers = require('../../database-helpers/elasticsearch/list_gm_users');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {

    getJob(request.params.id, function (errJob, job) {

      //COUNTRIES
      listCountries(function (errCountries, countries) {
          // $lab:coverage:off$
        if (errCountries) {
          console.log(errCountries);
        }
        // $lab:coverage:on$

        //SECTORS
        listSectors(function (errSectors, sectors) {
              // $lab:coverage:off$
          if (errSectors) {
            console.log(errSectors);
          }
          // $lab:coverage:on$

          //CATEGORIES
          listCategories(function (errorCategories, categories) {

            listClients(function(errorClients, clients) {

              const client = clients.filter(function (client) {
                return client.jobs.indexOf(job.id) > -1;
              })

              job.client = client[0];

              //OWNERS
              listUsers(function (errorUsers, users) {
                return reply.view('jobCreateView',
                                  {  job:job,
                                     countries: countries,
                                     sectors:sectors,
                                     categories: categories,
                                     clients: clients,
                                     users: users,
                                     request: request
                                   });
              })

            })
          })

        })

      });

    });
  }
}
