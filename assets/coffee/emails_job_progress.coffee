$ ->
  $(".emails_job_progress").each ->
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

    update = () ->
      setTimeout () ->
        $.getJSON a_href, (d) ->
          progress_wrap.find(".job_status").html d.status ;
          progressbar.progress 'set progress', d.progress ;
          if d.status != "completed" then update()
          if d.status == "completed" && d.progress != d.schedulled_emails && current_status != d.status then window.location.reload();
      , 250

    update();