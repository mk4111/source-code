$(function() {
  var container, file_input, file_upload_label, upload_form, upload_list_button, upload_modal;
  container = $("div.container.source-list");
  if (container.length === 0) {
    return;
  }
  container.find('.tabular.menu .item').tab({
    history: true,
    historyType: 'hash',
    onVisible: function(t) {}
  });
  container.find('.ui.segment.head i.edit, .ui.segment.actions button.createfolder').each(function() {
    var button, modal, modal_form;
    button = $(this);
    modal = button.parent().find(".modal");
    modal_form = modal.find("form");
    modal_form.form({
      fields: {
        name: 'empty'
      }
    });
    modal.find(".actions button.update").click(function() {
      modal.find("form").submit();
      return false;
    });
    return button.click(function() {
      return modal.modal('show');
    });
  });
  upload_list_button = container.find('.ui.segment.actions button.uploadlist');
  upload_modal = upload_list_button.parent().find(".modal");
  upload_form = upload_modal.find("form");
  upload_form.find(".dropdown.folder-selection").dropdown();
  upload_form.form({
    fields: {
      name: 'empty',
      csv: 'empty'
    }
  });
  file_input = upload_form.find("input[type='file']");
  file_upload_label = upload_form.find(".file-upload-label");
  file_input.change(function() {
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
  upload_modal.find(".actions button.upload").click(function() {
    upload_form.submit();
    return false;
  });
  return upload_list_button.click(function() {
    return upload_modal.modal('show');
  });
});
