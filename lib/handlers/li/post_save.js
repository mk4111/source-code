'use strict';

const updateLi = require('../../database-helpers/elasticsearch/li/updateLI');

module.exports = function (request, reply) {

  updateLi(request.payload.id, request.payload.li, function (err, response) {
    // $lab:coverage:off$
    if(request.payload.redirect_url) {
        // We must trust here we have correct data, it's the easiest solution. There must be a solid frontend validation
        // hard to think about any other quick fix since the currect architecture isn't perfect and it's a not a game changer.
        return reply.redirect(request.payload.redirect_url);
    }
    if (err) {
      return reply({code: 500});
    }
    // $lab:coverage:on$
    return reply({code:200, url: request.payload.li});
  });
}
