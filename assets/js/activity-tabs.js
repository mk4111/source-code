// @TODO @speedingdeer: legacy, stop using pure js on client side like here (cs + jquery is much better and more readable)

(function () {
  //set current tab
  var currentTab = document.querySelector('.tabs ul li');
  // store which tab are we on by storing number of tabHeader
  var tabOn = currentTab.id.split('_')[1];
  //set data-current attr = 1 or 2 depends which tab are on
  currentTab.parentNode.setAttribute('data-current',tabOn);
  //add class active tab to be able to style it
  currentTab.setAttribute('class', 'tabActiveHeader');

  //hide non active jobs tab
    var pages = document.querySelectorAll(".tabPage");
    for (var i = 1; i < pages.length; i++) {
      pages[i].style.display="none";
    }

    //this adds click event to tabs
    var tabs = document.querySelectorAll(".tabs ul li");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', displayPage, false);
    }

  function displayPage() {
    var current = this.parentNode.getAttribute("data-current");
    //remove class of activetabheader and hide old contents
    document.getElementById("tabHeader_" + current).removeAttribute("class");
    document.getElementById("tabpage_" + current).style.display="none";

    var tabOn = this.id.split("_")[1];
    //add class of activetabheader to new active tab and show contents
    this.setAttribute("class","tabActiveHeader");
    document.getElementById("tabpage_" + tabOn).style.display="block";
    this.parentNode.setAttribute("data-current",tabOn);
  }

}());
