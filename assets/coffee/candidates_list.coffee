$ ->
  # emails
  if $(".candidates-list").length == 0 then return; # nothing to do here
  
  $(".candidates-list .email-preview a").each ->
    modal = $(".candidates-list").find(".modal." + $(this).attr('id'));
    $(this).click ->
      modal.modal('show');
      return false;