var ElasticSearch = require('elasticsearch');
var Bluebird = require('bluebird');;

var client = new ElasticSearch.Client({
  defer: function () {
    return Bluebird.defer();
  },
  host: process.env.SEARCHBOX_URL,
  log: 'error' // @TODO it should be configurable depending the enviroment
});

module.exports = client;
