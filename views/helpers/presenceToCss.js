'use strict';

var Handlebars = require('handlebars');

module.exports = function (object) {
    if(object) {
        return "present";
    }
    return "absent";

}
