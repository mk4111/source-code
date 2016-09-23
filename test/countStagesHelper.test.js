var countStages = require('../views/helpers/countStages.js');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Count stages in given jobs array', function () {

  it('return number of days', function (done) {

    var stages = [ {stageId: 4}, {stageId: 2}, {stageId: 2}, {stageId: 2} ];

    var numberOfStages = countStages(stages, {id: '2'});
    expect(numberOfStages).to.equal(3);
    var numberOfStages = countStages(stages, {id: 4});
    expect(numberOfStages).to.equal(1);
    var numberOfStages = countStages(stages, {id: '1'});
    expect(numberOfStages).to.equal(0);
    done();

  });
});