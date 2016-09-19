var Code = require('code');
var Lab = require('lab');
var Server = require('../lib/index.js');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;
var JWT = require('jsonwebtoken');
var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
var cheerio = require('cheerio');

describe('Attempt to access /csv-list/list with authorization', function () {

  it('return list of listNames with status code 200', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var options = {
        method: "GET",
        url: "/csv-list/list",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var lists = $('.label-list p');
        expect(lists.length).to.equal(1);
        server.stop(done);
      });

    });
  });
});

describe('access /csv-list/create with authorization', function () {

  it('return create a list page', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      expect(err).to.not.exist();
      var options = {
        method: "GET",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});

describe('Attemppt /csv-list/create create a list with wrong csv format column', function () {

  it('Attempt to create a list with the wrong csv format', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = "NameWrong,EmailWrong\nBob,bob@csv.com\nMatt,matt@csv.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var error = $('.error-csv').text();
        expect(error).to.equal('Sorry wrong format of the file. Is it a csv file? Does it have Name and Email columns?');
        server.stop(done);
      });
    });
  });
});

describe('Attemppt /csv-list/create create a list with wrong file format', function () {

  it('Attempt to create a list with the wrong file format', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = undefined;

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var error = $('.error-csv').text();
        expect(error).to.equal('Sorry wrong format of the file. Is it a csv file? Does it have Name and Email columns?');
        server.stop(done);
      });
    });
  });
});

describe('create /csv-list/create create a list js dev', function () {

  it('creates a new list and redirect the list of list', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = "Name,Email\nBob,bob@csv.com\nMatt,matt@csv.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(302);
        expect(res.headers.location).to.equal('/csv-list/list')
        server.stop(done);
      });
    });
  });
});

describe('access /csv-list/create attempt to recreate the list js dev', function () {

  it('it return the create form without recreating the list', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    setTimeout(function(){

    Server.init(0, function (err, server) {

      const csvFile = "Name,Email\nBob,bob@csv.com\nMatt,matt@csv.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev", csvFile: csvFile}
      };

      //wait for the previous list to be indexed!
        server.inject(options, function (res) {
          expect(res.statusCode).to.equal(200);
          var $ = cheerio.load(res.payload);
          var error = $('.error-csv').text();
          expect(error).to.equal('Sorry the name of the list already exists');
          server.stop(done);
        })
      });
    }, 5000);
  });
});

describe('/csv-list/create Attempt to create the list "list"', function () {

  it('Attempt to create the list "list"', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = "Name,Email\nBob,bob@csv.com\nMatt,matt@csv.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "list", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var error = $('.error-csv').text();
        expect(error).to.equal('Sorry "list" is a reserved keyword');
        server.stop(done);
      });
    });
  });
});

describe('/csv-list/create Create to create a new list with some already existing candidates', function () {

  it('Create a new list and add the list name to the existing candidates', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = "Name,Email\nMaria Dolores,fakecontact12@gmail.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "node dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(302);
        expect(res.headers.location).to.equal('/csv-list/list')
        server.stop(done);
      });
    });
  });
});

describe('Access /csv-list/list (list not empty)', function () {

  it('return list of list', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    //wait for the node list to be indexed
    setTimeout(function(){
    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var options = {
        method: "GET",
        url: "/csv-list/list",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var lists = $('.label-list p');
        expect(lists.length).to.be.above(0);
        server.stop(done);
      });

    });
  },5000);
  });
});

/*
* download csv test
*/

describe('Access /csv-list/dowanload on js dev list', function () {

  it('download the csv for the list js dev', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    //wait for the node list to be indexed
    setTimeout(function(){
    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      var options = {
        method: "POST",
        url: "/csv-list/download",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev"}
      };

      server.inject(options, function (res) {

        expect(res.headers["content-type"]).to.equal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        expect(res.headers["content-disposition"]).to.equal('attachment; filename="js dev.csv"');

        const Converter = require("csvtojson").Converter;
        const converter = new Converter({});
        converter.fromString(res.payload, function(err,csvJson){
          expect(csvJson.length).to.equal(4);
          server.stop(done);
        })
      });

    });
  },5000);
  });
});

/*
* upload a csv to an existing list
*/

describe('Access /csv-list/upload get the form to upload a csv to the list', function () {

  it('return the form to upload a csv to a list', function (done) {

    Server.init(0, function (err, server) {

        expect(err).to.not.exist();

      var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

        var options = {
          method: "GET",
          url: "/csv-list/upload/js%20dev",
          headers: { cookie: "token=" + token },
          credentials: { id: "12", "name": "Simon", valid: true}
        };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        server.stop(done);
      });
    });
  });
});


describe('Access /csv-list/upload upload the csv to the list', function () {

  it('uplaod the csv to the list "js dev"', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    const csvFile = "Name,Email\nCandidateCSV,candidate@csv.com";

    Server.init(0, function (err, server) {
        expect(err).to.not.exist();
        var options = {
          method: "POST",
          url: "/csv-list/upload",
          headers: { cookie: "token=" + token },
          credentials: { id: "12", "name": "Simon", valid: true},
          payload: {listName: 'js dev', csvFile: csvFile}
        };

        server.inject(options, function (res) {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.equal('/csv-list/list');
          server.stop(done);
        });
      });
    });
  });

