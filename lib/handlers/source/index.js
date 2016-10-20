const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  List.find({})
    .then(lists => {
      return reply.view('source', { request: request, lists: lists });
    });
}