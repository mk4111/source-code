'use strict';

/**
* Return all the list
*/

const getAllList = require('../../database-helpers/elasticsearch/csv_list/get_all_list');
const aggregateListNames = require('../../database-helpers/elasticsearch/csv_list/aggregate_listNames');
const compare = require('./helpers/compare.js');

module.exports = function (request, reply) {

  getAllList(function(error, lists){

    /**
    * Group by listNames to get the total number of candidates for each list
    */

    aggregateListNames(function(error, response){

      const aggregations = {}

      response.aggregations.listNamesAggs.buckets.forEach(bucket => {
        aggregations[bucket.key] = bucket.doc_count;
      });

      const sortedLists = lists.sort(compare);

      /**
      * Add the total number candidates for each list
      */
      sortedLists.forEach(list => {
        list.numberCandidates = aggregations[list.listName];
        list.encodedListName = encodeURIComponent(list.listName);
      });

      return reply.view('csvList', {lists: sortedLists, request:request});

    });
  });
}
