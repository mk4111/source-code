$(function() {
  return $(".lists_progress").each(function() {
    var a_href, current_status, progress_wrap, progressbar, status, subject, update;
    progress_wrap = $(this);
    status = progress_wrap.find(".job_status").html();
    subject = progress_wrap.find(".job_subject").html();
    a_href = progress_wrap.find(".job_id").html();
    progressbar = progress_wrap.find(".progress");
    console.log(progressbar);
    progressbar.progress({
      text: {
        active: '"' + subject + '", Status: ' + status.replace("_", " ") + ' ({value}/{total})'
      }
    });
    current_status = status;
    update = function() {
      return setTimeout(function() {
        console.log('/source/result/' + a_href);
        return $.getJSON('/source/result/' + a_href, function(d) {
          progress_wrap.find(".job_status").html(d.status);
          progressbar.progress('set progress', d.progress);
          if (d.status !== "completed") {
            update();
          }
          if (d.status === "completed") {
            return window.location.reload();
          }
        });
      }, 250);
    };
    return update();
  });
});
