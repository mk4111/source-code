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
        console.log(button.val());
        if (button.val() === "sendemail") {
          modal.modal({
            autofocus: false
          });
        }
        modal.modal('show');
        return false;
      });
    }
  });
  $(".container.candidate .action-buttons  button").each(function() {
    var actionButtton;
    actionButtton = $(this);
    if (actionButtton.hasClass("positive")) {
      return setTimeout(function() {
        return actionButtton.removeClass("positive");
      }, 5000);
    }
  });
  $(".modal.sendemail").each(function() {
    var initial_message, modal;
    modal = $(this);
    initial_message = modal.find("textarea[name='message']").val();
    return modal.find(".actions button").click(function() {
      return modal.find("form.sendmail").submit();
    });
  });
  $('.container.candidate .top-row-tabs .menu .item').tab({
    history: true,
    historyType: 'hash',
    onVisible: function(t) {
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
  $('.modal.addsubmission form').form({
    fields: {
      clientId: 'empty',
      stageId: 'empty',
      jobId: 'empty'
    }
  });
  $('.modal.appendtolist form');
  $('.modal.appendtolist form .list-selection').dropdown();
  $('.modal.appendtolist form').form({
    fields: {
      id: 'empty'
    }
  });
  $('.modal.appendtolist .actions button.appendtolist').click(function() {
    return $('.modal.appendtolist form').submit();
  });
  $('.modal.addsubmission button[type="submit"]').click(function() {
    return $('.modal.addsubmission form').submit();
  });
  return $(".container.candidate .tab.contact_details form.cv-upload #input-profile-resume").change(function() {
    var pathSegments;
    if ($(this).val()) {
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit']").removeClass("disabled");
      pathSegments = $(this).val().split("\\");
      return $(".container.candidate .tab.contact_details form.cv-upload button[type='submit'] span.value").html("(" + pathSegments[pathSegments.length - 1] + ")");
    } else {
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit']").addClass("disabled");
      return $(".container.candidate .tab.contact_details form.cv-upload button[type='submit'] span.value").html("");
    }
  });
});
