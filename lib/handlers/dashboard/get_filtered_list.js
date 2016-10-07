'use strict';

const getStatusbyClient = require('./helpers/get_status_by_client');
module.exports = function (request, reply) {
    
    const idUser = encodeURIComponent(request.params.user);
    console.log(request.auth)
    const myId = request.auth.credentials.id;
    return getStatusbyClient(idUser, request.params.idClient, myId,  status => {
        status.userIdGoogle = idUser;
        status.request = request;
        return reply.view('dasboardFiltered', status);
    });

}
