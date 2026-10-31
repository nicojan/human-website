/*
 * analytics.js — analytics tracker for the self-hosted Umami instance that also
 * serves nicojan.com (NAS, infra-nas/compose/umami/). Replaces matomo.js.
 *
 * Privacy-respecting by design:
 *   - skips when the browser sends Do Not Track (and tells the tracker too)
 *   - skips on localhost + loopback + .local/.test (dev); `data-domains` is a
 *     second fence, so a preview deploy on another hostname sends nothing
 *   - Umami sets no cookies and stores no IP address (country/region/city only)
 *   - heatmaps are OFF (RECORDER below): turning them on is a privacy-notice
 *     change, not a setting tweak
 *
 * Tracks, in addition to the default page view:
 *   - page language as the Umami tag (filterable), e.g. 'en' | 'zh-hant'
 *   - CTA clicks (.button--primary, .hero__cta, .link-cta, closing CTA)
 *   - primary-nav clicks
 *   - language toggles (EN ⇄ ZH)
 *   - FAQ <details> open/close
 *   - first <video> play (videos without autoplay only)
 *   - contact-form start + submit
 *   - scroll-depth milestones (25 / 50 / 75 / 100 %)
 *   - outbound links + downloads
 *   - uncaught JS errors + unhandled promise rejections
 * Every custom event carries `section` ('home' | 'about' | 'services' |
 * 'writing' | 'contact' | 'other') so events can be split by page area.
 *
 * NOT ported from matomo.js, because Umami has no equivalent: the 15s
 * active-time heartbeat (Umami derives visit length from event gaps) and
 * content-block impressions.
 */

(() => {
  'use strict';

  const UMAMI_HOST = 'https://stats.nicojan.com';
  const WEBSITE_ID = 'c2e31553-80c8-4be3-93de-b8399327657f';
  const RECORDER = false; // heatmaps; needs the privacy notice updated first

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

  const pageLanguage =
    (document.documentElement.getAttribute('lang') || '').toLowerCase() || 'unknown';

  const sectionOf = (path) => {
    const p = path.replace(/^\/zh-hant/, '') || '/';
    if (p === '/' || p === '') return 'home';
    const first = p.split('/').filter(Boolean)[0];
    if (['about', 'services', 'contact', 'writing'].includes(first)) return first;
    return 'other';
  };
  const section = sectionOf(location.pathname);

  /* ── Load the tracker ──────────────────────────────── */
  const load = (src, attrs) => {
    const s = document.createElement('script');
    s.defer = true;
    s.src = src;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    document.head.appendChild(s);
    return s;
  };

  /* `/nj.js` and `/nj` are the renamed tracker + collect paths; `/script.js`
   * and `/api/send` sit behind Cloudflare Access and would record nothing. */
  const tracker = load(`${UMAMI_HOST}/nj.js`, {
    'data-website-id': WEBSITE_ID,
    'data-host-url': UMAMI_HOST,
    'data-domains': 'forhuman.ca',
    'data-do-not-track': 'true',
    'data-tag': pageLanguage,
  });
  if (RECORDER) {
    load(`${UMAMI_HOST}/recorder.js`, {
      'data-website-id': WEBSITE_ID,
      'data-host-url': UMAMI_HOST,
    });
  }

  /* ── Helpers ───────────────────────────────────────── */
  /* Events fired before the tracker loads (an early JS error, a fast click)
   * wait here, then flush once window.umami exists. */
  const queue = [];
  const track = (name, data) => {
    const payload = { section, ...data };
    if (window.umami && typeof window.umami.track === 'function') {
      try {
        window.umami.track(name, payload);
      } catch (_) {
        /* never let analytics break the page */
      }
    } else {
      queue.push([name, payload]);
    }
  };
  tracker.addEventListener('load', () => {
    while (queue.length) {
      const [name, payload] = queue.shift();
      track(name, payload);
    }
  });

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
        track('cta-click', { label: label(el, el.getAttribute('href')) || 'cta' });
      });
    });

    /* Primary nav */
    document.querySelectorAll('.nav__links a').forEach((el) => {
      el.addEventListener('click', () => {
        track('nav-click', { href: el.getAttribute('href') || label(el) });
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
        track('language-toggle', { direction: targetZh ? 'en→zh-hant' : 'zh-hant→en' });
      });
    });

    /* FAQ <details> open/close */
    document.querySelectorAll('details.faq-item, details.faq').forEach((el) => {
      el.addEventListener('toggle', () => {
        const summary = el.querySelector('summary');
        track(el.open ? 'faq-open' : 'faq-close', { question: label(summary, 'faq') });
      });
    });

    /* Video — first play only, and never an autoplaying video: its "play" fires
     * on load with nobody watching. Every one of the 19 events Matomo recorded
     * (2026-09-07 → 10-30) was `Video / play`, i.e. autoplay noise. */
    document.querySelectorAll('video:not([autoplay])').forEach((video) => {
      const name = (video.getAttribute('aria-label') || video.currentSrc || 'video').slice(0, 120);
      video.addEventListener('play', once(() => track('video-play', { name })));
    });

    /* Contact form */
    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener(
        'focusin',
        once(() => track('form-start', { form: 'contact-form' })),
      );
      form.addEventListener('submit', () => {
        track('form-submit', { form: 'contact-form' });
      });
    }

    /* Outbound links + downloads (Matomo did these automatically; Umami does not) */
    const downloadRe = /\.(pdf|zip|docx?|xlsx?|pptx?|csv|txt|mp3|mp4|webm|m4a|mov|avif|webp|opus)$/i;
    document.addEventListener(
      'click',
      (e) => {
        const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        let url;
        try {
          url = new URL(a.getAttribute('href'), location.href);
        } catch (_) {
          return;
        }
        if (downloadRe.test(url.pathname)) {
          track('download', { file: url.href.slice(0, 500) });
        } else if (/^https?:$/.test(url.protocol) && url.hostname !== location.hostname) {
          track('outbound-link', { href: url.href.slice(0, 500) });
        }
      },
      true,
    );

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
          track('scroll-depth', { depth: m });
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
    const message = (e.message || 'error').slice(0, 150);
    const where = `${e.filename || ''}:${e.lineno || 0}:${e.colno || 0}`;
    track('js-error', { message, where });
  });
  window.addEventListener('unhandledrejection', (e) => {
    const reason = (e.reason && (e.reason.message || String(e.reason))) || 'unhandledrejection';
    track('js-error', { message: String(reason).slice(0, 150), where: 'unhandledrejection' });
  });
})();
