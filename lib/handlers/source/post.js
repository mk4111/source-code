const Underscore = require('Underscore');

const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
    var candidatesIDs = (typeof request.payload.candidateID === 'string') ? [request.payload.candidateID] : request.payload.candidateID;
    var promises = [];
    candidatesIDs
    Underscore.each(candidatesIDs, (id) => {
        promises.push (
            Candidate.findOneAndUpdate({ indexId: id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
        )
    });
    Promise.all(promises).then(candidates => {
        List.cerate(Underscore.extend(request.payload, {candidates: candidates})).then(list => {
            console.log(list);
            return reply.view('source_get', {
                request: request,
            }); 
        });
    });
}