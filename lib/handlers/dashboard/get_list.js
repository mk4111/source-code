'use strict';

const getStatus = require('./helpers/get_status');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('login');
  }

  let userId = request.params.user ? encodeURIComponent(request.params.user) : request.auth.credentials.id;

  getStatus(userId, request.auth.credentials.id, status => {
    status.userIdGoogle = request.auth.credentials.id;
    if (status.admin || request.params.user == request.auth.credentials.id) {
      // all good
      return reply.view('dashboard', status);
    } else {
      // no permissions
      return reply.redirect('/permission');
    }
  });

}
