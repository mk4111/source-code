require('env2')('.env');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');
var JWT = require('jsonwebtoken');
var cheerio = require('cheerio');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;



describe('delete a user', function () {
  var idProfile;
  it('add a duplicate profile', function (done) {
    var profile = require('./fixtures/duplicate-profile.json');
    var options = {
      method: "POST",
      url: "/profile",
      payload: profile
    };

    Server.init(0, function (err, server) {
       server.inject(options, function(res) {
         expect(res.statusCode).to.equal(200);
         setTimeout(function(){server.stop(done)}, 2000);
       });
     });

  });


  it('search for "Manuel", expect duplicate profiles', function (done) {
    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    var options = {
      method: "GET",
      url: "/search?headline=&fullname=manuel&location=&company=&skills=",
      headers: { cookie: "token=" + token }
    };
    Server.init(0, function (err, server) {
         server.inject(options, function(res) {
         expect(res.statusCode).to.equal(200);
         var $ = cheerio.load(res.payload);
         var duplicates = $('.candidate.row');
         idProfile = $('.candidate.row a')[0].attribs.href.split('/')[2];
         expect(parseInt(duplicates.length)).to.be.equal(2);
         server.stop(done);
       });
     })
  });

  it('add a user and delete it', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    var optionsDelete = {
      method: 'POST',
      url: "/delete",
      headers: { cookie: "token=" + token },
      payload: {id: idProfile}
    };

    Server.init(0, function (err, server) {
       server.inject(optionsDelete, function(res) {
         expect(res.statusCode).to.equal(302);
         setTimeout(function(){server.stop(done)}, 2000);
       });
     });

    });

    it('search for "Manuel", expect NO duplicate profiles', function (done) {

      var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
      var options = {
        method: "GET",
        url: "/search?headline=&fullname=manuel&location=&company=&skills=",
        headers: { cookie: "token=" + token }
      };
      Server.init(0, function (err, server) {
           server.inject(options, function(res) {
           expect(res.statusCode).to.equal(200);
           var $ = cheerio.load(res.payload);
           var duplicates = $('.candidate.row');
           expect(parseInt(duplicates.length)).to.be.equal(1);
           server.stop(done);
         });
       })
    });

    it('Attempt to delete a user without being authenticated', function (done) {

      var optionsDelete = {
        method: 'POST',
        url: "/delete",
        payload: {id: idProfile}
      };

      Server.init(0, function (err, server) {
         server.inject(optionsDelete, function(res) {
           expect(res.statusCode).to.equal(302);
           server.stop(done);
         });
       });

    });


  });
