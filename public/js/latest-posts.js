/*
 * latest-posts.js — populates the "Recent Writing" module on the homepage.
 *
 * Hugo builds /writing/index.json (see blog/layouts/_default/index.json).
 * This script fetches it, picks the two newest posts, and injects them as
 * cards. If the fetch fails (blog hasn't been built yet, or no posts), the
 * section stays hidden so the homepage still reads cleanly.
 */

(() => {
  'use strict';

  const container = document.querySelector('[data-latest-posts]');
  const section = document.getElementById('recent-writing');
  if (!container || !section) return;

  const htmlLang = document.documentElement.lang || 'en';
  const isZh = htmlLang.toLowerCase().startsWith('zh');
  /* v1 has only an English blog. ZH pages still display the same posts
     with ZH surrounding chrome. When ZH blog ships in v2, switch the
     lookup to /zh-hant/writing/index.json. */
  const indexUrl = '/writing/index.json';
  const localeTag = isZh ? 'zh-Hant' : 'en-CA';
  const ctaText = isZh ? '閱讀' : 'Read';

  fetch(indexUrl, { credentials: 'same-origin' })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('no index'))))
    .then((data) => {
      const posts = Array.isArray(data.posts) ? data.posts.slice(0, 2) : [];
      if (!posts.length) return;

      container.innerHTML = posts.map(renderCard).join('');
      section.hidden = false;
    })
    .catch(() => {
      /* Swallow. Section stays hidden. */
    });

  function renderCard(post) {
    const dateLabel = formatDate(post.date, localeTag);
    return `
      <a class="post-card" href="${attr(post.url)}">
        <span class="post-card__meta">${text(dateLabel)}</span>
        <h3 class="post-card__title">${text(post.title)}</h3>
        <p class="post-card__summary">${text(post.summary || '')}</p>
        <span class="post-card__cta link-cta">${text(ctaText)} <span aria-hidden="true">→</span></span>
      </a>
    `;
  }

  function formatDate(isoString, locale) {
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (_err) {
      return '';
    }
  }

  function text(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function attr(value) { return text(value); }
})();
