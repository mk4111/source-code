'use strict';

const Underscore = require('underscore')
const google       = require('googleapis');
const gmail        = google.gmail('v1');
const OAuth2       = google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const candidatesEmailId     = require('../../helpers/candidates_email_id');
const btoa                  = require('btoa');
const updateEmailsCandidate = require('../../database-helpers/elasticsearch/update_emails_candidate');

function scheduleEmailsLoop(candidatesData,  idx, email, callback) {
  sendEmail(candidatesData[idx], email)
    .then(() => {
      idx++;
      if( idx < candidatesData.length ) {
        scheduleEmailsLoop(candidatesData,  idx, email, callback);
      } else {
        callback();
      }
    }).catch((err) => {
      callback(err); 
    });
}

function sendEmail(candidate, email) {
    return new Promise((resolve, reject) => {

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
    
    gmail.users.messages.send(paramsEmail,
       function (errorEmail, responseEmail) {
        if(errorEmail) {
          console.log(errorEmail);
          reject(errorEmail);
        }
        if (responseEmail && responseEmail.labelIds && responseEmail.labelIds.indexOf('SENT') !== -1) {
          let emailObject = {};
          emailObject.subject = subject;
          emailObject.message = email.message.replace(/{name}/g, candidate.firstName);
          emailObject.senderName = email.senderName;
          emailObject.senderId = email.senderId;
          emailObject.timestamp = email.timestamp;
          emailObject.sentAt = email.sentAt;
          updateEmailsCandidate(candidate.id, emailObject, function(errorUpdate, responseUpdate) {
            resolve();
          });
        } else {
          reject();
        }
    });

  });

}

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {

    return reply.redirect('/login');
  }

  const profile = request.auth.credentials;
  oauth2Client.setCredentials(profile.tokens);

  const candidatesEmails = (typeof request.payload.to === 'string') ? [request.payload.to] : request.payload.to;
  const candidatesIDs = (typeof request.payload.candidateID === 'string') ? [request.payload.candidateID] : request.payload.candidateID;
  const candidatesFirstNames = ((typeof request.payload.candidateFN === 'string') ? [request.payload.candidateFN] : request.payload.candidateFN ).map(
      (s) => { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }
    );
  //[ {email: -. id: idCandidate, firstName: 'Thename'},... ]
  var candidatesData = candidatesEmailId(candidatesEmails, candidatesIDs, candidatesFirstNames);

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

  scheduleEmailsLoop(candidatesData, 0, email, (error) => {
    if(error) {
      console.log(error);
      // for now it's just fine to redirect to login - people remember it means some error but oviously
      // it's totally lame!
      return reply.redirect('/'); 
    }
    if(request.payload.pathUrl){
      return reply.redirect(request.payload.pathUrl);
    } else { 
      return reply.redirect('/'); 
    }
  });
}
