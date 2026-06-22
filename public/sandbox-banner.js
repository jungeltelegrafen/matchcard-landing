(function () {
  var style = document.createElement('style');
  style.textContent = [
    '#mc-sandbox-bar{',
      'position:fixed;top:0;left:0;right:0;z-index:9999;',
      'background:#1A1A2E;color:#C97B4B;',
      'display:flex;align-items:center;justify-content:center;gap:10px;',
      'padding:5px 16px;',
      'font:600 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;',
      'letter-spacing:.06em;text-transform:uppercase;',
    '}',
    '#mc-sandbox-bar a{color:#F5EFE6;text-decoration:none;opacity:.6;transition:opacity .15s}',
    '#mc-sandbox-bar a:hover{opacity:1}',
    'body{padding-top:28px!important}',
  ].join('');
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'mc-sandbox-bar';
  bar.innerHTML =
    '<span style="width:6px;height:6px;border-radius:50%;background:#C97B4B;flex-shrink:0"></span>' +
    'Sandbox prototype&ensp;&middot;&ensp;' +
    '<a href="https://matchcard.no" target="_blank" rel="noopener">matchcard.no ↗</a>';
  document.body.insertBefore(bar, document.body.firstChild);
})();
