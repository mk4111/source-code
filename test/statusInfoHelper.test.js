var statusInfoHelper = require('../views/helpers/statusInfoHelper');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;


describe('Pass the current status, clients, jobs', function () {

  it('return the span with the name of the client, title job', function (done) {

    var currentStatus = {clientId: '1', candidateId: '2', jobId: '2'};
    var clients = [{id: '1', name: 'DWYL'},{id: '2', name: 'FAC'}];
    var jobs = [{id: '1', client: '1', title: 'some job'},{id: '2', client: '2', title: 'other job'}];
    var result = statusInfoHelper(currentStatus, clients, jobs);

    expect(result.string).to.equal("<span>DWYL </span><span>other job </span>");
    done();
  });
});
