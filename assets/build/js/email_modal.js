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
          return console.log(f);
        }
      });
    });
  });
});
