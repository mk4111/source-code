'use strict';

const Mongose = require('mongoose');
const Underscore = require('underscore');

var CandidateSchema = new Mongose.Schema({
  indexId: { type: String, trim: true, index: true, unique: true },
  // I'm not going to use {true, unique: true, sparse: true} for all the others fields
  // we are not really good at keep the data consistent
  
  // url  it's a a LinkedIn url, the naming sucks but it's a legacy
  // better to keep it consistent with a names in index
  url: { type: String, trim: true },
  stackoverflow: { type: String, trim: true },
  skype: { type: String, trim: true },
  twitter: { type: String, trim: true },
  facebook: { type: String, trim: true },
  github: { type: String, trim: true },
  // the one which comes from the linkedIn
  email: { type: String, trim: true },
  phone: { type: String, trim: true },

  blacklisted: { type: Boolean, default: false },
  calls : [{ type: Mongose.Schema.Types.ObjectId, ref: 'Call' }],
  lists : [{ type: Mongose.Schema.Types.ObjectId, ref: 'List' }]
}, {
    timestamps: true // ask mongo to store timestamps (createdAt, updatedAt)
});

CandidateSchema.methods.merge = function(obj) {

    if (obj.contacts && obj.contacts.email) { obj.email = obj.contacts.email; }
    if (obj.contacts && obj.contacts.phone) { obj.phone = obj.contacts.phone; }

     //  in case is empty try to get one from ES
    if (! this.url && obj.url) { this.url = obj.url; }
    // check if the phone and email are not already defined from the LinkedIn profile
    if (obj.email) { this.email = obj.email; }
    if (obj.phone) { this.phone = obj.phone; }

    var id = obj.id;

    obj = Underscore.extend(obj, this);
    obj.id = id;
    return obj;
}

module.exports = Mongose.model('Candidate', CandidateSchema);
