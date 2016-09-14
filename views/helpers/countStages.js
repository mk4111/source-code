'use strict';

const Handlebars = require('handlebars');

module.exports = function (jobs, stage) {

  if(!jobs) { return 0; }

  var size = 0;

  if(stage == "*") { 
      for (var key in jobs) {
        for (var s in jobs[key]) {
            size += jobs[key][s].length;
        }
      }
  } else {
    for (var key in jobs) {
        if (String(stage.id) in jobs[key]) {
            size += jobs[key][stage.id].length;
        }
    }
  }
  return size;
}
