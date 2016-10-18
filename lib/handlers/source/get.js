module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: This here must be GONE
    return reply.view('source_get', {
      request: request,
  }); 
}