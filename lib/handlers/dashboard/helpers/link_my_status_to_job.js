'use strict';

const Underscore = require('underscore');

module.exports = function (candidates, jobsObject, myId) {

  candidates.forEach( candidate => {

    let status = candidate.statusCurrent;

    status.forEach(st => {

      let idJob = st.idJob;
      let idStage = st.idStage;

      if(myId.toString() === st.idUser.toString()) {
        if (jobsObject.hasOwnProperty(idJob)) {
          jobsObject[idJob][idStage].push(Underscore.extend({}, candidate, { statusTimestamp: st.timestamp }))
        }
      }
    })
  })

  return jobsObject;
}
