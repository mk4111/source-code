(function () {

  var filterFunc = function(k) {
    return k !== '';
  }

  function search() {
    var searchInput = document.getElementById('search-box').value;
    var currentPage = document.getElementById('currentPage').value;
    var totalPages = document.getElementById('totalPages').value;
    var filter = 'all';

    if (searchInput === '') {
      window.location.href = '/';
    } else {

      var queryString = searchInput.split(' ').filter(filterFunc).join(' ');
      queryString = encodeURIComponent(queryString);

      window.location.href='/search/' + filter + '/' + queryString + '/' + 1;
    }
  }

 document.getElementsByClassName('search-btn')[0].addEventListener('click', function (e) {
    e.preventDefault();
    search();
  }, false);

  document.getElementById('search-box').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) {
      search();
    }
  }, false);

  //highlight
  var keywords = document.getElementsByClassName('keywords')[0].value;
  if (keywords.length > 0) {
    var checkHighlight = document.getElementsByClassName('check-highlight');
    var matcher = new RegExp(keywords.split(' ').filter(filterFunc).join('|'), 'gi');

    var options = {
      startTag :"<b class='highlight'>", // could be a hyperlink
      endTag   :"</b>" // or you could use <i> instead of <b> ... want it? ask!
    }

    function wrapper (match) {
      return options.startTag + match + options.endTag;
    }

    for(var i = 0; i < checkHighlight.length; i++) {
      checkHighlight[i].innerHTML = checkHighlight[i].textContent.replace(matcher, wrapper);
    }

  }

}());
