var es = require('./es.js');

const listClients = require('./database-helpers/elasticsearch/list_clients');
const listStages = require('./database-helpers/elasticsearch/list_stages');

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/connected/{fullname}/{page?}',
    config: {
      description: 'return all connections',
      auth: {
        mode: 'try',
        strategy: 'jwt'
      },
      handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
          return reply.redirect('/login');
        }

        var myId = request.auth.credentials.id;
        var pageNum = Number(request.params.page) || 1;
        var perPage = Number(process.env.RESULTS_PER_PAGE);
        var page = Number(request.params.page) || 1;

        if( !Number(request.params.page) && request.params.page !== undefined ) {
            return reply.view('404').code(404);
          }

        if(Number(pageNum) < 1) {
          return reply.redirect('/');
        }

        var fullname = decodeURIComponent(request.params.fullname);

        es.search({
          index: process.env.ES_INDEX,
          type: process.env.ES_TYPE,
          from: (pageNum - 1) * perPage,
          size: perPage,
          _source: ['id', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts.email', 'headline', 'notes', 'statusCurrent'],
          body: {
            query: {
              match: {
                connectedTo: fullname
              }
            },
            sort: { "date": {"order": "desc"}}
          }
        }, function (error, response) {
          // $lab:coverage:off$
            if (error) {
              next(error);
            }
            // $lab:coverage:on$
            var results = [];

            response.hits.hits.forEach(function (profile) {
              var contact = {};
              contact.listFavourite = profile._source.favourite;
              contact.favourite = false;
              if(contact.listFavourite.indexOf(myId) !== -1) {
                contact.favourite = true;
              }

              contact.id = profile._id;
              contact.fullname = profile._source.fullname;
              contact.headline = profile._source.headline;
              contact.current = profile._source.current;
              contact.picture = profile._source.picture;
              contact.location = profile._source.location;
              contact.connectedTo = profile._source.connectedTo;

              //status
              contact.statusCurrent = profile._source.statusCurrent;


              if (profile._source.contacts.email) {
                contact.email = profile._source.contacts.email;
              } else {
                contact.email = '';
              }

              results.push(contact);
            })

            var nbPages = Math.ceil(response.hits.total / perPage);

            if( Number(pageNum) > nbPages ) {
               return reply.redirect('/');
            }

            var page_url_prev = 1;
            var page_url_next = Math.ceil(response.hits.total / perPage);

            if (pageNum > 1) {
              page_url_prev = '/connected/' +  encodeURIComponent(fullname) + '/' + (pageNum - 1);
            }

            if (pageNum < page_url_next) {
              pageNum++;
              page_url_next = '/connected/' + encodeURIComponent(fullname) + '/' + pageNum;
            }

            listClients(function (errClients, clients) {
              listStages(function (errStages, stages) {
                return reply.view('home',
                  {
                    request: request,
                    candidates: results,
                    page_url_prev: page_url_prev,
                    page_url_next: page_url_next,
                    page: page,
                    pages: nbPages,
                    clients: clients,
                    stages: stages
                  });
                })
            })

        });
      }
    }
  });

  return next();
}

exports.register.attributes = {
  name: 'Connected'
};
