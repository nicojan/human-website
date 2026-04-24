/*
 * blog-filter.js — tag-pill filter for the blog list page.
 *
 * Works in two modes:
 *   EN (server-rendered): Hugo emits the pills and <li data-post data-tags="…"> entries.
 *                         We just wire the click handler.
 *   ZH (client-rendered): The page ships empty <ul data-post-list> + empty <div data-tag-filter>.
 *                         We fetch /writing/index.json, render posts and pills, then filter.
 *
 * Tags are always compared in their urlized form ("close reading" → "close-reading"),
 * so EN and ZH use the same slugs.
 */

(() => {
  'use strict';

  const root = document.querySelector('[data-post-list]');
  if (!root) return;

  const pills = document.querySelector('[data-tag-filter]');
  const empty = document.querySelector('[data-post-empty]');
  const resetBtn = document.querySelector('[data-tag-reset]');
  const htmlLang = (document.documentElement.lang || 'en').toLowerCase();
  const isZh = htmlLang.startsWith('zh');

  if (root.hasAttribute('data-post-list-hydrate')) {
    hydrateFromJson().then(() => wireFilter()).catch(() => {
      /* Leave the placeholder content; fail quietly. */
    });
  } else {
    wireFilter();
  }

  function wireFilter() {
    if (!pills) return;

    pills.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tag]');
      if (!btn) return;
      const tag = btn.dataset.tag;
      applyFilter(tag);
      updatePillsState(btn);
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const allBtn = pills.querySelector('[data-tag="all"]');
        if (allBtn) {
          applyFilter('all');
          updatePillsState(allBtn);
        }
      });
    }
  }

  function applyFilter(tag) {
    const items = root.querySelectorAll('[data-post]');
    let visible = 0;
    items.forEach((li) => {
      const match = tag === 'all' || (li.dataset.tags || '').split(/\s+/).includes(tag);
      li.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
  }

  function updatePillsState(active) {
    pills.querySelectorAll('[data-tag]').forEach((b) => {
      const on = b === active;
      b.classList.toggle('tag-pill--active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  async function hydrateFromJson() {
    const res = await fetch('/writing/index.json', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('no index');
    const data = await res.json();
    const posts = Array.isArray(data.posts) ? data.posts : [];
    if (!posts.length) {
      root.innerHTML = '';
      const msg = document.createElement('p');
      msg.className = 'writing-list__empty';
      msg.textContent = isZh ? '部落格文章很快就來。' : 'First posts are on the way.';
      root.after(msg);
      return;
    }

    root.innerHTML = posts.map(renderPost).join('');
    if (pills) renderPills(collectTags(posts));
  }

  function collectTags(posts) {
    const seen = new Map();
    posts.forEach((p) => (p.tags || []).forEach((t) => {
      const slug = slugify(t);
      if (!seen.has(slug)) seen.set(slug, t);
    }));
    return Array.from(seen.entries()).sort(([a], [b]) => a.localeCompare(b));
  }

  function renderPills(tagPairs) {
    const allLabel = isZh ? '全部' : 'All';
    const header = `<button type="button" class="tag-pill tag-pill--active" data-tag="all" aria-pressed="true">${text(allLabel)}</button>`;
    const rest = tagPairs.map(([slug, label]) =>
      `<button type="button" class="tag-pill" data-tag="${attr(slug)}" aria-pressed="false">${text(label)}</button>`
    ).join('');
    pills.innerHTML = header + rest;
  }

  function renderPost(post) {
    const tagSlugs = (post.tags || []).map(slugify).join(' ');
    const dateLabel = formatDate(post.date, isZh ? 'zh-Hant' : 'en-CA');
    const readLabel = isZh ? '閱讀' : 'Read';
    const tagsHtml = (post.tags || []).length
      ? `<ul class="writing-entry__tags" aria-label="${attr(isZh ? '標籤' : 'Tags')}">${
          post.tags.map((t) => `<li>${text(t)}</li>`).join('')
        }</ul>`
      : '';

    return `
      <li data-post data-tags="${attr(tagSlugs)}">
        <article class="writing-entry">
          <div class="writing-entry__meta">
            <time datetime="${attr(post.date.slice(0, 10))}">${text(dateLabel)}</time>
            ${post.author ? ` · <span>${text(post.author)}</span>` : ''}
          </div>
          <h2 class="writing-entry__title"><a href="${attr(post.url)}">${text(post.title)}</a></h2>
          ${post.summary ? `<p class="writing-entry__summary">${text(post.summary)}</p>` : ''}
          ${tagsHtml}
          <a class="link-cta" href="${attr(post.url)}">${text(readLabel)} <span aria-hidden="true">→</span></a>
        </article>
      </li>
    `;
  }

  function slugify(tag) {
    return String(tag)
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
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
