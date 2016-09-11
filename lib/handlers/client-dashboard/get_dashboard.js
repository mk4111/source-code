'use strict';

const getClient = require('../../database-helpers/elasticsearch/get_clients');
const listJobs = require('../../database-helpers/elasticsearch/jobs/list_jobs_by_client_id');
const getCandidatesWithStatus = require('../../database-helpers/elasticsearch/client-candidates/get_candidates_with_status');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const convertCandidatesToObj = require('./helpers/convert_candidates_to_object');
const getUser = require('../../database-helpers/elasticsearch/get_user');

module.exports = function (request, reply) {

  if( !request.auth.isAuthenticated) {

    return reply.redirect('/client-login');
  }

  /**
  * get the logged in client object
  */
  getClient(request.auth.credentials.idClient, function (errClient, client) {

    listJobs(request.auth.credentials.idClient, function (errJobs, jobs) {

      getUser(client.accountManager, function (errUser, user) {

        getCandidatesWithStatus(request.auth.credentials.idClient, function (errCandidates, candidates) {

          const candidateObj = convertCandidatesToObj(candidates);

          listStages(function (errStages, stages) {

            const stagesObj = (() => { let r = {}; stages.forEach(s => { r[s.id] = s }); return r; })();

            const view = {};
            view.client = client;
            view.owner = user;
            view.title = 'Dashboard';
            view.jobs = {}

            jobs.forEach(function (job) {

              view.jobs[job.id] = {
                title: job.title,
                salary: job.salary,
                stages: {}
              }

              job.stagesAllowed.forEach(function (stage, indexStage) {

                view.jobs[job.id].stages[stage] = {};
                view.jobs[job.id].stages[stage].name = stagesObj[stage].name;
                view.jobs[job.id].stages[stage].candidates = {};

                if(candidateObj[job.id]) {

                 if(candidateObj[job.id][stage]) {

                    view.jobs[job.id].stages[stage].candidates = candidateObj[job.id][stage];
                    //defined the next stage

                    //find the next stage for the current stage and this Job
                    const nextStageIndex = (indexStage + 1) === job.stagesAllowed.length ? indexStage : indexStage + 1;
                    const nextStage = job.stagesAllowed[nextStageIndex];

                    //add the nextStage for each candidate object
                    Object.keys(view.jobs[job.id].stages[stage].candidates).forEach(function(idCandidate){
                      view.jobs[job.id].stages[stage].candidates[idCandidate].nextStage = nextStage;
                    })

                 } else {
                   //no canidate for this stage
                   view.jobs[job.id].stages[stage].candidates = {};
                 }
                }

              });
            });
          
            return reply.view('dashboardClient', view, { layout: 'client' });
          });
        });
      });
    });
  });
}
