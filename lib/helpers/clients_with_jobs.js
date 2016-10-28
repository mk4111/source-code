const Underscore = require("underscore");

const es = require('../es');

module.exports = function() {

  return new Promise((resolveClientsWithJobs, rejectClientsWithJobs) => {
    var promises = [];
    var activeJobs = {};
    var clientsWithJobs = {};
    // get all active jobs 
    // @TODO: scan method will work better and look better here
    es.count({
      index: process.env.ES_INDEX, 
      type: process.env.ES_TYPE_GM_JOBS,
      body: { query: { match: { "active": "true" } } }
    }).then(r => {
      var from = 0;
      var size = 1000;
      while (r.count > from * size) {
        // all active jobs
        promises.push(
          new Promise((resolve, reject) => {
              es.search({
              index: process.env.ES_INDEX, 
              type: process.env.ES_TYPE_GM_JOBS,
              from: from,
              size: size,
                _source: ['title', 'client', 'salary', 'address'],
                body: { query: { match: { "active": "true" } } }
              }).then(r => {
                Underscore.each(r.hits.hits, j => {
                activeJobs[j._id] = j._source;
                clientsWithJobs[j._source.client] = {};
              });
              resolve();
            });
          })
        );
        from += size;
      }
      Promise.all(promises).then(() => {
        Underscore.each(clientsWithJobs, (v,k) => {
          promises.push(
            new Promise((resolve, reject) => {
              es.get({
              index: process.env.ES_INDEX,
              type: process.env.ES_TYPE_GM_CLIENTS,
              id: k,
              _source: ['id', 'name', 'logoUrl',]
            })
              .then(r => {
              r._source.id = k;
              clientsWithJobs[k] = r._source;
              resolve();
              }).catch((e) => { resolve(); });
            })
          );
        });
        Promise.all(promises)
          .then(() => {
            resolveClientsWithJobs({
              activeJobs: activeJobs,
              clientsWithJobs: clientsWithJobs
            });
          }).catch((e) => {
            console.log(e);
          })
      });

   });
});

}
