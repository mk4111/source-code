$ ->

  if $(".container.candidate").length == 0 then return; # nothing to do here

  $(".container.candidate .action-buttons button").each ->
    button = $(this);
    if button.val()
      modal = button.parent().find(".modal." + button.val())
      button.click ->
        modal.modal('show');
        return false;

  if $("form.log-call button").hasClass "positive"
    setTimeout ->
      $("form.log-call button").removeClass "positive"
    , 5000

  $(".modal.sendemail").each ->
    modal = $(this)
    initial_message = modal.find("textarea[name='message']").val();
    modal.find(".actions button").click ->
      modal.find("form.sendmail").submit();

  $('.container.candidate .top-row-tabs .menu .item').tab(
    history: true,
    historyType: 'hash'
    onVisible: (t) ->
      $("form").each ->
        $(this).find('input[name="redirect_url"]').val window.location.pathname + "#/" + t
  );
  $('.container.candidate .bottom-row-tabs .menu .item').tab(
    history: true,
    historyType: 'hash'
  );

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
  });

  $('.modal.addsubmission button[type="submit"]').click ->
    $('.modal.addsubmission form').submit();

  $(".container.candidate .tab.contact_details form.cv-upload #input-profile-resume").change ->
    if $(this).val()
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit']").removeClass "disabled"
      pathSegments = $(this).val().split("\\")
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit'] span.value").html "(" + pathSegments[pathSegments.length-1] + ")"
    else
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit']").addClass "disabled"
      $(".container.candidate .tab.contact_details form.cv-upload button[type='submit'] span.value").html ""