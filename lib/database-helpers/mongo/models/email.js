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
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'sent' ,'error'],
    default: 'waiting',
    required: true
  },
  
  _emails_job: {type: String, ref: 'EmailsJob', set: (v) => {
    if(v == null || v.trim().length == 0) {
      return undefined;
    }
    return v;
  }},

}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('Email', EmailSchema);
