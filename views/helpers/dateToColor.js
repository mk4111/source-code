'use strict';

const Handlebars = require('handlebars');
const Underscore = require('underscore');
const Moment = require('moment');

module.exports = function (timestamp) {

    if (!timestamp) { return "green"; } // N/A

    var date = Moment(timestamp);

    console.log(date.format());
    console.log(Moment().format())
    console.log(Moment().month(-1).format())

    if (date.isBefore(Moment()) && Moment().add({month: -1}).isBefore(date)) {

        // within one month
        return "red";
    }
    if (date.isBefore(Moment()) && Moment().add({month: -3}).isBefore(date)) {
        // within three months
        return "yellow";
    }
    return "green";
}
