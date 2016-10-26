const Underscore = require('underscore');

const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');
const Folder = require('../../database-helpers/mongo/models/folder');

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
    List.create(Underscore.extend(request.payload, { userId:request.auth.credentials.user.idGoogle, candidates: candidates }))
      .then(list => {
        if (request.payload._folder) {
          return Folder.findById(request.payload._folder)
            .then(f => {
              f.lists.push(list);
              f.save();
              return list;
            });
          }
          return list;
        }).then( (list) => {
          reply.redirect('/source/' + list._id)
        })
      
  });
}