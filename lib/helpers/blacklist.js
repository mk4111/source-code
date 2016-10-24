'use strict'

/*
* Add a property clientProfile to true if the current property of the profile contains a client
* @param {Object} profileCan - profile of the candidate
* @param {Array} clientList - list of clients
*/

let blacklist = function(profileCandidate, clientList) {

  profileCandidate.clientProfile = false;
  //lower case the list of companies
  let list = clientList.map(client => {return client.toLowerCase()} );
  if(list.indexOf(profileCandidate.current && profileCandidate.current.toLowerCase()) !== -1) {
    profileCandidate.clientProfile = true;
  } else {
    list.forEach(function(client) {
      if(profileCandidate.current && profileCandidate.current.toLowerCase().indexOf(client) !== -1) {
        profileCandidate.clientProfile = true;
      }
    })
  }
  return profileCandidate;
}

module.exports = blacklist;
