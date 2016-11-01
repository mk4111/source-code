'use strict';

const Mongose = require('mongoose');

var EmailTemplateSchema = new Mongose.Schema({
  name: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    // the guy who created the template
    type: String,
    required: true
  }
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('EmailTemplate', EmailTemplateSchema);
