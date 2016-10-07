'use strict';

const client = require('./es.js');

exports.register = function (server, options, next) {

  var number = 0;

  server.route({
    method: 'GET',
    path: '/analytics',
    config: {
      description: 'return analytics of the activities in JSON format',
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },
      handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
          return reply.redirect('/login');
        }

        client.search({
          index: process.env.ES_INDEX,
          type: process.env.ES_TYPE_ANALYTICS,
          size: 500,
          body: {
            query: {
              match_all: {}
            },
            sort: {"timestamp": {"order": "desc"}}
          }
        }, function (error, response) {
           // $lab:coverage:off$
          if (error) {
            return next(error)
          }
          // $lab:coverage:on$
          var results = [];

          response.hits.hits.forEach(function (analyticsObj) {
            results.push(analyticsObj._source);
          })

          return reply.view('analytics', {results: results, request: request})
        });

      }
    }

  });

  return next();
};

exports.register.attributes = {
  name: 'Analytics'
};
