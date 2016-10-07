'use strict';

/**
* Return the view clientUserForm which display the form to create a client user
*/

const listClients = require('../../database-helpers/elasticsearch/list_clients');

module.exports = (request, reply) => {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  }

  listClients((err, clients) => {

    return reply.view('clientUserForm', {clients: clients, request: request})
  });
}
