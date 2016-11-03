$(function() {
  return $("button.sourcewizard").each(function() {
    var wizard_button, wizard_form, wizard_modal;
    wizard_button = $(this);
    wizard_modal = wizard_button.parent().find(".modal.sourcewizard").modal({
      allowMultiple: true
    });
    wizard_form = wizard_modal.find("form.source");
    wizard_form.form({
      fields: {
        clientId: 'empty',
        jobId: 'empty',
        location: 'empty',
        skills: 'empty'
      }
    });
    wizard_form.submit(function() {
      return wizard_modal.modal('refresh');
    });
    wizard_modal.find(".actions button.source").click(function() {
      return wizard_form.submit();
    });
    return wizard_button.click(function() {
      return wizard_modal.modal('show');
    });
  });
});
