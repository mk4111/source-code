const Underscore = require('underscore');

const List = require('../../database-helpers/mongo/models/list');
const Folder = require('../../database-helpers/mongo/models/folder');

const ClientsWithJobsService = require('../../helpers/clients_with_jobs.js');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  var promises = []
  promises.push ( List.find({}) );
  promises.push ( Folder.find({}).populate('lists') );
  promises.push ( List.find({_folder: null}) );
  promises.push ( ClientsWithJobsService() )

  Promise.all(promises)
    .then(r => {
        return reply.view('source', { 
            request: request, 
            lists: r[0],
            folders: Underscore.union( r[1], [{ _id: "none", name: "None", lists: r[2] }] ),
            activeJobs: r[3].activeJobs,
            clientsWithJobs: r[3].clientsWithJobs,
        });
    });
}