$(function() {
  var clear_button, connected_to_dropdown, deselect_button, email_button, enable_action_buttons, enable_search_button, enable_search_option, list_button, reset_button, resetable, search_button, search_form, select_button, sidebar, uri;
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
  search_form = sidebar.find("form.search");
  search_button = search_form.find("button[type='submit']");
  reset_button = sidebar.find("button.reset");
  reset_button.click(function() {
    if (reset_button.hasClass("disabled")) {
      return false;
    }
    return window.location = "/search";
  });
  resetable = false;
  uri = URI(window.location);
  _.each(uri.search(true), function(val) {
    if (val) {
      resetable = true;
      return false;
    }
  });
  if (resetable) {
    reset_button.removeClass("disabled");
  } else {
    reset_button.addClass("disabled");
  }
  enable_search_button = function() {
    var disabled;
    disabled = true;
    if (search_form.find("input[type='checkbox']:checked").length) {
      disabled = false;
    }
    search_form.find("input[type='text']").each(function() {
      if ($(this).val() && $(this).val().trim()) {
        disabled = false;
        return false;
      }
    });
    if (disabled) {
      search_button.addClass("disabled");
      if (!resetable) {
        return reset_button.addClass("disabled");
      }
    } else {
      search_button.removeClass("disabled");
      return reset_button.removeClass("disabled");
    }
  };
  search_form.find("input").change(enable_search_button);
  search_form.find("input").keyup(enable_search_button);
  enable_search_button();
  clear_button = search_form.find(".advance_search button.clear");
  enable_search_option = function() {
    var clear_enabled, quick_search;
    quick_search = true;
    clear_enabled = false;
    search_form.find(".advance_search input").each(function() {
      if ($(this).val()) {
        clear_enabled = true;
      }
      if ($(this).val() && $(this).val().trim()) {
        quick_search = false;
        return false;
      }
    });
    if (quick_search) {
      search_form.find(".quick_search input").parent().removeClass("disabled");
    } else {
      search_form.find(".quick_search input").parent().addClass("disabled");
    }
    if (clear_enabled) {
      return clear_button.removeClass("disabled");
    } else {
      return clear_button.addClass("disabled");
    }
  };
  search_form.find(".advance_search input").each(function() {
    return $(this).keyup(enable_search_option);
  });
  enable_search_option();
  search_form.find(".advance_search button.clear").click(function() {
    search_form.find(".advance_search input").each(function() {
      return $(this).val("");
    });
    enable_search_option();
    return false;
  });
  connected_to_dropdown = $('.ui.dropdown.connected_to').dropdown({
    onChange: function(f) {}
  });
  select_button = sidebar.find("button.select_all");
  deselect_button = sidebar.find("button.deselect_all");
  email_button = sidebar.find("button.send_email");
  list_button = sidebar.find("button.create_list");
  enable_action_buttons = function() {
    if ($(".checkbox input[name='email']:checked").length) {
      email_button.removeClass("disabled");
      list_button.removeClass("disabled");
      deselect_button.removeClass("disabled");
      if ($(".checkbox input[name='email']:not(:checked)").length) {
        return select_button.removeClass("disabled");
      } else {
        return select_button.addClass("disabled");
      }
    } else {
      email_button.addClass("disabled");
      list_button.addClass("disabled");
      deselect_button.addClass("disabled");
      return select_button.removeClass("disabled");
    }
  };
  enable_action_buttons();
  $(".checkbox input[name='email']").change(enable_action_buttons);
  deselect_button.click(function() {
    $(".checkbox input[name='email']").prop('checked', false);
    return enable_action_buttons();
  });
  select_button.click(function() {
    $(".checkbox input[name='email']").prop('checked', true);
    return enable_action_buttons();
  });
  search_form.find("button.modal-list-candiates").each(function() {
    var modal, modal_button;
    modal_button = $(this);
    if (modal_button.val()) {
      modal = sidebar.find(".modal." + modal_button.val());
      modal.find(".actions button").click(function() {
        return modal.find("form.sendmail").submit();
      });
      return modal_button.click(function() {
        var result_list;
        modal.find(".row.emails").html("");
        result_list = "";
        $(".checkbox input[name='email']:checked").each(function() {
          var checkbox;
          checkbox = $(this);
          return result_list += checkbox.parent().find(".email-details").html();
        });
        modal.find(".row.emails").html(result_list);
        modal.modal('show');
        return false;
      });
    }
  });
  return "if email_button.val()\n  email_modal = sidebar.find(\".modal.\" + email_button.val());\n  email_modal.find(\".actions button\").click ->\n    email_modal.find(\"form.sendmail\").submit()\n  email_button.click -> \n    email_modal.find(\".row.emails\").html(\"\");\n    result_list = \"\";\n    $(\".checkbox input[name='email']:checked\").each ->\n      checkbox = $(this);\n      result_list += checkbox.parent().find(\".email-details\").html();\n    email_modal.find(\".row.emails\").html(result_list);\n    email_modal.modal('show');\n    return false;\n\n\nif list_button.val()\n  list_modal = sidebar.find(\".modal.\" + list_button.val());\n  list_button.click ->\n    list_modal.modal('show');\n";
});
