'use strict';

const Mongose = require('mongoose');

var StageSchema = new Mongose.Schema({
  candidateId: {
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
