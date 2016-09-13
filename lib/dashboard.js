'use strict';

const getList = require('./handlers/dashboard/get_list');
const getFilteredList = require('./handlers/dashboard/get_filtered_list');

exports.register = function (server, options, next) {

  server.route(
  [
    {
      method: 'GET',
      path: '/dashboard/{user?}',
      config: {
        description: 'return the dasboard',
        auth: {
          mode: 'try',
          strategy: 'jwt'
        },
        handler: getList
      }
    },
    {
      // @TODO speedingdeer: it's obviously shouldn't be POST, it must be GET... 
      method: 'POST',
      path: '/dashboard/client/{idClient}',
      config: {
        description: 'return the dasboard filtered by client',
        auth: {
          mode: 'try',
          strategy: 'jwt'
        },
        handler: getFilteredList
      }
    }
  ]
);
  return next()
}

exports.register.attributes = {
  name: 'Dashboard'
};
