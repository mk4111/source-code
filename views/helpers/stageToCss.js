'use strict';

var Handlebars = require('handlebars');

module.exports = function (stage) {
    // make it work for both the full individual stage and the id only
    var stageId = stage;
    if( stage instanceof Object ) { stageId = stage.id; }
    
    switch(String(stageId)) {
        case '1': return "blue "; // Submitted
        case '2': return "orange"; // Technical
        case '3': return "green"; // Face to Face
        case '4': return "yellow"; // Offer
        case '5': return "purple"; // Placement
        case '6': return "red"; // Rejected
    }
}
