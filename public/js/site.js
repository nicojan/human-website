/*
 * site.js — shared behaviours across every page.
 *
 * Vanilla JS, no bundler, no framework.
 *
 *   - dynamic copyright year in the footer
 *   - mobile nav toggle
 *   - sticky-header scroll state
 *   - IntersectionObserver scroll-in animations (with reduced-motion opt-out)
 *   - pause autoplay videos under reduced-motion
 */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Dynamic copyright year */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile nav toggle — full-viewport overlay. Locks body scroll while
     open, responds to ESC, and auto-closes when the viewport crosses
     back into the desktop breakpoint (so the state can't get stuck).
     The drawer has a dedicated × close button; the burger is covered
     by the drawer once open and needs no state of its own beyond the
     ARIA flip. */
  const nav = document.querySelector('[data-nav]');
  const burger = document.querySelector('[data-nav-burger]');
  const closeBtn = document.querySelector('[data-nav-close]');
  if (nav && burger) {
    const isZh = document.documentElement.lang === 'zh-Hant';
    const labelOpen = isZh ? '開啟選單' : 'Open menu';
    const labelClose = isZh ? '關閉選單' : 'Close menu';
    const setOpen = (isOpen) => {
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? labelClose : labelOpen);
    };
    burger.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    if (closeBtn) {
      closeBtn.addEventListener('click', () => setOpen(false));
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });
    const desktopMql = window.matchMedia('(min-width: 48rem)');
    const handleViewportChange = () => {
      if (desktopMql.matches && nav.classList.contains('is-open')) setOpen(false);
    };
    if (desktopMql.addEventListener) {
      desktopMql.addEventListener('change', handleViewportChange);
    } else if (desktopMql.addListener) {
      desktopMql.addListener(handleViewportChange);
    }
  }

  /* Sticky header state */
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 2);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Pill-mode nav: on pages with a video hero, the nav renders as a
     floating glass pill while any part of the hero is visible, then
     flips to the standard full-width bar once the user has scrolled
     past the hero. The full wordmark and the mobile comma-mark both
     swap to their on-ink variants while the pill is active so they
     stay legible against the dark video behind the glass. */
  const videoHero = document.querySelector('.hero--video');
  if (videoHero && 'IntersectionObserver' in window) {
    document.body.classList.add('has-video-hero', 'hero-in-view');
    const markEls = {
      full: document.querySelector('.nav__wordmark--full'),
      mark: document.querySelector('.nav__wordmark--mark'),
    };
    const MARKS = {
      light: {
        full: '/brand/human-wordmark-colour-on-white.svg',
        mark: '/brand/human-comma-terracotta.svg',
      },
      dark: {
        full: '/brand/human-wordmark-colour-on-ink.svg',
        mark: '/brand/human-comma-white-on-ink.svg',
      },
    };
    const applyVariant = (variant) => {
      if (markEls.full) markEls.full.src = MARKS[variant].full;
      if (markEls.mark) markEls.mark.src = MARKS[variant].mark;
    };
    applyVariant('dark');
    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle('hero-in-view', entry.isIntersecting);
        applyVariant(entry.isIntersecting ? 'dark' : 'light');
      });
    }, { threshold: 0 });
    heroIO.observe(videoHero);
  }

  /* Scroll-in animations
     Elements with [data-animate] start hidden (via CSS) and gain .is-visible
     once they enter the viewport. Parents with [data-animate-stagger] cascade
     their children with a short delay.

     Above-the-fold elements are revealed immediately on first paint. The
     IntersectionObserver only fires on intersection *changes* — elements that
     are already in view when observe() is called never trigger a callback,
     so without this initial sweep the hero would stay at opacity: 0. */
  const animatedEls = document.querySelectorAll('[data-animate]');
  if (animatedEls.length) {
    const staggerParents = document.querySelectorAll('[data-animate-stagger]');
    staggerParents.forEach((parent) => {
      const children = parent.querySelectorAll('[data-animate]');
      children.forEach((child, index) => {
        if (index < 5) {
          child.style.transitionDelay = `${index * 80}ms`;
        }
      });
    });

    if (prefersReducedMotion) {
      animatedEls.forEach((el) => el.classList.add('is-visible'));
    } else if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.01 });

      const viewportHeight = window.innerHeight;
      animatedEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < viewportHeight && rect.bottom > 0;
        if (inView) {
          el.classList.add('is-visible');
        } else {
          io.observe(el);
        }
      });
    } else {
      animatedEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* Principle media tilt — fires later than the generic [data-animate]
     observer above. The rootMargin trims the top and bottom by 30%, so
     each .principle gains .is-tilted only when it crosses into the
     middle 40% band of the viewport (its near-centre). One-shot — the
     class stays once added. */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const principles = document.querySelectorAll('.principle');
    if (principles.length) {
      const tiltIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-tilted');
            tiltIO.unobserve(entry.target);
          }
        });
      }, { rootMargin: '-30% 0px -30% 0px', threshold: 0.01 });

      principles.forEach((el) => tiltIO.observe(el));
    }
  }

  /* Reduced motion: pause autoplay videos */
  if (prefersReducedMotion) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
      video.autoplay = false;
      video.pause();
    });
  }
})();
