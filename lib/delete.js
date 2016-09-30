'use strict';

const es = require('./es.js');

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
              if(error) {
                  return next(error);
              }
              // $lab:coverage:on$
              var profile = response._source;
              profile.delete_by = request.auth.credentials.id;
              profile.deleted_at = Date.now();
              es.index({
                index: process.env.ES_INDEX_DELETED,
                type: process.env.ES_TYPE,
                body: profile
              }, function (error, response) {
                console.log(error)
                // $lab:coverage:off$
                  if(error) {
                      return next(error);
                  }
                  // $lab:coverage:on$
                  es.delete({
                    index: process.env.ES_INDEX,
                    type: process.env.ES_TYPE,
                    id: id
                  }, function (error, response) {
                      // $lab:coverage:off$
                      console.log(error)
                      if (error) {
                        return next(error);
                      }
                    // $lab:coverage:on$
                    return reply.redirect('/');
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
