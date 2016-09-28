var Underscore = require('underscore');
var Handlebars = require('handlebars');
module.exports = function (statusCurrent, clients, jobs) {

  var result = "";

  Underscore.each(clients, function (client) {

    if (statusCurrent.clientId == client.id) {
      result += "<span>" + client.name + " </span>";
      return false; // break
    }

  });


  Underscore.each(jobs, function (job) {

    if (statusCurrent.jobId == job.id) {
      result += "<span>" + job.title + " </span>";
      return false; // breaks
    }

  });

  return new Handlebars.SafeString(result);
};
