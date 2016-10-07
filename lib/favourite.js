var es = require('./es.js');

exports.register = function (server, option, next) {

  server.route([
    {
      method: 'POST',
      path: '/favourite',
      config: {
        description: 'update the list of favorite id for a specific profile',
        auth: {
          mode: 'try',
          strategy: 'jwt'
        },
        handler: function (request, reply) {
          if (!request.auth.isAuthenticated) {
            return reply(401).code(401);
          }
          else {
            //get candidate document based on id
            es.get({
              index: process.env.ES_INDEX,
              type: process.env.ES_TYPE,
              id: request.payload.id
            }, function (error, response) {

              // $lab:coverage:off$
              if (error) {
                return reply(500);
              }
              // $lab:coverage:on$
              //create listFavourite property if doesnt exist
              var listFavourite = response._source.favourite;
              //store google user id into this list
              listFavourite.push(request.auth.credentials.id);
              response._source.favourite = listFavourite;
              //create/ update candidate profile with the new listFavourite
              es.index({
                  index: process.env.ES_INDEX,
                  type: process.env.ES_TYPE,
                  id: request.payload.id,
                  body: response._source
                }, function (error, response) {
                    // $lab:coverage:off$
                    if (error) {
                      return reply(500);
                    }
                    // $lab:coverage:on$
                    if (request.payload.javascriptDisabled === 'true') {
                      return reply.redirect('/candidate/' + request.payload.id);
                    } else {
                      return reply(200);
                    }

                });
            });
          }
        }
      }
    },

    {
      method: 'GET',
      path: '/favourite/{page?}',
      config: {
        description: 'Get the list of my favourite profiles',
        auth: {
          mode: 'try',
          strategy: 'jwt'
        },
        handler: function (request, reply) {
          if (!request.auth.isAuthenticated) {
            return reply.redirect('/login').code(401);
          }
          else {
            //been tested on the home page. Need a plugin pagination!
            // $lab:coverage:off$
            var myId = request.auth.credentials.id;

            var pageNum = request.params.page || 1;
            var perPage = Number(process.env.RESULTS_PER_PAGE);

            if( !Number(request.params.page) && request.params.page !== undefined ) {
               return reply.view('404').code(404);
            }

            if(Number(pageNum) < 1) {
                return reply.redirect('/');
            }
            // $lab:coverage:on$
          var bodySearch = {"query": { "term": { "favourite": request.auth.credentials.id } }}

            es.search({
              index: process.env.ES_INDEX,
              from: (pageNum - 1) * perPage,
              size: perPage,
              fields: ['id', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite'],
              body: bodySearch
              }, function (error, response) {
                var results = [];
                response.hits.hits.forEach(function (profile) {
                  var contact = {};
                  contact.favourite = true;
                  contact.id = profile._id;
                  contact.fullname = profile.fields.fullname[0];
                  contact.current = profile.fields.current[0];
                  contact.picture = profile.fields.picture[0];
                  contact.location = profile.fields.location[0];
                  contact.connectedTo = profile.fields.connectedTo || [];
                  results.push(contact);
                });
                //pagination already tested on home page
                // $lab:coverage:off$
                var nbPages = Math.ceil(response.hits.total / perPage);

                if( (Number(pageNum) > nbPages) && nbPages !== 0  ) {
                   return reply.redirect('/');
                }

                var page_url_prev = 1;
                var page_url_next = Math.ceil(response.hits.total / perPage);

                if (pageNum > 1) {
                  page_url_prev = '/favourite/' + (pageNum - 1);
                }

                if (pageNum < page_url_next) {
                  pageNum++;
                  page_url_next = '/favourite/' + pageNum;
                }
                // $lab:coverage:on$
                return reply.view('home',
                  {
                      request: request,
                      candidates: results,
                      page_url_prev: page_url_prev,
                      page_url_next: page_url_next,
                      page: request.params.page || 1,
                      pages: nbPages
                  });

              })
          }
        }
      }
    }
  ]);
  return next();
}

exports.register.attributes = {
  name: 'Favourite'
}
