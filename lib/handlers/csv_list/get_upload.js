'use strict';

/**
* Return the form for uploading a csv to an existing list
*/

module.exports = function (request, reply) {

  return reply.view("csvUploadForm", { listName: request.params.listName, request: request });
}
