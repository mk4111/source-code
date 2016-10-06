'use strict';

var Handlebars = require('handlebars');
var Underscore = require('underscore');

module.exports = function (request) {

        var nav = {

        home: {
            img: '/assets/img/logo.png',
            url: '/',
        },
        clients: {
            name: 'Clients',
            url: '/clients/list'
        },
        jobs: {
            name: 'Jobs',
            url: '/jobs/list'
        },
        source: {
            name: 'Source',
            css: 'source',
            url: 'csv-list/list'
        },
        mail: {
            name: 'Mail'
        },
        search: {
            search: true // harcoded 'template' name
        },
        advance: {
            advance: true // hardcoded 'template' name
        }

    };


    Underscore.each(nav, (v,k) => {
        if (request.path == v.url) {
            v.css = (v.css) ? v.css + " active" : "active";
        }
        if(!v.url) {
            v.css = (v.css) ? v.css + " disabled" : "disabled";
        }
    });

    return nav;
}
