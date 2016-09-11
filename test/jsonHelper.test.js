var json = require('../views/helpers/json.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Count stages in given jobs array', function () {

  it('return number of days', function (done) {

    let obj = { '1':1, '2':2 };
    expect(typeof "string").to.equal(typeof json(obj));
    done();

  });
});