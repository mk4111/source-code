'use strict';

const es = require('./es.js');
const Candidate = require('./database-helpers/mongo/models/candidate');

exports.register = function (server, option, next) {

  server.route([
    {
      method: 'POST',
      path: '/delete',
      config: {
        description: 'delete candidate',
        auth: {
          mode: 'try',
          strategy: 'jwt'
        },
        handler: function (request, reply) {

          if (!request.auth.isAuthenticated) {
           return reply.redirect('login');
          }
          else {
          //get the id of the profile
          var id = request.payload.id;
          // save the profile into a new index
          es.get({
            index: process.env.ES_INDEX ,
            type: process.env.ES_TYPE,
            id: id
          }, function (error, response) {
            // $lab:coverage:off$
            console.log(error)
            if(error) { return next(error); }
            es.delete({
              index: process.env.ES_INDEX,
              type: process.env.ES_TYPE,
              id: id
            }, function (error, response) {
              // $lab:coverage:off$
              console.log(error)
              if (error) { return next(error); }
                // $lab:coverage:on$
                Candidate.remove({indexId: id}).then( (r) => {
                  return reply.redirect('/search');
                });
              });
            });
          }
        }
      }
    }
  ]);
  return next();
}

exports.register.attributes = {
  name: 'Delete'
}
