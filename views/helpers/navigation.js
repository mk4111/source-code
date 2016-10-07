'use strict';

var Handlebars = require('handlebars');
var Underscore = require('underscore');

module.exports = function (request) {

    var nav = [

        {
            img: '/assets/img/logo.png',
            url: '/',
        }, {
            name: 'Clients',
            url: '/clients/list'
        }, {
            name: 'Jobs',
            url: '/jobs/list'
        }, {
            name: 'Source',
            css: 'source',
            url: '/csv-list/list'
        }, {
            name: 'Mail'
        }, {
            search: true // harcoded 'template' name
        }

    ];

    if(request.auth.credentials && request.auth.credentials.user.admin) {
        nav.push( { admin: true } );
    } else {
        nav.push( { user: true } );
    }


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
