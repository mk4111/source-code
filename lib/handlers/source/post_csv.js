const Underscore = require("underscore");
const Converter = require("csvtojson").Converter;    

const es = require('../../es');

const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE

  const converter = new Converter({});

  converter.fromString(request.payload.csv, (csv_error, csv_candidates) => {

    var numberContacts = 0;
    var p = new Promise(function(resolve, reject) {

      es.search({
        index: process.env.ES_INDEX,
        type: process.env.ES_TYPE,
        scroll: '30s',
        search_type: 'scan',
        size: 1000,
        _source: ['fullname', 'contacts'],
        body: {
          query: {
            terms: {
              "contacts.email.original": csv_candidates.map(c => { return c.Email; })
            }
          },
        }
      }, function next(error, response) {

        var result = [];
        response.hits.hits.forEach(function (contact) {

          if(contact && contact._id) {
            result.push({
              fullname: contact._source.fullname,
              contacts: contact._source.contacts,
              id: contact._id
            });
            numberContacts += 1;
          }

        });

        if (response.hits.total !== numberContacts) {
          es.scroll({
            scrollId: response._scroll_id,
            scroll: '30s',
            size: 1000,
          }, next);
        } else {
          resolve(result);
        }
      });

    });
    

    p.then( candidates => {
      var ids = candidates.map(c => { return c.id; });
      var found_emails = candidates.map( candidate => { return candidate.contacts.email; } );
      var not_found = csv_candidates.filter( profile => { return found_emails.indexOf(profile.Email) === -1; } );
      // for all not found we need to create new ES entries 
      var bulk = [];

      not_found.forEach(profile => {
        var candidate = { contacts: {} };
        candidate.fullname = profile.Name;
        candidate.picture = '/assets/img/square-global-m-logo.png';
        candidate.contacts.email = profile.Email;
        candidate.contacts.emailRaw = profile.Email;
        candidate.date = Date.now();
        bulk.push({index: {_index: process.env.ES_INDEX, _type: process.env.ES_TYPE }})
        bulk.push(candidate);
      });

      es.bulk({body: bulk})
        .then(r => {
          if(r.items) { r.items.forEach(i => {  ids.push(i.create._id); }); };
        })
        .then(() => {
          // check if all mogo profiles created
          var promises = [];
          Underscore.each(ids, (id) => {
            promises.push (
              Candidate.findOneAndUpdate({ indexId: id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
            )
          });
          Promise.all(promises).then(list_candidates => {
            List.create(Underscore.extend(request.payload, { userId:request.auth.credentials.user.idGoogle, candidates: list_candidates }))
              .then(list => {
                reply.redirect('/source/' + list._id)
              })
              .catch((e) => {
                // @TODO: add some error handling
                console.log(e)
              });
          });
        });

    }).catch(e => {
      console.log(e);
    });

  });

}