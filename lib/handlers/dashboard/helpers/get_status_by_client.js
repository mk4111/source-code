'use strict';

const listMyClients = require('../../../database-helpers/elasticsearch/list_my_clients');
const getUserIdByIdGoogle = require('../../../database-helpers/elasticsearch/get_user_by_id_google');
const listJobs = require('../../../database-helpers/elasticsearch/list_jobs');
const listStages = require('../../../database-helpers/elasticsearch/list_stages');
const createDashObj = require('./create_my_dashboard_obj');
const getCandidatesWithStatus = require('../../../database-helpers/elasticsearch/get_candidates_with_status');
const linkCandidatesToJobs = require('./link_candidates_to_job');
const linkMyStatusToJob = require('./link_my_status_to_job');
const jobsToObject = require('./jobs_to_object');
const filterJobs = require('./filter_jobs');
const filterStages = require('./filter_stages');
const listGmUsers = require('../../../database-helpers/elasticsearch/list_users_with_id_google');

module.exports = function(idUser, idClient, idConnectedUser, next) {

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
          let myJobs = jobs.filter(job => job.owner.id.toString() === me.id.toString());
          myJobs = myJobs.filter( job => { return job.client.toString() === idClient.toString()});

          const clientSelected = clients.filter( client => client.id === idClient);
          const clientName = clientSelected[0].name;

          const jobsDetail = jobsToObject(jobs);

          listStages(function (errStages, stages) {

            getCandidatesWithStatus( function(err, candidates) {

              let myjobsObject = createDashObj(myJobs,stages);
              linkCandidatesToJobs(candidates, myjobsObject);

              //filter non empty stagesDetail
              myjobsObject = filterStages(myjobsObject);

              const result = {
                admin: userConnected.admin,
                clients: clients,
                clientName: clientName,
                users: users,
                myJobs: myjobsObject,
                jobsDetail: jobsDetail,
                stagesDetail: stages.map(s => { let r = {}; r[s.id] = s; return r })
              };

              return next(result);
            })
          })
        })
      })

    })

}
