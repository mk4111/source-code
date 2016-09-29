'use strict';

const clientES = require('../../es.js');

module.exports = function (callback) {

  clientES.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE_GM_USERS,
    size: 1000,
    body: {
      query: {
        match_all: {}
      },
        sort: {"names.firstname": {"order": "asc"}}
    }

    }, function (err, response) {

      const users = [];
      response.hits.hits.forEach(function (user) {
        var userObj = user._source;
        userObj.id = user._id;
        users.push(userObj);
      });

      const result = users.filter( user => {return user.idGoogle !== undefined});
      return callback(err, result);
  });
}
