var Handlebars = require('handlebars');
module.exports = function (emails) {

  var result = ""; 
  emails.forEach(function (obj) {

    result += "<li>" + obj.email + "</li><input name='to' type='hidden' value='" + obj.email + "'>"; 
    result += "<input name='candidateID' type='hidden' value='" + obj.id + "'>";
    result += "<input name='candidateFN' type='hidden' value='" + obj.fn + "'>";
     
  });

  return new Handlebars.SafeString(result);
};