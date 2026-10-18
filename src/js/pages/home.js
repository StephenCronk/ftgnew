(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var hasIO = 'IntersectionObserver' in window;

  // Background videos (hero, banner): only downloaded when motion is welcome and data saver is off,
  // otherwise the poster stays. Each loads as it nears the viewport and pauses off screen.
  if (!reduce && !saveData) {
    document.querySelectorAll('[data-bg-video]').forEach(function (video) {
      var source = video.querySelector('source');
      var toggle = video.closest('section').querySelector('[data-video-toggle]');
      var userPaused = false;
      function play() {
        if (!source.src) { source.src = source.getAttribute('data-src'); video.load(); }
        var p = video.play(); if (p && p.catch) p.catch(function () {});
      }
      function sync() {
        toggle.classList.toggle('is-paused', video.paused);
        toggle.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
      }
      video.addEventListener('play', sync);
      video.addEventListener('pause', sync);
      toggle.hidden = false;
      toggle.addEventListener('click', function () {
        userPaused = !video.paused;
        if (userPaused) video.pause(); else play();
      });
      if (!hasIO) { play(); return; }
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { if (!userPaused) play(); } else if (!video.paused) video.pause();
      }, { rootMargin: '200px 0px' }).observe(video);
    });
  }

  // Mission logo: builds itself when the whole logo is on screen, then again every 30 seconds.
  // A replay that falls due while the logo is out of view waits until it is fully back.
  var logo = document.querySelector('[data-logo-anim]');
  if (logo && !reduce && hasIO) {
    var inView = false, due = true;
    function playLogo() {
      due = false;
      logo.classList.remove('is-playing');
      logo.getBoundingClientRect(); // restart the CSS animations
      logo.classList.add('is-playing');
      setTimeout(function () { due = true; if (inView) playLogo(); }, 30000);
    }
    logo.classList.add('is-armed');
    new IntersectionObserver(function (entries) {
      inView = entries[0].intersectionRatio >= 0.98;
      if (inView && due) playLogo();
    }, { threshold: 0.98 }).observe(logo);
  }

  // Parallax: the banner's video drifts slower than the page.
  var banner = document.querySelector('[data-parallax]');
  if (banner && !reduce) {
    var media = banner.querySelector('.pbanner__media');
    var ticking = false;
    function update() {
      ticking = false;
      var r = banner.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      media.style.transform = 'translate3d(0,' + (p * r.height * 0.25).toFixed(1) + 'px,0)';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
