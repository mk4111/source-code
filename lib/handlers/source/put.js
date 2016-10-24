const Underscore = require('underscore');

const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
  var candidatesIDs = (typeof request.payload.candidateID === 'string') ? [request.payload.candidateID] : request.payload.candidateID;
  var promises = [];
  Underscore.each(candidatesIDs, (id) => {
    promises.push (
      Candidate.findOneAndUpdate({ indexId: id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
    )
  });
  Promise.all(promises).then(candidates => {
    List.findById(request.payload.id)
      .then( (list) => {
        Underscore.each(candidates, (c) => {
          if (list.candidates.indexOf(c._id) == -1) {
            list.candidates.push(c);
          }
        })
        list.save()
          .then(() => {
            return reply.redirect("/source/" + request.payload.id);
          })
      }).catch((e) => {
          console.log(e);
          return reply.redirect("/source");
      });
  });
}