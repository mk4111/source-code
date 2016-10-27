const Underscore = require('underscore');

const EmailTemplate = require('../../database-helpers/mongo/models/email_template');
module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE it's super lame
  EmailTemplate.create(Underscore.extend(request.payload, { userId:request.auth.credentials.user.idGoogle }))
  .then( () => {
    return reply.redirect('/emails');
  });
}