var Underscore = require('underscore')

var EmailService = require('./helpers/emails')

var Queue = require('bull');

// https://github.com/OptimalBits/bull/issues/325
var emails_queue;
if(process.env.REDISCLOUD_URL) {
  emails_queue = Queue('Emails processing', process.env.REDISCLOUD_URL, {});
} else {
  emails_queue = Queue('Emails processing');
}

emails_queue.process(function(job, done) {

  var promises = [];
  Underscore.each(job.data.candidatesData, candidate => {
    promises.push( EmailService.send(job.data.credentials, candidate, job.data.email, job.data.client, job.data.job, job.data.countries) );
  });

  Promise.All(promises).then(() => {
    done();
  }).catch((e) => {
    // something went wrong with emails
    console.log(e);
  })

});


module.exports = emails_queue;