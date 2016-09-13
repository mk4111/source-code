$ ->
  # stages bar
  $(".stages-bar").find(".button").each ->
    $(this).click ->
      $(this).blur();
      $(this).removeClass("active");
      $(this).removeClass "inverted";
      
      if $(this).val() == "stage-*"
        $(".stages-bar .single-stage").each ->
          $(this).addClass "inverted"
        $(".candidate-box-wrap").each ->
          $(this).css 'display','block';

      else
        clicked = $(this);
        $(".stages-bar .single-stage").each ->
          if clicked.val() != $(this).val() then $(this).addClass("inverted");

        if $(".stages-bar .single-stage:not(.iverted)").length == 0
            $(".stages-bar .all-stages").removeClass "inverted"
        else
            $(".stages-bar .all-stages").addClass "inverted"

        $(".stages-bar .single-stage").each ->
          if $(this).hasClass "inverted"
            $(".candidate-box-wrap." + $(this).val()).each ->
              $(this).css 'display','none';
          else
            $(".candidate-box-wrap." + $(this).val()).each ->
              $(this).css 'display','block';

  $('.ui.dropdown').dropdown();