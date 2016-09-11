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
const lastEmailDate = require('../../../helpers/last_email_date.js');
const lastEmail30 = require('../../../helpers/lastEmail30.js');

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
            getCandidatesWithStatus( function(err, candidates) {
          
              candidates.forEach( c => {
                 c.lastEmail = lastEmailDate(c.emails);
                  //filter on emails to take out emails that has been sent within last month
                  c.emailLast30 = lastEmail30(c.emails);
              });

              let myJobsObject = createDashObj(myJobs,stages);
              let otherJobsObject = createDashObj(otherJobs, stages);

              linkCandidatesToJobs(candidates, myJobsObject);
              linkMyStatusToJob(candidates, otherJobsObject, me.idGoogle);

              //filter otherJobsObject to keep only the jobs containing a candidates
              otherJobsObject = filterJobs(otherJobsObject);

              //filter non empty stages
              myJobsObject = filterStages(myJobsObject);
              otherJobsObject = filterStages(otherJobsObject);

              return next({
                admin: userConnected.admin,
                clients: clients,
                users: users,
                myJobs: myJobsObject,
                otherJobs: otherJobsObject,
                jobsDetail: jobsDetail,
                stages: stages.map(s => { let r = {}; r[s.id] = s; return r })[0]
              });
            });

          });

        });

      });

    });

}
