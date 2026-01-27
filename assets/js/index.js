// script.js (FULL CLEAN VERSION - copy/paste everything)

document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Hamburger toggle
  // =========================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    const toggleMenu = () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Keyboard support (Enter / Space)
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // Close menu when clicking a link (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      const clickedInsideNav = navMenu.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      if (!clickedInsideNav && !clickedHamburger && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // =========================
  // Navbar shadow on scroll
  // =========================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 50 ? '0 14px 30px rgba(0,0,0,0.08)' : 'none';
  });

  // =========================
  // Feature hover animations (safe)
  // =========================
  const features = document.querySelectorAll('.feature-item');
  features.forEach(f => {
    f.addEventListener('mouseenter', () => {
      f.style.transform = 'translateY(-5px)';
      f.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    });
    f.addEventListener('mouseleave', () => {
      f.style.transform = 'translateY(0)';
      f.style.boxShadow = 'none';
    });

    f.addEventListener('touchstart', () => {
      f.style.transform = 'translateY(-3px)';
      f.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
    }, { passive: true });

    f.addEventListener('touchend', () => {
      f.style.transform = 'translateY(0)';
      f.style.boxShadow = 'none';
    }, { passive: true });
  });

  // =========================
  // HERO PRO SLIDER (NO RADIO, smooth, buttons work)
  // =========================
  const root = document.getElementById('heroPro');
  if (!root) return;

  const track = root.querySelector('.hero-track');
  const slides = Array.from(root.querySelectorAll('.hero-panel'));
  const prevBtn = root.querySelector('.hero-prev');
  const nextBtn = root.querySelector('.hero-next');
  const bar = root.querySelector('.hero-progress-bar');

  if (!track || slides.length === 0) return;

  const total = slides.length;
  let index = 0;

  // ✅ Calm timing (readable, not sluggish)
  const DURATION = 5200; // how long each slide stays (ms)

  // Autoplay timer id
  let timer = null;

  // For pausing/resuming progress line correctly
  let startTime = 0;
  let remaining = DURATION;
  let isPaused = false;

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fill slide counters (01/05 ...). Current is per-slide, total same for all.
  slides.forEach((s, i) => {
    const cur = s.querySelector('.hero-counter .current');
    const tot = s.querySelector('.hero-counter .total');
    if (cur) cur.textContent = String(i + 1).padStart(2, '0');
    if (tot) tot.textContent = String(total).padStart(2, '0');
  });

  const setProgress = (ms) => {
    if (!bar) return;

    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.offsetHeight; // reflow

    bar.style.transition = `width ${ms}ms linear`;
    bar.style.width = '100%';
  };

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const scheduleNext = (ms) => {
    clearTimer();
    startTime = performance.now();
    remaining = ms;

    setProgress(ms);

    timer = setTimeout(() => {
      if (isPaused) return;

      index = (index + 1) % total;
      slides.forEach((s, idx) => s.classList.toggle('is-active', idx === index));
      track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;

      restartCycle(DURATION);
    }, ms);
  };

  const restartCycle = (ms) => {
    if (prefersReducedMotion()) {
      clearTimer();
      if (bar) {
        bar.style.transition = 'none';
        bar.style.width = '35%';
        bar.style.opacity = '0.55';
      }
      return;
    }
    isPaused = false;
    scheduleNext(ms);
  };

  const goTo = (i, { animate = true } = {}) => {
    index = (i + total) % total;

    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === index));

    if (!animate) track.style.transition = 'none';
    track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
    if (!animate) {
      track.offsetHeight;
      track.style.transition = '';
    }

    restartCycle(DURATION);
  };

  const pause = () => {
    if (isPaused) return;
    isPaused = true;

    const elapsed = performance.now() - startTime;
    remaining = Math.max(0, remaining - elapsed);

    // Freeze bar at current width (stable)
    if (bar) {
      const w = getComputedStyle(bar).width;
      bar.style.transition = 'none';
      bar.style.width = w;
    }

    clearTimer();
  };

  const resume = () => {
    if (!isPaused) return;
    if (prefersReducedMotion()) return;

    isPaused = false;
    scheduleNext(remaining || DURATION);
  };

  // Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(index + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goTo(index - 1);
    });
  }

  // Pause on hover
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);

  // Pointer pause/resume
  root.addEventListener('pointerdown', pause, { passive: true });
  root.addEventListener('pointerup', resume, { passive: true });
  root.addEventListener('pointercancel', resume, { passive: true });

  // Keyboard support
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  });

  // Swipe (mobile)
  let startX = 0;
  let tracking = false;

  root.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    tracking = true;
    startX = e.touches[0].clientX;
    pause();
  }, { passive: true });

  root.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;

    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
    const dx = endX - startX;

    if (Math.abs(dx) > 50) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    } else {
      resume();
    }
  }, { passive: true });

  // Init
  slides.forEach((s, idx) => s.classList.toggle('is-active', idx === 0));
  track.style.transform = 'translate3d(0,0,0)';
  restartCycle(DURATION);
});
