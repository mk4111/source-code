'use strict';

const Underscore = require('underscore');

module.exports = function (candidates, jobsObject) {

  candidates.forEach( candidate => {

    let status = candidate.statusCurrent;

    status.forEach(st => {
      let idJob = st.idJob;
      let idStage = st.idStage;

      if (jobsObject.hasOwnProperty(idJob)) {
        jobsObject[idJob][idStage].push(Underscore.extend(candidate, { statusTimestamp: st.timestamp }));
      }
    })

  });
  
  return jobsObject;
}
