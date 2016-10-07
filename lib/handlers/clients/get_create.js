'use strict';

const listUsers = require('../../database-helpers/elasticsearch/list_gm_users.js');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {

    listUsers(function (errUsers, users) {

      //return only active users
      const activeUsers = users.filter( user => { return user.active});

      return reply.view('clientFormView', {client: {}, owners: activeUsers, request:request });
    });
  }
}
