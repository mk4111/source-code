'use strict';

var Moment = require('moment');
var Handlebars = require('handlebars');

module.exports = function (timestamp) { return Moment(timestamp).format('YYYY-MM-DD'); }
