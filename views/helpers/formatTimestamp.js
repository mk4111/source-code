'use strict';

var Moment = require('moment');
var Handlebars = require('handlebars');

module.exports = function (timestamp, f) {
    return Moment(timestamp).format(f); 
}
