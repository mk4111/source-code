const Underscore = require('underscore');

const EmailTemplate = require('../../database-helpers/mongo/models/email_template');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  EmailTemplate.find({}).then(email_templates => {
    return reply.view('emails', { request: request, email_templates: email_templates });
  });
    
}