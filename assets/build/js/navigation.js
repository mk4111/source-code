$(function() {
  var navbar, popup;
  navbar = $("#navbar");
  popup = navbar.find("a.search").popup({
    on: 'click',
    closable: false,
    hoverable: false,
    position: 'bottom center',
    preserve: true,
    lastResort: true,
    closable: false,
    duration: 200,
    exclusive: true,
    onVisible: function() {
      return $("#search-form input").first().focus();
    }
  });
  return navbar.find(".dropdown.bars").dropdown({
    onShow: function() {
      return popup.popup('hide');
    }
  });
});
