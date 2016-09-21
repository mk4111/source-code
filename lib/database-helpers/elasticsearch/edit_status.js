'use strict';

var clientES = require('../../es.js');

module.exports = function (id, status, callback) {

  clientES.get({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    id: id,
    _source: ['statusCurrent']
  }, function (errGet, responseGet) {

    const currentStatus = responseGet._source.statusCurrent;

    currentStatus.forEach(function (element, i) {
      if (element.timestamp.toString() === status.timestamp.toString()) {
        currentStatus[i] = status;
      }
    });

    clientES.update({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: id,
      body: {
        doc: {
          statusCurrent: currentStatus
        }
      }
    }, function (errUpdate, responseUpdate) {

      return callback(errUpdate, responseUpdate);
    });
  });
}
