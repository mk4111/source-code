'use strict';

const Handlebars = require('handlebars');

module.exports = function (stage) {
    switch(stage.id) {
        case 1: return "blue"; // Submitted
        case 2: return "orange"; // Technical
        case 3: return "green"; // Face to Face
        case 4: return "yellow"; // Offer
        case 5: return "purple"; // Placement
        case 6: return "red disabled"; // Rejected
    }
}
