const Underscore = require('underscore');

const List = require('../../database-helpers/mongo/models/list');
const ListsResultJob = require('../../database-helpers/mongo/models/lists_result_job');

const es = require('../../es');

const ListsResultQueue = require('../../lists_result_queue')

module.exports = function (request, reply) {
  if (!request.auth.isAuthenticated) { return reply.redirect('/login'); }
  var filter = {
    bool: {
      must: [],
      must_not: []
    }
  };

  // email required
  filter.bool.must.push( {
    or: [ 
      { regexp : { "contacts.email": ".+" } }, 
      { regexp : { "contacts.edited_email": ".+" } }
    ]
  });

  var matchAdvanced = [];
  // location required
  matchAdvanced.push({match: {location: request.payload.location}});
  // skill required
  var skills = request.payload.skills.split(",").map( s => { return s.trim() });
  skills = skills.filter(s => s !== '');
  skills.forEach(function (skill) {
    matchAdvanced.push( { match: { "skills.skill": skill } } );
  });

  var body = {
    query: { bool: { must: matchAdvanced } },
    filter: filter,
  }

  var promises = [];
  promises.push(
    new Promise((resolve, reject) => {
      es.get({
        index: process.env.ES_INDEX, 
        type: process.env.ES_TYPE_GM_JOBS,
        id: request.payload.jobId,
        _source: ['title'],
      }).then(r => {
        resolve(r._source);
      }).catch((e) => { resolve(); });
    })
  );

  promises.push(
    new Promise((resolve, reject) => {
      es.get({
        index: process.env.ES_INDEX,
        type: process.env.ES_TYPE_GM_CLIENTS,
        id: request.payload.clientId,
        _source: ['name']
      }).then(r => {
        resolve(r._source);
      }).catch((e) => { resolve(); });
    })
  );

  promises.push(
    es.search({
      index: process.env.ES_INDEX,
      type: process.env.ES_TYPE,
      size: 0,
      body: body
    })
  );

  Promise.all(promises).then(r => {
    List.create({ 
      name: r[1].name + " - " + r[0].title,
      userId: request.auth.credentials.user.idGoogle,
      origin: "source"
    }).then(list => {
      ListsResultJob.create({
        _list: list._id,
        queueId: "Lists Result Queue",
        userId: request.auth.credentials.user.idGoogle,
        candidates_number: r[2].hits.total
      }).then(job => {
        ListsResultQueue.add({
          job: job._id,
          list: list._id,
          body: body
        }).then(queue_job => {
          job.update({jobId:queue_job.jobId})
            .then( () => {
              return reply.redirect('/source/' + list._id );
            }).catch(e => { console.log(e); })
        }).catch(e => { console.log(e); });
      }).catch(e => { console.log(e); });
    }).catch(e => { console.log(e); });
  }).catch(e => { console.log(e); });;

}