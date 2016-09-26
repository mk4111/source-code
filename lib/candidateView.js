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

const sortByLevelSkill = require('./helpers/sort_by_level_skill.js');

const Stage = require('./database-helpers/mongo/models/stage');

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/candidate/{id}/{keywords?}',
    config: {
      description: 'return the candidate detailed view page',
      auth: { mode: 'try', strategy: 'jwt'},
      handler:  (request, reply) => {

        if (!request.auth.isAuthenticated) { return reply.redirect('/login'); }

          es.get({
            index: process.env.ES_INDEX,
            type: process.env.ES_TYPE,
            id: request.params.id.toString()
          }, function (error, response) {
            if(!response.found) {
              return reply.view('404').code(404);
            }
            response._source.firstName = response._source.fullname.split(' ')[0];

              response._source.id = response._id;
              // not sure if we will need them but let them stay for a while yet
              response._source.keywords = (request.params.keywords) ? decodeURIComponent(request.params.keywords) : '';

              // ok yhis doesn't make sense at all, 
              response._source.connectedTo = response._source.connectedTo || [];
              var emails = response._source.emails || [];
              response._source.emails = emails;
              response._source.lastEmail = lastEmailDate(emails);
              var jobApplications = response._source.jobApplications;
              jobApplications = jobApplications.sort((a,b) => { return a.timestamp - b.timestamp; } );
              response._source.jobApplications = jobApplications;
              response._source.notesList.reverse();
              response._source.listSkills = sortByLevelSkill(response._source.skills || []).slice(0,6);

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
                            response._source.stages = candidateStages
                            return reply.view('candidateView', {
                              candidate: response._source,
                              jobs: jobs,
                              jobsActive: jobsActive,
                              clients: clients,
                              users: users,
                              stages:stages,
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
  });

  return next();
};

exports.register.attributes = {
  name: 'candidateView'
};
