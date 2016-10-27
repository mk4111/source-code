$ ->

  $(".modal.sendemail").each ->
    modal = $(this);
    modal.find(".ui.accordion").accordion({ 
      'onOpen': () ->
        create_email_template_modal.modal('refresh');
      });
    
    modal.find("form.sendmail").each ->
      $(this).form({
        fields: {
          subject: 'empty',
          message: 'empty'
        }
      });

      $(this).submit ->
        modal.modal('refresh');

      $(this).find(".dropdown.template-selection").dropdown {
        onChange: (f) -> 
          console.log(f);
      };