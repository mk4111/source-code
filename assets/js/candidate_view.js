// @TODO @speedingdeer: legacy, stop using pure js on client side like here (cs + jquery is much better and more readable)

(function () {
  //favourite
  var favouriteForm = document.getElementsByClassName('favourite-form')[0];
    favouriteForm.addEventListener('submit', function (e){
      e.preventDefault();
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/favourite');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseText === '200') {
            favouriteForm.setAttribute("action", "");
            var state = document.getElementById('star-state');
            state.className = 'fa fa-star';
          }
          console.log(xhr.responseText);
        }
      };

      xhr.send(JSON.stringify({id: document.getElementById('profileId').value }));
      console.log('had to favourite!!');

    }, false);

    //delete duplicate profile
    var deleteProfile = document.getElementsByClassName('delete-profile')[0];
    var deleteProfileConfirmation = document.getElementsByClassName('delete-profile-confirmation')[0];
    var cancelDeleteProfile = document.getElementsByClassName('cancel-delete-profile')[0];

    deleteProfile.addEventListener('click', function (e){
      e.preventDefault();
      deleteProfileConfirmation.style.display = 'block'
      deleteProfile.style.display = 'none';
    }, false);

    cancelDeleteProfile.addEventListener('click', function() {
      deleteProfileConfirmation.style.display = 'none';
      deleteProfile.style.display = 'block';
    }, false);

    //display email message
    var displayEmail = document.querySelectorAll('.display-email');
    var close = document.querySelectorAll('.close');

    for (var i = 0; i < displayEmail.length; i++) {
     displayEmail[i].addEventListener('click', function (e) {
      e.preventDefault();
      this.nextElementSibling.nextElementSibling.style.display = 'block';
      this.nextElementSibling.style.display = 'block';
      }, false);
    }

    for (var i = 0; i < close.length; i++) {
      close[i].addEventListener('click', function (e) {
        e.preventDefault();
        this.nextElementSibling.style.display = 'none';
        this.style.display = 'none';
      }, false);
    }

    var addStatus = document.getElementById('add-status');
    addStatus.addEventListener('click', function (e) {
      this.style.display = 'none';
      document.querySelector('.dropdown-clients').style.display = 'inline-block';
      document.querySelector('.dropdown-jobs').style.display = 'inline-block';
      document.querySelector('.dropdown-stages').style.display = 'inline-block';
      document.querySelector('.dropdown-save').style.display = 'inline-block';
    });

    var editStatus = document.getElementsByClassName('edit-status');
    for (var i = 0; i < editStatus.length; i++) {
      editStatus[i].addEventListener('click', function (e) {
        e.preventDefault();
        this.style.display = 'none';
        var dropdowns = document.querySelectorAll('.id-' + e.target.id);
        for (var i = 0; i <dropdowns.length; i++) {
          dropdowns[i].style.display = 'inline-block';
        }
      }, false);
    }

    function removeOptions(selectbox){
      var i;
      for(i = selectbox.options.length-1; i>= 0; i--){
          selectbox.remove(i);
      }
    }

    document.getElementById("clients").addEventListener("change", function(e) {

        var selected = e.target.value;
        var jobs = document.getElementsByClassName(selected);
        var jobsDropdown = document.getElementById("jobs");
        //delete options of jobsDropdown
          removeOptions(jobsDropdown);

          for (var i = 0; i < jobs.length; i++) {
              var option = document.createElement('option');
              option.setAttribute('value', jobs[i].id);
              var text = document.createTextNode(jobs[i].value);
              option.appendChild(text);
              jobsDropdown.appendChild(option);
          }

    }, false);

    var clients_edit =  document.querySelectorAll('.clients-edit');

    for (var i = 0; i < clients_edit.length; i++) {
      clients_edit[i].addEventListener('click', function (e) {

        var selected = e.target.value;
        var selectedAttr = e.target.getAttribute('data-tmp');

        var jobs = document.getElementsByClassName(selected);

        var jobsDropdowns = document.querySelector('.dropbtn.id-' + selectedAttr);

        removeOptions(jobsDropdowns);

        for (var i = 0; i < jobs.length; i++) {
            var option = document.createElement('option');
            option.setAttribute('value', jobs[i].className);
            var text = document.createTextNode(jobs[i].value);
            option.appendChild(text);
            jobsDropdowns.appendChild(option);
        }
      }, false);
    }

    //info section

    var editButton = document.getElementById('edit-info');
    editButton.addEventListener('click', function () {
      //display and update data
      var scurrent = document.querySelector('.scurrent').textContent;
      document.querySelector('.scurrent-input').value = scurrent;
      var sexpected = document.querySelector('.sexpected').textContent;
      document.querySelector('.sexpected-input').value = sexpected;
      var notice = document.querySelector('.notice').textContent;
      document.querySelector('.notice-input').value = notice;
      var locations = document.querySelector('.locations').textContent;
      document.querySelector('.locations-input').value = locations;

      document.getElementsByClassName('info-wrapper')[0].style.display = 'none';
      document.getElementsByClassName('info-form')[0].style.display = 'block';

    }, false);

    var saveButton = document.getElementById('save-info');
    saveButton.addEventListener('click', function (e) {
      e.preventDefault();
      //ajax call
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/info/save');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

          var response = JSON.parse(xhr.responseText);

          if (response.code === 200) {
            //display new data
            document.querySelector('.scurrent').textContent = response.info.scurrent;
            document.querySelector('.sexpected').textContent = response.info.sexpected;
            document.querySelector('.notice').textContent = response.info.notice;
            document.querySelector('.locations').textContent = response.info.locations;
            document.querySelector('.error-tag').style.display = 'none';
          }
          if (response.code === 500) {
            document.querySelector('.error-tag').style.display = 'block';
          }

          document.getElementsByClassName('info-form')[0].style.display = 'none';
          document.getElementsByClassName('info-wrapper')[0].style.display = 'block';
        }
      };

      var infoObject = {
        idCandidate: document.querySelector('.id-candidate').value,
        scurrent: document.querySelector('.scurrent-input').value,
        sexpected: document.querySelector('.sexpected-input').value,
        notice: document.querySelector('.notice-input').value,
        locations: document.querySelector('.locations-input').value
      };

      xhr.send(JSON.stringify(infoObject));
    }, false);

    //li url edit/save

    var editLI = document.getElementById('edit-li');
    editLI.addEventListener('click', function (e) {
      e.preventDefault();
      //display and update data
      var li = document.querySelector('#li').textContent;
      document.querySelector('.li-input').value = li;
      document.querySelector('#edit-li').style.display = 'none';
      document.querySelector('.li-save').style.display = 'block';

    }, false);

    var saveLI = document.querySelector('.li-save button');
    saveLI.addEventListener('click', function (e) {
      e.preventDefault();

      //ajax call
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/li/save');
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);

          if (response.code === 200) {
            //display new data
            document.querySelector('#li').textContent = response.url;
            document.querySelector('#li').setAttribute('href', response.url);
            document.querySelector('.error-li-tag').style.display = 'none';
          }
          if (response.code === 500) {
            document.querySelector('.error-li-tag').style.display = 'block';
          }

          document.querySelector('.li-save').style.display = 'none';
          document.querySelector('#edit-li').style.display = 'block';
        }
      };

      var liObject = {
        idCandidate: document.querySelector('.id-candidate').value,
        li: document.querySelector('.li-input').value
      };

      xhr.send(JSON.stringify(liObject));
    }, false)

    //delete the listNames from the candidate profile
    var deleteListName = document.querySelectorAll('.delete-list-names');
    for (var i = 0; i < deleteListName.length; i++) {
      deleteListName[i].addEventListener('click', function (e) {
        e.preventDefault();
        var parent = e.target.parentNode.parentNode;

        var child = parent.getElementsByTagName('div')[0];
        var listName = parent.querySelector('input[name="listName"]').value;
        var idCandidate = parent.querySelector('input[name="idCandidate"]').value;
        var payload = {listName: listName, idCandidate:idCandidate};

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/candidates/delete-list');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {

            var response = xhr.responseText;

            if (JSON.parse(response).code === 200) {
              //remove element
              parent.removeChild(child);
            }

            if (JSON.parse(response).code === 500) {
              //error message
              document.querySelector('.error-list-name').style.display = 'block';
            }
          }
        }
        xhr.send(JSON.stringify(payload));
      });
    }
})();
