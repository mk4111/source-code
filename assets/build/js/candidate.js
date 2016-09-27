$(function() {
  if ($(".container.candidate").length === 0) {
    return;
  }
  $(".container.candidate .action-buttons button").each(function() {
    var button, modal;
    button = $(this);
    if (button.val()) {
      modal = button.parent().find(".modal." + button.val());
      return button.click(function() {
        modal.modal('show');
        return false;
      });
    }
  });
  return $(".modal.send-email").each(function() {
    var initial_message, modal;
    modal = $(this);
    initial_message = modal.find("textarea[name='message']").val();
    return modal.find(".actions button").click(function() {
      modal.find("form.sendmail").submit();
      modal.find("form.sendmail input[name='subject']").val("");
      return modal.find("form.sendmail input[name='message']").val(initial_message);
    });
  });
});
