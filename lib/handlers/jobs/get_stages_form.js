'use strict';

/**
* Produce a view object: {job: {title: -, id: -}, stages: {idStage: {name: -, stagesAllowed: -, candidates: -}, {...}}}
*/

const getJob = require('../../database-helpers/elasticsearch/get_jobs');
const listStages = require('../../database-helpers/elasticsearch/list_stages');
const listCandidates = require('../../database-helpers/elasticsearch/list_candidates_status_job');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/client-login');
  }

  getJob(request.params.id, function (errJob, job) {

    listStages(function (errStages, listStages) {

      listCandidates(request.params.id, function (errCandidates, candidates) {

        //initialise the view object
        const view = {};

        view.stages = {};
        view.job = {title: job.title, id: job.id};
        view.title = 'Stages';
        view.request = request;

        listStages.forEach(function (stage) {
          view.stages[stage.id] =
          {
            name: stage.name,
            candidates: 0 //number of candidates on this stage
          };

        });

        //define the stagesAllowed property
        Object.keys(view.stages).forEach( function(stageId) {
          job.stagesAllowed.indexOf(stageId) > -1 ? view.stages[stageId].allowed = true : view.stages[stageId].allowed = false;
        })

        //get all the idStage of the candidates of this job
        // [{statusCurrent: [{idStage:1},{idStage:2} ]}, {statusCurrent: [{idStage:3},{idStage:4}]} ]  produce [[1,2],[3,4]]

        const idStages = candidates.map(function(candidate) {
          return candidate.statusCurrent.map(function(status) {
                    return status.idStage;
                 })
        })

        //flatten the array of idStages: [[1,2], [3,4]] to [1,2,3,4]
        const idStagesConcat = [].concat.apply([], idStages);

        idStagesConcat.forEach(function(id){
          view.stages[id].candidates += 1;
        })

        return reply.view('jobFormStages', view, { layout: 'client' });
      });
    });
  });
}
