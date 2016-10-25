'use strict'

const post = require('./handlers/folders/post');
const put = require('./handlers/folders/post');

exports.register = function (server, option, next) {

  server.route([
    {
      method: 'POST',
      path: '/folders',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: post
      }
    }, {
      method: 'POST',
      path: '/folders/{folder}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: put
      }
    }
  ]);
  return next();
}

exports.register.attributes = {
  name: 'Folders'
}
