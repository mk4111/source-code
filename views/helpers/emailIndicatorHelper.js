var Handlebars = require('handlebars');
var miliToDays = require('./convertToDaysHelper.js');

// @TODO @speedingdeer: the whole this thing it's to be rewritten, It's super lame to remder html from the 
// pure text, it's cthe temlpates job to do that.
// also it doesn't make sene to identify if to display text or not, 
// it can be easy done within the css with the clear logic, there is to much werid logic in this front-end

module.exports = function (sentEmailObj, displayText, emails) {
  if (sentEmailObj.timestamp !== undefined) {
    var difference = new Date().getTime() - sentEmailObj.timestamp;
    var days = miliToDays(difference);

    if (days < 30) {
      var result = "<div class='last-email-30'><i class='send icon'></i>";
      if (displayText) {
        result += "<span> Emailed within a month</span>";
      }
      result += "</div>";
      return new Handlebars.SafeString(result);
    }

    if (days < 90) {
      result = "<div class='last-email-90'><i class='send icon'></i>";
      if (displayText) {
        result += "<span> Emailed within 3 months</span>";
      }
      result += "</div>"
      return new Handlebars.SafeString(result);
    }
      result = "<div class='last-email-regular'><i class='send icon'></i>";
      if (displayText) {
        result += "<span> Emailed over 3 months ago</span>";
      }
      result += "</div>";
    return new Handlebars.SafeString(result);

  } else {
      result = "<div class='last-email-regular'><i class='send icon'></i>";
      if (displayText) {
        result += "<span> Emailed over 3 months ago</span>";
      }
      result += "</div>";
    return new Handlebars.SafeString(result);
  }

};
