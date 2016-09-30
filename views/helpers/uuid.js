'use strict';

var Handlebars = require('handlebars');
var Uuid = require('uuid')

module.exports = function () {
    return Uuid.v4();
}
