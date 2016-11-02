$(function() {
  return $(".emails_job_progress").each(function() {
    var a_href, current_status, progress_wrap, progressbar, status, subject, update;
    progress_wrap = $(this);
    status = progress_wrap.find(".job_status").html();
    subject = progress_wrap.find(".job_subject").html();
    a_href = progress_wrap.find("a").attr('href');
    progressbar = progress_wrap.find(".progress");
    progressbar.progress({
      text: {
        active: '"' + subject + '", Status: ' + status.replace("_", " ") + ' ({value}/{total})'
      }
    });
    current_status = status;
    update = function() {
      return setTimeout(function() {
        return $.getJSON(a_href, function(d) {
          progress_wrap.find(".job_status").html(d.status);
          progressbar.progress('set progress', d.progress);
          if (d.status !== "completed") {
            update();
          }
          if (d.status === "completed" && d.progress !== d.schedulled_emails && current_status !== d.status) {
            return window.location.reload();
          }
        });
      }, 250);
    };
    return update();
  });
});
