'use strict';

const clientES = require('../../es.js');
const listJobs = require('../../database-helpers/elasticsearch/list_jobs');
const listCountries = require('../../database-helpers/elasticsearch/list_countries');

module.exports = function (request, reply) {

  var accept = request.headers.accept.split(',');

  listJobs(function(err, response) {
    //api json request
    if(accept.indexOf('application/json') !== -1) {
      //filter on active
      const activeJobs = response.filter( job => job.active );

      return reply(activeJobs);

     } else {
       //our application request
       listCountries(function(errorCountries, countries) {

         response.forEach(function(job) {

           const countryLabels = countries.filter(function(countryObj) {
             return countryObj.value.toString() === job.address.countryID.toString();
           });

           job.countryLabel = countryLabels[0].label;
         });

         const activeJobs = response.filter( job => job.active );
         const inactiveJobs = response.filter ( job => !job.active );

         return reply.view('jobs', {activeJobs: activeJobs, inactiveJobs: inactiveJobs, request: request});
       });
    }
  });
};
