'use strict';

const clientES = require('../../es.js');

/**
* Update info on candidate object
* @param {String} idCandidate - ES id candidate
* @param {Object} info
* Example:
{ idCandidate: 'some id',
  scurrent: '40000',
  sexpected: '60000',
  notice: '3 weeks',
  locations: 'London'
}
* @param {Function} callback - function with ES error and ES response
*/

module.exports = function (idCandidate, info, callback) {

  clientES.update({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    id: idCandidate,
    body: {doc: {info: info}}
  }, function (err, response) {
    return callback (err, response);
  });
}
