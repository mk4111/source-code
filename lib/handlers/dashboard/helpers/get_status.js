'use strict';

const Underscore = require('underscore');

const listStages = require('../../../database-helpers/elasticsearch/list_stages');
const listCountries = require('../../../database-helpers/elasticsearch/list_countries');
const listGmUsers = require('../../../database-helpers/elasticsearch/list_users_with_id_google');

const Es = require('../../../es');

const Stage = require('../../../database-helpers/mongo/models/stage');

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

      listStages(function (errStages, stages) {

        if (userConnected.admin && !request.params.user) {

          var promises = [];
          users.forEach(u => {
            if (u.active && u.recruiter) {
              // consider onlu active recruiters
              promises.push( Stage.find({userId:u.idGoogle}).then(s => { return {user: u, stages: s} }) );
            }
          });
          Promise.all(promises).then(r => {
            return next({
              userStages: r.sort((a,b) => {
                if (a.user.idGoogle == me.idGoogle) { return -1; }
                if (b.user.idGoogle == me.idGoogle) { return 1; }
                return b.stages.length - a.stages.length;
              }),
              admin: userConnected.admin,
              users: users,
              stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
              list: true,
            });
          });

        } else {

          Stage.find({userId:idUser}).then(userStages => {
            // for stages extract all client, jobs, and candidates needed
            var clientsMap = {};
            var candidatesMap = {};
            var jobsMap = {};

            userStages.forEach(s => {
              clientsMap[s.clientId] = {};
              candidatesMap[s.candidateId] = {};
              jobsMap[s.jobId] = {};
            });

            var promises = []


            // @TODO: @speedingdeer instead of iterating the whole thing use .map to search by multiple ids
            Underscore.each(clientsMap, (v,k) => {
              promises.push(
                new Promise((resolve, reject) => {
                  Es.get({ index: process.env.ES_INDEX, type: process.env.ES_TYPE_GM_CLIENTS, id: k })
                  .then(r => {
                    clientsMap[k] = r._source;
                    resolve();
                  }).catch((e) => { resolve(); });
                })
              );
            });

            Underscore.each(jobsMap, (v,k) => {
              promises.push(
                new Promise((resolve, reject) => {
                  Es.get({ index: process.env.ES_INDEX, type: process.env.ES_TYPE_GM_JOBS, id: k })
                  .then(r => {
                    jobsMap[k] = r._source;
                    resolve();
                  }).catch((e) => { resolve(); });
                })
              );
            });

            Underscore.each(candidatesMap, (v,k) => {
              promises.push(
                new Promise((resolve, reject) => {
                  Es.get({ index: process.env.ES_INDEX, type: process.env.ES_TYPE, id: k })
                  .then(r => {
                    candidatesMap[k] = r._source;
                    resolve();
                  }).catch((e) => { resolve(); });
                })
              );
            });


            Promise.all(promises).then( (r) => {

              // separate my jobs and my clients
              var myJobsMap = {};
              var otherJobsMap = {};
              var myClientsMap = {};
              var otherClientsMap = {};

              Underscore.each(jobsMap, (v, k) => {
                if(!Underscore.isEmpty(v) && (v.owner.id == me.id)) {
                  myJobsMap[k] = v;
                  myClientsMap[v.client] = clientsMap[v.client];
                } else {
                  otherJobsMap[k] = v;
                  otherClientsMap[v.client] = clientsMap[v.client];
                }
              });

              listCountries(function (err, countries) {

                return next({
                  me:me,
                  userStages: userStages,
                  stages: stages,
                  admin: userConnected.admin,
                  jobsMap: jobsMap,
                  candidatesMap: candidatesMap,
                  clientsMap: clientsMap,
                  myJobsMap: myJobsMap,
                  otherJobsMap: otherJobsMap,
                  myClientsMap: myClientsMap,
                  otherClientsMap: otherClientsMap,
                  stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                  countries: (() => { let r = {}; countries.forEach(o => { r[o.value] = o }); return r; })(),
                  list: false
                });

              });

            }).catch(e => {
              // @TODO: if page can't be resolved
              // throw here an error or something
              // to propagate 403/404
              console.log(e)
            });

          });

        }

    });

  });

}
