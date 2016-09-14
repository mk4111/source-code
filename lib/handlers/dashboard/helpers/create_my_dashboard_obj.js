'use strict';

module.exports = function (jobs, stages) {

  const obj = {};

  jobs.forEach(function (job) {
    obj[job.id] = {};
    stages.forEach(function (stage) {
      obj[job.id][stage.id.toString()] = [];
    });
  });

  return obj;
}
