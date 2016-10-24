$(function() {
  var enable_submit, file_input, file_upload_label, form, name_input, sidebar, submit_button;
  if ($(".sidebar.crate-from-csv").length === 0) {
    return;
  }
  sidebar = $(".sidebar.crate-from-csv");
  form = sidebar.find("form");
  submit_button = form.find("button[type='submit']");
  name_input = form.find("input[name='name']");
  file_upload_label = form.find(".file-upload-label");
  form.form({
    fields: {
      name: 'empty',
      csv: 'empty'
    }
  });
  enable_submit = function() {
    if (name_input.val() && name_input.val().trim() && file_input.val()) {
      return submit_button.removeClass("disabled");
    } else {
      return submit_button.addClass("disabled");
    }
  };
  enable_submit();
  file_input = form.find("input[type='file']");
  file_input.change(function() {
    enable_submit();
    if ($(this).val()) {
      file_upload_label.find(".select").hide();
      file_upload_label.find(".upload").html(_.last($(this).val().split('\\')));
      return file_upload_label.find(".upload").show();
    } else {
      file_upload_label.find(".select").show();
      file_upload_label.find(".upload").html('');
      return file_upload_label.find(".upload").hide();
    }
  });
  return form.find("input[type='text'], textarea").keyup(enable_submit);
});
