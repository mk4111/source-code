'use strict';

const updateCandidate = require('../../database-helpers/elasticsearch/csv_list/delete_list_name_on_candidate');

module.exports = function (request, reply) {

  if( !request.auth.isAuthenticated) {

    return reply({code: 500});
  }

  //update es - remove listNames
  updateCandidate(request.payload.idCandidate, request.payload.listName, function (err, response) {

    if(request.payload.redirect_url) { return reply.redirect(request.payload.redirect_url); }

    return reply({code: 200});
  });
}
