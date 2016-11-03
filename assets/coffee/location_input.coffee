$ ->
  $(".input.locationinput").each ->
    location_input = $(this)
    modal_countries = location_input.parent().parent().parent().parent().find(".modal.countries").modal({ allowMultiple: true });
    modal_countries.find("form").submit ->
      location_input.find("input[name='location']").val modal_countries.find("input[type='radio']:checked").val()
      modal_countries.modal('hide');
      return false;

    modal_countries.find(".actions .button").click ->
      location_input.find("input[name='location']").val modal_countries.find("input[type='radio']:checked").val()
      location_input.find("input[name='location']").change();
      modal_countries.modal('hide');


    location_input.find("button.location").click ->
      modal_countries.modal('show');
