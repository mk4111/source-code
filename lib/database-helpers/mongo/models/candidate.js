'use strict';

const Mongose = require('mongoose');

// will keep all provided by hand / 

var CandidateSchema = new Mongose.Schema({
  // the 
  linkedInId: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  }
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, )
});

module.exports = Mongose.model('Candidate', StageSchema);
