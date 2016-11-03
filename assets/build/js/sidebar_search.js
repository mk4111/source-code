$(function() {
  var clear_button, connected_to_dropdown, deselect_button, email_button, enable_action_buttons, enable_search_button, enable_search_option, list_button, reset_button, resetable, search_button, search_form, select_button, sidebar, uri;
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
    var modal, modal_button, selectmode_form;
    modal_button = $(this);
    if (modal_button.val()) {
      modal = sidebar.find(".modal." + modal_button.val());
      selectmode_form = modal.find("form.selectmode").submit(function(v) {
        var selected;
        selected = selectmode_form.find("input[type='radio']:checked").val();
        modal.find(".appendtolist").hide();
        modal.find(".createlist").hide();
        modal.find(".selectmode").hide();
        modal.find("." + selected).show();
        modal.modal('refresh');
        return false;
      });
      modal.find(".actions button").each(function() {
        return $(this).click(function() {
          if ($(this).val()) {
            modal.find("form." + $(this).val()).submit();
            return false;
          }
        });
      });
      return modal_button.click(function() {
        var blacklist_selector, blacklisted_lenght, checkbox_selector, result_list;
        modal.find(".row.emails").html("");
        result_list = "";
        checkbox_selector = ".email-checkbox .checkbox input[name='email']:checked";
        blacklist_selector = ":not(.not-blacklisted)" + checkbox_selector;
        if (modal_button.val() && modal_button.val() === "sendemail") {
          modal.modal({
            autofocus: false
          });
          checkbox_selector = ".not-blacklisted" + checkbox_selector;
          blacklisted_lenght = $(blacklist_selector).length;
          if (blacklisted_lenght) {
            modal.find("div.removed-emails .counter").html(blacklisted_lenght);
            modal.find("div.removed-emails").show();
            if (blacklisted_lenght > 1) {
              modal.find("div.removed-emails .were").show();
              modal.find("div.removed-emails .was").hide();
            } else {
              modal.find("div.removed-emails .was").show();
              modal.find("div.removed-emails .were").hide();
            }
          } else {
            modal.find("div.removed-emails").hide();
          }
        }
        modal.find("div.accepted-emails");
        modal.find("div.accepted-emails .counter").html($(checkbox_selector).length);
        modal.find("div.accepted-emails").show();
        if ($(checkbox_selector).length > 1) {
          modal.find("div.accepted-emails .were").show();
          modal.find("div.accepted-emails .was").hide();
        } else {
          modal.find("div.accepted-emails .was").show();
          modal.find("div.accepted-emails .were").hide();
        }
        $(checkbox_selector).each(function() {
          var checkbox;
          checkbox = $(this);
          return result_list += checkbox.parent().find(".email-details").html();
        });
        modal.find(".row.emails").each(function() {
          return $(this).html(result_list);
        });
        if (modal_button.val() && modal_button.val() === "createlist") {
          modal.find(".selectmode").show();
          modal.find(".appendtolist").hide();
          modal.find(".createlist").hide();
        }
        modal.modal('show');
        return false;
      });
    }
  });
  sidebar.find('.modal.createlist form.createlist').form({
    fields: {
      name: 'empty'
    }
  });
  sidebar.find(".modal.createlist form.createlist .dropdown.folder-selection").dropdown();
  sidebar.find('.modal.createlist form.appendtolist').form({
    fields: {
      id: 'empty'
    }
  });
  return sidebar.find('.modal.createlist form.appendtolist .list-selection').dropdown();
});
