// Global behaviour: mobile menu, header scroll state, cookie bar. Page-specific scripts live in js/pages/.
(function () {
  var toggle = document.querySelector('.site-header__toggle');
  var header = document.querySelector('.site-header');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Shadow once the page moves; on Home this also turns the see-through header solid.
    var scrolled = false;
    function onScroll() {
      var s = window.scrollY > 40;
      if (s !== scrolled) { scrolled = s; header.classList.toggle('is-scrolled', s); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
