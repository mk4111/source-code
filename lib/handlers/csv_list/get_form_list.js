'use strict';

/**
* Return the form for the creation of a list
*/

module.exports = function (request, reply) {

  return reply.view("csvListForm", { request:request });
}
