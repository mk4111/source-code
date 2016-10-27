$(function() {
  return $(".modal.sendemail").each(function() {
    var modal;
    modal = $(this);
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
