'use strict';

const Underscore = require('underscore');
const Stage = require('../../database-helpers/mongo/models/stage');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {
    Stage.create(Underscore.extend(request.payload, {userId: request.auth.credentials.id}))
      .then( s => { return reply.redirect('/candidate/' + request.payload.candidateId); })
      .catch( e => { console.log(e); return reply.redirect('/candidate/' + request.payload.candidateId); });
  }
}
