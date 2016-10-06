'use strict';

/*
* Return the view clientUsers which display the list of the client users
*/

const clientUsersList = require('../../database-helpers/elasticsearch/client_users/list_client_users');
const listClients = require('../../database-helpers/elasticsearch/list_clients');

module.exports = (request, reply) => {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  }

  clientUsersList((err, clientUsers) => {

    listClients((errClients, clients) => {

      clientUsers.forEach((clientUser) => {

        let client = clients.filter((clientObj) => {
          return clientUser.idClient === clientObj.id;
        });

        client[0] ? clientUser.nameClient = client[0].name : clientUser.nameClient = '';

      });

      const authorizedClients = clientUsers.filter( clientUser => clientUser.authorized );
      const unAuthorizedClients = clientUsers.filter ( clientUser => !clientUser.authorized );

      return reply.view('clientUsers', {clientUsers: clientUsers, authorizedClients: authorizedClients, unAuthorizedClients: unAuthorizedClients, request: request });
    });
  });
}
