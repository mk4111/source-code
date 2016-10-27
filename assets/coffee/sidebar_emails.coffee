$ ->
  sidebar = $('.ui.sidebar.emails');
  if sidebar.length == 0 then return; # nth to do here

  $("a.create_email_template, button.create_email_template").each ->
    button = $(this);
    container = button.parent();
    create_email_template_modal = container.find('.modal.create_email_template')
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
    'onOpen': () ->
        create_email_template_modal.modal('refresh');
    });
    create_email_template_confirm_button.click ->
      create_email_template_form.submit();
      create_email_template_modal.modal('refresh');

    button.click ->
      create_email_template_modal.modal('show');
      return false;