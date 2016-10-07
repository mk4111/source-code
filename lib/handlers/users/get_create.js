'use strict';

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');

  } else {

    return reply.view('userFormView', { request: request });
  }
}
