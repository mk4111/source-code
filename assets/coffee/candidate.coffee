$ ->

  if $(".container.candidate").length == 0 then return; # nothing to do here

  $(".container.candidate .action-buttons button").each ->
    button = $(this);
    if button.val()
      modal = button.parent().find(".modal." + button.val())
      button.click ->
        console.log button.val()
        if button.val() == "sendemail"
          modal.modal({autofocus: false}); # don't open anything by default here. too many options.
        modal.modal('show');
        return false;

  $(".container.candidate .action-buttons  button").each ->
    actionButtton = $(this)
    if actionButtton.hasClass "positive"
      setTimeout ->
        actionButtton.removeClass "positive"
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

  # add form and validation
  $('.modal.addsubmission form').form({
    fields: {
      clientId: 'empty',
      stageId: 'empty',
      jobId: 'empty'
    }
  });

  # append to list
  $('.modal.appendtolist form');
  $('.modal.appendtolist form .list-selection').dropdown();
  $('.modal.appendtolist form').form({
      fields: { id: 'empty', }
    });
  $('.modal.appendtolist .actions button.appendtolist').click ->
    $('.modal.appendtolist form').submit();


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