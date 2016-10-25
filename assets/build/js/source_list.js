$(function() {
  var container;
  container = $("div.container.source-list");
  if (container.length === 0) {
    return;
  }
  return container.find('.tabular.menu .item').tab({
    history: true,
    historyType: 'hash',
    onVisible: function(t) {}
  });
});
