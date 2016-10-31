$ ->

  ## assuming there is only one emial form on page, otherwise we need to extend the email validation
  modal = $(".modal.sendemail");
  modal.find(".ui.accordion").accordion({ 
    'onOpen': () ->
      modal.modal('refresh');
    });
    
  form = modal.find("form.sendmail")

  email_content = () =>
    content = form.find("textarea").val();
    # replace the template variables
    clientId = form.find(".dropdown.client").find("input[name='clientId']").val();
    jobId = form.find(".dropdown.job").find("input[name='jobId']").val();
    candidate_fullname = form.find(".template_content.candidatefullname").html();
    candidate_firstname = form.find(".template_content.candidatefirstname").html();

    if clientId
      content = content.replace('{{client.name}}', form.find(".template_content.clientname." + clientId).html());
    if jobId
      content = content.replace('{{job.title}}', form.find(".template_content.jobtitle." + jobId).html());
      content = content.replace('{{job.address.country}}', form.find(".template_content.jobaddresscountry." + jobId).html());
      content = content.replace('{{job.address.city}}', form.find(".template_content.jobaddresscity." + jobId).html());
      content = content.replace('{{job.employmenttype}}', form.find(".template_content.jobemploymenttype." + jobId).html());
    if candidate_fullname then content = content.replace('{{candidate.fullname}}', candidate_fullname);
    else content = content.replace('{{candidate.fullname}}', candidate_fullname);
    if candidate_firstname
      candidate_firstname = candidate_firstname.charAt(0).toUpperCase() + candidate_firstname.slice(1).toLowerCase(); # copied from backend
      content = content.replace('{{candidate.firstname}}', candidate_firstname);
    else
      content = content.replace('{{candidate.firstname}}', "[FULL NAME]");

    return content;

  $.fn.form.settings.rules.variables_defined = (value) =>
    content = email_content();
    return !content.match(/{{.*}}/)

  form.form({
    fields: {
      subject: {
        identifier: 'subject',
        rules: [
          {
            type: 'empty',
          }
        ]
      },
      message: {
        identifier: 'message',
        rules: [
          {
            type: 'empty',
          },
          {
            type: 'variables_defined[form]',
            prompt: 'Mesage: Some template\'s variables don\'t have defined values. Check preview to identify them'
          }
        ]
      },
    }
  });


  form.submit ->
    modal.modal('refresxh');

  form.find(".dropdown.template-selection").dropdown {
    onChange: (f) ->
      content = "";
      subject = "";
      if f then content = form.find(".template_content.content." + f).html();
      if f then subject = form.find(".template_content.subject." + f).html();
      form.find("textarea").html content ;
      form.find("input[name='subject']").val subject ;
  };

  ## preview mode
  modal.find(".menu .item").tab({
    onVisible: (t) ->
      # take the email content and process

      modal.find("pre.email_content").html email_content() ;
    });

