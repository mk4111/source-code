$ ->

  navbar = $("#navbar");


  if $('.ui.sidebar.candidate-search').length == 0
    # diable on the search page
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
    on: 'hover',
    onShow: ->
      popup.popup('hide');
  });