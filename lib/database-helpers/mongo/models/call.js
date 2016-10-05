'use strict';

const Mongose = require('mongoose');

var CallSchema = new Mongose.Schema({
  _candidate: {type: String, ref: 'Candidate'},
  userId: {
    type: String,
    required: true
  },
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('Call', CallSchema);
