/*
* From a list of emails, ids and first names this function return an array of objects containing this values
[{email:-, id:-, firstName:-}, {}, ...]
*/

// it's weird better delete it
module.exports = function (emails, ids, fn) {

  return emails.map(function(entry, index) {
    return { email: entry, id: ids[index], firstName: fn[index] };
  })

}
