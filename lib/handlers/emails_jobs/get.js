const Underscore = require('underscore');
const Negotiator = require('negotiator');
const EmailsJob = require('../../database-helpers/mongo/models/emails_job');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  var promises = [];
  promises.push(
    EmailsJob.findById(request.params.emails_job).populate({
      path:'emails',
      match: {
        status: 'error'
      }
    })
  );

  Promise.all(promises)
    .then(r => {
      // content negotation
      var negotiator = new Negotiator(request)
      if (negotiator.mediaTypes().indexOf("application/json") != -1) {
        return reply(r[0]);
      }
      return reply.view('emails_job', { request: request, job: r[0] } );

    });
}