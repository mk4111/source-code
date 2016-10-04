'use strict';

const Handlebars = require('handlebars');

/* @TODO: remove it, the html shouldn't be fixed in js */

module.exports = function (isAdmin) {

  let result = "<input type=\"checkbox\" name=\"admin\" > Admin <br/>";

  if(isAdmin === true) {

    result = "<input type=\"checkbox\" name=\"admin\" checked> Admin <br/>";
  }

    return new Handlebars.SafeString(result);
}
