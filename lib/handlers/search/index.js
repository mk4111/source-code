'use strict';

const Underscore = require("underscore");
const Querystring = require('query-string');

const CandidatesService = require('../../helpers/candidates.js');
const es = require('../../es');
const List = require('../../database-helpers/mongo/models/list');

function goRoot(reply, queryString) { return reply.redirect('/search?' + queryString); }

module.exports = function (request, reply) {
  // @TODO remobe me from here please!
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); }
  
  var queryString = Querystring.stringify(request.query);

  if (request.params.page && isNaN(request.params.page)) { return goRoot(reply, queryString); }
  var pageNum = Number(request.params.page) || 1;
  var perPage = Number(process.env.RESULTS_PER_PAGE);

  var filter = {
    bool: {
      must: [],
      must_not: []
    }
  };
  // build filters
  if (request.query.req_sent_application) {
    filter.bool.must_not.push( { missing: { field: "jobApplications" } } )
  }
  if (request.query.req_cv) {
    filter.bool.must.push({ regexp : { "cvDocumentLink": ".+" } });
  }
  if (request.query.req_email) {
    filter.bool.must.push( {
      or: [ 
        { regexp : { "contacts.email": ".+" } }, 
        { regexp : { "contacts.edited_email": ".+" } }
      ]
    } );
  }
  if (request.query.req_phone) {
    filter.bool.must.push( { regexp : { "contacts.phone": ".+" } } );
  }
  if (request.query.req_salary) {
    filter.bool.must.push( { regexp : { "info.sexpected": ".+" } } );
  }
  // build query
  var query = {  match_all: {} }; // default
  if (request.query.q) {
    // query string
    query = { 
      multi_match: {
        query: request.query.q,
        type: "cross_fields",
        fields: ["headline", "fullname", "location", "current", "skills.skill", "contacts.edited_email", "contacts.email", "languages.lang"]
      }
    };
  }

  // check on advance search if any
  var matchAdvanced = [];
  if (request.query.headline) {
        matchAdvanced.push({match: {headline: request.query.headline}});
  }
  if (request.query.company) {
        matchAdvanced.push({match: {current: request.query.company}});
  }
  if (request.query.fullname) {
        matchAdvanced.push({match: {fullname: request.query.fullname}});
  }
  if (request.query.location) {
        matchAdvanced.push({match: {location: request.query.location}});
  }
  if (request.query.skills) {
    var skills = request.query.skills.split(",").map( s => { return s.trim() });
    skills = skills.filter(s => s !== '');

    skills.forEach(function (skill) {
      matchAdvanced.push( { match: { "skills.skill": skill } } );
    });
  }
  if (request.query.languages) {
    var languages = request.query.languages.split(",").map( s => { return s.trim() });
    languages = languages.filter(s => s !== '');
    languages.forEach(function (language) {
      matchAdvanced.push( { match: { "languages.lang": language } } );
    });
  }

  if (matchAdvanced.length) {
    query = { bool: { must: matchAdvanced } }
  }

  es.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
    from: (pageNum - 1) * perPage,
    size: perPage,
    _source: ['id', 'info', 'url', 'jobApplications', 'cvDocumentLink', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts', 'headline', 'emails', 'viewedBy', 'skills'],
    body: {
      query: query,
      filter: filter,
      sort: [
        {_score: {"order": "desc"} },
        { date: {"order": "desc"} }
      ]
    }
  }).then(response => {

    // collect statistics
    var promises = [];

    var mustFilter = filter.bool.must.slice();
    var statFilter = mustFilter.slice();

    statFilter.push( {
      or: [ { regexp : { "contacts.email": ".+" } }, 
            { regexp : { "contacts.edited_email": ".+" } } ]
          });

    filter.bool.must = statFilter;
    promises.push(
      es.search({
        index: process.env.ES_INDEX,
        type: process.env.ES_TYPE,
        size: 0,
        _source: ['id'],
        body: { query: query, filter: filter }
      }));

      var statFilter = mustFilter.slice();
      statFilter.push( { regexp : { "contacts.phone": ".+" } } );
      filter.bool.must = statFilter;
      promises.push(
        es.search({
          index: process.env.ES_INDEX,
          type: process.env.ES_TYPE,
          size: 0,
          _source: ['id'],
          body: { query: query, filter: filter }
        }));

      var statFilter = mustFilter.slice();
      statFilter.push( { regexp : { "cvDocumentLink": ".+" } } );
      filter.bool.must = statFilter;
      promises.push(
        es.search({
          index: process.env.ES_INDEX,
          type: process.env.ES_TYPE,
          size: 0,
          _source: ['id'],
          body: { query: query, filter: filter }
        }));

      var statFilter = mustFilter.slice();
      statFilter.push( { missing: { field: "emails" } } )
      filter.bool.must = statFilter;
      promises.push(
        es.search({
          index: process.env.ES_INDEX,
          type: process.env.ES_TYPE,
          size: 0,
          _source: ['id'],
          body: { query: query, filter: filter }
        }));


    Promise.all(promises)
      .then(r => {

        var stats = {
          results: response.hits.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          with_email: r[0].hits.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          with_phone: r[1].hits.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          with_resume: r[2].hits.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          unconntacted: r[3].hits.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        };


        var candidates = [];
        // define paginations for search results
        var nbPages = Math.ceil(response.hits.total / perPage);
        if( pageNum > nbPages && nbPages > 0) { return goRoot(reply, queryString); }

        response.hits.hits.forEach(function (candidate) {
          candidate._source.id = candidate._id;
          candidates.push(candidate._source);
        });

        CandidatesService(candidates, skills, matchAdvanced, queryString)
          .then(r => {
            List.find({})
              .then((l) => {
                return reply.view('search', Underscore.extend( { request: request, stats: stats, lists:l }, r) );
              })
        }).catch(e => {
          console.log(e);
        });

    });
  });

}
