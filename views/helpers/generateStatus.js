var Handlebars = require('handlebars');
module.exports = function (statusCurrent, clients, stages) {

  var result = "";
  
  clients.forEach(function (obj) {
    if (statusCurrent.idClient.toString() === obj.id.toString()) { result += obj.name + " "; }
  });

  if (String(statusCurrent.idStage) in stages) {
    result += "[" + stages[String(statusCurrent.idStage)].name + "]";
  }

  return new Handlebars.SafeString(result);
};
