$ ->
  $(".emails_job_progress").each ->
    progress_wrap = $(this);
    status = progress_wrap.find(".job_status").html();
    subject = progress_wrap.find(".job_subject").html();
    progress_wrap.find(".progress").progress({
      text: {
        active: '"' + subject + '", Status: ' + status.replace("_", " ") + ' ({value}/{total})'
      }
    });