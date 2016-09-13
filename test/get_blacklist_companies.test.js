var Code = require('code');
var Lab = require('lab');
var getBlacklistCompanies = require('../lib/helpers/get_blacklist_companies');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

//create fixtures

describe('Get the list of clients', function () {

  it('returns the list of clients', function (done) {
    getBlacklistCompanies(function(error, list) {
      expect(list.indexOf('FAC')).to.be.above(-1);
      expect(list.indexOf('Founders And Coders')).to.be.above(-1);
      expect(list.indexOf('DWYL')).to.be.above(-1);
      expect(list.indexOf('Do WYL')).to.equal(-1);
      done();
    })
  });
});
