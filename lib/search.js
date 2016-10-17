'use strict';

const index = require('./handlers/search');

exports.register = function(server, options, next) {

  server.route(
    {
      method: 'GET',
      path: '/search/{page?}',
      config: {
        description: 'return the search results using job, name, location and skills fields',
        auth: {
          mode: 'try',
          strategy: 'jwt'
        },
        handler: index
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'Search'
};
