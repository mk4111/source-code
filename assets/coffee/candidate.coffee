$ ->

  if $(".container.candidate").length == 0 then return; # nothing to do here

  $(".container.candidate .action-buttons button").each ->
    button = $(this);
    if button.val()
        modal = button.parent().find(".modal." + button.val())
        button.click ->
            modal.modal('show');