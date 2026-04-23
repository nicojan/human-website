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

  /* Mobile nav toggle */
  const nav = document.querySelector('[data-nav]');
  const burger = document.querySelector('[data-nav-burger]');
  if (nav && burger) {
    const isZh = document.documentElement.lang === 'zh-Hant';
    const labelOpen = isZh ? '開啟選單' : 'Open menu';
    const labelClose = isZh ? '關閉選單' : 'Close menu';
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? labelClose : labelOpen);
    });
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
     past the hero. The wordmark swaps to the colour-on-ink variant
     (light "Human," with terracotta comma) while the pill is active
     so it stays legible against the dark video behind the glass. */
  const videoHero = document.querySelector('.hero--video');
  if (videoHero && 'IntersectionObserver' in window) {
    document.body.classList.add('has-video-hero', 'hero-in-view');
    const navWordmark = document.querySelector('.nav__wordmark');
    const WORDMARK_LIGHT_BG = '/brand/human-wordmark-colour-on-white.svg';
    const WORDMARK_DARK_BG  = '/brand/human-wordmark-colour-on-ink.svg';
    if (navWordmark) {
      navWordmark.src = WORDMARK_DARK_BG;
    }
    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        document.body.classList.toggle('hero-in-view', entry.isIntersecting);
        if (navWordmark) {
          navWordmark.src = entry.isIntersecting ? WORDMARK_DARK_BG : WORDMARK_LIGHT_BG;
        }
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

  /* Reduced motion: pause autoplay videos */
  if (prefersReducedMotion) {
    document.querySelectorAll('video[autoplay]').forEach((video) => {
      video.autoplay = false;
      video.pause();
    });
  }
})();
