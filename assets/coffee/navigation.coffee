$ ->

  navbar = $("#navbar");

  popup = navbar.find("a.search").popup({
    on: 'click',
    closable: false,
    hoverable : false,
    position: 'bottom center',
    preserve: true,
    lastResort: true,
    closable: false,
    duration: 200,
    exclusive: true,
    onVisible: () ->
      $("#search-form input").first().focus()

  });

  navbar.find(".dropdown.bars").dropdown({
    onShow: ->
      popup.popup('hide');
  });