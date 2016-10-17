'use strict'

const index = require('./handlers/source/index');
const get = require('./handlers/source/get');
const post = require('./handlers/source/post');
const put = require('./handlers/source/put');

exports.register = function (server, option, next) {

  server.route([
    {
      method: 'GET',
      path: '/source',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: index
      }
    }, {
      method: 'GET',
      path: '/source/{list}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: get
      }
    }, {
      method: 'POST',
      path: '/source',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: post
      }
    }, {
      method: 'PUT',
      path: '/source/{list}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: put
      }
    },
  ]);
  return next();
}

exports.register.attributes = {
  name: 'Source'
}
