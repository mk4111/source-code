'use strict';

const postSendemail = require('./handlers/email');

exports.register = function (server, options, next) {

  server.route([
  {
    method: 'POST',
    path: '/email',
    config: {
      description: 'send email',
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },

      handler: postSendemail

    }
  }
]);

  return next();
};

exports.register.attributes = {
  name: 'Email'
};
