const Underscore = require("underscore");

const listIntersectedSkills = require('./intersection.js');
const sortByLevelSkill = require('./sort_by_level_skill.js');
const getBlacklistCompanies = require('./get_blacklist_companies');
const blacklist = require('./blacklist.js');
const lastEmailDate = require('./last_email_date.js');
const listClients = require('../database-helpers/elasticsearch/list_clients');
const listStages = require('../database-helpers/elasticsearch/list_stages');
const listGmUsers = require('../database-helpers/elasticsearch/list_users_with_id_google');

const Stage = require('../database-helpers/mongo/models/stage');
const Candidate = require('../database-helpers/mongo/models/candidate');

module.exports = function(candidates, skills, matchAdvanced, queryString) {
  var results = [];
  return new Promise((resolve, reject) => {
    candidates.forEach(function (profile) {
      // get candidates' skills
      var contact = profile;
      if (matchAdvanced.length) {contact.listSkills = listIntersectedSkills(skills || [], contact.skills || [] );} 
      else { contact.listSkills = listIntersectedSkills(queryString.toLowerCase().split(','), contact.skills || []); }
      contact.listSkills = contact.listSkills.slice(0,6); // make sure there are not more than 6 skills in list
      var listSkillsFlattened = (() => { var r = []; Underscore.each(contact.listSkills, (s) => { r.push(s.skill.toLowerCase()); s.matched = true; }); return r; })();
      var allSkillSorted = sortByLevelSkill(profile.skills || []);
      Underscore.each(allSkillSorted, (s) => {
        if (!s.skill) { return; } // empty skill ? yes it happens
        if (contact.listSkills.length >= 6) { return false; } // break we don't need more
        if (Underscore.contains(listSkillsFlattened, s.skill.toLowerCase())) { return; } // continue - try the next one
        listSkillsFlattened.push(s.skill.toLowerCase());
        contact.listSkills.push(s);
      });
      contact.listSkills = sortByLevelSkill(contact.listSkills || [])

      contact.firstName = contact.fullname.split(' ')[0];
      var emails = contact.emails || [];
      contact.lastEmail = lastEmailDate(emails);
      results.push(contact);
    });

    var promises = [];

    results.forEach(c => {
      promises.push(
        Stage.find({candidateId:c.id})
          .then(s => {
            c.stages = s;
          })
      );
    });

    results.forEach(c => {
      promises.push(
        Candidate.findOneAndUpdate({ indexId: c.id }, {}, { upsert: true, new: true, setDefaultsOnInsert: true })
          .then(cm => { cm.merge(c); })
      );
    });

    Promise.all(promises).then( () => {

      // can't believe it must be that ugly too
      getBlacklistCompanies(function(error, clientList) {
        results.forEach(function(canProfile) {
          blacklist(canProfile, clientList);
        });

        // @TODO: doesn't make sense at to provide such a long document to parse here,
        // should list only there clients which are needed to generate state if any.
        // What's more it's actually the home page candidates listing just without any paramters
        // doesn't make sense to keep both - home and query
        listClients(function (errClients, clients) {

          listGmUsers( (errorUsers, users ) => {

            listStages(function (errStages, stages) {

              var result = {
                candidates: results,
                users: users.filter(u => { return u.recruiter && u.active; }),
                clients: clients,
                stages: (() => { var r = {}; stages.forEach(o => { r[o.id] = o }); return r; })()
              };

              resolve(result);

            });

          });

        });

      });

    });

  });

}
