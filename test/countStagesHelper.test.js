var countStages = require('../views/helpers/countStages.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Count stages in given jobs array', function () {

  it('return number of days', function (done) {

    var jobs = [
        {'2': "somejob"},
        {'4': "somejob"},
        {'2': "somejob"},
    ];

    var numberOfStages = countStages(jobs, 2);
    expect(numberOfStages).to.equal(2);
    var numberOfStages = countStages(jobs, 4);
    expect(numberOfStages).to.equal(1);
    var numberOfStages = countStages(jobs, 1);
    expect(numberOfStages).to.equal(0);
    done();

  });
});