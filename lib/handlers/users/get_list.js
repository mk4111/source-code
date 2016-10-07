'use strict';

const clientES = require('../../es.js');
const listUsers = require('../../database-helpers/elasticsearch/list_gm_users');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {

    return reply.redirect('login');

  } else {

    listUsers(function (errUsers, users) {

      const activeUsers = users.filter( user => user.active );
      const inactiveUsers = users.filter ( user => !user.active );
      return reply.view('users', {activeUsers: activeUsers, inactiveUsers: inactiveUsers, request: request});
    });
  }
}
