'use strict';

const Stage = require('../../database-helpers/mongo/models/stage');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    // @TODO: @speedingdeer: it's not enough 
    // you need to check here if the user owns the status etc.
    // btw it's super lame to manage the access control like this, should be a bluebird wrapper.
    return reply.redirect('/login');
  } else {
    var redirect_url = request.payload.redirect_url ? request.payload.redirect_url : '/candidate/' + request.payload.candidateId;
    Stage.findById(request.payload.id)
      .then(s => {
      return s.update(request.payload)
    }).then(s => {
      return reply.redirect(redirect_url);
    });
  }
}
