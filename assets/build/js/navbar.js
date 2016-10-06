$(function() {
  var navbar;
  navbar = $("#navbar");
  navbar.find(".dropdown.bars").dropdown();
  navbar.find("a.search").popup({
    on: 'click',
    closable: false,
    hoverable: false,
    position: 'bottom center',
    preserve: true,
    lastResort: true,
    closable: false,
    duration: 200,
    onVisible: function() {
      return $("#search-form input").first().focus();
    }
  });
  return $('.menu .browse').popup({
    hoverable: true,
    position: 'bottom left',
    delay: {
      show: 300,
      hide: 800
    }
  });
});
