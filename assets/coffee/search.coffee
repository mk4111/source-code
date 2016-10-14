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

  saerch_form = sidebar.find("form");

  enable_search_option = () ->
    quick_search = true;
    saerch_form.find(".advance_search input").each ->
      if $(this).val()
        quick_search = false;
        return false; # break
    if quick_search
      saerch_form.find(".quick_search input").parent().removeClass "disabled"
    else
      saerch_form.find(".quick_search input").parent().addClass "disabled"

  saerch_form.find(".advance_search input").each ->
    $(this).keyup enable_search_option

  enable_search_option(); # check which for to enable

  saerch_form.find(".advance_search button.clear").click ->
    saerch_form.find(".advance_search input").each ->
      $(this).val "";
    enable_search_option()
    return false; # don't propagate

  connected_to_dropdown = $('.ui.dropdown.connected_to').dropdown {
    onChange: (f) -> 
      ;
  };

  button = sidebar.find("button.send_email");

  enable_email_button = () ->
    if $(".checkbox input[name='email']:checked").length then button.removeClass "disabled"
    else button.addClass "disabled"

  enable_email_button();
  $(".checkbox input[name='email']").change enable_email_button

  sidebar.find("button.select_all").click ->
    $(".checkbox input[name='email']").prop('checked', true);
    enable_email_button();
    $(this).focusout();
    $(this).blur();
    return false;

  if button.val()
    modal = sidebar.find(".modal." + button.val());
    modal.find(".actions button").click ->
      modal.find("form.sendmail").submit()
    button.click -> 
      modal.find("ul").html("");
      result_list = "";
      $(".checkbox input[name='email']:checked").each ->
        checkbox = $(this);
        result_list += checkbox.parent().find(".email-details").html();
      modal.find("ul").html(result_list);
      modal.modal('show');
      $(this).focusout();
      $(this).blur();
      return false;

  # connected to remain disabled untill we reindex contects collection
  # uri = URI(window.location)
  # connected_to = uri.search(true).connected_to
  # if connected_to
  #  connected_to_dropdown.dropdown('set selected', connected_to.split(","));


