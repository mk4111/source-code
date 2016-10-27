$(function() {
  return $(".clients_jobs_dropdowns").each(function() {
    var dropdowns;
    dropdowns = $(this);
    dropdowns.find('.dropdown.job').dropdown();
    return dropdowns.find('.dropdown.client').dropdown({
      'onChange': function(v) {
        dropdowns.find('.dropdown.job div.item').hide();
        dropdowns.find('.dropdown.job div.item.client-id-' + v).show();
        return dropdowns.find('.dropdown.job').dropdown('clear');
      }
    });
  });
});