describe('Attemppt /csv-list/upalod wrong csv format', function () {

  it('Attempt to create a list with the wrong csv format', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = "NameWrong,EmailWrong\nBob,bob@csv.com\nMatt,matt@csv.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/upload",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var error = $('.error-csv').text();
        expect(error).to.equal('Sorry wrong format of the file. Is it a csv file? Does it have Name and Email columns?');
        server.stop(done);
      });
    });
  });
});

describe('Attemppt /csv-list/upalod wrong file format', function () {

  it('Attempt to create a list with the wrong file format', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = undefined;

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/upload",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "js dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var error = $('.error-csv').text();
        expect(error).to.equal('Sorry wrong format of the file. Is it a csv file? Does it have Name and Email columns?');
        server.stop(done);
      });
    });
  });
});

/*
* delete a list
*/

describe('Access /csv-list/delete to delete the list', function () {

  it('delete the "Backend" list', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    Server.init(0, function (err, server) {
        expect(err).to.not.exist();
        var options = {
          method: "POST",
          url: "/csv-list/delete",
          headers: { cookie: "token=" + token },
          credentials: { id: "12", "name": "Simon", valid: true},
          payload: {listName: 'Backend', listId: '1114'}
        };

        server.inject(options, function (res) {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.equal('/csv-list/list');
          server.stop(done);
        });
      });
    });
  });

/*
* get caniddates who belongs to specific list
*/

describe('Access /csv-list/js dev to see all candidates from the list "js dev"', function () {

  it('return list of candidates', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    Server.init(0, function (err, server) {
        expect(err).to.not.exist();
        var options = {
          method: "GET",
          url: "/csv-list/js%20dev",
          headers: { cookie: "token=" + token }
        };

        server.inject(options, function (res) {
          expect(res.statusCode).to.equal(200);
          var $ = cheerio.load(res.payload);
          var numberCandidates = $('.row.candidate').children().length;
          expect(numberCandidates).to.be.above(1);
          server.stop(done);
        });
      });
    });
  });

describe('Access /csv-list/js dev/2', function () {

  it('returns the specific page number 2', function (done) {

    var nubersPerPage = process.env.RESULTS_PER_PAGE;
    process.env.RESULTS_PER_PAGE = 1;

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    var options = {
      method: "GET",
      url: "/csv-list/js%20dev/2",
      headers: { cookie: "token=" + token }
    };

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);
        process.env.RESULTS_PER_PAGE = nubersPerPage;
        server.stop(done);
      });
    });
  });
});

describe('Attemp to access negative number page /csv-list/js dev/-10', function () {

  it('returns the status code 200', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    var options = {
      method: "GET",
      url: "/csv-list/js%20dev/-10",
      headers: { cookie: "token=" + token }
    };

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var numberCandidates = $('.row.candidate').children().length;
        expect(numberCandidates).to.be.above(1);
        server.stop(done);
      });
    });
  });
});

/**
* Search by skills
*/

describe('Search by skills on js dev list', function () {

  it('returns one candidate', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    var options = {
      method: "GET",
      url: "/query-list/js%20dev?skills=javascript",
      headers: { cookie: "token=" + token }
    };

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var numberCandidates = $('.row.candidate').length;
        expect(numberCandidates).to.equal(1);
        server.stop(done);
      });
    });
  });
});


describe('Search by skills on haskell list', function () {

  it('returns one candidate', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);

    var options = {
      method: "GET",
      url: "/query-list/haskell?skills=haskell",
      headers: { cookie: "token=" + token }
    };

    Server.init(0, function (err, server) {

      expect(err).to.not.exist();

      server.inject(options, function (res) {

        expect(res.statusCode).to.equal(200);
        var $ = cheerio.load(res.payload);
        var numberCandidates = $('.row.candidate').length;
        expect(numberCandidates).to.equal(1);
        server.stop(done);
      });
    });
  });
});

describe('create /csv-list/create create a list react-dev', function () {

  it('creates a new list react-dev and redirect the list of list', function (done) {

    var token =  JWT.sign({ id: 12, "name": "Simon", valid: true}, process.env.JWT_SECRET);
    Server.init(0, function (err, server) {

      const csvFile = "Name,Email\nAla,react@example.com\nMatt,matt@csv.com";

      expect(err).to.not.exist();
      var options = {
        method: "POST",
        url: "/csv-list/create",
        headers: { cookie: "token=" + token },
        credentials: { id: "12", "name": "Simon", valid: true},
        payload: {listName: "react-dev", csvFile: csvFile}
      };

      server.inject(options, function (res) {
        expect(res.statusCode).to.equal(302);
        expect(res.headers.location).to.equal('/csv-list/list')
        server.stop(done);
      });
    });
  });
});
