var countStages = require('../views/helpers/countStages.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Count stages in given jobs array', function () {

  it('return number of days', function (done) {

    var jobs = { 
        'job1': {
            '4': ['1'],
            '2': ['1','2']
        },
        'job2': {
            '2': ['3']
        }
    };

    var numberOfStages = countStages(jobs, {id: '2'});
    expect(numberOfStages).to.equal(3);
    var numberOfStages = countStages(jobs, {id: 4});
    expect(numberOfStages).to.equal(1);
    var numberOfStages = countStages(jobs, {id: '1'});
    expect(numberOfStages).to.equal(0);
    done();

  });
});