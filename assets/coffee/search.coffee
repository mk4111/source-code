$ ->
  if ! $('.ui.sidebar.candidate-search') then return;

  sidebar = $('.ui.sidebar.candidate-search').sidebar {
    dimPage: false,
    onVisible: ->
      ;
    onHide: ->
      ;
  };

  $('.ui.sticky')
    .sticky({
      context: '.pusher'
    })
  ;

  $(".fixed.menu .item.search").click ->
    $('.ui.sidebar.candidate-search').sidebar('toggle');