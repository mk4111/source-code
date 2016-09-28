$ ->

  if $(".container.candidate").length == 0 then return; # nothing to do here

  $(".container.candidate .action-buttons button").each ->
    button = $(this);
    if button.val()
      modal = button.parent().find(".modal." + button.val())
      button.click ->
        modal.modal('show');
        return false;

  $(".modal.sendemail").each ->
    modal = $(this)
    initial_message = modal.find("textarea[name='message']").val();
    modal.find(".actions button").click ->
      modal.find("form.sendmail").submit()
      modal.find("form.sendmail input[name='subject']").val("");
      modal.find("form.sendmail input[name='message']").val(initial_message);

  $('.container.candidate .menu .item').tab();

  # add submission dropdown
  $('.modal.addsubmission .dropdown.stage').dropdown();
  $('.modal.addsubmission .dropdown.job').dropdown();
  $('.modal.addsubmission .dropdown.client').dropdown({
    'onChange': (v) ->
      $('.modal.addsubmission .dropdown.job div.item').hide();
      $('.modal.addsubmission .dropdown.job div.item.client-id-' + v).show();
      $('.modal.addsubmission .dropdown.job').dropdown('clear');
    });

  # add form and validation
  $('.modal.addsubmission form').form({
    fields: {
      clientId: 'empty',
      stageId: 'empty',
      jobId: 'empty'
    }
  })

  $('.modal.addsubmission button[type="submit"]').click ->
    $('.modal.addsubmission form').submit();
