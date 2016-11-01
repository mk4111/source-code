$ ->

  $(".button.datepicker").each ->
    button = $(this);
    modal = button.parent().find(".modal.datepicker");
    submit_button = modal.find(".actions button.select");
    reset_button = modal.find(".actions button.reset");

    form = modal.find("form");
    form.form({
      fields: {
        from: 'empty',
      }
    });

    submit_button.click ->
      form.submit();

    reset_button.click ->
      uri = URI window.location.search;
      uri.removeSearch("from");
      uri.removeSearch("to");
      window.location.search = uri;

    calendar_from = form.find(".calendar.from");
    calendar_to = form.find(".calendar.to");
    button.click ->
      modal.modal('show');
      calendar_from.calendar({
        type: 'month',
        format: 'YYYY-MM',
        endCalendar: calendar_to
      });
      calendar_to.calendar({
        type: 'month',
        format: 'YYYY-MM',
        startCalendar: calendar_from
      });