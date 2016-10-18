var es = require('../lib/es.js');
require('env2')('.env');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');
var JWT = require('jsonwebtoken');
var cheerio = require('cheerio');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test
var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

describe('/search', function () {

  it('attempt to access search page without being authenticated', function (done) {

    Server.init(0, function (err, server) {
      expect(err).to.not.exist();
      server.inject('/search', function (res) {
        expect(res.statusCode).to.equal(302);
        server.stop(done);
      });
    });
  });
});

describe('return a search results, when user is authenticated: Search for Nick and return 1 result', function () {
  it('returns specific search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=Nick&location=&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        //we should only have one result
        var $ = cheerio.load(res.payload);
        expect($('.candidates-list').length).to.equal(1);
        expect($('.pathUrl')['0'].attribs.value).to.equal("/search/1?headline=&fullname=Nick&location=&company=&skills=");
        server.stop(done);
      });
    });
  });
});

describe('return a search results, when user is authenticated: Search for Nick with skills smart and javascript', function () {
  it('returns specific search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=Nick&location=&company=&skills=Smart%2C+javascript', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        //we should only have one result
        var $ = cheerio.load(res.payload);
        expect($('.candidates-list').length).to.equal(1);
        server.stop(done);
      });
    });
  });
});

describe('return a search results, when user is authenticated: Search for Nick with skills smart and wrongSkill, no results', function () {
  it('returns 0 results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=Nick&location=&company=&skills=smart%2C+wrongskill', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        //we should only have one result
        var $ = cheerio.load(res.payload);
        expect($('.candidates-list .row.candidate').length).to.equal(0);
        server.stop(done);
      });
    });
  });
});

describe('Silly search: return 0 results', function () {
  it('doesn\'t return any results for a silly search', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=kungfumaster&fullname=chuck&location=heaven&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        //we should only have one result
        var $ = cheerio.load(res.payload);
        expect($('.candidates-list .row.candidate').length).to.equal(0);
        server.stop(done);
      });
    });
  });
});

describe('return a search results, when user is authenticated and with no precise page number', function () {
  it('returns specific search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search?headline=javascript&fullname=Anita&location=London&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});

describe('attempt to access a search page with wrong page parameter', function () {
  it('redirects', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/wrongNumber?headline=javascript&fullname=Anita&location=London&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(302);
        server.stop(done);
      });
    });
  });
});


describe('search only with specified location', function () {
  it('returns search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=&location=London&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});

describe('search with headline, fullname, empty location and empty company', function () {
  it('returns search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=developer&fullname=Anita&location=&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});


describe('search for candidate who is in my favourite list', function () {

  it('returns search results', function (done) {
    var tokenSimon =  JWT.sign({ id: '12', "name": "Simon", valid: true}, process.env.JWT_SECRET);

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=Oba&location=&company=&skills=', headers: { cookie: "token=" + tokenSimon }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});

describe('search for candidate who is NOT in my favourite list', function () {

  it('returns search results', function (done) {
    var tokenSimon =  JWT.sign({ id: '12', "name": "Simon", valid: true}, process.env.JWT_SECRET);

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=Manuel&location=&company=&skills=', headers: { cookie: "token=" + tokenSimon }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});

describe('search for candidate who doesn\'t have fullname' , function () {

  it('returns search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=&location=Bordeaux&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});

describe('search for candidate with specified company name' , function () {

  it('returns search results', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=&location=&company=Fawlty Hotel&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});


describe('return multiple results' , function () {

  it('return search results', function (done) {
    var numbersPerPage = process.env.RESULTS_PER_PAGE;
    process.env.RESULTS_PER_PAGE = 1;
    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/1?headline=&fullname=&location=Barcelona&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        process.env.RESULTS_PER_PAGE = numbersPerPage;
        server.stop(done);
      });
    });
  });
});

describe('return multiple results on specific page 2' , function () {

  it('return search results', function (done) {
    var numbersPerPage = process.env.RESULTS_PER_PAGE;
    process.env.RESULTS_PER_PAGE = 1;
    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      server.inject({url: '/search/2?headline=&fullname=&location=Barcelona&company=&skills=', headers: { cookie: "token=" + token }}, function (res) {
        expect(res.statusCode).to.equal(200);
        process.env.RESULTS_PER_PAGE = numbersPerPage;
        server.stop(done);
      });
    });
  });
});
