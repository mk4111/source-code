'use strict';

var Handlebars = require('handlebars');

module.exports = function (a, b) {
    console.log("====")
    console.log(a)
    console.log(b)
    console.log(a == b)
    console.log("====")
    return a == b;
}
