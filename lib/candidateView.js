'use strict';

const es = require('./es.js');
const getBlacklistCompanies = require('./helpers/get_blacklist_companies');
const blacklist = require('./helpers/blacklist.js');
const lastEmailDate = require('./helpers/last_email_date.js');
const multigetJobs = require('./database-helpers/elasticsearch/multiget_jobs.js');
const jobList = require('./database-helpers/elasticsearch/list_jobs.js');
const listClients = require('./database-helpers/elasticsearch/list_clients');
const listUsers = require('./database-helpers/elasticsearch/list_users_with_id_google');
const listStages = require('./database-helpers/elasticsearch/list_stages');
const rejectedJobs = require('./handlers/candidate-view/helpers/rejected_jobs');

const Stage = require('./database-helpers/mongo/models/stage');

// $lab:coverage:off$
const compare = function (jobAppA, jobAppB) {
  if (jobAppB.timestamp < jobAppA.timestamp)
    return -1;
  else if (jobAppB.timestamp > jobAppA.timestamp)
    return 1;
  else
    return 0;
}
// $lab:coverage:on$

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/candidate/{id}/{keywords?}',
    config: {
      description: 'return the candidate detailed view page',
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },
      handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
         return reply.redirect('/login');
        }
        else {
          var myId = request.auth.credentials.id;

          es.get({
            index: process.env.ES_INDEX,
            type: process.env.ES_TYPE,
            id: request.params.id.toString()
          }, function (error, response) {
            if(!response.found) {
              return reply.view('404').code(404);
            }
            var listFavourite = response._source.favourite;

            response._source.firstName = response._source.fullname.split(' ')[0];

            response._source.favourite = false;
            if(listFavourite.indexOf(myId) !== -1) {
              response._source.favourite = true;
            }
              response._source.id = response._id;

              if (request.params.keywords) {
                response._source.keywords = decodeURIComponent(request.params.keywords);
              } else {
                response._source.keywords = '';
              }

              response._source.connectedTo = response._source.connectedTo || [];
              var emails = response._source.emails || [];
              response._source.emails = emails;
              response._source.lastEmail = lastEmailDate(emails);

              var jobApplications = response._source.jobApplications;
              jobApplications = jobApplications.sort(compare);
              response._source.jobApplications = jobApplications;
              response._source.notesList.reverse();

              //listNames
              response._source.listNames = response._source.listNames;

              const idsJob = jobApplications.map(application => application.jobID).filter(Boolean);
              multigetJobs(idsJob, function(errJobs, jobs) {

                jobApplications.forEach(function (application) {

                  var timestamp = new Date(application.timestamp);
                  application.date = timestamp.getDate() + '-' + ("0" + (timestamp.getMonth() + 1)).slice(-2) + '-' + timestamp.getFullYear();

                  application.job = {};

                  if(application.jobID) {

                    var jobObj = jobs.filter(function(job) {
                      return application.jobID.toString() === job.id.toString();
                    });
                  application.job = jobObj[0];
                  }

                });

                getBlacklistCompanies(function(error, clientList){

                  blacklist(response._source, clientList);

                  jobList(function (errJobs, jobs) {


                    let jobsActive = jobs.filter( job => {return job.active});



                    listClients(function (errClients, clients) {

                      listUsers(function (errUsers, users) {

                        listStages(function (errStages, stages) {

                          //create the rejected object to create the tags on the canddiate page
                          const rejectedObj = response._source.rejected;
                          const rejectedStatus = rejectedJobs(rejectedObj, jobs, clients);


                          Stage.find( {candidateId: request.params.id.toString()} ).then(candidateStages => {
                            return reply.view('candidateView', {
                              candidate: response._source,
                              jobs: jobs,
                              jobsActive: jobsActive,
                              clients: clients,
                              users: users,
                              stages:stages,
                              candidateStages: candidateStages,
                              rejectedStatus: rejectedStatus
                            });

                          }).catch(e => { console.log (e) });

                        });
                      });
                    });
                  });
                });
              })
          });
        }
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'candidateView'
};
