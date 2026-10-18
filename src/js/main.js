// Global behaviour: mobile menu, cookie bar. Page-specific scripts live in js/pages/.
(function () {
  var toggle = document.querySelector('.site-header__toggle');
  var header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  var bar = document.getElementById('cookie-bar');
  var accept = document.getElementById('cookie-accept');
  var KEY = 'ftg-cookie-accepted';
  var seen = false;
  try { seen = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (bar && !seen) bar.hidden = false;
  if (accept) accept.addEventListener('click', function () {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    bar.hidden = true;
  });
})();
