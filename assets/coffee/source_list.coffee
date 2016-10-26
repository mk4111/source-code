$ ->
  
  container = $("div.container.source-list");
  if container.length == 0 then return;

  container.find('.tabular.menu .item').tab(
    history: true,
    historyType: 'hash'
    onVisible: (t) ->
      ;
  );

  # edit / add folders
  container.find('.ui.segment.head i.edit, .ui.segment.actions button.createfolder').each ->
    button = $(this)
    modal = button.parent().find(".modal")
    modal_form = modal.find("form");
    modal_form.form({ fields: { name: 'empty', } });
    modal.find(".actions button.update").click ->
        modal.find("form").submit();
        return false;
    button.click ->
        modal.modal('show');

  # upload csv form
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

  file_input.change ->
    if $(this).val()
      file_upload_label.find(".select").hide();
      file_upload_label.find(".upload").html _.last($(this).val().split('\\')) ;
      file_upload_label.find(".upload").show();
    else
      file_upload_label.find(".select").show();
      file_upload_label.find(".upload").html '' ;
      file_upload_label.find(".upload").hide();


  upload_modal.find(".actions button.upload").click ->
    upload_form.submit();
    return false;

  upload_list_button.click ->
    upload_modal.modal('show');

