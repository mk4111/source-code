$(function() {
  var csv_form, enable_csv_submit, enable_folder_submit, file_input, file_upload_label, folder_form, folder_name_input, folder_submit_button, list_name_input, list_submit_button, sidebar;
  if ($(".sidebar.crate-from-csv").length === 0) {
    return;
  }
  sidebar = $(".sidebar.crate-from-csv");
  csv_form = sidebar.find("form.csv");
  list_submit_button = csv_form.find("button[type='submit']");
  list_name_input = csv_form.find("input[name='name']");
  file_upload_label = csv_form.find(".file-upload-label");
  csv_form.find(".dropdown.folder-selection").dropdown();
  csv_form.form({
    fields: {
      name: 'empty',
      csv: 'empty'
    }
  });
  enable_csv_submit = function() {
    if (list_name_input.val() && list_name_input.val().trim() && file_input.val()) {
      return list_submit_button.removeClass("disabled");
    } else {
      return list_submit_button.addClass("disabled");
    }
  };
  enable_csv_submit();
  file_input = csv_form.find("input[type='file']");
  file_input.change(function() {
    enable_csv_submit();
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
  csv_form.find("input[type='text'], textarea").keyup(enable_csv_submit);
  folder_form = sidebar.find("form.folder");
  folder_submit_button = folder_form.find("button[type='submit']");
  folder_name_input = folder_form.find("input[name='name']");
  folder_form.form({
    fields: {
      name: 'empty'
    }
  });
  enable_folder_submit = function() {
    if (folder_name_input.val() && folder_name_input.val().trim()) {
      return folder_submit_button.removeClass("disabled");
    } else {
      return folder_submit_button.addClass("disabled");
    }
  };
  enable_folder_submit();
  return folder_name_input.keyup(enable_folder_submit);
});
