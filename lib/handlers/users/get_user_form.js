'use strict';

const clientES = require('../../es.js');

const getUser = require('../../database-helpers/elasticsearch/get_user');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');

  } else {

    getUser(request.params.id, function (errUser, user) {

      return reply.view('userFormView', {user: user, request: request});
    })
  }
}
