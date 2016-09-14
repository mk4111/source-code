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

module.exports = function (emails) {

  var result = {};

  if (emails.length > 0) {
    var lastEmail = emails.reverse();
    result.sentAt = lastEmail[0].sentAt;
    result.timestamp = lastEmail[0].timestamp;
  }

  return result;
}
