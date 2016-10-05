'use strict';

const Mongose = require('mongoose');

var CandidateSchema = new Mongose.Schema({
  indexId: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  blacklisted: {
    type: Boolean,
    default: false
  },
  /*
  linkedInUrl: {
    type: String,
    unique : true,
    dropDups: true
  },
  stackoverflowUrl: {
    type: String,
    unique : true,
    dropDups: true
  },
  skypeId: {
    type: String,
    unique : true,
    dropDups: true
  },
  twitterId: {
    type: String,
    unique : true,
    dropDups: true
  },
  facebookUrl: {
    type: String,
    unique : true,
    dropDups: true
  },
  githubUrl: {
    type: String,
    unique : true,
    dropDups: true
  },
  */
  calls : [{ type: Mongose.Schema.Types.ObjectId, ref: 'Call' }]
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('Candidate', CandidateSchema);
