'use strict'

const index = require('./handlers/emails_jobs/index');
const get = require('./handlers/emails_jobs/get');

exports.register = function (server, option, next) {

  server.route([
    {
      method: 'GET',
      path: '/emails_jobs',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: index
      }
    }, {
      method: 'GET',
      path: '/emails_jobs/{emails_job}',
      config: {
        auth: { mode: 'try', strategy: 'jwt'},
        handler: get
      }
    }
  ]);
  return next();
}

exports.register.attributes = {
  name: 'EmailsJobs'
}
