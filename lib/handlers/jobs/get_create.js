'use strict';

const listUsers = require('../../database-helpers/elasticsearch/list_gm_users');
const listCountries = require('../../database-helpers/elasticsearch/list_countries.js');
const listSectors = require('../../database-helpers/elasticsearch/list_sectors.js');
const listClients = require('../../database-helpers/elasticsearch/list_clients.js');
const listCategories = require('../../database-helpers/elasticsearch/list_categories');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('login');
  } {

    listUsers(function (errUsers, users) {
      // $lab:coverage:off$
      if (errUsers) {
        console.log(errUsers);
      }
      // $lab:coverage:on$
      listCountries(function (errCountries, countries) {
          // $lab:coverage:off$
        if (errCountries) {
          console.log(errCountries);
        }
        // $lab:coverage:on$
        listSectors(function (errSectors, sectors) {
              // $lab:coverage:off$
          if (errSectors) {
            console.log(errSectors);
          }
          // $lab:coverage:on$

          listClients(function (errClients, clients) {
             // $lab:coverage:off$
            if (errClients) {
              console.log(errClients);
            }
            // $lab:coverage:on$

            listCategories(function(errorCategories, categories){

               // $lab:coverage:off$
               if (errClients) {
                 console.log(errorCategories);
               }
               // $lab:coverage:on$

               //filter the inactive users
               const activeUsers = users.filter( user => {return user.active});

               return reply.view('jobCreateView',
                                 { users: activeUsers,
                                   countries:countries,
                                   sectors:sectors,
                                   clients:clients,
                                   request: request,
                                   categories: categories});

            })

          })
        });
      });
    });
  }
}
