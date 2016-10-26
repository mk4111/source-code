$ ->
  
  container = $("div.container.source-list");
  if container.length == 0 then return;

  container.find('.tabular.menu .item').tab(
    history: true,
    historyType: 'hash'
    onVisible: (t) ->
      ;
  );

  container.find('.ui.segment.head i.edit').each ->
    button = $(this)
    modal = button.parent().find(".modal.edit-folder")
    modal_form = modal.find("form");
    modal_form.form({ fields: { name: 'empty', } });
    modal.find(".actions button.update").click ->
        modal.find("form").submit();
        return false;
    
    button.click ->
        modal.modal('show');
