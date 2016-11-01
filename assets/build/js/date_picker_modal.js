$(function() {
  return $(".button.datepicker").each(function() {
    var button, calendar_from, calendar_to, form, modal, reset_button, submit_button;
    button = $(this);
    modal = button.parent().find(".modal.datepicker");
    submit_button = modal.find(".actions button.select");
    reset_button = modal.find(".actions button.reset");
    form = modal.find("form");
    form.form({
      fields: {
        from: 'empty'
      }
    });
    submit_button.click(function() {
      return form.submit();
    });
    reset_button.click(function() {
      var uri;
      uri = URI(window.location.search);
      uri.removeSearch("from");
      uri.removeSearch("to");
      return window.location.search = uri;
    });
    calendar_from = form.find(".calendar.from");
    calendar_to = form.find(".calendar.to");
    return button.click(function() {
      modal.modal('show');
      calendar_from.calendar({
        type: 'month',
        format: 'YYYY-MM',
        endCalendar: calendar_to
      });
      return calendar_to.calendar({
        type: 'month',
        format: 'YYYY-MM',
        startCalendar: calendar_from
      });
    });
  });
});
