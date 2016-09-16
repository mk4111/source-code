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
    var candidates, i;
    $(".candidate-box-wrap").each(function() {
      var _, candidate, f, filtered, j, len, results, selected;
      candidate = $(this);
      candidate.css('display', candidate_box_display_mode);
      filtered = false;
      results = [];
      for (_ in filters) {
        selected = filters[_];
        if (selected.length > 0) {
          filtered = true;
          for (j = 0, len = selected.length; j < len; j++) {
            f = selected[j];
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
    candidates = [];
    $(".candidate-box-wrap").each(function() {
      var candidate, f, filtered, j, k, len, selected;
      candidate = $(this);
      filtered = false;
      for (k in filters) {
        selected = filters[k];
        if (selected.length > 0 && k !== 'stages') {
          filtered = true;
          for (j = 0, len = selected.length; j < len; j++) {
            f = selected[j];
            if (candidate.hasClass(f)) {
              filtered = false;
              break;
            }
          }
          if (filtered) {
            break;
          }
        }
      }
      if (!filtered) {
        return candidates.push(candidate);
      }
    });
    $(".stages-bar .all-stages span.stage-counter").html(String(candidates.length));
    i = 1;
    return $(".stages-bar .single-stage").each(function() {
      var c, counter, j, len, stageClass;
      counter = 0;
      stageClass = "stage-" + String(i++);
      for (j = 0, len = candidates.length; j < len; j++) {
        c = candidates[j];
        if (c.hasClass(stageClass)) {
          counter++;
        }
      }
      return $(".stages-bar .single-stage." + stageClass + " span.stage-counter").html(String(counter));
    });
  };
  $(".dashboard.stages-bar").find(".button").each(function() {
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
