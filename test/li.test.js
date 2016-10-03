require('env2')('.env');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('save or update LI url on candidate profile', function () {

  it('save/update a LI url: /li/save', function (done) {

    var options = {
      method: "POST",
      url: "/li/save",
      payload: {
        id: '1',
        li: "https://www.linkedin.com/in/fakeprofile2"
      }
    };

    Server.init(0, function (err, server) {

      server.inject(options , function (res) {
        expect(err).to.not.exist();

        var liObj = JSON.parse(res.payload);
        expect(liObj.url).to.equal("https://www.linkedin.com/in/fakeprofile2");

        server.stop(done);
      });
    });
  });
});
