'use strict';

const Mongose = require('mongoose');

var EmailTemplateSchema = new Mongose.Schema({
  name: {
    // the guy who created the template
    type: String,
    required: true
  },
  subject: {
    // the guy who created the template
    type: String,
    required: true
  },
  content: {
    // the guy who created the template
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
