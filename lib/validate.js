'use strict';

var redisClient = require('redis-connection')();
const getUserByGoogleId = require('./database-helpers/elasticsearch/get_user_by_id_google');

module.exports = function (decoded, request, callback) {

  // do your checks to see if the session is valid
  redisClient.get(decoded.id, function (rediserror, reply) {
    /* istanbul ignore if */
      // $lab:coverage:off$
    if(rediserror) { console.log(rediserror); }
    // $lab:coverage:on$
    var session;
    if(reply) { session = JSON.parse(reply); }
    else {
      // unable to find session in redis ... reply is null
      return callback(rediserror, false);
    }

    getUserByGoogleId(session.id, function (errUser, user) {

      session.user = user;

      if (session.valid === true) { return callback(rediserror, true, session); }
      else { return callback(rediserror, false); }

    });


  });
};

module.exports.redisClient = redisClient;
