'use strict';

const Underscore = require('underscore');

const es = require('./es.js');
const getBlacklistCompanies = require('./helpers/get_blacklist_companies');
const blacklist = require('./helpers/blacklist.js');
const lastEmailDate = require('./helpers/last_email_date.js');
const multigetJobs = require('./database-helpers/elasticsearch/multiget_jobs.js');
const listUsers = require('./database-helpers/elasticsearch/list_users_with_id_google');
const listStages = require('./database-helpers/elasticsearch/list_stages');
const listCountries = require('./database-helpers/elasticsearch/list_countries');
const getUserByIdGoogle = require('./database-helpers/elasticsearch/get_user_by_id_google');
const sortByLevelSkill = require('./helpers/sort_by_level_skill.js');

const Es = require('./es');

const Stage = require('./database-helpers/mongo/models/stage');
const Candidate = require('./database-helpers/mongo/models/candidate');
const Call = require('./database-helpers/mongo/models/call');
const List = require('./database-helpers/mongo/models/list');
const EmailTemplate = require('./database-helpers/mongo/models/email_template');

const ClientsWithJobsService = require('./helpers/clients_with_jobs.js');


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
              response._source.lastEmail = lastEmailDate(response._source.emails || []);

              var jobApplications = response._source.jobApplications || [];
              jobApplications = jobApplications.sort((a,b) => { return a.timestamp - b.timestamp; } );
              response._source.jobApplications = jobApplications;
              var notes = response._source.notesList || []; // inconsistent
              response._source.notesList = notes.reverse();
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

                      listUsers(function (errUsers, users) {

                        listStages(function (errStages, stages) {

                          getUserByIdGoogle(request.auth.credentials.id, function (err, user) {

                            Stage.find( {candidateId: request.params.id.toString()} ).then(candidateStages => {

                              var clientsMap = {};
                              var jobsMap = {};

                              candidateStages.forEach(s => {
                                clientsMap[s.clientId] = {};
                                jobsMap[s.jobId] = {};
                              });

                              var promises = []

                              // @TODO: @speedingdeer instead of iterating the whole thing use .map to search by multiple ids
                              Underscore.each(clientsMap, (v,k) => {
                                promises.push(
                                  new Promise((resolve, reject) => {
                                    Es.get({ 
                                      index: process.env.ES_INDEX,
                                      type: process.env.ES_TYPE_GM_CLIENTS,
                                      id: k,
                                      _source: ['id', 'name', 'logoUrl']
                                    })
                                    .then(r => {
                                      r._source.id = k;
                                      clientsMap[k] = r._source;
                                      resolve();
                                    }).catch((e) => { resolve(); });
                                  })
                                );
                              });

                              Underscore.each(jobsMap, (v,k) => {
                                promises.push(
                                  new Promise((resolve, reject) => {
                                    Es.get({
                                      index: process.env.ES_INDEX, type: 
                                      process.env.ES_TYPE_GM_JOBS,
                                      id: String(k),
                                      _source: ['title', 'client', 'location', 'salary', 'address', 'employmentType'],
                                    })
                                    .then(r => {
                                      jobsMap[k] = r._source;
                                      resolve();
                                    }).catch((e) => { resolve(); });
                                  })
                                );
                              });

                              var activeJobs = {};
                              var clientsWithJobs = {};

                              ClientsWithJobsService().then((clientsWithJobs) => {

                                Promise.all(promises).then(() => {

                                 Candidate.findOneAndUpdate({ indexId: request.params.id.toString() }, {}, { upsert: true, new: true, setDefaultsOnInsert: true }).populate('calls')
                                 .then(c => {
                                  if(c) { response._source = c.merge(response._source); }
                                  Promise.all(promises)
                                    .then(() => {
                                      return List.find({});
                                    }).then((lists) => {
                                      response._source.stages = candidateStages;
                                      var listToAdd = [];
                                      Underscore.each(lists, l => {
                                        var toAdd = true;
                                        Underscore.each(l.candidates, c => {
                                          if(c == response._source.mongo_id) {
                                            toAdd = false;
                                            return false;
                                          }
                                        });
                                        if (toAdd) { listToAdd.push(l); }
                                      });
                                      EmailTemplate.find({})
                                        .then( (email_templates) => {
                                          listCountries(function (err, countries) {
                                            return reply.view('candidateView', {
                                              countries: countries,
                                              email_templates: email_templates,
                                              lists: listToAdd,
                                              request: request,
                                              candidate: response._source,
                                              jobs: jobsMap,
                                              clients: clientsMap,
                                              user: user,
                                              callSaved: request.yar.flash('call-saved'),
                                              listSaved: request.yar.flash('list-saved'),
                                              emailSent: request.yar.flash('email-sent'),
                                              usersByGoogle: (() => { let r = {}; users.forEach(o => { r[o.idGoogle] = o }); return r; })(),
                                              activeJobs: clientsWithJobs.activeJobs,
                                              clientsWithJobs: clientsWithJobs.clientsWithJobs,
                                              stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                                              calls: request.yar.get('calls'),
                                              emails: [{email: response._source.email, id: response._source.id, fn: response._source.firstName}]
                                            });
                                          });
                                        });
                                    }).catch(e => { console.log (e) });

                                 });

                                });

                              });

                            }).catch(e => { console.log (e) });

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
