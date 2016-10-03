'use strict';

const Mongose = require('mongoose');

var StageSchema = new Mongose.Schema({
  // all the ids are the ES documents referneces, we don't keep the data in mongo, only the index in ES :(
  candidateId: { // remember it's not an the candidate
    type: String,
    required: true
  },
  jobId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  stageId: {
    type: Number,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, )
});

module.exports = Mongose.model('Stage', StageSchema);
