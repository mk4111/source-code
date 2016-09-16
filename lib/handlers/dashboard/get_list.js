'use strict';

const getStatus = require('./helpers/get_status');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('login');
  }

  let userId = request.params.user ? encodeURIComponent(request.params.user) : request.auth.credentials.id;

  getStatus(userId, request.auth.credentials.id, status => {

    if (!status.admin && (request.params.user && request.params.user != request.auth.credentials.id)) {
      // all good
      // @TODO: it's super lame to manage the permissions like here, it should 403 or 401 and then
      // there is a hapi.js plugin who manages the permissions
      return reply.redirect('/permission');
    } else {
      // no permissions
      status.userIdGoogle = request.auth.credentials.id;
      return reply.view('dashboard', status);

    }
  });

}
