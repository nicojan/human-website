/*
 * blog-filter.js — tag-pill filter for the blog list page.
 *
 * Both EN (/writing/) and ZH (/zh-hant/writing/) are rendered by Hugo with
 * the same list.html template, so this script only needs to wire up the
 * click handler. Tag slugs come straight from Hugo's urlize filter on
 * [data-post] elements, so EN and ZH comparisons share the same form.
 */

(() => {
  'use strict';

  const root = document.querySelector('[data-post-list]');
  if (!root) return;

  const pills = document.querySelector('[data-tag-filter]');
  const empty = document.querySelector('[data-post-empty]');
  const resetBtn = document.querySelector('[data-tag-reset]');
  if (!pills) return;

  pills.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    setFilter(btn.dataset.tag, btn);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const allBtn = pills.querySelector('[data-tag="all"]');
      if (allBtn) setFilter('all', allBtn);
    });
  }

  function setFilter(tag, activeBtn) {
    let visible = 0;
    root.querySelectorAll('[data-post]').forEach((li) => {
      const tags = (li.dataset.tags || '').split(/\s+/);
      const match = tag === 'all' || tags.includes(tag);
      li.hidden = !match;
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;

    pills.querySelectorAll('[data-tag]').forEach((b) => {
      const on = b === activeBtn;
      b.classList.toggle('tag-pill--active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
})();
