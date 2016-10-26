'use strict';

var Handlebars = require('handlebars');
var Underscore = require('underscore');

module.exports = function (folders) {
    var grid = [];
    var row = []
    var counter = 0;
    Underscore.each(folders, (f) => {
        row.push(f);
        if(++counter == 8) {
            counter = 0;
            grid.push(row);
            row = [];
        }
    });
    if(row.length) {
        grid.push(row);
    }
    return grid;
}
