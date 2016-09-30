require('env2')('.env');
var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('save or update info section on candidate', function () {

  it('save/update a info section: /info/save', function (done) {

    var options = {
      method: "POST",
      url: "/info/save",
      payload: {
        id: '1',
        scurrent: '30k',
        sexpected: '50k',
        notice: '1 month',
        locations: 'London, Madrid'
      }
    };

    Server.init(0, function (err, server) {

      server.inject(options , function (res) {
        expect(err).to.not.exist();

        var infoObj = JSON.parse(res.payload);

        expect(infoObj.info.scurrent).to.equal('30k');
        expect(infoObj.info.sexpected).to.equal('50k');
        server.stop(done);
      });
    });
  });
});
