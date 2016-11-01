const google       = require('googleapis');
const gmail        = google.gmail('v1');

const btoa = require('btoa');

const updateEmailsCandidate = require('../database-helpers/elasticsearch/update_emails_candidate');

function sendEmail(oauth2Client, candidate, email, client, job, countries) {
  return new Promise((resolve, reject) => {
    const subject = email.subject;

    var message = email.message;
    message = message.replace(/{{candidate.firstname}}/g, candidate.firstName);
    message = message.replace(/{{candidate.fullname}}/g, candidate.fullName);
    if (client) {
      message = message.replace(/{{client.name}}/g, client.name);
    }
    if (job) {
      message = message.replace(/{{job.title}}/g, job.title);
      message = message.replace(/{{job.address.country}}/g,  countries[job.address.countryID].label);
      message = message.replace(/{{job.address.city}}/g, job.address.city);
      message = message.replace(/{{job.employmenttype}}/g, job.name);
    }

    const messageHtml = message.replace(/\n/g, '<br/>');

    const base64EncodedEmail = btoa(
      "Content-Type:  text/html; charset=\"UTF-8\"\n" +
      "Content-length: 5000\n" +
      "Content-Transfer-Encoding: message/rfc2822\n" +
      "to: " + candidate.email + "\n" +
      "from: \"" + email.senderName + "\" <"+ email.senderEmail +">\n" +
      "subject:" + subject + "\n\n" +
       messageHtml +
      '<br/><br/>' + email.signature
    ).replace(/\+/g, '-').replace(/\//g, '_');

    var paramsEmail = {
      userId: 'me',
      auth: oauth2Client,
      resource: {
        raw: base64EncodedEmail
      }
    };

    console.log("...trying...")

    gmail.users.messages.send(paramsEmail,
       function (errorEmail, responseEmail) {
        console.log("callback")
        if(errorEmail) {
          console.log(errorEmail);
          reject(errorEmail);
        }
        if (responseEmail && responseEmail.labelIds && responseEmail.labelIds.indexOf('SENT') !== -1) {
          var emailObject = { 
            message: email.message,
            subject: subject,
            senderName: email.senderName,
            senderId: email.senderId,
            timestamp: email.timestamp,
            sentAt: email.sentAt
          };
          updateEmailsCandidate(candidate.id, emailObject, function(errorUpdate, responseUpdate) {
            console.log("RESOLVE")
            resolve();
          });
        } else {
          console.log("REJECT")
          reject();
        }
    });

  });

}


module.exports = {
  send: sendEmail
}