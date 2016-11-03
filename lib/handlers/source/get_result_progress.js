const Underscore = require('underscore');
const Negotiator = require('negotiator');
const ListsResultsJob = require('../../database-helpers/mongo/models/lists_result_job');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  var promises = [];
  promises.push(
    ListsResultsJob.findById(request.params.lists_result_job)
  );

  Promise.all(promises)
    .then(r => {
      return reply(r[0]);
    });
}