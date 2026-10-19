(function () {
  var root = document.documentElement;

  // ----- Theme toggle -----
  var themeBtn = document.getElementById('themeToggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function syncThemeIcon() {
    themeBtn.innerHTML = isDark() ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeIcon();
  });
  syncThemeIcon();

  // ----- Mobile menu -----
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');
  function setMenu(open) {
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  }
  burger.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  // ----- Nav border on scroll -----
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Footer year -----
  document.getElementById('year').textContent = new Date().getFullYear();

  if (!('IntersectionObserver' in window)) {
    root.classList.add('no-js');
    return;
  }

  // ----- Reveal on scroll -----
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

  // ----- Count-up stats -----
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
      countObs.unobserve(el);
      if (reduce) { el.textContent = target + suffix; return; }
      var start = null, dur = 1100;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });

  // ----- Active nav link -----
  var navLinks = Array.prototype.slice.call(links.querySelectorAll('a'));
  var spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(function (a) {
    var sec = document.querySelector(a.getAttribute('href'));
    if (sec) spyObs.observe(sec);
  });
})();
