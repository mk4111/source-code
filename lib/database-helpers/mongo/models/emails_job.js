'use strict';

const Mongose = require('mongoose');

var EmailsJobSchema = new Mongose.Schema({
  emails : [{ type: Mongose.Schema.Types.ObjectId, ref: 'Email' }],
  jobId:  {
    type: String,
    required: true
  },
  queueId: {
    type: String,
    required: true
  },
  userId: {
    // the guy who created the job
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'in_progress' ,'completed'],
    default: 'waiting',
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  schedulled_emails: {
    type: Number
  },


}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('EmailsJob', EmailsJobSchema);
