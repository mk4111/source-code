module.exports = function (id, stages) {

  var stagesObj = stages.filter(function (stage) {
    return stage.id.toString() === id.toString();
  });

  return stagesObj[0].name;
};
