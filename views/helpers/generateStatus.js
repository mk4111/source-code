var Handlebars = require('handlebars');
module.exports = function (statusCurrent, clients, stages) {

  var result = "";
  
  clients.forEach(function (obj) {
    if (statusCurrent.idClient.toString() === obj.id.toString()) { result += obj.name + " "; }
  });


  stages.forEach(function (obj) {
    if (statusCurrent.idStage.toString() === obj.id.toString()) { result += obj.name; }
  });

  return new Handlebars.SafeString(result);
};
