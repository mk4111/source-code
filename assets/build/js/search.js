$(function() {
  var clear_button, connected_to_dropdown, deselect_button, email_button, enable_action_buttons, enable_search_button, enable_search_option, list_button, modal_countries, reset_button, resetable, search_button, search_form, select_button, sidebar, uri;
  $(".fixed.menu div.item.search").click(function() {
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
      list_button.removeClass("disabled");
      deselect_button.removeClass("disabled");
      if ($(".checkbox input[name='email']:not(:checked)").length) {
        select_button.removeClass("disabled");
      } else {
        select_button.addClass("disabled");
      }
    } else {
      list_button.addClass("disabled");
      deselect_button.addClass("disabled");
      if ($(".checkbox input[name='email']").length) {
        select_button.removeClass("disabled");
      }
    }
    if ($(".not-blacklisted.email-checkbox .checkbox input[name='email']:checked").length) {
      return email_button.removeClass("disabled");
    } else {
      return email_button.addClass("disabled");
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
        modal.find("form").submit();
        return false;
      });
      return modal_button.click(function() {
        var blacklist_selector, blacklisted_lenght, checkbox_selector, result_list;
        modal.find(".row.emails").html("");
        result_list = "";
        checkbox_selector = ".email-checkbox .checkbox input[name='email']:checked";
        blacklist_selector = ":not(.not-blacklisted)" + checkbox_selector;
        if (modal_button.val() && modal_button.val() === "sendemail") {
          checkbox_selector = ".not-blacklisted" + checkbox_selector;
          blacklisted_lenght = $(blacklist_selector).length;
          if (blacklisted_lenght) {
            modal.find(".segment.removed-emails .counter").html(blacklisted_lenght);
            modal.find(".segment.removed-emails").show();
            if (blacklisted_lenght > 1) {
              modal.find(".segment.removed-emails .were").show();
              modal.find(".segment.removed-emails .was").hide();
            } else {
              modal.find(".segment.removed-emails .was").show();
              modal.find(".segment.removed-emails .were").hide();
            }
          } else {
            modal.find(".segment.removed-emails").hide();
          }
        }
        $(checkbox_selector).each(function() {
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
  sidebar.find('.modal.createlist form').form({
    fields: {
      name: 'empty'
    }
  });
  modal_countries = sidebar.find(".modal.countries").modal();
  modal_countries.find("form").submit(function() {
    search_form.find(".advance_search input[name='location']").val(modal_countries.find("input[type='radio']:checked").val());
    modal_countries.modal('hide');
    enable_search_button();
    enable_search_option();
    return false;
  });
  modal_countries.find(".actions .button").click(function() {
    search_form.find(".advance_search input[name='location']").val(modal_countries.find("input[type='radio']:checked").val());
    return modal_countries.modal('hide');
  });
  return search_form.find(".advance_search button.location").click(function() {
    return modal_countries.modal('show');
  });
});
