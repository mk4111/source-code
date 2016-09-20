'use strict';

const Underscore = require('Underscore');
const Moment = require('moment');
const Handlebars = require('handlebars');

module.exports = function (viewedBy) {
    var views = [];

    Underscore.each(viewedBy, (user) => {
        Underscore.each(user.timestamp, (timestamp) => {
            views.push({ 
                'timestamp': timestamp,
                'user': user,
                'timestamp_formatted_long': Moment(timestamp).format('YYYY-MM-DD hh:mm:ss'),
                'timestamp_formatted_short': Moment(timestamp).format('YYYY-MM-DD')
            });
        });
    });

    views = views.sort( (a, b) => { return b.timestamp - a.timestamp } );
    return views;
}
