'use strict';

const Underscore = require('underscore');
const listMyClients = require('../../../database-helpers/elasticsearch/list_my_clients');
const listClients = require('../../../database-helpers/elasticsearch/list_clients');
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

function jobsPerUser(jobs, stages, candidates, user) {
  var myJobs = jobs.filter(job => job.owner.id === user.id);
  var otherJobs = jobs.filter(job => job.owner.id !== user.id);

  // @speedingdeer: I don't see much sense in using ES just ot get all data
  // and nexy filter them manually, It's so no efficient ...
  let myJobsObject = createDashObj(myJobs, stages);
  let otherJobsObject = createDashObj(otherJobs, stages);
  linkMyStatusToJob(candidates, myJobsObject, user.idGoogle);
  linkMyStatusToJob(candidates, otherJobsObject, user.idGoogle);

  // filter otherJobsObject to keep only the jobs containing a candidates
  otherJobsObject = filterJobs(otherJobsObject);
  // filter non empty stages
  myJobsObject = filterStages(myJobsObject);
  otherJobsObject = filterStages(otherJobsObject);

  var allJobs = Underscore.extend({}, myJobsObject, otherJobsObject);
  var allStagesNumber = 0;
  Underscore.each(allJobs, (stages,k) => {
    Underscore.each(stages, (stage,k) => {
      allStagesNumber += stage.length;
    });
  });

  return [myJobs, otherJobs, myJobsObject, otherJobsObject, allJobs, allStagesNumber];

}

module.exports = function(request, idUser, idConnectedUser, next) {

    listGmUsers( (errorUsers, users ) => {

      const userFitlered = users.filter( user => { return user.idGoogle.toString() === idUser; })
      let userConnected = users.filter( user => { return user.idGoogle.toString() === idConnectedUser; });

      const me = userFitlered[0];
      userConnected = userConnected[0];

      listClients(function (errClients, clients) {

        var clientsMap = (() => { let r = {}; clients.forEach(o => { r[o.id] = o; }); return r; })();

        listJobs(function (errJobs, jobs) {

          jobs = jobs.filter(job => job.active === true);
          var jobsMap = (() => { let r = {}; jobs.forEach(o => { r[o.id] = o }); return r; })();

          listStages(function (errStages, stages) {

            getCandidatesWithStatus( function(err, candidates) {

              if (userConnected.admin && !request.params.user) {

              var usersJobs = [];

              users.forEach(u => {
                let j = jobsPerUser(jobs, stages, candidates, u);
                if (u.active && u.idGoogle != me.idGoogle) {
                  usersJobs.push({
                    user: u,
                    jobs: j[4],
                    allStagesNumber: j[5]
                  });
                }
              });

              usersJobs = usersJobs.sort((a,b) => { return b.allStagesNumber - a.allStagesNumber; });

              usersJobs.unshift({
                user: me,
                jobs: jobsPerUser(jobs, stages, candidates, me)[4]
              });

                return next({
                  usersJobs: usersJobs,
                  admin: userConnected.admin,
                  users: users,
                  stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                  list: true,
                });
              } else {

              // again super lame but it's the fastest fix
              var j = jobsPerUser(jobs, stages, candidates, me);
              var myJobs = j[0];
              var otherJobs = j[1];
              var myJobsObject = j[2];
              var otherJobsObject = j[3];
              var allJobsObject = j[4];

              var otherRoles = new Set([]);
              Underscore.each(otherJobsObject, (job, k) => {
                Underscore.each(otherJobs, (job) => {
                  if (job.id == k) {
                    otherRoles.add(job)
                    return false; // break
                  }
                })
              });

              var myClients = new Set([]);
              Underscore.each(myJobsObject, (job, k) => {
                myClients.add(clientsMap[(jobsMap[k].client)]);
              });

              var otherClients = new Set([]);
              Underscore.each(otherJobsObject, (job, k) => {
                otherClients.add(clientsMap[(jobsMap[k].client)]);
              });


              // should come rather from ES
              var candidatesList = {};
              for(var jobIdx in allJobsObject) {
                for (var stageIdx in allJobsObject[jobIdx]) {
                  allJobsObject[jobIdx][stageIdx].forEach( c => {
                    candidatesList[c.id] = c.fullname;
                  });
                  }
              }

              listCountries(function (err, countries) {
                return next({
                  list: false,
                  me:me,
                  admin: userConnected.admin,
                  myClients: Array.from(myClients),
                  otherClients: Array.from(otherClients),
                  users: users,
                  myRoles: myJobs,
                  otherRoles: Array.from(otherRoles),
                  myJobs: myJobsObject,
                  otherJobs: otherJobsObject,
                  allJobs: allJobsObject,
                  candidates: candidatesList,
                  jobsMap: jobsMap,
                  clientsMap: clientsMap,
                  stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                  countries: (() => { let r = {}; countries.forEach(o => { r[o.value] = o }); return r; })()
                });

              });
            }

          });

        });

      });

    });

  });

}
