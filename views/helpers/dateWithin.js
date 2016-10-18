'use strict';

const Handlebars = require('handlebars');
const Underscore = require('underscore');
const Moment = require('moment');

module.exports = function (timestamp, key, value) {

    if (!timestamp) { return false; } // N/A

    var date = Moment(timestamp);

    var modifier = []
    modifier[key] = value; 

    if (Moment().add(modifier).isBefore(date)) {
        return true;
    }
    
    return false;
}