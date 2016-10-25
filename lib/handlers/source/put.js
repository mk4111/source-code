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
    List.findById(request.payload.id).populate('candidates')
      .then( (list) => {
        if (request.payload.append) {
          Underscore.each(candidates, (c) => {
            // it's not great the performance wise but the code is simple this way
            if (list.candidates.map((listed) => { return String(listed._id); }).indexOf(String(c._id)) == -1) {
              list.candidates.push(c);
            }
          })
        }
        if (request.payload.remove) {
          var updated = [];
          Underscore.each(list.candidates, (c) => {
            if (candidatesIDs.indexOf(c.indexId) == -1) {
              updated.push(c);
            }
          });
          list.candidates = updated;
        }
        if (request.payload.edit) {
          console.log(request.payload)
          list.name = request.payload.name.trim();
          list.description = request.payload.description.trim();
        }
        list.save()
          .then(() => {
            if(request.payload.candidate_id) {
              request.yar.flash('list-saved', true);
              return reply.redirect("/candidate/" + request.payload.candidate_id);
            }
            return reply.redirect("/source/" + request.payload.id);
          })
      }).catch((e) => {
          console.log(e);
          return reply.redirect("/source");
      });
  });
}