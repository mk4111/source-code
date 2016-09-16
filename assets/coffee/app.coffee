$ ->
  # stages bar

  if $(".stages-bar").length == 0 then return; # nothing to do here

  # remember the initial display mode
  candidate_box_display_mode = $(".candidate-box-wrap").first().css("display");

  filters = {
    stages: [],
    candidates: [],
    clients: [],
    roles: []
  }

  filter_results = () ->
    
    # iterate through all candidate box and check if has at least one class from selected categories
    $(".candidate-box-wrap").each ->
      candidate = $(this);
      # by default it's enabled
      candidate.css 'display', candidate_box_display_mode
      for _, selected of filters
        if selected.length > 0
          # need to check if contains a class from category - possibly disabled
          filtered = true;
          for f in selected
            if candidate.hasClass(f)
              filtered = false;
              break;
          if filtered
            candidate.css 'display', 'none';
            break;


    """
    if $(this).val() == "stage-*"
      $(".stages-bar .single-stage").each ->
        $(this).removeClass "inverted"
      $(".candidate-box-wrap").each ->
        $(this).css 'display', candidate_box_display_mode;

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
            $(this).css 'display', candidate_box_display_mode;
      """


  $(".stages-bar").find(".button").each ->
    $(this).click ->
      # color ui and trigger filtering
      $(this).blur();
      $(this).removeClass("active");
      $(this).removeClass "inverted";
      $(".stages-bar .single-stage").each ->

      if $(this).val() == "stage-*"
        $(".stages-bar .single-stage").each ->
          $(this).removeClass "inverted";
        filters.stages = [];
      else
        clicked = $(this);
        $(".stages-bar .single-stage").each ->
          if clicked.val() != $(this).val() then $(this).addClass("inverted");
          $(".stages-bar .all-stages").addClass "inverted";
          filters.stages = [clicked.val()];
      filter_results();

  $('.ui.dropdown.candidates').dropdown {
    onChange: (f) -> 
      if f.length
        filters.candidates = f.split(',');
      else
        filters.candidates = [];
      filter_results();
  };

  $('.ui.dropdown.clients').dropdown {
    onChange: (f) -> 
      if f.length
        filters.clients = f.split(',');
      else
        filters.clients = [];
      filter_results();
  };

  $('.ui.dropdown.roles').dropdown {
    onChange: (f) -> 
      if f.length
        filters.roles = f.split(',');
      else
        filters.roles = [];
      filter_results();
  };
