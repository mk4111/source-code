const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
  List.findById(request.payload.id)
    .then( () => {
        return reply.redirect("/source/" + request.payload.id);
    }).catch(() => {
        return reply.redirect("/source");
    });
  
}