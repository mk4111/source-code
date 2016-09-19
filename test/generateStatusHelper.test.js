var generateStatus = require('../views/helpers/generateStatus');
var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('Create status indicator', function () {

  it('return the client and stage of a status', function (done) {

    var stage = { '1': {id: '1', name: 'stage1' }, '2': { id: '2', name: 'stage2' } };
    var client = [{ id: '2', name: 'clientName' }, { id: '3', name: 'clientName3' }];
    var status = { idClient: '2', idStage: '1' }
    var result = generateStatus(status, client, stage);

    expect(result.string).to.equal('clientName [stage1]');
    done();
  });
});
