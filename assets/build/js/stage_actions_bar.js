$(function() {
  $(".buttons.stage-actions button").each(function() {
    return $(this).popup({
      hoverable: true,
      inline: true
    });
  });
  return $(".buttons.stage-actions > button").each(function() {
    var button, form, modal;
    button = $(this);
    modal = button.parent().find(".modal." + button.val());
    form = button.parent().find("form." + button.val());
    modal.find(".button.cancel").click(function() {
      return modal.modal('close');
    });
    modal.find(".button.action").click(function() {
      return form.submit();
    });
    return button.click(function() {
      if (button.hasClass("reject") || button.hasClass("delete")) {
        return modal.modal('show');
      }
      return form.submit();
    });
  });
});
