$(function() {
  var folder_dropdown, list_edit_form, selected_folder, sidebar;
  sidebar = $('.ui.sidebar.source-list');
  if (sidebar.length === 0) {
    return;
  }
  list_edit_form = sidebar.find("form.list-edit");
  folder_dropdown = list_edit_form.find(".dropdown.folder-selection");
  selected_folder = list_edit_form.find("input[name='current_folder']");
  return folder_dropdown.dropdown('set selected', selected_folder.val());
});
