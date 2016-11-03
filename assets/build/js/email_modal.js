$(function() {
  var email_content, form, modal;
  modal = $(".modal.sendemail");
  modal.find(".ui.accordion").accordion({
    'onOpen': function() {
      return modal.modal('refresh');
    }
  });
  form = modal.find("form.sendmail");
  email_content = (function(_this) {
    return function() {
      var candidate_firstname, candidate_fullname, clientId, content, jobId;
      content = form.find("textarea").val();
      clientId = form.find(".dropdown.client").find("input[name='clientId']").val();
      jobId = form.find(".dropdown.job").find("input[name='jobId']").val();
      candidate_fullname = form.find(".template_content.candidatefullname").html();
      candidate_firstname = form.find(".template_content.candidatefirstname").html();
      if (clientId) {
        content = content.replace('{{client.name}}', form.find(".template_content.clientname." + clientId).html());
      }
      if (jobId) {
        content = content.replace('{{job.title}}', form.find(".template_content.jobtitle." + jobId).html());
        content = content.replace('{{job.address.country}}', form.find(".template_content.jobaddresscountry." + jobId).html());
        content = content.replace('{{job.address.city}}', form.find(".template_content.jobaddresscity." + jobId).html());
        content = content.replace('{{job.employmenttype}}', form.find(".template_content.jobemploymenttype." + jobId).html());
      }
      if (candidate_firstname) {
        candidate_firstname = candidate_firstname.charAt(0).toUpperCase() + candidate_firstname.slice(1).toLowerCase();
        content = content.replace('{{candidate.firstname}}', candidate_firstname);
      } else {
        content = content.replace('{{candidate.firstname}}', "[FIRST NAME]");
      }
      if (candidate_fullname) {
        content = content.replace('{{candidate.firstname}}', candidate_fullname);
      } else {
        content = content.replace('{{candidate.firstname}}', "[FULL NAME]");
      }
      return content;
    };
  })(this);
  $.fn.form.settings.rules.variables_defined = (function(_this) {
    return function(value) {
      var content;
      content = email_content();
      return !content.match(/{{.*}}/);
    };
  })(this);
  form.form({
    fields: {
      subject: {
        identifier: 'subject',
        rules: [
          {
            type: 'empty'
          }
        ]
      },
      message: {
        identifier: 'message',
        rules: [
          {
            type: 'empty'
          }, {
            type: 'variables_defined[form]',
            prompt: 'Mesage: Some template\'s variables don\'t have defined values. Check preview to identify them'
          }
        ]
      }
    }
  });
  form.submit(function() {
    return modal.modal('refresxh');
  });
  form.find(".dropdown.template-selection").dropdown({
    onChange: function(f) {
      var content, subject;
      content = "";
      subject = "";
      if (f) {
        content = form.find(".template_content.content." + f).html();
      }
      if (f) {
        subject = form.find(".template_content.subject." + f).html();
      }
      form.find("textarea").html(content);
      return form.find("input[name='subject']").val(subject);
    }
  });
  return modal.find(".menu .item").tab({
    onVisible: function(t) {
      return modal.find("pre.email_content").html(email_content());
    }
  });
});
