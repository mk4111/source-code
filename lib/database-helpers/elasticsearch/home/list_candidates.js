'use strict';

const clientES = require('../../../es.js');

/**
* Return list of candidates in descending order by date (default 100 candidates per page)
* @param {Number} page - the page number
* @param {Function} callback - function with error and the list of candidates
*/

module.exports = function (pageNum, callback) {

  const perPage = Number(process.env.RESULTS_PER_PAGE);

  clientES.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    from: (pageNum - 1) * perPage,
    size: perPage,
    _source: ['id', 'info', 'url',  'github_url', 'stackoverflow_url', 'cvDocumentLink', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts', 'headline', 'statusCurrent', 'emails', 'viewedBy', 'skills'],
    body: {
      query: {
          match_all: {}
      },
      sort: { "date": {"order": "desc"}}
    }
  }, function (error, response) {

    // $lab:coverage:off$
    if (error) {
      callback(error);
    }
    // $lab:coverage:on$

    const result = [];

    response.hits.hits.forEach(function (candidate) {
      candidate._source.id = candidate._id;
      result.push(candidate._source);
    });

    return callback({candidates: result, totalCandidates: response.hits.total});
 });
}
