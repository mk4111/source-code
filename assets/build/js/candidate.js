$(function() {
  if ($(".container.candidate").length === 0) {
    return;
  }
  return $(".container.candidate .action-buttons button").each(function() {
    var button, modal;
    button = $(this);
    if (button.val()) {
      modal = button.parent().find(".modal." + button.val());
      return button.click(function() {
        return modal.modal('show');
      });
    }
  });
});
