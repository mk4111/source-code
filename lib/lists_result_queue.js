var Underscore = require('underscore')

var Queue = require('bull');

var List = require('./database-helpers/mongo/models/list')
var Candidate = require('./database-helpers/mongo/models/candidate')
var ListsResultJob = require('./database-helpers/mongo/models/lists_result_job')

var es = require('./es');

// https://github.com/OptimalBits/bull/issues/325
var lists_result_queue;
if(process.env.REDISCLOUD_URL) {
  lists_result_queue = Queue('Lists Result processing', process.env.REDISCLOUD_URL, {});
} else {
  lists_result_queue = Queue('Lists Result processing');
}

function schedulle(candidates, job, list) {
  return new Promise((resolve, reject) => {

    function s(candidates, idx, job, list) {
      Candidate.findOneAndUpdate({ indexId: candidates[idx]._id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true }).then(c => {
        list.candidates.push(c);
        c.lists.push(list);
        Promise.all([c.save(), list.save(), job.update({progress: idx + 1})])
          .then( () => {
            if (idx + 1 == candidates.length) {
              return resolve();
            } else {
              s(candidates, idx+1, job, list)
            }
          }).catch(e => {
            console.log(e)
          });
      });
    }

    s(candidates, 0, job, list)

  });


}

lists_result_queue.process((job, done) => {

  var search_promise = new Promise((resolve, reject) => {
    var candidates = [];
    es.search({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      scroll: '30s',
      search_type: 'scan',
      size: 1000,
      _source: ['id'],
      body: job.data.body
    }, function more(error, response) {
      response.hits.hits.forEach( (candidate) => {

        candidates.push(candidate);
      });
      if (response.hits.total !== candidates.length) {
        es.scroll({
          scrollId: response._scroll_id,
          scroll: '30s',
          size: 1000,
        }, more);
      } else {
        resolve(candidates); 
      }
    });
  });
  Promise.all([
    List.findById(job.data.list),
    ListsResultJob.findByIdAndUpdate(job.data.job, { status: "in_progress" }),
    search_promise
  ]).then(r => {
    var list = r[0];
    var results_job = r[1];
    var candidates = r[2];
    var promises = [];
    schedulle(candidates, results_job, list).then( r => {
      results_job.update({status: "completed"}).then(j => {
        done();
      });
    });


  }).catch(e => {
    console.log(e)
  });

});


module.exports = lists_result_queue;