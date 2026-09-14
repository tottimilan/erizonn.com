(function () {
  window.__ezReady = true;

  var root = document.documentElement;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function motionAllowed() {
    return !motionQuery.matches && !root.classList.contains('motion-paused');
  }

  /* Navigation */
  var nav = document.querySelector('.nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function setMenu(open) {
    if (!toggle || !links) return;
    links.classList.toggle('active', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      setMenu(!links.classList.contains('active'));
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('active')) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (links.classList.contains('active') && nav && !nav.contains(e.target)) {
        setMenu(false);
      }
    });

    // Close when keyboard focus moves to something outside the nav, so the
    // open panel never covers the focused element.
    if (nav) {
      nav.addEventListener('focusout', function (e) {
        if (links.classList.contains('active') && e.relatedTarget && !nav.contains(e.relatedTarget)) {
          setMenu(false);
        }
      });
    }

    var desktop = window.matchMedia('(min-width: 861px)');
    var onDesktop = function (mq) { if (mq.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onDesktop);
  }

  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Pause / resume all decorative motion */
  var motionToggle = document.querySelector('[data-motion-toggle]');
  var motionLabel = motionToggle && motionToggle.querySelector('[data-motion-label]');

  function setPaused(paused, persist) {
    root.classList.toggle('motion-paused', paused);
    if (motionLabel) motionLabel.textContent = paused ? 'Reanudar animaciones' : 'Pausar animaciones';
    if (persist) {
      try { localStorage.setItem('ez-motion-paused', paused ? '1' : '0'); } catch (err) { /* storage unavailable */ }
    }
  }

  try {
    if (localStorage.getItem('ez-motion-paused') === '1') setPaused(true, false);
  } catch (err) { /* storage unavailable */ }

  if (motionToggle) {
    motionToggle.addEventListener('click', function () {
      setPaused(!root.classList.contains('motion-paused'), true);
    });
  }

  /* Rotating headline word */
  var rotator = document.querySelector('[data-rotator]');
  if (rotator) {
    var words = rotator.querySelectorAll('.rotator-word');
    var index = 0;
    if (words.length > 1) {
      setInterval(function () {
        if (document.hidden || !motionAllowed()) return;
        var current = words[index];
        index = (index + 1) % words.length;
        var next = words[index];
        current.classList.remove('is-active');
        current.classList.add('is-leaving');
        next.classList.remove('is-leaving');
        next.classList.add('is-active');
        setTimeout(function () { current.classList.remove('is-leaving'); }, 650);
      }, 2600);
    }
  }

  /* Spotlight tiles follow the pointer */
  if (finePointer) {
    document.querySelectorAll('.tile').forEach(function (tile) {
      tile.addEventListener('pointermove', function (e) {
        var r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* Subtle tilt on the hero mockups */
  var hero = document.querySelector('.hero');
  var visual = document.querySelector('.hero-visual-inner');
  if (hero && visual && finePointer) {
    var frame = null;
    var lastX = 0;
    var lastY = 0;

    hero.addEventListener('pointermove', function (e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (frame || !motionAllowed()) return;
      frame = requestAnimationFrame(function () {
        frame = null;
        var r = hero.getBoundingClientRect();
        visual.style.setProperty('--px', ((lastX - r.left) / r.width - 0.5).toFixed(3));
        visual.style.setProperty('--py', ((lastY - r.top) / r.height - 0.5).toFixed(3));
      });
    });

    hero.addEventListener('pointerleave', function () {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      visual.style.setProperty('--px', '0');
      visual.style.setProperty('--py', '0');
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (mq) { if (mq.matches) revealAll(); });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  reveals.forEach(function (el) { observer.observe(el); });
})();
