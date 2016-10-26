const Underscore = require('underscore');

const Folder = require('../../database-helpers/mongo/models/folder');
const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
  Folder.findByIdAndUpdate(request.params.folder, request.payload)
    .then(folder => {
      reply.redirect('/source#/' + folder._id);
    });
}