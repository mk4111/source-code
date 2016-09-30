'use strict'

/**
* Define routes to upload a csv
*/

const getFormList = require('./handlers/csv_list/get_form_list');
const getList = require('./handlers/csv_list/get_list');
const postCreateList = require('./handlers/csv_list/post_list');
const postDownload = require('./handlers/csv_list/post_download');
const getUpload = require('./handlers/csv_list/get_upload');
const postUpload = require('./handlers/csv_list/post_upload');
const deleteList = require('./handlers/csv_list/post_delete');
const getCandidates = require('./handlers/csv_list/get_candidates');
const searchSkills = require('./handlers/csv_list/search_skills');

exports.register = function (server, option, next) {

  server.route(
    [
     {
        method: 'GET',
        path: '/csv-list/list',
        config: {
          description: 'Return the list of listNames',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: getList
        }
      },
      {
         method: 'GET',
         path: '/csv-list/{listName}/{pageNumber?}',
         config: {
           description: 'Return the list of candidates who belongs to that specific list',
           auth: {
             mode: 'try',
             strategy: 'jwt'
           },
           handler: getCandidates
         }
       },
      {
        // @speedingdeer: get for create? don't get it.
        method: 'GET',
        path: '/csv-list/create',
        config: {
          description: 'Return the form for the creation of a new list',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: getFormList
        }
      },
      {
        method: 'POST',
        path: '/csv-list/create',
        config: {
          description: 'Index a new list if it doesn\'t exists yet',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: postCreateList
        }
      },
      {
        method: 'POST',
        path: '/csv-list/download',
        config: {
          description: 'Download the list of candidate',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: postDownload
        }
      },
      {
        method: 'GET',
        path: '/csv-list/upload/{listName}',
        config: {
          description: 'Display the form for uploading a csv file',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: getUpload
        }
      },
      {
        method: 'POST',
        path: '/csv-list/upload',
        config: {
          description: 'Upload a csv file for an existing list',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: postUpload
        }
      },
      {
        method: 'POST',
        path: '/csv-list/delete',
        config: {
          description: 'Delete a list',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: deleteList
        }
      },
      {
        method: 'GET',
        path: '/query-list/{listName}/{pageNumber?}',
        config: {
          description: 'Search by skills on a csv list',
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: searchSkills
        }
      }
    ]
  );
  return next();
}

exports.register.attributes = {
  name: 'CsvList'
}
