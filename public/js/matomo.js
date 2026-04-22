/*
 * matomo.js — analytics tracker for self-hosted Matomo at analytics.forhuman.ca.
 *
 * Privacy-respecting by design:
 *   - skips when the browser sends Do Not Track
 *   - skips on localhost + loopback (dev)
 *   - pairs with Matomo's "Anonymize IP (last 2 bytes)" and
 *     "Disable browser fingerprint" privacy settings (cookieless)
 *
 * Tracks, in addition to the default page view:
 *   - active-time heartbeat (15s)
 *   - outbound links + downloads (auto, extended with media types)
 *   - visible content-block impressions (auto on scroll)
 *   - custom dimensions: pageLanguage (1), pageSection (2)
 *   - CTA clicks (.button--primary, .hero__cta, .link-cta, closing CTA)
 *   - primary-nav clicks
 *   - language toggles (EN ⇄ ZH)
 *   - FAQ <details> open/close
 *   - first <video> play
 *   - contact-form start + submit
 *   - scroll-depth milestones (25 / 50 / 75 / 100 %)
 *   - uncaught JS errors + unhandled promise rejections
 */

(() => {
  'use strict';

  const MATOMO_URL = 'https://analytics.forhuman.ca/';
  const SITE_ID = '1';

  /* Respect Do Not Track */
  const dnt =
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1';
  if (dnt) return;

  /* Skip dev hosts */
  const host = location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.local') ||
    host.endsWith('.test')
  ) {
    return;
  }

  window._paq = window._paq || [];
  const _paq = window._paq;

  /* ── Privacy + core config ─────────────────────────── */
  _paq.push(['disableCookies']);
  _paq.push(['setSecureCookie', true]);
  _paq.push(['setDomains', ['*.forhuman.ca']]);
  _paq.push(['setLinkTrackingTimer', 500]);
  _paq.push(['addDownloadExtensions', 'webm|mp4|m4a|mov|avif|webp|opus']);

  /* ── Custom dimensions ─────────────────────────────────
   * Create these once in Matomo → Personal → Plugins →
   * CustomDimensions before they surface in reports. Sending
   * unknown dimension IDs is harmless — Matomo drops them.
   *   1 = pageLanguage   ('en' | 'zh-hant' | …)
   *   2 = pageSection    ('home' | 'about' | 'services' | 'writing' | 'contact' | 'other')
   * ───────────────────────────────────────────────────── */
  const pageLanguage =
    (document.documentElement.getAttribute('lang') || '').toLowerCase() || 'unknown';
  _paq.push(['setCustomDimension', 1, pageLanguage]);

  const sectionOf = (path) => {
    const p = path.replace(/^\/zh-hant/, '') || '/';
    if (p === '/' || p === '') return 'home';
    const first = p.split('/').filter(Boolean)[0];
    if (['about', 'services', 'contact', 'writing'].includes(first)) return first;
    return 'other';
  };
  _paq.push(['setCustomDimension', 2, sectionOf(location.pathname)]);

  /* ── Activate tracking ─────────────────────────────── */
  _paq.push(['enableHeartBeatTimer', 15]);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  _paq.push(['trackVisibleContentImpressions', true, 750]);

  _paq.push(['setTrackerUrl', MATOMO_URL + 'matomo.php']);
  _paq.push(['setSiteId', SITE_ID]);

  const s = document.createElement('script');
  s.async = true;
  s.defer = true;
  s.src = MATOMO_URL + 'matomo.js';
  document.head.appendChild(s);

  /* ── Helpers ───────────────────────────────────────── */
  const track = (category, action, name, value) => {
    const payload = ['trackEvent', category, action];
    if (name !== undefined) payload.push(name);
    if (value !== undefined) payload.push(value);
    _paq.push(payload);
  };

  const once = (fn) => {
    let fired = false;
    return (...args) => {
      if (fired) return;
      fired = true;
      try {
        fn(...args);
      } catch (_) {
        /* never let analytics break the page */
      }
    };
  };

  const label = (el, fallback) =>
    ((el && el.textContent) || fallback || '').trim().replace(/\s+/g, ' ').slice(0, 120);

  /* ── Custom event listeners ────────────────────────── */
  const wire = () => {
    /* CTAs */
    const ctaSelectors = [
      '.button--primary',
      '.hero__cta a',
      '.hero__cta button',
      '.link-cta',
      '.closing-cta__grid a',
      '.closing-cta__grid button',
    ].join(',');
    document.querySelectorAll(ctaSelectors).forEach((el) => {
      el.addEventListener('click', () => {
        track('CTA', 'click', label(el, el.getAttribute('href')) || 'cta');
      });
    });

    /* Primary nav */
    document.querySelectorAll('.nav__links a').forEach((el) => {
      el.addEventListener('click', () => {
        track('Navigation', 'click', el.getAttribute('href') || label(el));
      });
    });

    /* Language toggle — only links that change locale */
    const onZh = location.pathname.startsWith('/zh-hant');
    document.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('//')) return;
      const targetZh = href.startsWith('/zh-hant');
      if (targetZh === onZh) return;
      el.addEventListener('click', () => {
        track('Language', 'toggle', targetZh ? 'en→zh-hant' : 'zh-hant→en');
      });
    });

    /* FAQ <details> open/close */
    document.querySelectorAll('details.faq-item, details.faq').forEach((el) => {
      el.addEventListener('toggle', () => {
        const summary = el.querySelector('summary');
        track('FAQ', el.open ? 'open' : 'close', label(summary, 'faq'));
      });
    });

    /* Video — first play only (autoplay muted loops would spam otherwise) */
    document.querySelectorAll('video').forEach((video) => {
      const name = (video.getAttribute('aria-label') || video.currentSrc || 'video').slice(0, 120);
      video.addEventListener('play', once(() => track('Video', 'play', name)));
    });

    /* Contact form */
    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener(
        'focusin',
        once(() => track('Form', 'start', 'contact-form')),
      );
      form.addEventListener('submit', () => {
        track('Form', 'submit', 'contact-form');
      });
    }

    /* Scroll depth */
    const milestones = [25, 50, 75, 100];
    const fired = new Set();
    const checkDepth = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      if (scrollable <= 0) return;
      const pct = Math.min(100, Math.round(((window.scrollY || 0) / scrollable) * 100));
      for (const m of milestones) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track('Scroll', 'depth', `${m}%`, m);
        }
      }
    };
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          checkDepth();
          ticking = false;
        });
      },
      { passive: true },
    );
    checkDepth();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  /* ── Uncaught errors ──────────────────────────────── */
  window.addEventListener('error', (e) => {
    const msg = (e.message || 'error').slice(0, 150);
    const where = `${e.filename || ''}:${e.lineno || 0}:${e.colno || 0}`;
    track('JSError', msg, where);
  });
  window.addEventListener('unhandledrejection', (e) => {
    const reason = (e.reason && (e.reason.message || String(e.reason))) || 'unhandledrejection';
    track('JSError', 'unhandledrejection', String(reason).slice(0, 150));
  });
})();
