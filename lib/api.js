'use strict';

var es = require('./es.js');
var transform_linkedin_url = require('linkedin-canonical-url');
var completeProfile = require('./helpers/complete_profile');
var userLiName = require('./database-helpers/elasticsearch/get_user_by_li_name');

exports.register = function (server, options, next) {

  server.route([
  {
    method: 'POST',
    path: '/profile',
    config: {
      description: 'save JSON object',
      auth: false,
      handler: function (request, reply) {
        request.payload.date = Date.now();

        //copy the email to the not analyzed version
        request.payload.contacts.emailRaw = request.payload.contacts.email;

        if(request.payload.url) {

            request.payload.url = transform_linkedin_url(request.payload.url);

            es.search({
              index: process.env.ES_INDEX,
              type: process.env.ES_TYPE,
              body: {
                  query: {
                      match_phrase: {url: request.payload.url}
                  }
             }

            }, function (error, response) {



                if(response.hits.hits.length > 0) {

                    var id = response.hits.hits[0]._id;

                    var connectedUsers = response.hits.hits[0]._source.connectedTo;

                    //if 1st degree contact or no first degree connections yet, update allow
                    if((request.payload.connectedTo && request.payload.connectedTo[0]) || connectedUsers.length === 0) {

                      if (connectedUsers.indexOf(request.payload.connectedTo[0]) === -1) {

                        connectedUsers.push(request.payload.connectedTo[0]);
                      }

                      request.payload.connectedTo = connectedUsers;

                      //keep the list of favourite if the profile is updated from the api
                      request.payload.favourite = response.hits.hits[0]._source.favourite;

                      //keep emails sent to the profile
                      request.payload.emails = response.hits.hits[0]._source.emails;

                      //keep the cv
                      request.payload.cvDocumentLink = response.hits.hits[0]._source.cvDocumentLink;

                      //keep the jobApplications
                      request.payload.jobApplications = response.hits.hits[0]._source.jobApplications;

                      //update phone email address only if the payload contain those values
                      request.payload.contacts.email = request.payload.contacts.email || response.hits.hits[0]._source.contacts.email;

                      //copy the email to the not analyzed version
                      request.payload.contacts.emailRaw = request.payload.contacts.email;

                      request.payload.contacts.phone = request.payload.contacts.phone || response.hits.hits[0]._source.contacts.phone;

                      request.payload.contacts.address = request.payload.contacts.address || response.hits.hits[0]._source.contacts.address;

                      //kepp info
                      request.payload.info = response.hits.hits[0]._source.info;

                      //kepp statusCurrent
                      request.payload.statusCurrent = response.hits.hits[0]._source.statusCurrent;

                      //keep statusHistory
                      request.payload.statusHistory = response.hits.hits[0]._source.statusHistory;

                      //keep notesList

                      request.payload.notesList = response.hits.hits[0]._source.notesList;

                      //keep rejected
                      request.payload.rejected = response.hits.hits[0]._source.rejected;

                      //keep listNames
                      request.payload.listNames = response.hits.hits[0]._source.listNames;

                      var viewedBy = response.hits.hits[0]._source.viewedBy || [];
                      //create userObject based on userName from Li

                      userLiName(request.payload.viewedBy, function (err, user) {

                        var userObj = {};
                        userObj.id = user.id;
                        userObj.fullname = user.names.fullname;
                        userObj.initials = user.names.fullname.split(' ').map( name => name.charAt(0).toUpperCase()).join('');

                        var userNameExist = viewedBy.filter(function (obj) {
                          return userObj.id.toString() === obj.id.toString();
                        });

                        // if userNameExist is empty array/false that means we dont have the user name in viewedBy
                        if (userNameExist.length === 0) {
                          userObj.timestamp = [Date.now()];
                          viewedBy.push(userObj);
                        } else {
                          userNameExist[0].timestamp.push(Date.now());
                        }

                        request.payload.viewedBy =  viewedBy;

                        es.index({
                          index: process.env.ES_INDEX,
                          type: process.env.ES_TYPE,
                          id: id,
                          body: completeProfile(request.payload)
                        }, function (error, response) {
                          // $lab:coverage:off$
                            if(error) {
                                return next(error);
                            }
                            // $lab:coverage:on$
                          return reply(response._id);
                        });

                      });

                    } else {
                      //not first degree connection and connectedUsers is not empty
                      var viewedBy = response.hits.hits[0]._source.viewedBy;
                      userLiName(request.payload.viewedBy, function (err, user) {

                        var userObj = {};
                        userObj.id = user.id;
                        userObj.fullname = user.names.fullname;
                        userObj.initials = user.names.fullname.split(' ').map( name => name.charAt(0).toUpperCase()).join('');

                        var userNameExist = viewedBy.filter(function (obj) {
                            return userObj.id === obj.id;
                        });

                        if (userNameExist.length === 0) {
                          userObj.timestamp = [Date.now()];
                          viewedBy.push(userObj);
                        } else {
                          userNameExist[0].timestamp.push(Date.now());
                        }

                        es.update({
                          index: process.env.ES_INDEX,
                          type: process.env.ES_TYPE,
                          id: response.hits.hits[0]._id,
                          body: {
                            doc: {
                              viewedBy: viewedBy
                            }
                          }
                        }, function (err, response) {
                          // $lab:coverage:off$
                            if(error) {
                                return next(error);
                            }
                            // $lab:coverage:on$

                          return reply("401");
                        });
                      });
                    }
                } else {
                  //url in the profile but not find in ES
                  var viewedBy = [];
                  userLiName(request.payload.viewedBy, function (err, user) {

                      var userObj = {};
                      userObj.id = user.id;
                      userObj.fullname = user.names.fullname;
                      userObj.initials = user.names.fullname.split(' ').map( name => name.charAt(0).toUpperCase()).join('');
                      userObj.timestamp = [Date.now()];
                      viewedBy.push(userObj);

                      request.payload.viewedBy = viewedBy;

                      es.index({
                        index: process.env.ES_INDEX,
                        type: process.env.ES_TYPE,
                        body: completeProfile(request.payload)
                      }, function (error, response) {
                        // $lab:coverage:off$
                          if(error) {
                              return next(error);
                          }
                          // $lab:coverage:on$
                          return reply(response._id);
                      });
                  });
                }
            });
          }else {
            //no url in the profile and we save in ES
            var viewedBy = [];
            userLiName(request.payload.viewedBy, function (err, user) {

              var userObj = {};
              userObj.id = user.id;
              userObj.fullname = user.names.fullname;
              userObj.initials = user.names.fullname.split(' ').map( name => name.charAt(0).toUpperCase()).join('');
              userObj.timestamp = [Date.now()];
              viewedBy.push(userObj);

              request.payload.viewedBy = viewedBy;

              es.index({
                index: process.env.ES_INDEX,
                type: process.env.ES_TYPE,
                body: completeProfile(request.payload)
              }, function (error, response) {
                // $lab:coverage:off$
                  if(error) {
                      return next(error);
                  }
                  // $lab:coverage:on$
                  return reply(response._id);
              });
            });

          }
      }
    }
  }

  ]);

  return next();
};

exports.register.attributes = {
  name: 'Api'
};
