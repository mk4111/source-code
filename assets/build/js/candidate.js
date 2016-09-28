$(function() {
  if ($(".container.candidate").length === 0) {
    return;
  }
  $(".container.candidate .action-buttons button").each(function() {
    var button, modal;
    button = $(this);
    if (button.val()) {
      modal = button.parent().find(".modal." + button.val());
      return button.click(function() {
        modal.modal('show');
        return false;
      });
    }
  });
  $(".modal.sendemail").each(function() {
    var initial_message, modal;
    modal = $(this);
    initial_message = modal.find("textarea[name='message']").val();
    return modal.find(".actions button").click(function() {
      modal.find("form.sendmail").submit();
      modal.find("form.sendmail input[name='subject']").val("");
      return modal.find("form.sendmail input[name='message']").val(initial_message);
    });
  });
  $('.container.candidate .menu .item').tab();
  $('.modal.addsubmission .dropdown.stage').dropdown();
  $('.modal.addsubmission .dropdown.job').dropdown();
  $('.modal.addsubmission .dropdown.client').dropdown({
    'onChange': function(v) {
      $('.modal.addsubmission .dropdown.job div.item').hide();
      $('.modal.addsubmission .dropdown.job div.item.client-id-' + v).show();
      return $('.modal.addsubmission .dropdown.job').dropdown('clear');
    }
  });
  $('.modal.addsubmission form').form({
    fields: {
      clientId: 'empty',
      stageId: 'empty',
      jobId: 'empty'
    }
  });
  return $('.modal.addsubmission button[type="submit"]').click(function() {
    return $('.modal.addsubmission form').submit();
  });
});
