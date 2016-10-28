$(function() {
  return $(".modal.sendemail").each(function() {
    var modal;
    modal = $(this);
    modal.find(".ui.accordion").accordion({
      'onOpen': function() {
        return create_email_template_modal.modal('refresh');
      }
    });
    return modal.find("form.sendmail").each(function() {
      var form;
      form = $(this);
      $(this).form({
        fields: {
          subject: 'empty',
          message: 'empty'
        }
      });
      $(this).submit(function() {
        return modal.modal('refresh');
      });
      return $(this).find(".dropdown.template-selection").dropdown({
        onChange: function(f) {
          var html;
          html = "";
          if (f) {
            html = form.find(".template_content." + f).html();
          }
          return form.find("textarea").html(html);
        }
      });
    });
  });
});
