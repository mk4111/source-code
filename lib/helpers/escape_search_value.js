module.exports = function (value) {
  if(value) {
    return value.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1");
  }
  return "";
}
