'use strict';

const Stage = require('../../database-helpers/mongo/models/stage');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {
    var redirect_url = request.payload.redirect_url ? request.payload.redirect_url : '/candidate/' + request.payload.idCandidate;
    Stage.findByIdAndRemove(request.payload.id)
      .then(s => {
      return reply.redirect(redirect_url);
    });
  }
}
