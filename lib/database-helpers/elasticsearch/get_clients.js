'use strict';

/**
* Return a client
* @param {String} id - the Elasticsearch id of the client
* @param {Function} callback - callback with error and the client user object
*/

const clientES = require('../../es.js');

module.exports = function (id, callback) {

  clientES.get({

    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE_GM_CLIENTS,
    id: id
  }, function (error, response) {

    var client = response._source;
    if (client) { client.id = response._id; }

    return callback(error, client);
  });
}
