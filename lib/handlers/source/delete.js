const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
  List.remove({_id: request.params.list})
    .then(() => { return reply.redirect("/source"); })
    .catch(() => { return reply.redirect("/source"); })
}