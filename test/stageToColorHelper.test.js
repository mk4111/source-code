var countStages = require('../views/helpers/stageToColor.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Count stages in given jobs array', function () {

  it('return number of days', function (done) {

    var color = stageToColor({id: 2});
    expect(color).to.equal("blue");
    done();

  });
});