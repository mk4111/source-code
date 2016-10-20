'use strict';

/**
* Get and update the notesList of specific candidate
* @param {object} note
* Example of note:
{
idCandidate: 'ElasticSeach id',
note: 'somenote',
timestamp: 897978787,
idUser: 'user idGoogle'
}
* @param {Function} callback - returns error or response
*/

const clientES = require('../../es.js');

module.exports = function (note, callback) {

  console.log(note.idCandidate)

  clientES.get({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    id: note.idCandidate,
    _source: ['notesList']

  }, function (error, response) {

    const currentNote = response._source.notesList || [];
    currentNote.push(note);

    clientES.update({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: note.idCandidate,
      body: {
        doc: {
          notesList: currentNote
        }
      }
    }, function (errorUpdate, responseUpdate) {

      return callback(errorUpdate, responseUpdate);
    })
  });
}
