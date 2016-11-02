'use strict';

const Mongose = require('mongoose');

var EmailSchema = new Mongose.Schema({
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    // sender
    type: String,
    required: true
  },
  indexId: {
    // receiver
    type: String,
    required: true
  },
  email_address: {
    type: String
  },
  status: {
    type: String,
    enum: ['unknown', 'sent', 'error'],
    default: 'unknown',
    required: true
  },
  _emails_job: {type: String, ref: 'EmailsJob' },

}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('Email', EmailSchema);
