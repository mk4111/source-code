// @TODO @speedingdeer: there literally no sence to write functions like interaction, union etc. from scratch.
// There are multiple libraries for array / text analises, even the simple underscore would do a job 

const Underscore = require("underscore");

module.exports = function (searchedSkills, candidateSkillObj) {
  var result = [];
  var concluded = [];

  searchedSkills.forEach(function (skillString) {
    var splitted = skillString.split(/\s+/);
    concluded.push(skillString);
    if (splitted.length > 1) {
        // there might be other matchings to displays
        concluded = Underscore.union(concluded, splitted);
    }
  });

  concluded.forEach(function (skillString) {
    
    candidateSkillObj.forEach(function(skillObj) {
        if (!Underscore.isEmpty(skillObj.skill) && !Underscore.isEmpty(skillString) && skillObj.skill.toLowerCase().indexOf(skillString.toLowerCase()) !== -1 ) {
            result.push(skillObj)
        }
    });
  });
    
  return result;
}
