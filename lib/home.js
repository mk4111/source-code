'use strict';

const getList = require('./handlers/home/get_list');

exports.register = function (server, options, next) {

  server.route(
  {
    method: 'GET',
    path: '/{page?}',
    config: {
      description: 'return the home page',
      auth: { mode: 'try', strategy: 'jwt' },
      handler: getList
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Home'
};
