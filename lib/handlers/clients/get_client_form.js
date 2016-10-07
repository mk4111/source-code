'use strict';

const clientES = require('../../es.js');
const getClient = require('../../database-helpers/elasticsearch/get_clients.js');
const listUsers = require('../../database-helpers/elasticsearch/list_gm_users.js');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {

    getClient(request.params.id, function (errClient, client) {

      listUsers(function (errUsers, users) {

        return reply.view('clientFormView', {client: client, owners: users, request:request});
      });
    });
  }
}
