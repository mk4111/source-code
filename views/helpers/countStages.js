'use strict';

const Handlebars = require('handlebars');
const Underscore = require('underscore');

module.exports = function (applications, stage) {

  if(!applications) { return 0; }

  var result = 0;

  Underscore.each(String(stage).split(","), s => {
    applications.forEach(a => { if (a.stageId == s) { result++; } })
  });

  return result;

}
