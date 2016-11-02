const Underscore = require('underscore');

const EmailsJob = require('../../database-helpers/mongo/models/emails_job');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  var promises = [];
  promises.push ( EmailsJob.findById(request.params.emails_job).populate('emails') );

  Promise.all(promises)
    .then(r => {
      return reply.view('emails_job', { request: request, job: r[0] } );
    });
}