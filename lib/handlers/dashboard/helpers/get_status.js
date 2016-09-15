'use strict';

const listMyClients = require('../../../database-helpers/elasticsearch/list_my_clients');
const listJobs = require('../../../database-helpers/elasticsearch/list_jobs');
const listStages = require('../../../database-helpers/elasticsearch/list_stages');
const listCountries = require('../../../database-helpers/elasticsearch/list_countries');
const createDashObj = require('./create_my_dashboard_obj');
const getCandidatesWithStatus = require('../../../database-helpers/elasticsearch/get_candidates_with_status');
const linkCandidatesToJobs = require('./link_candidates_to_job');
const linkMyStatusToJob = require('./link_my_status_to_job');
const filterJobs = require('./filter_jobs');
const filterStages = require('./filter_stages');
const listGmUsers = require('../../../database-helpers/elasticsearch/list_users_with_id_google');

module.exports = function(idUser, idConnectedUser, next) {

    listGmUsers( (errorUsers, users ) => {

        const userFitlered = users.filter( user => {
          return user.idGoogle.toString() === idUser;
        })

        let userConnected = users.filter( user => {
          return user.idGoogle.toString() === idConnectedUser;
        });

      const me = userFitlered[0];
      userConnected = userConnected[0];

      listMyClients(me.id, function (errClients, clients) {

        listJobs(function (errJobs, jobs) {

          jobs = jobs.filter(job => job.active === true);
          const myJobs = jobs.filter(job => job.owner.id === me.id);
          const otherJobs = jobs.filter(job => job.owner.id !== me.id);

          listStages(function (errStages, stages) {

            getCandidatesWithStatus( function(err, candidates) {

              // @speedingdeer: I don't see much sense in using ES just ot get all data
              // and nexy filter them manually, It's so no efficient ...

              let myJobsObject = createDashObj(myJobs,stages);
              let otherJobsObject = createDashObj(otherJobs, stages);
              linkCandidatesToJobs(candidates, myJobsObject);
              linkMyStatusToJob(candidates, otherJobsObject, me.idGoogle);

              //filter otherJobsObject to keep only the jobs containing a candidates
              otherJobsObject = filterJobs(otherJobsObject);

              //filter non empty stages
              myJobsObject = filterStages(myJobsObject);
              otherJobsObject = filterStages(otherJobsObject);

              // should come rather from ES
              var candidatesList = {};
              for(var jobIdx in myJobsObject) {
                for (var stageIdx in myJobsObject[jobIdx]) {
                  myJobsObject[jobIdx][stageIdx].forEach( c => {
                    candidatesList[c.id] = c.fullname;
                  });
                }
              }


              listCountries(function (err, countries){

                return next({
                  admin: userConnected.admin,
                  clients: clients,
                  users: users,
                  myRoles: myJobs,
                  otherRoles: otherJobs,
                  myJobs: myJobsObject,
                  otherJobs: otherJobsObject,
                  candidates: candidatesList,
                  jobsMap: (() => { let r = {}; jobs.forEach(o => { r[o.id] = o }); return r; })(),
                  clientsMap: (() => { let r = {}; clients.forEach(o => { r[o.id] = o; }); return r; })(),
                  stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                  countries: (() => { let r = {}; countries.forEach(o => { r[o.value] = o }); return r; })()
                });

              });

            });

          });

        });

      });

    });

}
