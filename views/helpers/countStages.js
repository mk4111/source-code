'use strict';

const Handlebars = require('handlebars');

module.exports = function (jobs, stage) {
  let result = 0;
  let jobsStage = []
  for(let jobKey in jobs) {
    for (let l in jobs[jobKey]) { if (l == stage) { result++; } }
  }
  return result;
}
