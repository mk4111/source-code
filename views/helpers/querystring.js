'use strict';

var Handlebars = require('handlebars');
const Querystring = require('query-string');

module.exports = function (request) {
    return Querystring.stringify(request.query);
}
