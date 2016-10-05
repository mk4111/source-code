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
  $('.container.candidate .top-row-tabs .menu .item').tab({
    history: true,
    historyType: 'hash',
    onVisible: function(t) {
      console.log(t);
      return $("form").each(function() {
        return $(this).find('input[name="redirect_url"]').val(window.location.pathname + "#/" + t);
      });
    }
  });
  $('.container.candidate .bottom-row-tabs .menu .item').tab({
    history: true,
    historyType: 'hash'
  });
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
  $('.modal.addsubmission button[type="submit"]').click(function() {
    return $('.modal.addsubmission form').submit();
  });
  return $(".container.candidate .tab.contact_details form.cv-upload #input-profile-resume").change(function() {
    var pathSegments;
    if ($(this).val()) {
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit']").removeClass("disabled");
      pathSegments = $(this).val().split("\\");
      console.log(pathSegments);
      return $(".container.candidate .tab.contact_details form.cv-upload button[type='submit'] span.value").html("(" + pathSegments[pathSegments.length - 1] + ")");
    } else {
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit']").addClass("disabled");
      return $(".container.candidate .tab.contact_details form.cv-upload button[type='submit'] span.value").html("");
    }
  });
});
