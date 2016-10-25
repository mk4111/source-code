const List = require('../../database-helpers/mongo/models/list');
const Folder = require('../../database-helpers/mongo/models/folder');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  var promises = []
  promises.push ( List.find({}) )
  promises.push ( Folder.find({}) )

  Promise.all(promises)
    .then(r => {
      return reply.view('source', { request: request, lists: r[0], folders: r[1] });
    });
}