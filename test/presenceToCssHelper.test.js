var presenceToCss = require('../views/helpers/presenceToCss.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Gives the present / absent css class depending given property is defined or not', function () {

  it('return the right css class', function (done) {

    var css = presenceToCss("any");
    expect(css).to.equal("present");
    css = presenceToCss("");
    expect(css).to.equal("absent");
    done();

  });
});