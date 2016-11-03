'use strict'

const index = require('./handlers/source/index');
const get = require('./handlers/source/get');
const get_result_progress = require('./handlers/source/get_result_progress');
const post = require('./handlers/source/post');
const post_csv = require('./handlers/source/post_csv');
const post_results = require('./handlers/source/post_results');
const put = require('./handlers/source/put');
const del = require('./handlers/source/delete');

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
      method: 'GET',
      path: '/source/result/{lists_result_job}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: get_result_progress
      }
    }, {
      // content negotation would be better here but it's fine
      method: 'GET',
      path: '/source/csv/{list}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: function(request, reply) { return get(request, reply, "csv"); }
      }
    }, {
      method: 'POST',
      path: '/source/delete/{list}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: del
      }
    }, {
      method: 'POST',
      path: '/source',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: post
      }
    }, {
      method: 'POST',
      path: '/source/results',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: post_results
      }
    }, {
      method: 'POST',
      path: '/source/csv',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: post_csv
      }
    }, {
      method: 'POST',
      path: '/source/edit',
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
