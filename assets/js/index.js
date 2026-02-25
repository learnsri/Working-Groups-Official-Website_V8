// assets/js/index.js (FIXED – single DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // Hamburger toggle (works on mobile)
  // =========================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.getElementById('primaryNav');
  const navOverlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-close');

  if (hamburger && navMenu) {
   const openMenu = () => {
  hamburger.classList.add('active');
  navMenu.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');

  if (navOverlay) {
    navOverlay.classList.add('active');
    navOverlay.setAttribute('aria-hidden', 'false');
  }

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollbarWidth + 'px';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');

  if (navOverlay) {
    navOverlay.classList.remove('active');
    navOverlay.setAttribute('aria-hidden', 'true');
  }

  document.body.style.paddingRight = '';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
};

    const toggleMenu = () => {
      if (navMenu.classList.contains('active')) closeMenu();
      else openMenu();
    };

    hamburger.addEventListener('click', toggleMenu);

    if (closeBtn){
      closeBtn.addEventListener('click', () => {
        closeMenu();
      });
    }

    // Keyboard support
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
      if (e.key === 'Escape') closeMenu();
    });

    // Close menu when a link is clicked (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) closeMenu();
      });
    });

    // Close menu when clicking outside (overlay)
    document.addEventListener('click', (e) => {
      const clickedInsideNav = navMenu.contains(e.target);
      const clickedHamburger = hamburger.contains(e.target);
      const clickedOverlay = navOverlay ? navOverlay.contains(e.target) : false;

      if ((!clickedInsideNav && !clickedHamburger && navMenu.classList.contains('active')) || clickedOverlay) {
        closeMenu();
      }
    });

    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // Close on Escape globally
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    }, { passive: true });
  }

  // =========================
  // Navbar shadow on scroll
  // =========================
  const navbar = document.getElementById('siteNav');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 10) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // =========================
  // Feature hover (optional)
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

  // =========================================================
  // NEW HERO CINEMATIC SLIDER (for #heroCinema)
  // =========================================================
  const root = document.getElementById('heroCinema');
  if (!root) return;

  const track = root.querySelector('.hc-track');
  const slides = Array.from(root.querySelectorAll('.hc-slide'));
  const prevBtn = root.querySelector('.hc-prev');
  const nextBtn = root.querySelector('.hc-next');
  const dotsWrap = root.querySelector('.hc-dots');
  const bar = root.querySelector('.hc-progress-bar');

  if (!track || slides.length === 0) return;

  const total = slides.length;
  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const AUTOPLAY = root.dataset.autoplay !== 'false';
  const DURATION = 5600;
  const SNAP_MS = prefersReducedMotion() ? 0 : 950;

  let index = 0;
  let timer = null;
  let startTime = 0;
  let remaining = DURATION;
  let paused = false;
  let isPointerDown = false;
  let startX = 0;
  let currentX = 0;
  let baseTranslate = 0;
  let rafId = null;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const setTrackTransition = (on) => {
    track.style.transition = on ? `transform ${SNAP_MS}ms cubic-bezier(.18,.86,.18,1)` : 'none';
  };

  const translateToIndex = (i, { animate = true } = {}) => {
    const x = -i * 100;
    if (!animate) setTrackTransition(false);
    track.style.transform = `translate3d(${x}%, 0, 0)`;
    if (!animate) {
      track.offsetHeight;
      setTrackTransition(true);
    }
  };

  const setActive = (i) => {
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    slides.forEach((s, idx) => {
      const cur = s.querySelector('.hc-cur');
      const tot = s.querySelector('.hc-total');
      if (tot) tot.textContent = String(total).padStart(2, '0');
      if (cur && idx === i) cur.textContent = String(i + 1).padStart(2, '0');
      if (cur && idx !== i) cur.textContent = String(idx + 1).padStart(2, '0');
    });
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle('is-active', idx === i));
    }
  };

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const setProgress = (ms) => {
    if (!bar) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    bar.offsetHeight;
    bar.style.transition = `width ${ms}ms linear`;
    bar.style.width = '100%';
  };

  const scheduleNext = (ms) => {
    clearTimer();
    startTime = performance.now();
    remaining = ms;
    if (!prefersReducedMotion()) setProgress(ms);
    else if (bar) {
      bar.style.transition = 'none';
      bar.style.width = '35%';
      bar.style.opacity = '0.55';
    }
    timer = setTimeout(() => {
      if (paused || !AUTOPLAY) return;
      goTo(index + 1);
    }, ms);
  };

  const pause = () => {
    if (paused) return;
    paused = true;
    const elapsed = performance.now() - startTime;
    remaining = clamp(remaining - elapsed, 0, DURATION);
    if (bar && !prefersReducedMotion()) {
      const w = getComputedStyle(bar).width;
      bar.style.transition = 'none';
      bar.style.width = w;
    }
    clearTimer();
  };

  const resume = () => {
    if (!paused) return;
    if (!AUTOPLAY) return;
    if (prefersReducedMotion()) return;
    paused = false;
    scheduleNext(remaining || DURATION);
  };

  const goTo = (i, { animate = true, fromDrag = false } = {}) => {
    index = (i + total) % total;
    setActive(index);
    translateToIndex(index, { animate });
    paused = false;
    if (AUTOPLAY && !prefersReducedMotion() && !fromDrag) scheduleNext(DURATION);
    if (AUTOPLAY && !prefersReducedMotion() && fromDrag) scheduleNext(DURATION);
  };

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hc-dot';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.setAttribute('role', 'tab');
      b.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(i);
      });
      dotsWrap.appendChild(b);
    }
  }

  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); goTo(index + 1); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); goTo(index - 1); });

  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(index - 1); }
    if (e.key === 'Escape')     { e.preventDefault(); pause(); }
  });

  // Drag support
  const getTranslatePercent = () => {
    const t = getComputedStyle(track).transform;
    if (!t || t === 'none') return -index * 100;
    const m = t.match(/matrix\((.+)\)/);
    if (!m) return -index * 100;
    const parts = m[1].split(',').map(v => parseFloat(v.trim()));
    const tx = parts[4];
    const stageW = root.getBoundingClientRect().width || 1;
    return (tx / stageW) * 100;
  };

  const applyDrag = () => {
    rafId = null;
    const stageW = root.getBoundingClientRect().width || 1;
    const dx = currentX - startX;
    const dxPct = (dx / stageW) * 100;
    const next = baseTranslate + dxPct;
    const min = -(total - 1) * 100;
    const max = 0;
    let rubber = next;
    if (next > max) rubber = max + (next - max) * 0.35;
    if (next < min) rubber = min + (next - min) * 0.35;
    track.style.transform = `translate3d(${rubber}%, 0, 0)`;
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isPointerDown = true;
    pause();
    setTrackTransition(false);
    startX = e.clientX;
    currentX = startX;
    baseTranslate = getTranslatePercent();
    root.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isPointerDown) return;
    currentX = e.clientX;
    if (!rafId) rafId = requestAnimationFrame(applyDrag);
  };

  const onPointerUp = (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    const pct = getTranslatePercent();
    const nearest = clamp(Math.round(Math.abs(pct) / 100), 0, total - 1);
    const stageW = root.getBoundingClientRect().width || 1;
    const dx = currentX - startX;
    const velocityHint = Math.abs(dx) / stageW;
    let target = nearest;
    if (Math.abs(dx) > 60) {
      if (dx < 0) target = clamp(nearest + (velocityHint > 0.25 ? 1 : 0), 0, total - 1);
      else target = clamp(nearest - (velocityHint > 0.25 ? 1 : 0), 0, total - 1);
    }
    setTrackTransition(true);
    goTo(target, { animate: true, fromDrag: true });
    resume();
  };

  root.addEventListener('pointerdown', onPointerDown, { passive: true });
  root.addEventListener('pointermove', onPointerMove, { passive: true });
  root.addEventListener('pointerup', onPointerUp, { passive: true });
  root.addEventListener('pointercancel', onPointerUp, { passive: true });

  // Touch fallback
  let tStartX = 0;
  root.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    tStartX = e.touches[0].clientX;
    pause();
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : tStartX;
    const dx = endX - tStartX;
    if (Math.abs(dx) > 55) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    } else {
      resume();
    }
  }, { passive: true });

  // Init
  setTrackTransition(true);
  setActive(0);
  translateToIndex(0, { animate: false });
  if (AUTOPLAY && !prefersReducedMotion()) scheduleNext(DURATION);
});



// Vision section reveal
const visionSection = document.getElementById('vision');

if (visionSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visionSection.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2 });

  observer.observe(visionSection);
}