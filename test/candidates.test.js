require('env2')('.env');
var es = require('../lib/es.js');
var JWT = require('jsonwebtoken');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

var idCandidate = 0;

describe('/candidates/create candidate', function () {

  it('Create a candidate', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/candidates/create",
        payload: {
          firstName: "Borislav",
          lastName: "Shekerov",
          email: "boris@example.com",
          phone: "1111111111",
          jobID: 1,
          linkedInURL: "https://uk.linkedin.com/in/borislav-shekerov-a7800990",
          comments: "Testing",
          skillset: "Marketing",
          name: "Borislav Shekerov",
          source: "Company Website"
      }
    };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        
        setTimeout(function () {
          es.get({
            index: process.env.ES_INDEX,
            type: process.env.ES_TYPE,
            id: res.payload
          }, function (err, response) {
            expect(res.statusCode).to.equal(200);
            expect(response._source.fullname).to.equal('Borislav Shekerov');
            server.stop(done);
          }); 
          }, 2000);
               
      });
    });
  });
});


describe('Update /candidates/create candidate', function () {

  it('Update a candidate with existing url in db', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/candidates/create",
        payload: {
          firstName: "Borislav",
          lastName: "Shekerov",
          email: "boris@example.com",
          phone: "1111111111",
          jobID: 2,
          linkedInURL: "https://uk.linkedin.com/in/borislav-shekerov-a7800990",
          comments: "Something else",
          skillset: "React",
          name: "Borislav Shekerov",
          source: "Company Website"
      }
    };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        idCandidate = res.payload;
        setTimeout(function () {
          es.get({
            index: process.env.ES_INDEX,
            type: process.env.ES_TYPE,
            id: res.payload
          }, function (err, response) {
            expect(res.statusCode).to.equal(200);
            expect(response._source.jobApplications.length).to.equal(2);

            server.stop(done);
          }); 
          }, 2000);
               
      });
    });
  });
});

describe('Return just created candidate', function () {

  it('checks the length of jobApplications ', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    var options = {
      method: "GET",
      url: "/candidate/" + idCandidate,
      headers: { cookie: "token=" + token },
      credentials: { id: "12", "name": "Simon", valid: true}
    };

    Server.init(0, function (err, server) {

      server.inject(options, function(res) {
        expect(err).to.not.exist();
        expect(res.statusCode).to.equal(200);
        expect(res.payload.indexOf('Something else')).to.be.above(-1);
        server.stop(done);
      });
    
    });
  });
});