var Handlebars = require('handlebars');
var Querystring = require('querystring');

module.exports = function (page, totalPages, request) {

  // @speedingdeer: have no idea what is this for
  page = Handlebars.Utils.escapeExpression(page);
  totalPages = Handlebars.Utils.escapeExpression(totalPages);

  // @TODO: this is lame, html must be render in template, injecting like here feels weird

  var queryString =  Querystring.stringify(request.url.query);
  var pagePath = ( request.url.pathname.indexOf("search") != -1 ) ? "search/" : "";

  if (queryString) { queryString = "?" + queryString; }

  if(totalPages == 0) { return ""; }

  var result = "<div class='ui pagination menu'>";

  if (Number(page) > 1) {
    // append the fisrt page
    result += "<a class='item' href='/" + pagePath + "1" + queryString + "'>1</a>";
  }

  if (Number(page) > 3) {
    // append the ... between first and current
    result += "<div class='disabled item'>...</div>";
  }

  if (Number(page) > 2) {
    // append the ... between first and current
      result += "<a class='item' href='/" + pagePath + ( Number(page) - 1 ) + queryString + "'>" + ( Number(page) - 1 ) + "</a>";
  }


  // now add current
  result += "<a class='active item' href='/" + pagePath + page + queryString + "'>" + page + "</a>";

  if (Number(page) < Number(totalPages) - 1 ) {
    // append the ... between the current and last
    result += "<a class='item' href='/" + pagePath + ( Number(page) + 1 ) + queryString + "'>" + ( Number(page) + 1 ) + "</a>";
  }

  if (Number(page) < Number(totalPages) - 2 ) {
    // append the ... between the current and last
    result += "<div class='disabled item'>...</div>";
  }

  if (Number(page) < Number(totalPages) ) {
    // append the last
      result += "<a class='item' href='/" + pagePath + totalPages + queryString + "'>" + totalPages + "</a>";
  }

  result += "</div>";

    return new Handlebars.SafeString(result);
};
