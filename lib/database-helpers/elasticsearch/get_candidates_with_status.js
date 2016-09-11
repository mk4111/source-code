'use strict';

var clientES = require('../../es.js');

module.exports = function (callback) {

  let numberCandidates = 0;

  clientES.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    scroll: '30s',
    search_type: 'scan',
    size: 1000,
    _source: ['id', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts.email', 'headline', 'statusCurrent', 'emails', 'viewedBy'],
    body: {
      query: {
        filtered: {
          filter: {
            bool: {
              must_not: {
                missing: {
                  field: "statusCurrent.idJob"
                }
              }
            }
          }
        }
      }
    }
  }, function getMoreUntilDone(error, response) {

      var result = [];

      response.hits.hits.forEach(function (candidate) {

        candidate._source.id = candidate._id;
        result.push(candidate._source);
        numberCandidates += 1;
      });

      if (response.hits.total !== numberCandidates) {
        clientES.scroll({
          scrollId: response._scroll_id,
          scroll: '30s',
          size: 1000,
        }, getMoreUntilDone);
      } else {

        return callback(error, result);
      }

    });
}
