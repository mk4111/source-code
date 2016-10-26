const Underscore = require('underscore');

const Folder = require('../../database-helpers/mongo/models/folder');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
  
  console.log("HELLO")

  Folder.create(Underscore.extend(request.payload, { userId:request.auth.credentials.user.idGoogle }))
    .then(folder => {
        reply.redirect('/source#' + folder._id)
      });
}