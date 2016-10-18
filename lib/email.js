'use strict';

const post = require('./handlers/email/post');

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

      handler: post

    }
  }
]);

  return next();
};

exports.register.attributes = {
  name: 'Email'
};
