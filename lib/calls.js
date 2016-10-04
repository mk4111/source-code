const getUserByIdGoogle = require('./database-helpers/elasticsearch/get_user_by_id_google');
const Call = require('./database-helpers/mongo/models/call');
const Candidate = require('./database-helpers/mongo/models/candidate');

exports.register = function (server, options, next) {

  server.route([
  {
    method: 'POST',
    path: '/calls',
    // it should be try, but must be the applicaion is buggy, required auth wouldn't work
    config: {
      auth: { mode: 'try', strategy: 'jwt'},
      handler: function (request, reply) {

        if (!request.auth.isAuthenticated) { return reply.redirect('/login'); }
        Candidate.findOne({ indexId: request.payload.id })
          .then((c) => {
            Call.create({
              userId: request.auth.credentials.id,
              _candidate: c._id
            }).then((created) => {
              c.calls.push(created);
              c.save().then(() => {
                return reply.redirect(request.payload.redirect_url);
              });
            });
          });

      }
    }
  }]);
  return next();
}

exports.register.attributes = {
  name: 'Calls'
};
