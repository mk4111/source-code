$(function() {
  var container;
  container = $("div.container.source-list");
  if (container.length === 0) {
    return;
  }
  container.find('.tabular.menu .item').tab({
    history: true,
    historyType: 'hash',
    onVisible: function(t) {}
  });
  return container.find('.ui.segment.head i.edit').each(function() {
    var button, modal, modal_form;
    button = $(this);
    modal = button.parent().find(".modal.edit-folder");
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
});
