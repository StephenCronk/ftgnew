// Preview-only theme picker. The inline script in the page head applies a saved theme before first paint;
// this file wires up the floating panel. The first theme (Harbour) is the site's own styling.
(function () {
  var root = document.querySelector('[data-theme-picker]');
  if (!root) return;
  var tab = root.querySelector('.theme-picker__tab');
  var panel = root.querySelector('.theme-picker__panel');
  var options = root.querySelectorAll('[data-theme-option]');
  var KEY = 'ftg-theme';

  function setOpen(open) {
    panel.hidden = !open;
    tab.setAttribute('aria-expanded', String(open));
  }
  function current() { return document.documentElement.getAttribute('data-theme') || options[0].getAttribute('data-theme-option'); }
  function sync() {
    var id = current();
    options.forEach(function (o) { o.setAttribute('aria-pressed', String(o.getAttribute('data-theme-option') === id)); });
  }

  tab.addEventListener('click', function () { setOpen(panel.hidden); });
  options.forEach(function (o, i) {
    o.addEventListener('click', function () {
      var id = o.getAttribute('data-theme-option');
      window.ftgApplyTheme(i === 0 ? '' : id);
      try { if (i === 0) localStorage.removeItem(KEY); else localStorage.setItem(KEY, id); } catch (e) {}
      sync();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { setOpen(false); tab.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !root.contains(e.target)) setOpen(false);
  });
  sync();
})();
