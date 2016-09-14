'use strict';

/**
* Return array of object (email) that has been sent over month ago
* @param {Array} emails - array of objects
* Example of emails:
[ { timestamp: '1455808458140',
    message: 'Some message',
    sentAt: '05.02.2016',
    senderName: 'anita',
    subject: 'hello',
    senderId: '12323',
    senderEmail: 'email@gmail.com' } ]
*/

module.exports = function (emails) {
  if (!emails) { return false; } // just get back if no emails
  const result = emails.filter(function (email) {
    return email.timestamp > Date.now() - (30 * 24 * 60 * 60 * 1000);
  });

  return result.length > 0;
}
