(function () {

    tinymce.init({
    selector: '#tiny',
    theme: 'modern',
    width: '80%',
    height: 300,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table contextmenu directionality emoticons template paste textcolor'
    ],
    content_css:[
    '//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
    '//www.tinymce.com/css/codepen.min.css'
  ],
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons'
  });

  var filterFunc = function(k) {
    return k !== '';
  }

  //highlight
  if ( document.getElementsByClassName('keywords').length > 0 ) {
    var keywords = document.getElementsByClassName('keywords')[0].value;
    if (keywords.length > 0) {
      var checkHighlight = document.getElementsByClassName('check-highlight');
      var regex = keywords.split(' ').filter(filterFunc).join('|');
      regex = regex.replace(/[-[\]{}()*+?.,\\^$]/g, "\\$&");
      var matcher = new RegExp(regex, 'gi');

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
  }

  //convert our selector object into array using slice.call
  function arr(selector, context) {
    context = context || document;
    var elements = context.querySelectorAll(selector);
    return Array.prototype.slice.call(elements);
  }
  //create pie chart on a fly
   arr('.pie').forEach(function(pie) {
    var p = parseFloat(pie.textContent);
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    var circle = document.createElementNS(NS, "circle");
    //added title for accessibility, so that screen reader users can also know what percentage is displayed
    var title = document.createElementNS(NS, "title");

    circle.setAttribute("r", 16);
    circle.setAttribute("cx", 16);
    circle.setAttribute("cy", 16);
    circle.setAttribute("stroke-dasharray", p + " 100");

    svg.setAttribute("viewBox", "0 0 32 32");
    title.textContent = pie.textContent;
    pie.textContent = '';
    svg.appendChild(title);
    svg.appendChild(circle);
    pie.appendChild(svg);
  });

  //select all checkboxes
  var selectAll = document.getElementById('select-all');
    if (selectAll) {
    selectAll.addEventListener('click', function () {
      var checkboxes = document.getElementsByName('email');
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = this.checked;
      }
    }, false);
  }


  // handling dropdown - should be gone soon
  var loadUserDashboardForm = document.getElementById('load-user-dashboard-form');
  if (loadUserDashboardForm) {
    loadUserDashboardForm.addEventListener('submit', function (event) {
      //use select as dropdown menu - untl the UI freamwork chosen
      window.location = "/dashboard/" + document.getElementById('load-user-dashboard-select').value;
      event.preventDefault();
    });
  }

}());
