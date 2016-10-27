const Underscore = require('underscore');

const EmailTemplate = require('../../database-helpers/mongo/models/email_template');
module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  EmailTemplate.findByIdAndUpdate(request.params.email_template, request.payload)
    .then(folder => {
      return reply.redirect('/emails');
    });
}