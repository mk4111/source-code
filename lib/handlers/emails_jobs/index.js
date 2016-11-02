const Underscore = require('underscore');

const EmailsJob = require('../../database-helpers/mongo/models/emails_job');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  var promises = [];

  promises.push ( EmailsJob.find({userId: request.auth.credentials.user.idGoogle}) );

  Promise.all(promises)
    .then(r => {
      return reply.view('emails_jobs', { request: request, jobs: r[0] } );
    });
}