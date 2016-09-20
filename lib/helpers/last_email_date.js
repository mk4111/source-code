'use strict';

/**
* Return an object of the date and timestamp of last email
* Example: { sentAt: '02.02.2016', timestamp: '1455808458140' }
* @param {Array} emails - array of objects
* Example of emails:
[ { timestamp: '1455808458140',
    message: 'Some message',
    sentAt: '02.02.2016',
    senderName: 'anita',
    subject: 'hello',
    senderId: '12323',
    senderEmail: 'email@gmail.com' } ]
*/

// @TODO: @speedingdeer: does it really deserve to be a helper?

const Uuid = require("uuid");

module.exports = function (emails) {
  if (emails && emails.length > 0) { return emails.reverse()[0]; }
  return {};
}
