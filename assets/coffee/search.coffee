$ ->

  $(".fixed.menu .item.search").click ->
    $('.ui.sidebar.candidate-search').sidebar('toggle');

  if ! $('.ui.sidebar.candidate-search') then return;

  sidebar = $('.ui.sidebar.candidate-search').sidebar {
    dimPage: false,
    onVisible: ->
      ;
    onHide: ->
      ;
  };

  $('.ui.sticky')
    .sticky({
      context: '.pusher'
    })
  ;

  search_form = sidebar.find("form.search");

  search_button = search_form.find("button[type='submit']");

  enable_search_button = () ->
    disabled = true;
    if search_form.find("input[type='checkbox']:checked").length
      disabled = false;
    search_form.find("input[type='text']").each ->
      if $(this).val() && $(this).val().trim()
        disabled = false;
        return false; # break
    if disabled then search_button.addClass "disabled" ;
    else search_button.removeClass "disabled" ;

  search_form.find("input").change enable_search_button
  search_form.find("input").keyup enable_search_button

  enable_search_button();

  clear_button = search_form.find(".advance_search button.clear");

  enable_search_option = () ->
    quick_search = true;
    clear_enabled = false;
    search_form.find(".advance_search input").each ->
      if $(this).val() then clear_enabled = true;
      if $(this).val() && $(this).val().trim()
        quick_search = false;
        return false; # break
    if quick_search then search_form.find(".quick_search input").parent().removeClass "disabled" ;
    else search_form.find(".quick_search input").parent().addClass "disabled" ;
    if clear_enabled then clear_button.removeClass "disabled" ;
    else clear_button.addClass "disabled" ;

  search_form.find(".advance_search input").each ->
    $(this).keyup enable_search_option

  enable_search_option(); # check which for to enable


  search_form.find(".advance_search button.clear").click ->
    search_form.find(".advance_search input").each ->
      $(this).val "";
    enable_search_option()
    return false; # don't propagate

  connected_to_dropdown = $('.ui.dropdown.connected_to').dropdown {
    onChange: (f) -> 
      ;
  };

  select_button = sidebar.find("button.select_all");
  deselect_button = sidebar.find("button.deselect_all");
  email_button = sidebar.find("button.send_email");
  list_button = sidebar.find("button.create_list");

  enable_action_buttons = () ->
    if $(".checkbox input[name='email']:checked").length
      email_button.removeClass "disabled" ;
      list_button.removeClass "disabled" ;
      deselect_button.removeClass "disabled" ;
      if $(".checkbox input[name='email']:not(:checked)").length
        select_button.removeClass "disabled" ;
      else
        select_button.addClass "disabled" ;
    else
      email_button.addClass "disabled" ;
      list_button.addClass "disabled" ;
      deselect_button.addClass "disabled" ;
      select_button.removeClass "disabled" ;


  enable_action_buttons();
  $(".checkbox input[name='email']").change enable_action_buttons

  deselect_button.click ->
    $(".checkbox input[name='email']").prop('checked', false);
    enable_action_buttons();
  select_button.click ->
    $(".checkbox input[name='email']").prop('checked', true);
    enable_action_buttons();

  if email_button.val()
    email_modal = sidebar.find(".modal." + email_button.val());
    email_modal.find(".actions button").click ->
      email_modal.find("form.sendmail").submit()
    email_button.click -> 
      email_modal.find(".row.emails").html("");
      result_list = "";
      $(".checkbox input[name='email']:checked").each ->
        checkbox = $(this);
        result_list += checkbox.parent().find(".email-details").html();
      email_modal.find(".row.emails").html(result_list);
      email_modal.modal('show');
      return false;

  if list_button.val()
    list_modal = sidebar.find(".modal." + list_button.val());
    list_button.click ->
      list_modal.modal('show');

  # connected to remain disabled untill we reindex contects collection
  # uri = URI(window.location)
  # connected_to = uri.search(true).connected_to
  # if connected_to
  #  connected_to_dropdown.dropdown('set selected', connected_to.split(","));


