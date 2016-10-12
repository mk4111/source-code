$(function() {
  var enable_search_option, saerch_form, sidebar;
  $(".fixed.menu .item.search").click(function() {
    return $('.ui.sidebar.candidate-search').sidebar('toggle');
  });
  if (!$('.ui.sidebar.candidate-search')) {
    return;
  }
  sidebar = $('.ui.sidebar.candidate-search').sidebar({
    dimPage: false,
    onVisible: function() {},
    onHide: function() {}
  });
  $('.ui.sticky').sticky({
    context: '.pusher'
  });
  saerch_form = sidebar.find("form");
  enable_search_option = function() {
    var quick_search;
    quick_search = true;
    saerch_form.find(".advance_search input").each(function() {
      if ($(this).val()) {
        quick_search = false;
        return false;
      }
    });
    if (quick_search) {
      return saerch_form.find(".quick_search input").parent().removeClass("disabled");
    } else {
      return saerch_form.find(".quick_search input").parent().addClass("disabled");
    }
  };
  saerch_form.find(".advance_search input").each(function() {
    return $(this).keyup(enable_search_option);
  });
  saerch_form.find(".advance_search button.clear").click(function() {
    saerch_form.find(".advance_search input").each(function() {
      return $(this).val("");
    });
    enable_search_option();
    return false;
  });
  return enable_search_option();
});
