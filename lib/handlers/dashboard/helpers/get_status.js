'use strict';

const Underscore = require('underscore');
const Moment = require('moment')

const listStages = require('../../../database-helpers/elasticsearch/list_stages');
const listCountries = require('../../../database-helpers/elasticsearch/list_countries');
const listGmUsers = require('../../../database-helpers/elasticsearch/list_users_with_id_google');

const Es = require('../../../es');

const Stage = require('../../../database-helpers/mongo/models/stage');
const Call = require('../../../database-helpers/mongo/models/call');


module.exports = function(request, idUser, idConnectedUser, next) {

    // default condition
    var stagesCondition = {
      $or: [
        { stageId: {$lte: 4} },
        { updatedAt: {$gte: Moment().startOf('month').toDate() } }
      ]
    };

    // modified condition
    if (request.query.from) {
      stagesCondition = { $or: [
        { createdAt: {$gte: Moment().year(request.query.from.trim().split(/\W+/)[1]).month(request.query.from.trim().split(/\W+/)[0]).startOf('month').toDate() } },
        { updatedAt: {$gte: Moment().year(request.query.from.trim().split(/\W+/)[1]).month(request.query.from.trim().split(/\W+/)[0]).startOf('month').toDate() } }
      ] };
      if (request.query.to) {
        stagesCondition = { $and: [
          stagesCondition,
          { $or: [
            { createdAt: {$lte: Moment().year(request.query.to.trim().split(/\W+/)[1]).month(request.query.to.trim().split(/\W+/)[0]).endOf('month').toDate() } },
            { updatedAt: {$lte: Moment().year(request.query.to.trim().split(/\W+/)[1]).month(request.query.to.trim().split(/\W+/)[0]).endOf('month').toDate() } }
          ] }
        ] };
      }
    }


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
              promises.push( Stage.find(
                Underscore.extend({userId:u.idGoogle}, stagesCondition)
              ).then(s => { return {user: u, stages: s} }) );
            }
          });

          Promise.all(promises).then(r => {

            promises = [];
            var usersCallMap = {};

            users.forEach(u => {
              if (u.active && u.recruiter) {
              // consider onlu active recruiters
                promises.push( Call.count({userId:u.idGoogle}).then(r => { usersCallMap[u.idGoogle] = r; }) );
              }
            });

            Promise.all(promises).then(c => {
              return next({
                userStages: r.sort((a,b) => {
                  if (a.user.idGoogle == me.idGoogle) { return -1; }
                  if (b.user.idGoogle == me.idGoogle) { return 1; }
                  return b.stages.length - a.stages.length;
                }),
                usersCallMap: usersCallMap,
                admin: userConnected.admin,
                users: users,
                stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                list: true,
              });

            }).catch(e => { console.log(e) });

          }).catch(e => { console.log(e) });

        } else {
            Stage.find(
              Underscore.extend({userId:idUser}, stagesCondition)
            ).then(userStages => {
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
                  Es.get({ index: process.env.ES_INDEX, type: process.env.ES_TYPE_GM_JOBS, id: k, _source: ['id', 'owner', 'title', 'client', 'location', 'salary', 'address'] })
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

              Call.count({userId: idUser}).then( callsNumber => {
                var usersCallMap = {};
                usersCallMap[idUser] = callsNumber;
                listCountries(function (err, countries) {
                  return next({
                    me:me,
                    userStages: userStages,
                    admin: userConnected.admin,
                    jobsMap: jobsMap,
                    candidatesMap: candidatesMap,
                    clientsMap: clientsMap,
                    myJobsMap: myJobsMap,
                    otherJobsMap: otherJobsMap,
                    myClientsMap: myClientsMap,
                    otherClientsMap: otherClientsMap,
                    usersCallMap: usersCallMap,
                    request: request,
                    stages: (() => { let r = {}; stages.forEach(o => { r[o.id] = o }); return r; })(),
                    countries: (() => { let r = {}; countries.forEach(o => { r[o.value] = o }); return r; })(),
                    list: false
                  });

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
