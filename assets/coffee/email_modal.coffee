$ ->

  $(".modal.sendemail").each ->
    modal = $(this);
    modal.find(".ui.accordion").accordion({ 
      'onOpen': () ->
        create_email_template_modal.modal('refresh');
      });
    
    modal.find("form.sendmail").each ->
      form = $(this);
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
          html = "";
          if f then html = form.find(".template_content." + f).html();
          form.find("textarea").html html ;
      };