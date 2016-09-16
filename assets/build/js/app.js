$(function() {
  var candidate_box_display_mode, filter_results, filters;
  if ($(".stages-bar").length === 0) {
    return;
  }
  candidate_box_display_mode = $(".candidate-box-wrap").first().css("display");
  filters = {
    stages: [],
    candidates: [],
    clients: [],
    roles: []
  };
  filter_results = function() {
    $(".candidate-box-wrap").each(function() {
      var _, candidate, f, filtered, i, len, results, selected;
      candidate = $(this);
      candidate.css('display', candidate_box_display_mode);
      results = [];
      for (_ in filters) {
        selected = filters[_];
        if (selected.length > 0) {
          filtered = true;
          for (i = 0, len = selected.length; i < len; i++) {
            f = selected[i];
            if (candidate.hasClass(f)) {
              filtered = false;
              break;
            }
          }
          if (filtered) {
            candidate.css('display', 'none');
            break;
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    return "if $(this).val() == \"stage-*\"\n  $(\".stages-bar .single-stage\").each ->\n    $(this).removeClass \"inverted\"\n  $(\".candidate-box-wrap\").each ->\n    $(this).css 'display', candidate_box_display_mode;\n\nelse\n  clicked = $(this);\n  $(\".stages-bar .single-stage\").each ->\n    if clicked.val() != $(this).val() then $(this).addClass(\"inverted\");\n\n  if $(\".stages-bar .single-stage:not(.iverted)\").length == 0\n    $(\".stages-bar .all-stages\").removeClass \"inverted\"\n  else\n    $(\".stages-bar .all-stages\").addClass \"inverted\"\n\n  $(\".stages-bar .single-stage\").each ->\n    if $(this).hasClass \"inverted\"\n      $(\".candidate-box-wrap.\" + $(this).val()).each ->\n        $(this).css 'display','none';\n    else\n      $(\".candidate-box-wrap.\" + $(this).val()).each ->\n        $(this).css 'display', candidate_box_display_mode;";
  };
  $(".stages-bar").find(".button").each(function() {
    return $(this).click(function() {
      var clicked;
      $(this).blur();
      $(this).removeClass("active");
      $(this).removeClass("inverted");
      $(".stages-bar .single-stage").each(function() {});
      if ($(this).val() === "stage-*") {
        $(".stages-bar .single-stage").each(function() {
          return $(this).removeClass("inverted");
        });
        filters.stages = [];
      } else {
        clicked = $(this);
        $(".stages-bar .single-stage").each(function() {
          if (clicked.val() !== $(this).val()) {
            $(this).addClass("inverted");
          }
          $(".stages-bar .all-stages").addClass("inverted");
          return filters.stages = [clicked.val()];
        });
      }
      return filter_results();
    });
  });
  $('.ui.dropdown.candidates').dropdown({
    onChange: function(f) {
      if (f.length) {
        filters.candidates = f.split(',');
      } else {
        filters.candidates = [];
      }
      return filter_results();
    }
  });
  $('.ui.dropdown.clients').dropdown({
    onChange: function(f) {
      if (f.length) {
        filters.clients = f.split(',');
      } else {
        filters.clients = [];
      }
      return filter_results();
    }
  });
  return $('.ui.dropdown.roles').dropdown({
    onChange: function(f) {
      if (f.length) {
        filters.roles = f.split(',');
      } else {
        filters.roles = [];
      }
      return filter_results();
    }
  });
});
