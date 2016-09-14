'use strict';

var Handlebars = require('handlebars');

module.exports = function (stage, stageCounter) {
    var disabled = stageCounter > 0 ? "" : "disabled";
    switch(stage.id) {
        case 1: return "blue " + disabled; // Submitted
        case 2: return "orange " + disabled; // Technical
        case 3: return "green " + disabled; // Face to Face
        case 4: return "yellow " + disabled; // Offer
        case 5: return "purple " + disabled; // Placement
        case 6: return "red " + disabled; // Rejected
    }
}
