$ ->
  # tooltip
  $(".buttons.stage-actions button").each ->
    $(this).popup({ 
      hoverable  : true,
      inline     : true
    });

  # stage actions
  $(".buttons.stage-actions > button").each ->
    button = $(this);
    modal = button.parent().find(".modal." + button.val());
    form = button.parent().find("form." + button.val());
    modal.find(".button.cancel").click ->
      modal.modal('close');
    modal.find(".button.action").click ->
      form.submit();
    
    button.click ->
      if button.hasClass("reject") || button.hasClass("delete")
        return modal.modal('show');
      form.submit();

