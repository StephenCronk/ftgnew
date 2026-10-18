// Shared interactive components: before/after sliders, tabs, accordions, lazy YouTube, counters.
(function () {
  // Before / after
  document.querySelectorAll('[data-ba]').forEach(function (el) {
    var range = el.querySelector('.ba__range');
    function set(v) { el.style.setProperty('--pos', v + '%'); }
    range.addEventListener('input', function () { set(range.value); });
  });

  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = root.querySelectorAll('[role="tab"]');
    var panels = root.querySelectorAll('[role="tabpanel"]');
    function activate(idx) {
      tabs.forEach(function (t, j) { var on = j === idx; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach(function (p, j) { var on = j === idx; p.classList.toggle('is-active', on); p.hidden = !on; });
    }
    tabs.forEach(function (t, idx) {
      t.addEventListener('click', function () { activate(idx); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); tabs[(idx + 1) % tabs.length].focus(); activate((idx + 1) % tabs.length); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); tabs[(idx - 1 + tabs.length) % tabs.length].focus(); activate((idx - 1 + tabs.length) % tabs.length); }
      });
    });
  });

  // Accordions: [data-accordion] > .acc__item > button.acc__trigger + .acc__panel
  document.querySelectorAll('[data-accordion]').forEach(function (root) {
    var single = root.hasAttribute('data-accordion-single');
    root.querySelectorAll('.acc__trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc__item'), open = item.classList.contains('is-open');
        if (single) root.querySelectorAll('.acc__item.is-open').forEach(function (o) { o.classList.remove('is-open'); o.querySelector('.acc__trigger').setAttribute('aria-expanded', 'false'); });
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  });

  // Lazy YouTube
  document.querySelectorAll('[data-video]').forEach(function (box) {
    box.querySelector('.video__play').addEventListener('click', function () {
      var id = box.getAttribute('data-video');
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = 'YouTube video'; f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'; f.allowFullscreen = true;
      box.innerHTML = ''; box.appendChild(f);
    });
  });

  // Count-up numbers: <span data-count="1849">0</span>, shown with thousands separators
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = parseInt(el.getAttribute('data-count'), 10), t0 = null, dur = 2000;
        io.unobserve(el);
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { c.textContent = '0'; io.observe(c); });
  } else { counters.forEach(function (c) { c.textContent = fmt(c.getAttribute('data-count')); }); }

  // Read more / collapse: button[data-readmore="#id"]
  document.querySelectorAll('[data-readmore]').forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute('data-readmore'));
    btn.addEventListener('click', function () {
      var open = target.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.readmore__label').textContent = open ? btn.getAttribute('data-less') || 'Collapse' : btn.getAttribute('data-more') || 'Read More';
    });
  });
})();

// Carousel: [data-carousel data-cols data-scroll] > .carousel__viewport > .carousel__track > .carousel__slide
(function () {
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = root.querySelector('.carousel__dots');
    var prev = root.querySelector('.carousel__arrow--prev'), next = root.querySelector('.carousel__arrow--next');
    var colsDesktop = parseInt(root.getAttribute('data-cols') || '2', 10);
    var scrollBy = parseInt(root.getAttribute('data-scroll') || '1', 10);
    var index = 0, cols = colsDesktop, pages = 1;

    function layout() {
      cols = window.innerWidth <= 767 ? 1 : colsDesktop;
      root.style.setProperty('--cols', cols);
      var step = Math.min(scrollBy, cols);
      pages = Math.max(1, Math.ceil((slides.length - cols) / step) + 1);
      if (index > pages - 1) index = pages - 1;
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'carousel__dot' + (i === index ? ' is-active' : ''); b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        (function (n) { b.addEventListener('click', function () { go(n); }); })(i);
        dotsWrap.appendChild(b);
      }
      root.classList.toggle('carousel--static', slides.length <= cols);
      go(index);
    }
    function go(n) {
      var step = Math.min(scrollBy, cols);
      index = (n + pages) % pages;
      var first = Math.min(index * step, Math.max(0, slides.length - cols));
      track.style.transform = 'translateX(' + (-first * (100 / cols)) + '%)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.classList.toggle('is-active', i === index); });
    }
    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });
    window.addEventListener('resize', layout);
    layout();
  });
})();
