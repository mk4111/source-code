'use strict';

const Mongose = require('mongoose');

var ListSchema = new Mongose.Schema({
  candidates : [{ type: Mongose.Schema.Types.ObjectId, ref: 'Candidate' }],
  userId: {
    // the gut who created the list
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('List', ListSchema);
