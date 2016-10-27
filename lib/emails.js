'use strict';

const index = require('./handlers/emails/index');
const post = require('./handlers/emails/post');
// templates
const post_template = require('./handlers/emails/post_template');
const put_template = require('./handlers/emails/put_template');

exports.register = function (server, options, next) {

  server.route([
  {
    method: 'POST',
    path: '/emails',
    config: {
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },

      handler: post

    }
  }, {
    method: 'GET',
    path: '/emails',
    config: {
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },

      handler: index

    }
  }, {
    method: 'POST',
    path: '/emails/templates/',
    config: {
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },

      handler: post_template

    }
  }, {
    method: 'POST',
    path: '/emails/templates/{email_template}',
    config: {
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },

      handler: put_template

    }
  }

]);

  return next();
};

exports.register.attributes = {
  name: 'Email'
};
