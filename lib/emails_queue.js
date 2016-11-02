var Underscore = require('underscore')

var EmailService = require('./helpers/emails')

var Queue = require('bull');

var Email = require('./database-helpers/mongo/models/email')
var EmailsJob = require('./database-helpers/mongo/models/emails_job')

// https://github.com/OptimalBits/bull/issues/325
var emails_queue;
if(process.env.REDISCLOUD_URL) {
  emails_queue = Queue('Emails processing', process.env.REDISCLOUD_URL, {});
} else {
  emails_queue = Queue('Emails processing');
}

emails_queue.process(function(job, done) {

  var emails = [];

  function schedulleEmail(idx, emails_job, resolve, reject) {
    if (idx == job.data.candidatesData.length) { return resolve(emails); }
    EmailService.send(job.data.credentials, job.data.candidatesData[idx], job.data.email, job.data.client, job.data.job, job.data.countries)
      .then((email) => {
        emails.push(email);
        emails_job.status = "in_progress";
        emails_job.progress = idx + 1;
        emails_job.save().then(() => {
      });
      schedulleEmail(idx+1, emails_job, resolve, reject);
    })
    .catch((email) => {
      emails.push(email);
      schedulleEmail(idx+1, emails_job, resolve, reject);
    });
  }

  var emailsPromise = new Promise((resolve, reject) => {
    EmailsJob.findById(job.data.emails_job_id).then(emails_job => {
      schedulleEmail(0, emails_job, resolve, reject);
    })
  });

  emailsPromise
    .then((emails) => {
      EmailsJob.findById(job.data.emails_job_id).then(emails_job => {
        promises = [];
        Underscore.each(emails, email => {
          email._emails_job = emails_job._id;
          promises.push(email.save());
        });
        Promise.all(promises).then(emails_saved => {
          Underscore.each(emails_saved, saved => {
            emails_job.emails.push(saved);
          });
          emails_job.status = "completed";
          emails_job.emails = emails_saved;
          emails_job.save().then(()=> {
          done();
        }).catch(e => console.log(e));
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }).catch((e) => {
    console.log(e);
    EmailsJob.findById(job.data.emails_job_id).then(emails_job => {
      emails_job.status = "error";
      emails_job.save().then(()=> { done(); });
    });
  });


});


module.exports = emails_queue;