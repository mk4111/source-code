var Handlebars = require('handlebars');
module.exports = function (statusCurrent, clients, jobs) {

  var result = "";

  clients.forEach(function (client) {

    if (statusCurrent.clientId == client.id) {
      result += "<span>" + client.name + " </span>";
      return false; // break
    }

  });


  jobs.forEach(function (job) {

    if (statusCurrent.jobId == job.id) {
      result += "<span>" + job.title + " </span>";
      return false; // breaks
    }

  });

  return new Handlebars.SafeString(result);
};
