'use strict';

/**
* WIP

const Mongose = require('mongoose');

var CandidateSchema = new Mongose.Schema({
  linkedInId: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  linkedInUrl: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  skypeId: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  githubUrl: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  Url: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  }
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, )
});

module.exports = Mongose.model('Candidate', StageSchema);

*/
