'use strict';
//profile  in erquest.quty.credential
require('env2')('.env');
const es = require('../lib/es.js');
const Code = require('code');
const Lab = require('lab');
const Server = require('../lib/index.js');
const JWT = require('jsonwebtoken');
const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;



describe('Attempt to send email without being authenticated', function () {

  it('it redirect to the login page', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      const options = {
        method: "POST",
        url: "/emails"
      }

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(302);

        server.stop(done);
      });
    });
  });
});


  describe('send an email', function () {

    it('it send an email', function (done) {

      const accessToken =  JWT.sign({ id: '12', name: "Simon", valid: true, firstname: "Simon"}, process.env.JWT_SECRET);

      //we can reuse the tokens used for updloading a cv
      const tokens = {
        access_token: process.env.CV_ACCESS_TOKEN,
        token_type: process.env.CV_TOKEN_TYPE,
        id_token: process.env.CV_ID_TOKEN,
        refresh_token: process.env.CV_REFRESH_TOKEN,
        expiry_date: process.env.CV_EXPIRY_DATE
      };

      const payload = {
        to: "test@gmail.com",
        candidateID: "12",
        candidateFN: "maria",
        fn: "Simon",
        role: "dev",
        office: "007",
        mobile: "007",
        linkedin: "/in/simon",
        subject: "subject of the messsage test",
        message: "Hello {name}",


      }
      const options = {
        method: "POST",
        url: "/emails",
        headers: { cookie: "token=" + accessToken },
        credentials: { id: "12", "name": "Simon", valid: true, "firstname": "Simon", emails: [{value: "dolores.maria9810@gmail.com"}], tokens: tokens},
        payload: payload
      };

      const nock = require('nock');
      nock('https://www.googleapis.com')
        .post('/gmail/v1/users/me/messages/send')
        .reply(200, {labelIds: ['SENT']});

      Server.init(0, function (err, server) {

        expect(err).to.not.exist();

        server.inject(options, function (res) {

          expect(res.statusCode).to.equal(302);

          server.stop(done);
        });
      });
    });
  });


  describe('Attempt to send an email', function () {

    it('Attempt to send an email, response NOSENT', function (done) {

      const accessToken =  JWT.sign({ id: '12', name: "Simon", valid: true, firstname: "Simon"}, process.env.JWT_SECRET);

      //we can reuse the tokens used for updloading a cv
      const tokens = {
        access_token: process.env.CV_ACCESS_TOKEN,
        token_type: process.env.CV_TOKEN_TYPE,
        id_token: process.env.CV_ID_TOKEN,
        refresh_token: process.env.CV_REFRESH_TOKEN,
        expiry_date: process.env.CV_EXPIRY_DATE
      };

      const payload = {
        to: "test@gmail.com",
        candidateID: "12",
        candidateFN: "maria",
        fn: "Simon",
        role: "dev",
        office: "007",
        mobile: "007",
        linkedin: "/in/simon",
        subject: "subject of the messsage test",
        message: "Hello {name}",
        pathUrl: '/12'
      };

      const options = {
        method: "POST",
        url: "/emails",
        headers: { cookie: "token=" + accessToken },
        credentials: { id: "12", "name": "Simon", valid: true, "firstname": "Simon", emails: [{value: "dolores.maria9810@gmail.com"}], tokens: tokens},
        payload: payload
      };

      const nock = require('nock');
      nock('https://www.googleapis.com')
        .post('/gmail/v1/users/me/messages/send')
        .reply(200, {labelIds: ['NOSENT']});



      Server.init(0, function (err, server) {

        expect(err).to.not.exist();

        server.inject(options, function (res) {

          expect(res.statusCode).to.equal(302);

          server.stop(done);
        });
      });
    });
  });


  describe('send multiple emails', function () {

    it('send multiple emails', function (done) {

      const accessToken =  JWT.sign({ id: '12', name: "Simon", valid: true, firstname: "Simon"}, process.env.JWT_SECRET);

      //we can reuse the tokens used for updloading a cv
      const tokens = {
        access_token: process.env.CV_ACCESS_TOKEN,
        token_type: process.env.CV_TOKEN_TYPE,
        id_token: process.env.CV_ID_TOKEN,
        refresh_token: process.env.CV_REFRESH_TOKEN,
        expiry_date: process.env.CV_EXPIRY_DATE
      };

      const payload = {
        to: ["test@gmail.com","test2@gmail.com"],
        candidateID: ["12", "123"],
        candidateFN: ["maria", "maria2"],
        fn: "Simon",
        role: "dev",
        office: "007",
        mobile: "007",
        linkedin: "/in/simon",
        subject: "subject of the messsage test",
        message: "Hello {name}",


      }
      const options = {
        method: "POST",
        url: "/emails",
        headers: { cookie: "token=" + accessToken },
        credentials: { id: "12", "name": "Simon", valid: true, "firstname": "Simon", emails: [{value: "dolores.maria9810@gmail.com"}], tokens: tokens},
        payload: payload
      };

//'https://www.googleapis.com/upload/gmail/v1/users/{userId}/messages/send',

      const nock = require('nock');
      nock('https://www.googleapis.com')
        .persist()
        .post('/gmail/v1/users/me/messages/send')
        .reply(200, {labelIds: ['SENT']});



      Server.init(0, function (err, server) {

        expect(err).to.not.exist();

        server.inject(options, function (res) {

          expect(res.statusCode).to.equal(302);

          server.stop(done);
        });
      });
    });
  });
