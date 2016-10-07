'use strict';

const clientES = require('../../../es.js');

/**
* Return list of candidates searched by fullname, locations, current and skills
* sorted by date (latest candidates first ) and relevance score
* @param {Array}
* @param {Number} page - the page
* @param {Function} callback - function with error and the list of candidates
*/

module.exports = function (mustClause, pageNum, callback) {

  const perPage = Number(process.env.RESULTS_PER_PAGE);

  clientES.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    from: (pageNum - 1) * perPage,
    size: perPage,
    _source: ['id', 'info', 'url', 'jobApplications', 'cvDocumentLink', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts', 'headline', 'emails', 'viewedBy', 'skills'],
    body: {
      query: {
        bool:{
          must: mustClause
        }
      },
      sort: [
        {_score: {"order": "desc"}},
        {date: {"order": "desc"}}
      ]
    }
  }, function (error, response) {
    
    const result = [];

    response.hits.hits.forEach(function (candidate) {
      candidate._source.id = candidate._id;
      result.push(candidate._source);
    });

    return callback({candidates: result, totalCandidates: response.hits.total});

 });
}
