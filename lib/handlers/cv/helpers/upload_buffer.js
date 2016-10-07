'use strict';

/**
* Create a file on a Google Drive folder from a buffer
*/
const Google       = require('googleapis');
const OAuth2       = Google.auth.OAuth2;
const Oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

const tokens = {
  access_token: process.env.CV_ACCESS_TOKEN,
  token_type: process.env.CV_TOKEN_TYPE,
  id_token: process.env.CV_ID_TOKEN,
  refresh_token: process.env.CV_REFRESH_TOKEN,
  expiry_date: process.env.CV_EXPIRY_DATE
};

Oauth2Client.setCredentials(tokens);
const Drive = Google.drive({ version: 'v3', auth: Oauth2Client });
const SaveCVError = require('../../../database-helpers/elasticsearch/save-cv-error');
const UpdateCVLink = require('../../../database-helpers/elasticsearch/update-cv-link');
const Mime = require('mime-types');

/**
* @param {Buffer} binary - file content
* @param {String} fileName - name of the uploaded file (with extension, ex cv.pdf)
* @param {String} idCandidate - id of the candidate's cv
* @param {Function} next - callback with 1 param: 500 (if error) or Google Drive Id of the file
*/
module.exports = function (binary, fileName, idCandidate, next) {

  const params = {
    uploadType: "media",
    media: {
      body: binary,
    },
    resource: {
      name: fileName,
      description: idCandidate,
      parents: [process.env.FOLDER_ID]
    }
  };

 const mimeType = Mime.lookup(fileName);

  if ( mimeType ) {

    params.resource.mimeType = mimeType;
  }

  Drive.files.create(params, function(error, response) {

    //error during the upload of a file (the response is null or empty)
    if(!Boolean(response)) {
      console.log('Error when uploading cv', error);
      const errorPayload = {
        timestamp: Date.now(),
        candidateID: idCandidate,
        fileContent: binary.toString()
      }

      SaveCVError(errorPayload, function(errorSaveCv, responseSaveCv){
        console.log('save in error data base cv');
        return next(500);
      })

    } else {
      const documentLink = 'https://drive.google.com/file/d/' + response.id;
      UpdateCVLink(idCandidate, documentLink, function(errorUpdateCV, responseUpdateCV) {
        return next(response.id);
      })
    }
  });
}
