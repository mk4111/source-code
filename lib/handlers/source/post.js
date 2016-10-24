const Underscore = require('underscore');

const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
    var candidatesIDs = (typeof request.payload.candidateID === 'string') ? [request.payload.candidateID] : request.payload.candidateID;
    var promises = [];
    Underscore.each(candidatesIDs, (id) => {
        console.log("push", id)
        promises.push (
            Candidate.findOneAndUpdate({ indexId: id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
        )
    });

    Promise.all(promises).then(candidates => {
        List.create(Underscore.extend(request.payload, { userId:request.auth.credentials.user.idGoogle, candidates: candidates }))
            .then(list => {
                reply.redirect('/source/' + list._id)
            }).catch((e) => {
                // @TODO: add some error handling
                console.log(e)
            });
    });
}