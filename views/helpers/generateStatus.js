var Handlebars = require('handlebars');
module.exports = function (statusCurrent, clients, stages) {


  var result = "";


  if (!statusCurrent || !clients || !stages) { return ""; }

  clients.forEach(function (obj) {
    if (statusCurrent.clientId.toString() === obj.id.toString()) { result += obj.name + " "; }
  });

  if (String(statusCurrent.stageId) in stages) {
    result += "[" + stages[String(statusCurrent.stageId)].name + "]";
  }

  return new Handlebars.SafeString(result);
};
