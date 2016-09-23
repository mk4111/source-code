'use strict';

const Handlebars = require('handlebars');

module.exports = function (applications, stage) {

  if(!applications) { return 0; }

  var result = 0;
  applications.forEach(a => { if (a.stageId == stage.id) { result++; } })
  return result;

}
