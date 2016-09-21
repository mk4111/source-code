'use strict';

const deleteStatus = require('../../database-helpers/elasticsearch/delete_status');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {

    const status = {
      idCandidate: request.payload.idCandidate,
      timestamp: request.payload.timestamp
    };

    deleteStatus(request.payload.idCandidate, status, function (err, response) {
      if(request.payload.redirectDashboard){
        // allow the elasticsearch to reindex
        // @speedingdeer: ...good luck
        setTimeout(function(){ 
          var redirect_url = request.payload.redirect_url ? request.payload.redirect_url : '/candidate/' + request.payload.idCandidate;
          return reply.redirect(redirect_url);
        }, 1000);

      } else {
        var redirect_url = request.payload.redirect_url ? request.payload.redirect_url : '/candidate/' + request.payload.idCandidate;
        return reply.redirect(redirect_url);
      }
    });
  }
}
