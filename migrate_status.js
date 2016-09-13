require('env2')('.env');
const ElasticSearch = require('elasticsearch');
const Uderscore = require('underscore');
var es =  new ElasticSearch.Client({
  host: process.env.SEARCHBOX_URL,
  log: 'error'
});

/*
es.search({
  index: process.env.ES_INDEX,
  type: process.env.ES_TYPE_STATUS,
  body: {
    sort: { order: {"order": "asc"}}
  }
}, function (error, response) {
  var result = [];
  response.hits.hits.forEach(function (status) {
    console.log(status)
  });
});

*/
function update(pageNum, perPage, totalDocs) {
        
        if( ((pageNum * perPage) - perPage) >= totalDocs ) {
          return;
        }
        es.search({
        index: process.env.ES_INDEX,
        type: process.env.ES_TYPE,
        from: (pageNum - 1) * perPage,
        size: perPage,
        _source: ['id', 'picture','fullname', 'current', 'location', 'connectedTo', 'favourite', 'contacts.email', 'headline', 'statusCurrent', 'emails', 'viewedBy'],
        body: {
          query: {
              match_all: {}
          },
          sort: { "date": {"order": "desc"}}
        }
      }, function (errGet, responseGet) {

        responseGet.hits.hits.forEach((c, i) => {

          if(c._source.statusCurrent && c._source.statusCurrent.length) {
            var status = [];
            c._source.statusCurrent.forEach((s) => {
              if (s.idStage == '3' || s.idStage == '4' || s.idStage == '5' || s.idStage == '6') { s.idStage = '2'; }
              if (s.idStage == '7' || s.idStage == '8') { s.idStage = '3'; }
              if (s.idStage == '9') { s.idStage = '4'; }
              if (s.idStage == '10') { s.idStage = '5'; }
              status.push(s);
            });
            /*
            es.update({
            index: process.env.ES_INDEX,
            type: process.env.ES_TYPE,
            id: c._id,
            body: {
              doc: {
                statusCurrent: status
                }
              }
            }, 
            function (errUpdate, responseUpdate) { 

            });
            */
          }
          console.log(status)

        });

        update(pageNum+1, perPage, totalDocs); 

      });
}

es.bulk({
  body: [
    // action description
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 1 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 2 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 3 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 4 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 5 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 6 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 7 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 8 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 9 } },
    { delete:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 10 } },

    { index:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 1 } },
    { id: 1, name: 'Submitted', order: 1 },
    { index:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 2 } },
    { id: 2, name: 'Technical', order: 2 },
    { index:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 3 } },
    { id: 3, name: 'Face to Face', order: 3 },
    { index:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 4 } },
    { id: 4, name: 'Offer', order: 4 },
    { index:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 5 } },
    { id: 5, name: 'Placement', order: 5 },
    { index:  { _index: process.env.ES_INDEX, _type: process.env.ES_TYPE_STATUS, _id: 6 } },
    { id: 6, name: 'Rejected', order: 6 },

  ]
}, function (err, resp) {
  var pageNum = 1;
  var totalDocs ;
  es.search({
    index: process.env.ES_INDEX,
    type: process.env.ES_TYPE,
  }, function (err, res) {
    totalDocs = res.hits.total;
    const perPage = Number(process.env.RESULTS_PER_PAGE);
    update(1, perPage, totalDocs)
  });
});
