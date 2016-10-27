$(function() {
  var container;
  container = $('.container.emails-list');
  if (container.length === 0) {
    return;
  }
  return container.find("a.create_email_template, button.create_email_template").each(function() {
    var button, create_email_template_confirm_button, create_email_template_form, create_email_template_modal;
    button = $(this);
    container = button.parent();
    create_email_template_modal = container.find('.modal.create_email_template');
    create_email_template_form = create_email_template_modal.find('form');
    create_email_template_confirm_button = create_email_template_modal.find('.actions button.confirm');
    create_email_template_form.form({
      fields: {
        name: 'empty',
        subject: 'empty',
        content: 'empty'
      }
    });
    create_email_template_modal.find(".ui.accordion").accordion({
      'onOpen': function() {
        return create_email_template_modal.modal('refresh');
      }
    });
    create_email_template_confirm_button.click(function() {
      create_email_template_form.submit();
      return create_email_template_modal.modal('refresh');
    });
    return button.click(function() {
      create_email_template_modal.modal('show');
      return false;
    });
  });
});
