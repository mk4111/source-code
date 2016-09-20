var Handlebars = require('handlebars');
module.exports = function (page, prev, next, totalPages, queryString) {

  // @speedingdeer: have no idea what is this for
  page = Handlebars.Utils.escapeExpression(page);
  prev = Handlebars.Utils.escapeExpression(prev);
  next = Handlebars.Utils.escapeExpression(next);
  totalPages = Handlebars.Utils.escapeExpression(totalPages);

  // @TODO: this is lame, html must be render in template, injecting like here feels weird

  var result = "<div class='ui pagination menu'>";

  if (Number(page) > 1) {
    // append the fisrt page
    result += "<a class='item' href='/query/" + "1" + queryString + "'>1</a>";
  }

  if (Number(page) > 3) {
    // append the ... between first and current
    result += "<div class='disabled item'>...</div>";
  }

  if (Number(page) > 2) {
    // append the ... between first and current
      result += "<a class='item' href='/query/" + ( Number(page) - 1 ) + queryString + "'>" + ( Number(page) - 1 ) + "</a>";
  }


  // now add current
  result += "<a class='active item' href='/query/" + page + queryString + "'>" + page + "</a>";

  if (Number(page) < Number(totalPages) - 1 ) {
    // append the ... between the current and last
    result += "<a class='item' href='/query/" + ( Number(page) + 1 ) + queryString + "'>" + ( Number(page) + 1 ) + "</a>";
  }

  if (Number(page) < Number(totalPages) - 2 ) {
    // append the ... between the current and last
    result += "<div class='disabled item'>...</div>";
  }

  if (Number(page) < Number(totalPages) ) {
    // append the last
      result += "<a class='item' href='/query/" + totalPages + queryString + "'>" + totalPages + "</a>";
  }

  result += "</div>";

    return new Handlebars.SafeString(result);
};
