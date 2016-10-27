$ ->

  $(".clients_jobs_dropdowns").each ->
    dropdowns = $(this);
    dropdowns.find('.dropdown.job').dropdown();
    dropdowns.find('.dropdown.client').dropdown({
      'onChange': (v) ->
        dropdowns.find('.dropdown.job div.item').hide();
        dropdowns.find('.dropdown.job div.item.client-id-' + v).show();
        dropdowns.find('.dropdown.job').dropdown('clear');
    });