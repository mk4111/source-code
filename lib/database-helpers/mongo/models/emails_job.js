'use strict';

const Mongose = require('mongoose');

var EmailsJobSchema = new Mongose.Schema({
  emails : [{ type: Mongose.Schema.Types.ObjectId, ref: 'Email' }],
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
  schedulled_emails: {
    type: Number
  },


}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('EmailsJob', EmailsJobSchema);
