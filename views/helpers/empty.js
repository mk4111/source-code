'use strict';

var Handlebars = require('handlebars');
var Underscore = require('underscore');

module.exports = function (obj) {
    return Underscore.isEmpty(obj);
}
