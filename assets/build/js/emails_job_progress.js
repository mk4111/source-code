$(function() {
  return $(".emails_job_progress").each(function() {
    var progress_wrap, status, subject;
    progress_wrap = $(this);
    status = progress_wrap.find(".job_status").html();
    subject = progress_wrap.find(".job_subject").html();
    return progress_wrap.find(".progress").progress({
      text: {
        active: '"' + subject + '", Status: ' + status.replace("_", " ") + ' ({value}/{total})'
      }
    });
  });
});
