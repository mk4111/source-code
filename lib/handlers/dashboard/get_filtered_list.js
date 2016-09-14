'use strict';

const getStatusbyClient = require('./helpers/get_status_by_client');
module.exports = function (request, reply) {
    
    //@TODO: this path must be gone - it's just ot make it backwad compatible
    if(request.payload && request.payload.idUser) {
        const idUser = request.payload.idUser;
        const myId = request.auth.credentials.id;

        return getStatusbyClient(idUser, request.params.idClient, myId,  status => {
            status.userIdGoogle = idUser;
            return reply.view('dasboardFiltered', status);
        });
    }

    const idUser = encodeURIComponent(request.params.user);
    const myId = request.auth.credentials.id;
    return getStatusbyClient(idUser, request.params.idClient, myId,  status => {
        status.userIdGoogle = idUser;
        return reply.view('dasboardFiltered', status);
    });

}
