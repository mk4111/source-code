$ ->

  if $(".container.candidate").length == 0 then return; # nothing to do here

  $(".container.candidate .action-buttons button").each ->
    button = $(this);
    if button.val()
      modal = button.parent().find(".modal." + button.val())
      button.click ->
        modal.modal('show');
        return false;

  $(".modal.send-email").each ->
    modal = $(this)
    initial_message = modal.find("textarea[name='message']").val();
    modal.find(".actions button").click ->
      modal.find("form.sendmail").submit()
      modal.find("form.sendmail input[name='subject']").val("");
      modal.find("form.sendmail input[name='message']").val(initial_message);
