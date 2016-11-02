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
            name: 'Mail',
            url: '/emails'
        }, {
            search: true, // harcoded 'template' name
            url: '/search'
        }

    ];

    if(request.auth.credentials && request.auth.credentials.user && request.auth.credentials.user.admin) {
        nav.push( { admin: true } );
    } else {
        nav.push( { user: true } );
    }


    Underscore.each(nav, (v,k) => {
        v.dom = "a";
        if(!v.url) {
            v.css = (v.css) ? v.css + " disabled" : "disabled";
        }
        if (request.path == v.url) {
            v.css = (v.css) ? v.css + " active" : "active";
            v.url = "";
            v.active = true;
            v.dom = "div";
        }
    });

    return nav;
}
