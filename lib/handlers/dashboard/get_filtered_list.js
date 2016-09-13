'use strict';

const getStatusbyClient = require('./helpers/get_status_by_client');
module.exports = function (request, reply) {

  const idUser = encodeURIComponent(request.params.user);
  const myId = request.auth.credentials.id;


  // @TODO: Check permissions here, who can access the client dashboard? anyone?

  getStatusbyClient(idUser, request.params.idClient, myId,  status => {
    status.userIdGoogle = idUser;
    return reply.view('dasboardFiltered', status);
  });

}
