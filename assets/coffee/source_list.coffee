$ ->
  
  container = $("div.container.source-list");
  if container.length == 0 then return;

  container.find('.tabular.menu .item').tab(
    history: true,
    historyType: 'hash'
    onVisible: (t) ->
      ;
  );

