'use strict';

const Mongose = require('mongoose');

var FolderSchema = new Mongose.Schema({
  lists : [{ type: Mongose.Schema.Types.ObjectId, ref: 'List' }],
  userId: {
    // the guy who created the folder
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  // root folder if any
  _folder: {type: String, ref: 'Folder'},
  // subfolders if any
  folders : [{ type: Mongose.Schema.Types.ObjectId, ref: 'Folder' }],

}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

module.exports = Mongose.model('Folder', FolderSchema);
