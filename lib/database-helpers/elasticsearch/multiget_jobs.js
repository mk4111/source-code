'use strict';

const clientES = require('../../es.js');

module.exports = function (ids, callback) {

  var params = ids.map( id => {return { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_GM_JOBS, _id: id }})

  // it's not correct to use an array of doc locations for the same index. if they are all about jobs, there should be just an
  // array of ids given here

  if(params.length > 0) {

    clientES.mget({
      body: {
        docs: params
      }
    }, function(error, response){
      let result = response.docs.map(job => {
          let jobObject = job._source;
          
          if(jobObject) {
            jobObject.id = job._id;
          }
          return jobObject;
      });
      result = result.filter(Boolean);
      return callback(error, result);

    });
  } else {
    return callback(null, []);
  }
}
