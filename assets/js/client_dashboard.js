// @TODO @speedingdeer: legacy, stop using pure js on client side like here (cs + jquery is much better and more readable)

(function () {
  'use strict';

  //cache the document object, so JS doesn't need to look up for it in global scope each time
  var doc = document;
  var nextStageButtons = doc.querySelectorAll('.next-stage');
  var rejectButtons = doc.querySelectorAll('.reject');

  //Find the closest parent/grandparent element that has a specific class
  function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  function nodeListToArray(nodelist) {
    return Array.prototype.slice.call(nodelist);
  }

  function updateValues(elmts, val) {
    nodeListToArray(elmts).map(function(el) {
      return el.value = val;
    });
  }

  function createPayloadObj(elmts, payload) {
    nodeListToArray(elmts).map(function (el) {
      return payload[el.getAttribute('name')] = el.getAttribute('value');
    });
  }

  function hideErrorMessage(el) {
    return el.querySelector('.error-msg').style.display = 'none';
  }

  function showErrorMessage(el) {
    return el.querySelector('.error-msg').style.display = 'block';
  }

  nodeListToArray(nextStageButtons).forEach(function (element) {
    element.addEventListener('click', function (e) {
      e.preventDefault();

      var payload = {};
      var inputs = e.target.parentNode.getElementsByTagName('input');

      createPayloadObj(inputs, payload);
      var currentCandidateDOM = findAncestor(e.target.parentNode, 'cl-candidate');
      var currentStageDOM = findAncestor(e.target.parentNode, 'cl-stage-child');
      var siblingCurrentStage = currentStageDOM.nextElementSibling;
      hideErrorMessage(currentCandidateDOM);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/nextStage');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

          var response = xhr.responseText;

          if (JSON.parse(response).code === 200) {

            var parsedRes = JSON.parse(response).payload;
            var updatedCurrentStage = currentCandidateDOM.querySelectorAll('input[name="currentStage"]');
            updateValues(updatedCurrentStage, parsedRes.currentStage);
            var updatedNextStage = currentCandidateDOM.querySelectorAll('input[name="nextStage"]');
            updateValues(updatedNextStage, parsedRes.nextStage)

            if (siblingCurrentStage) {
              currentStageDOM.removeChild(currentCandidateDOM);
              siblingCurrentStage.appendChild(currentCandidateDOM);
            }

          }

          if (JSON.parse(response).code === 500) {
            showErrorMessage(currentCandidateDOM);
          }
        }
      };

      xhr.send(JSON.stringify(payload));
    });
  });

  nodeListToArray(rejectButtons).forEach(function (element) {
    element.addEventListener('click', function (e) {

      e.preventDefault();
      //create the payload object
      var payload = {};
      var inputs = e.target.parentNode.getElementsByTagName('input');

      createPayloadObj(inputs, payload);
      var currentCandidateDOM = findAncestor(e.target.parentNode, 'cl-candidate');
      var currentStageDOM = findAncestor(e.target.parentNode, 'cl-stage-child');
      hideErrorMessage(currentCandidateDOM);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/reject');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

          var response = xhr.responseText;

          if (JSON.parse(response).code === 200) {
            currentStageDOM.removeChild(currentCandidateDOM);
          }

          if (JSON.parse(response).code === 500) {
            showErrorMessage(currentCandidateDOM);
          }
        }
      };

      xhr.send(JSON.stringify(payload));
    });
  });

}());
