'use strict';

const getClient = require('../../database-helpers/elasticsearch/get_clients');
const listUsers = require('../../database-helpers/elasticsearch/list_gm_users');
const getJobs = require('../../database-helpers/elasticsearch/list_jobs');
const timestampToDate = require('../../helpers/timestamp-to-date');
const listClientUsers = require('../../database-helpers/elasticsearch/client_users/list_client_users');
const getUserByGoogleId = require('../../database-helpers/elasticsearch/get_user_by_id_google');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  } else {

    getClient(request.params.id, function (errClient, client) {

      listUsers(function (errOwners, users) {

        var accountManagers = users.filter(function(user) {

          return user.id.toString() === client.accountManager.toString();
        });

        client.accountManagerName = accountManagers[0].names.fullname;

        getJobs(function (errJobs, jobs) {

          var clientJobs = client.jobs.map(function (idJob) {
            var jobFilter = jobs.filter(job => {return job.id === idJob});
            return jobFilter[0];
          });

          client.startFrom = timestampToDate(client.createdAt);
          client.jobs = clientJobs.filter(Boolean);

          listClientUsers(function (errCLientUsers, clientUsers) {

            var clientUsersList = clientUsers.filter(function(clientUser) {
              return clientUser.idClient === client.id;
            });

            getUserByGoogleId(request.auth.credentials.id, function (errUser, user) {

              return reply.view('clientView', {client: client, owners: users, clientUsersList: clientUsersList, user: user, request: request});
            });
          });
        });
      });
    });
  }
}
