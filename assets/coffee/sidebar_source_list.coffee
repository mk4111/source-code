$ -> 

  sidebar = $('.ui.sidebar.source-list');
  if sidebar.length == 0 then return;

  list_edit_form = sidebar.find("form.list-edit");
  folder_dropdown = list_edit_form.find(".dropdown.folder-selection");
  selected_folder = list_edit_form.find("input[name='current_folder']");
  folder_dropdown.dropdown('set selected', selected_folder.val());

  list_edit_form.form({
    fields: {
      name: 'empty',
    }
  });