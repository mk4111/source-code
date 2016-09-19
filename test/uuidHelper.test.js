var uuid = require('../views/helpers/uuid.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Gives the tight color based on the application stage', function () {

  it('return the right color', function (done) {

    var val = uuid();
    expect(val).to.not.be.null;
    done();

  });
});