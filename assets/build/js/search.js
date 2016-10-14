$(function() {
  var button, connected_to_dropdown, enable_email_button, enable_search_option, modal, saerch_form, sidebar;
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
  enable_search_option();
  saerch_form.find(".advance_search button.clear").click(function() {
    saerch_form.find(".advance_search input").each(function() {
      return $(this).val("");
    });
    enable_search_option();
    return false;
  });
  connected_to_dropdown = $('.ui.dropdown.connected_to').dropdown({
    onChange: function(f) {}
  });
  button = sidebar.find("button.send_email");
  enable_email_button = function() {
    if ($(".checkbox input[name='email']:checked").length) {
      return button.removeClass("disabled");
    } else {
      return button.addClass("disabled");
    }
  };
  enable_email_button();
  $(".checkbox input[name='email']").change(enable_email_button);
  sidebar.find("button.select_all").click(function() {
    $(".checkbox input[name='email']").prop('checked', true);
    enable_email_button();
    $(this).focusout();
    $(this).blur();
    return false;
  });
  if (button.val()) {
    modal = sidebar.find(".modal." + button.val());
    modal.find(".actions button").click(function() {
      return modal.find("form.sendmail").submit();
    });
    return button.click(function() {
      var result_list;
      modal.find("ul").html("");
      result_list = "";
      $(".checkbox input[name='email']:checked").each(function() {
        var checkbox;
        checkbox = $(this);
        return result_list += checkbox.parent().find(".email-details").html();
      });
      modal.find("ul").html(result_list);
      modal.modal('show');
      $(this).focusout();
      $(this).blur();
      return false;
    });
  }
});
