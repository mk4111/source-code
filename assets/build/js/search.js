$(function() {
  var connected_to_dropdown, email_button, enable_email_button, enable_search_option, modal, saerch_form, select_button, sidebar;
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
  email_button = sidebar.find("button.send_email");
  select_button = sidebar.find("button.select_all");
  enable_email_button = function() {
    if ($(".checkbox input[name='email']:checked").length) {
      email_button.removeClass("disabled");
      select_button.find(".positive").hide();
      return select_button.find(".negative").show();
    } else {
      email_button.addClass("disabled");
      select_button.find(".positive").show();
      return select_button.find(".negative").hide();
    }
  };
  enable_email_button();
  $(".checkbox input[name='email']").change(enable_email_button);
  select_button.click(function() {
    if ($(".checkbox input[name='email']:checked").length) {
      $(".checkbox input[name='email']").prop('checked', false);
    } else {
      $(".checkbox input[name='email']").prop('checked', true);
    }
    enable_email_button();
    $(this).focusout();
    $(this).blur();
    return false;
  });
  if (email_button.val()) {
    modal = sidebar.find(".modal." + email_button.val());
    modal.find(".actions button").click(function() {
      return modal.find("form.sendmail").submit();
    });
    return email_button.click(function() {
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
      $(this).focusout();
      $(this).blur();
      return false;
    });
  }
});
