'use strict';

/**
* Return the view clientUserForm which display the form to update a client user
*/

const getClientUser = require('../../database-helpers/elasticsearch/client_users/get_client_user');
const listClients = require('../../database-helpers/elasticsearch/list_clients');

module.exports = (request, reply) => {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  }

  getClientUser(request.params.id, (err, clientUser) => {

    listClients((errClients, clients) => {

      return reply.view('clientUserForm', {clientUser: clientUser, clients: clients, request: request});
    })
  });
}
