$ ->
  $("button.sourcewizard").each ->
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

    wizard_form.submit ->
        wizard_modal.modal('refresh');

    wizard_modal.find(".actions button.source").click ->
        wizard_form.submit();

    wizard_button.click ->
      wizard_modal.modal('show');