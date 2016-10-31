'use strict';

const Underscore = require('underscore')
const google       = require('googleapis');
const gmail        = google.gmail('v1');
const OAuth2       = google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const btoa                  = require('btoa');

const updateEmailsCandidate = require('../../database-helpers/elasticsearch/update_emails_candidate');
const listCountries = require('../../database-helpers/elasticsearch/list_countries');
const Es = require('../../es');

function scheduleEmailsLoop(candidatesData, idx, email, client, job, countries, error_callback) {
  sendEmail(candidatesData[idx], email, client, job, countries)
    .then(() => {
      idx++;
      if( idx < candidatesData.length ) {
        scheduleEmailsLoop(candidatesData, idx, email, client, job, countries, error_callback);
      } else {
        error_callback();
      }
    }).catch((err) => {
      error_callback(err); 
    });
}

function sendEmail(candidate, email, client, job, countries) {
    return new Promise((resolve, reject) => {

    const subject = email.subject.replace(/{name}/g, candidate.firstName);

    var message = email.message.replace(/{name}/g, candidate.firstName);
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
          let emailObject = { 
            message: email.message,
            subject: subject,
            senderName: email.senderName,
            senderId: email.senderId,
            timestamp: email.timestamp,
            sentAt: email.sentAt
          };
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
  const candidatesFullNames = ((typeof request.payload.candidateFN === 'string') ? [request.payload.candidateFULLN] : request.payload.candidateFULLN )

  var candidatesData = candidatesEmails.map( (entry, index) => { return { email: entry, id: candidatesIDs[index], firstName: candidatesFirstNames[index], fullName: candidatesFullNames[index] }; });

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

  var client = null, job = null, promises = [];

  if (request.payload.clientId) {
    promises.push(
      new Promise((resolve, reject) => {
        Es.get({ 
          index: process.env.ES_INDEX, type: process.env.ES_TYPE_GM_CLIENTS,
          id: request.payload.clientId,
          _source: ['id', 'name', 'logoUrl']
        }).then(r => {
          client = r._source;
          resolve();
        }).catch((e) => { reject(); });
      })
    );
  }
  if (request.payload.jobId) {
    promises.push(
      new Promise((resolve, reject) => {
        Es.get({
          index: process.env.ES_INDEX, type: process.env.ES_TYPE_GM_JOBS,
          id: request.payload.jobId,
          _source: ['title', 'client', 'salary', 'address', 'employmentType'],
        }).then(r => {
          job = r._source;
          resolve();
        }).catch((e) => { reject(); });
      })
    );
  }

  Promise.all(promises)
    .then(() => {

      listCountries(function (err, countries) {

        countries = (() => { let r = {}; countries.forEach(o => { r[o.value] = o }); return r; })();

        scheduleEmailsLoop(candidatesData, 0, email, client, job, countries, (error) => {
          if(error) {
            console.log(error);
            // for now it's just fine to redirect to login - people remember it means some error but oviously
            // it's totally lame!
            return reply.redirect('/'); 
          }
          if(request.payload.pathUrl) {
            if (request.payload.pathUrl.indexOf('candidate') != -1) {
              request.yar.flash('email-sent', true);
            }
            return reply.redirect(request.payload.pathUrl);
          } else { 
            return reply.redirect('/'); 
          }
        });

      });

    }).catch(e => {
      console.log(e);
    });
}
