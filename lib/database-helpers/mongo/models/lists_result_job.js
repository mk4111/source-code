'use strict';

const Mongose = require('mongoose');

var ListsResultJobSchema = new Mongose.Schema({
  _list: {type: String, ref: 'List'},
  jobId:  {
    type: String,
  },
  queueId: {
    type: String,
  },
  userId: {
    // the guy who created the job
    type: String,
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress' ,'completed', 'error'],
    default: 'waiting',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  candidates_number: {
    type: Number
  },


}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('ListsResultJob', ListsResultJobSchema);
