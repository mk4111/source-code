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
const stagesToObject = require('./stages_to_object');
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
          const jobsDetail = jobsToObject(jobs);

          listStages(function (errStages, stages) {

            const stagesDetail = stagesToObject(stages);

            getCandidatesWithStatus( function(err, candidates) {
          
              let myJobsObject = createDashObj(myJobs,stages);
              let otherJobsObject = createDashObj(otherJobs, stages);

              linkCandidatesToJobs(candidates, myJobsObject);
              linkMyStatusToJob(candidates, otherJobsObject, me.idGoogle);

              //filter otherJobsObject to keep only the jobs containing a candidates
              otherJobsObject = filterJobs(otherJobsObject);
              //filter non empty stagesDetail
              myJobsObject = filterStages(myJobsObject);
              otherJobsObject = filterStages(otherJobsObject);


              const result = {
                admin: userConnected.admin,
                clients: clients,
                users: users,
                myJobs: myJobsObject,
                otherJobs: otherJobsObject,
                jobsDetail: jobsDetail,
                stagesDetail: stagesDetail
              };

              return next(result);
            })
          })
        })
      })

    })

}
