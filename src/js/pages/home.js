(function () {
  // Hero slider (fade, autoplay 8s, loop)
  var track = document.querySelector('[data-slider]');
  if (track) {
    var slides = track.querySelectorAll('.hero__slide');
    var i = 0, timer;
    function go(n) { slides[i].classList.remove('is-active'); i = (n + slides.length) % slides.length; slides[i].classList.add('is-active'); }
    function start() { timer = setInterval(function () { go(i + 1); }, 8000); }
    document.querySelector('[data-slider-prev]').addEventListener('click', function () { go(i - 1); clearInterval(timer); start(); });
    document.querySelector('[data-slider-next]').addEventListener('click', function () { go(i + 1); clearInterval(timer); start(); });
    track.parentNode.addEventListener('mouseenter', function () { clearInterval(timer); });
    track.parentNode.addEventListener('mouseleave', start);
    start();
  }

  // Instagram "Load More": all fetched posts are already in the grid, so send people to the profile.
  var more = document.querySelector('[data-insta-more]');
  if (more) more.addEventListener('click', function () { window.open('https://www.instagram.com/fillingthegapdental/', '_blank', 'noopener'); });
})();
