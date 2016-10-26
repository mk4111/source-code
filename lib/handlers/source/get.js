const Underscore = require('underscore');
const Json2csv = require('json2csv');


const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');
const Folder = require('../../database-helpers/mongo/models/folder');

const es = require('../../es');

const CandidatesService = require('../../helpers/candidates.js');

module.exports = function (request, reply, format) {
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
            }).catch(e => {
              resolve({}); // empty / not existing profile
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
          if (!Underscore.isEmpty(candidate)) {
            candidate._source.id = candidate._id;
            candidates.push(candidate._source);
          }
        });
        CandidatesService(candidates, [], [], "")
          .then(r => {
            switch(format) {
              case "csv":
                var csv = Json2csv({ data: r.candidates, fields: ["id","fullname","email","location","current"]}); 
                return reply(csv).header("content-type", "text/csv");
              default: 
                Folder.find({})
                  .then(folders => {
                    return reply.view('source_get', Underscore.extend({ request: request, list:list, folders: folders }, r));
                  });
                break;
            }
        }).catch(e => {
          console.log(e);
        });
      })
    }).catch( (e) => {
      // the list doesn't exist
      return reply.redirect('/source');
    });
}