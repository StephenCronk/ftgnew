(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;

  // Hero video: only downloaded when motion is welcome and data saver is off; otherwise the poster stays.
  var video = document.querySelector('[data-hero-video]');
  var toggle = document.querySelector('[data-hero-toggle]');
  if (video && !reduce && !saveData) {
    var source = video.querySelector('source');
    var userPaused = false;
    source.src = source.getAttribute('data-src');
    video.load();
    function play() { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    function sync() {
      var paused = video.paused;
      toggle.classList.toggle('is-paused', paused);
      toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    }
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      userPaused = !video.paused;
      if (userPaused) video.pause(); else play();
    });
    play();
    // Stop decoding while the hero is off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { if (!userPaused) play(); } else video.pause();
      }).observe(video);
    }
  }

  // Fade sections in as they scroll into view.
  var items = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('reveal-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
