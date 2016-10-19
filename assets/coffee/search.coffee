$ ->

  $(".fixed.menu div.item.search").click ->
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
    .sticky({ context: '.pusher' });

  search_form = sidebar.find("form.search");
  search_button = search_form.find("button[type='submit']");
  reset_button = sidebar.find("button.reset");
  reset_button.click ->
    if reset_button.hasClass "disabled" then return false;
    window.location = "/search";


  resetable = false;
  
  uri = URI(window.location)
  _.each uri.search(true), (val) ->
    if val
      resetable = true;
      return false; # break

  if resetable then reset_button.removeClass "disabled"
  else reset_button.addClass "disabled"

  enable_search_button = () ->
    disabled = true;
    if search_form.find("input[type='checkbox']:checked").length
      disabled = false;
    search_form.find("input[type='text']").each ->
      if $(this).val() && $(this).val().trim()
        disabled = false;
        return false; # break
    if disabled
      search_button.addClass "disabled" ;
      if !resetable
        reset_button.addClass "disabled" ;

    else 
      search_button.removeClass "disabled" ;
      reset_button.removeClass "disabled" ;

  search_form.find("input").change enable_search_button
  search_form.find("input").keyup enable_search_button

  enable_search_button();

  clear_button = search_form.find(".advance_search button.clear");

  search_form.find(".advance_search .button.eu").click ->
    search_form.find(".advance_search input[name='location']").val "Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden" ;
    enable_search_option();
    enable_search_button();

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
  # list_button = sidebar.find("button.create_list");

  enable_action_buttons = () ->
    if $(".checkbox input[name='email']:checked").length
      email_button.removeClass "disabled" ;
      # list_button.removeClass "disabled" ;
      deselect_button.removeClass "disabled" ;
      if $(".checkbox input[name='email']:not(:checked)").length
        select_button.removeClass "disabled" ;
      else
        select_button.addClass "disabled" ;
    else
      email_button.addClass "disabled" ;
      # list_button.addClass "disabled" ;
      deselect_button.addClass "disabled" ;
      if $(".checkbox input[name='email']").length
        select_button.removeClass "disabled" ;

  enable_action_buttons();
  $(".checkbox input[name='email']").change enable_action_buttons

  deselect_button.click ->
    $(".checkbox input[name='email']").prop('checked', false);
    enable_action_buttons();
  select_button.click ->
    $(".checkbox input[name='email']").prop('checked', true);
    enable_action_buttons();

  search_form.find("button.modal-list-candiates").each ->
    modal_button = $(this);
    if modal_button.val()
      modal = sidebar.find(".modal." + modal_button.val());
      modal.find(".actions button").click ->
        modal.find("form").submit()
        return false;
      modal_button.click -> 
        modal.find(".row.emails").html("");
        result_list = "";
        $(".checkbox input[name='email']:checked").each ->
          checkbox = $(this);
          result_list += checkbox.parent().find(".email-details").html();
        modal.find(".row.emails").html(result_list);
        modal.modal('show');
        return false;

  sidebar.find('.modal.createlist form').form({
    fields: {
      name: 'empty',
    }
  });

  # connected to remain disabled untill we reindex contects collection
  # uri = URI(window.location)
  # connected_to = uri.search(true).connected_to
  # if connected_to
  #  connected_to_dropdown.dropdown('set selected', connected_to.split(","));

