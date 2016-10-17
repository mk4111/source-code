const Candidate = require('../../database-helpers/mongo/models/candidate');
const List = require('../../database-helpers/mongo/models/list');

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
    const candidatesIDs = (typeof request.payload.candidateID === 'string') ? [request.payload.candidateID] : request.payload.candidateID;
    console.log(candidatesIDs);
    // get / create all candidates
    // create the list itself
    // redirect to the list

    return reply.view('source_get', {
      request: request,
  }); 
}