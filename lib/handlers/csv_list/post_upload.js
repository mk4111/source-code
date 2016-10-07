'use strict';

/**
* Upload a csv file to an existing list
*/

const addListToCandidates = require('./helpers/add_list_to_candidates');

module.exports = function (request, reply) {

  /**
  * exists is true if the name of the list already exists in es, otherwise...false
  */
  addListToCandidates(request.payload.csvFile, request.payload.listName, function(parseCsvError){

    if(parseCsvError) {

      return reply.view('csvUploadForm', {errorMessage: 'Sorry wrong format of the file. Is it a csv file? Does it have Name and Email columns?', listName: request.payload.listName, request:request });
    }

    setTimeout(function(){

      return reply.redirect('/csv-list/list')
    }, 2000);
  });
}
