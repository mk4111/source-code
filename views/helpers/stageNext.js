'use strict';

var Handlebars = require('handlebars');
var Underscore = require('underscore');


module.exports = function (stage, stages) {
    stage = Number(stage); // make sure it's a number
    if (stages[String(stage + 1 + 1)]) { // + extra 1 cause the rejected is not a logicall state
        return stage + 1;
    }
    return null;
}
