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
      list_button.removeClass "disabled" ;
      deselect_button.removeClass "disabled" ;
      if $(".checkbox input[name='email']:not(:checked)").length
        select_button.removeClass "disabled" ;
      else
        select_button.addClass "disabled" ;
    else
      list_button.addClass "disabled" ;
      deselect_button.addClass "disabled" ;
      if $(".checkbox input[name='email']").length
        select_button.removeClass "disabled" ;

    if $(".not-blacklisted.email-checkbox .checkbox input[name='email']:checked").length
      email_button.removeClass "disabled" ;
    else
      email_button.addClass "disabled" ;

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
      # extra select mode option
      selectmode_form = modal.find("form.selectmode").submit (v) ->
        selected = selectmode_form.find("input[type='radio']:checked").val()
        modal.find(".appendtolist").hide(); 
        modal.find(".createlist").hide();
        modal.find(".selectmode").hide();
        modal.find("." + selected).show();
        return false;

      modal.find(".actions button").each ->
        $(this).click ->
          if $(this).val()
            modal.find("form." + $(this).val()).submit()
            return false;
      modal_button.click -> 
        modal.find(".row.emails").html("");
        result_list = "";
        checkbox_selector = ".email-checkbox .checkbox input[name='email']:checked";
        blacklist_selector = ":not(.not-blacklisted)" + checkbox_selector;
        if modal_button.val() && modal_button.val() == "sendemail"
          checkbox_selector = ".not-blacklisted" + checkbox_selector;
          blacklisted_lenght = $(blacklist_selector).length;
          if blacklisted_lenght
            modal.find(".segment.removed-emails .counter").html(blacklisted_lenght);
            modal.find(".segment.removed-emails").show();
            if blacklisted_lenght > 1
              modal.find(".segment.removed-emails .were").show()
              modal.find(".segment.removed-emails .was").hide()
            else
              modal.find(".segment.removed-emails .was").show()
              modal.find(".segment.removed-emails .were").hide()
          else
            modal.find(".segment.removed-emails").hide();

        # move all checkbox to modal now / not great but it's working
        $(checkbox_selector).each ->
          checkbox = $(this);
          result_list += checkbox.parent().find(".email-details").html();
        modal.find(".row.emails").each ->
          $(this).html(result_list);

        if modal_button.val() && modal_button.val() == "createlist"
          # prepare the wizzard path to go through
          modal.find(".selectmode").show();
          modal.find(".appendtolist").hide(); 
          modal.find(".createlist").hide();
        modal.modal('show');
        return false;

  sidebar.find('.modal.createlist form.createlist').form({
    fields: {
      name: 'empty',
    }
  });

  sidebar.find('.modal.createlist form.appendtolist .list-selection').dropdown();

  modal_countries = sidebar.find(".modal.countries").modal()
  modal_countries.find("form").submit ->
    search_form.find(".advance_search input[name='location']").val modal_countries.find("input[type='radio']:checked").val()
    modal_countries.modal('hide');
    enable_search_button();
    enable_search_option();
    return false;

  modal_countries.find(".actions .button").click ->
    search_form.find(".advance_search input[name='location']").val modal_countries.find("input[type='radio']:checked").val()
    modal_countries.modal('hide');

  search_form.find(".advance_search button.location").click ->
    modal_countries.modal('show');

  # connected to remain disabled untill we reindex contects collection
  # uri = URI(window.location)
  # connected_to = uri.search(true).connected_to
  # if connected_to
  #  connected_to_dropdown.dropdown('set selected', connected_to.split(","));

