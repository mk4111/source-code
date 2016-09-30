$(function() {
  if ($(".candidates-list").length === 0) {
    return;
  }
  return $(".candidates-list .email-preview a, .candidates-list .last-viewed-by a").each(function() {
    var modal;
    $(this).popup({
      hoverable: true,
      inline: true
    });
    modal = $(".candidates-list").find(".modal." + $(this).attr('id'));
    return $(this).click(function() {
      modal.modal('show');
      return false;
    });
  });
});
