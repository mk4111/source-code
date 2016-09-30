require('env2')('.env');
var JWT = require('jsonwebtoken');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

var cheerio = require('cheerio');

describe('Test the notes feature | ', function () {

  it('Attempt to save a note without the right access', function (done) {

    var options = {
      method: "POST",
      url: "/notes/save",
      payload: {notes: 'this is a note', idCandidate: '12'}
    };

    Server.init(0, function (err, server) {


      expect(err).to.not.exist();
      server.inject(options , function (res) {

        expect(res.statusCode).to.equal(302);

        server.stop(done);
      });
    });
  });


  it('Save a note with the right access', function (done) {

    var options = {
      method: "POST",
      url: "/notes/save",
      payload: {notes: 'this is a note', idCandidate: '1', idUser: '12'},
      credentials: { id: "12", "name": "Simon", valid: true}
    };

    Server.init(0, function (err, server) {


      expect(err).to.not.exist();
      server.inject(options , function (res) {

        expect(res.statusCode).to.equal(302);

        server.stop(done);
      });
    });
  });


  it('Check that the note is displayed', function (done) {

    var options = {
      method: "GET",
      url: "/candidate/1",
      credentials: { id: "12", "name": "Simon", valid: true}
    };

    Server.init(0, function (err, server) {


      expect(err).to.not.exist();
      server.inject(options , function (res) {

        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var notes = $('.notes.segment .card');
        expect(notes.length).to.equal(1);

        server.stop(done);
      });
    });
  });



});
