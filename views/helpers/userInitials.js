/**
 * extract first character of each name
 * @param {String} name - the person's name
 * @returns {String} initial - the first character of the person's name
 */
var mapFunc = function(name) {
  return name[0]; // return character at index zero
}
/**
 * split person's name by spaces and extract just the first letter
 * names are stored as a string containing first, middle and last name
 * so we split the name on whitespace.
 * @param {Array} names - the list of names for a given person
 * @returns {String} initials - the initials e.g: John Smith -> JS
 */
module.exports = function get_initials (names) {
  return names.split(' ').map(mapFunc).join('');
};
