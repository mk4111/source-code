'use strict';

const google       = require('googleapis');
const gmail        = google.gmail('v1');
const OAuth2       = google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const candidatesEmailId     = require('../../helpers/candidates_email_id');
const stringToArray         = require('../../helpers/string_to_array');
const capitalizeFirstLetter = require('../../helpers/capitalize_first_letter.js');
const btoa                  = require('btoa');
const updateEmailsCandidate = require('../../database-helpers/elasticsearch/update_emails_candidate');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {

    return reply.redirect('/login');
  }

  const profile = request.auth.credentials;
  oauth2Client.setCredentials(profile.tokens);

  const candidatesEmails = stringToArray(request.payload.to);
  const candidatesIDs = stringToArray(request.payload.candidateID);
  const candidatesFirstNames = stringToArray(request.payload.candidateFN).map(capitalizeFirstLetter);
  //[ {email: -. id: idCandidate, firstName: 'Thename'},... ]
  const candidatesData = candidatesEmailId(candidatesEmails, candidatesIDs, candidatesFirstNames);

  let userSignature = {};

  userSignature.names = {fullname: request.payload.fn}
  userSignature.role = request.payload.role;
  userSignature.phones = {mobile: request.payload.mobile, office: request.payload.office};
  userSignature.linkedin = request.payload.linkedin;

  //email properties
  let email = {};
  email.subject = request.payload.subject;
  email.message = request.payload.message;
  email.senderName = request.payload.firstname;
  email.senderEmail = profile.emails[0].value;
  email.senderId = profile.id;
  email.timestamp = new Date().getTime();
  email.sentAt = new Date().getDate() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + new Date().getFullYear();
  email.signature = request.payload.signature;

  let emailsSent = 0;
  candidatesData.forEach(function(candidate) {

    const subject = email.subject.replace(/{name}/g, candidate.firstName);

    const messageHtml = email.message.replace(/\n/g, '<br/>');
    const message = messageHtml.replace(/{name}/g, candidate.firstName);

    const base64EncodedEmail = btoa(
      "Content-Type:  text/html; charset=\"UTF-8\"\n" +
      "Content-length: 5000\n" +
      "Content-Transfer-Encoding: message/rfc2822\n" +
      "to: " + candidate.email + "\n" +
      "from: \"" + email.senderName + "\" <"+ email.senderEmail +">\n" +
      "subject:" + subject + "\n\n" +
      '<p>' + message +
      '</p>' + '</br>' + email.signature
    ).replace(/\+/g, '-').replace(/\//g, '_');


    let paramsEmail = {
      userId: 'me',
      auth: oauth2Client,
      resource: {
        raw: base64EncodedEmail
      }
    };

    gmail.users.messages.send(paramsEmail, function (errorEmail, responseEmail) {

      // $lab:coverage:off$
      if (errorEmail) {
        console.log(errorEmail);
        return reply.redirect('/login');
      }
      // $lab:coverage:on$

      if (responseEmail.labelIds.indexOf('SENT') !== -1) {

        let emailObject = {};
        emailObject.subject = subject;
        emailObject.message = email.message.replace(/{name}/g, candidate.firstName);
        emailObject.senderName = email.senderName;
        emailObject.senderId = email.senderId;
        emailObject.timestamp = email.timestamp;
        emailObject.sentAt = email.sentAt;

        updateEmailsCandidate(candidate.id, emailObject, function(errorUpdate, responseUpdate) {

        });

      }

      emailsSent++;
      if (emailsSent === candidatesEmails.length) {

        if(request.payload.pathUrl){
          return reply.redirect(request.payload.pathUrl);
        }

        else {
          return reply.redirect('/');
        }
      }

    });

  })
}
