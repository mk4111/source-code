const Underscore = require('underscore');

const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');

const es = require('../../es');

const CandidatesService = require('../../helpers/candidates.js');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
  var promises = [];
  var list;
  List.findById(request.params.list).populate('candidates')
    .then(l => {
      list = l;
      var promises = [];
      Underscore.each(list.candidates, c => {
        promises.push( 
          new Promise((resolve, reject) => {
            es.get({
              index: process.env.ES_INDEX,
              type: process.env.ES_TYPE,
              id: c.indexId
            }).then(r => {
              resolve(r);
            });
          })
        )
      });
      return promises;
    })
    .then( (promises) => {
      Promise.all(promises).then(source => {
        var candidates = [];
        var nbPages = Math.ceil(source.length / Number(process.env.RESULTS_PER_PAGE)); 
        Underscore.each(source, (candidate) => {
          candidate._source.id = candidate._id;
          candidates.push(candidate._source);
        });
        CandidatesService(candidates, [], [], "")
          .then(r => {
            return reply.view('source_get', Underscore.extend({ request: request, list:list }, r)); 
        }).catch(e => {
          console.log(e);
        });
      })
    }).catch( (e) => {
      // the list doesn't exist
      return reply.redirect('/source');
    });
}