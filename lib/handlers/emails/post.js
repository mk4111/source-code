'use strict';

const Underscore = require('underscore')

const updateEmailsCandidate = require('../../database-helpers/elasticsearch/update_emails_candidate');
const listCountries = require('../../database-helpers/elasticsearch/list_countries');
const Es = require('../../es');

const EmailService = require('../../helpers/emails');
const EmailsQueue = require('../../emails_queue');

const google       = require('googleapis');
const OAuth2       = google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);


module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); } // @TODO: this one must be gone

  const profile = request.auth.credentials;
  //oauth2Client.setCredentials(profile.tokens);

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
        if (candidatesData.length == 1) { 
          EmailService.send(request.auth.credentials, candidatesData[0], email, client, job, countries)
            .then(() => {
              if(request.payload.pathUrl) {
                if (request.payload.pathUrl.indexOf('candidate') != -1) {
                  request.yar.flash('email-sent', true);
                }
                return reply.redirect(request.payload.pathUrl);
              }
            }).catch(e => {
              return reply("ERROR").code(302); // @TODO use boom
            });
        } else {
          EmailsQueue.add({
            credentials:request.auth.credentials,
            candidatesData: candidatesData,
            email:email,
            client:client,
            job:job,
            countries:countries
          });
          return reply.redirect(request.payload.pathUrl);
        }
      });

    }).catch(e => {
      return reply("ERROR"); // @TODO use boom
    });
}