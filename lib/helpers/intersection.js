// @TODO @speedingdeer: there literally no sence to write functions like interaction, union etc. from scratch.
// There are multiple libraries for array / text analises, even the simple underscore would do a job 

const Underscore = require("underscore");

module.exports = function (searchedSkills, candidateSkillObj) {
  var result = [];
  var concluded = [];

  searchedSkills.forEach(function (skillString) {
    var splitted = skillString.split(/\s+/);
    if (splitted.length > 1) {
        // there might be other matchings to displays
        concluded = Underscore.union(concluded, splitted);
    }
  });

  searchedSkills = Underscore.union(searchedSkills, concluded);

  searchedSkills.forEach(function (skillString) {
    
    candidateSkillObj.forEach(function(skillObj) {
        if (skillString.toLowerCase() === skillObj.skill.toLowerCase() ) {
            result.push(skillObj)
        }
    });
  });
    
  return result;
}
