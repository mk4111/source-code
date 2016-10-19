require('env2')('.env');
var es = require('../lib/es.js');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');
var JWT = require('jsonwebtoken');

var cheerio = require('cheerio');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('api /profile', function () {

  it('updates a fake profile', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/fake-update.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
    };

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);

        var tokenSimon =  JWT.sign({ id: '13', "name": "Simon", valid: true}, process.env.JWT_SECRET);

        var optionsCandidate = {
          method: "GET",
          url: "/candidate/" + res.payload,
          headers: { cookie: "token=" + tokenSimon }
        };

        var redisClient = require('redis-connection')();
        redisClient.set(13, JSON.stringify({ id: 13, "name": "Simon", valid: true}), function (err, res) {
          setTimeout(function () { server.inject(optionsCandidate , function (res) {

          expect(res.statusCode).to.equal(200);
          server.stop(done);

        })}, 2000);

        });
      });
    });
  });

  it('updates profile david', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/david-dupont-update.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
    };

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);

        var tokenSimon =  JWT.sign({ id: '13', "name": "Simon", valid: true}, process.env.JWT_SECRET);

        var optionsCandidate = {
          method: "GET",
          url: "/candidate/" + res.payload,
          headers: { cookie: "token=" + tokenSimon }
        };

        var redisClient = require('redis-connection')();
        redisClient.set(13, JSON.stringify({ id: 13, "name": "Simon", valid: true}), function (err, res) {
          setTimeout(function () { server.inject(optionsCandidate , function (res) {

          expect(res.statusCode).to.equal(200);

          var $ = cheerio.load(res.payload);
          expect($('p.fullname').text()).to.equal("David Dupont");
          server.stop(done);

          })}, 3000);

        });
      });
    });
  });

    it('updates profile david and keep favourite', function (done) {

      Server.init(0, function (err, server) {

        expect(err).to.not.exist();

        var profile = require('./fixtures/david-dupont.json');

        var options = {
          method: 'POST',
          url: '/profile',
          payload: profile
      };

        server.inject(options, function (res) {

          expect(res.statusCode).to.equal(200);

          var tokenSimon =  JWT.sign({ id: '12', "name": "Simon", valid: true}, process.env.JWT_SECRET);

          var optionsCandidate = {
            method: "GET",
            url: "/candidate/" + res.payload,
            headers: { cookie: "token=" + tokenSimon }
          };

          var redisClient = require('redis-connection')();
          redisClient.set(12, JSON.stringify({ id: 12, "name": "Simon", valid: true}), function (err, res) {
            setTimeout(function () { server.inject(optionsCandidate , function (res) {

            expect(res.statusCode).to.equal(200);

            var $ = cheerio.load(res.payload);

            expect($('p.fullname').text()).to.equal("David Dupont");
            server.stop(done);

            })}, 3000);

          });
        });
      });
    });


  it('updates profile manuel same 1st degree contact', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/manuel.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
    };

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);

        var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

        var optionsCandidate = {
          method: "GET",
          url: "/candidate/" + res.payload,
          headers: { cookie: "token=" + token }
        };

        var redisClient = require('redis-connection')();
        redisClient.set(12, JSON.stringify({ id: 12, "name": "Simon", valid: true}), function (err, res) {
          setTimeout(function () { server.inject(optionsCandidate , function (res) {

          expect(res.statusCode).to.equal(200);

          var $ = cheerio.load(res.payload);

          expect($('p.fullname').text()).to.equal("Manuel");
          server.stop(done);

          })}, 3000);

        });
      });
    });
  });

  it("create a profile which doesn't have the property connectedTo", function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/sam.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        setTimeout(function () { server.stop(done) } ,2000);
      });

    });
  });

  it("Update sam's profile with a connectedTo value", function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/sam-with-connectedTo.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });

    });
  });

  it("Attempt to update Nick profile without being directly connected (no connectedTo value)", function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/nick.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.equal('401');
        server.stop(done);
      });

    });
  });
  var idTom;
  it("Create tom's profile which doesn't have a url", function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/tom.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        idTom = res.payload;
        server.stop(done);
      });

    });
  });

  it("Check that tom has a timestamp", function (done) {
    es.get({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: idTom
    }, function (error, response) {
      expect(parseInt(response._source.date, 10)).to.be.above(1449506430320);
      done();
    });
  });


    it('create profile Maria', function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/maria-dolores.json');
      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
    };

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);

        var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

        var optionsCandidate = {
          method: "GET",
          url: "/candidate/" + res.payload,
          headers: { cookie: "token=" + token }
        };

        var redisClient = require('redis-connection')();
        redisClient.set(12, JSON.stringify({ id: 12, "name": "Simon", valid: true}), function (err, res) {
          setTimeout(function () { server.inject(optionsCandidate, function (res) {

          expect(res.statusCode).to.equal(200);

          var $ = cheerio.load(res.payload);

          expect($('p.fullname').text()).to.equal("Maria Dolores");

          server.stop(done);

          })}, 3000);

        });
      });

    });
  });

  it("Update initials profile", function (done) {

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var profile = require('./fixtures/initialsProfile.json');

      var options = {
        method: 'POST',
        url: '/profile',
        payload: profile
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });

    });
  });

  it("Check that the initilasProfile has been viewed once", function (done) {
    es.get({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      id: "33" //id of the initialsProfile in the fixtures
    }, function (error, response) {
      expect(response._source.viewedBy.length).to.equal(1);
      done();
    });
  });


});
