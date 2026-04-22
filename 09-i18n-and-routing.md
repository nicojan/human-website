# i18n and Routing

## Route map

| URL | File | Language | Status |
|---|---|---|---|
| `/` | `src/pages/index.astro` | Bilingual | v1 |
| `/about` | `src/pages/about.astro` | EN | v1 |
| `/services` | `src/pages/services.astro` | EN | v1 |
| `/zh-hant/about` | `src/pages/zh-hant/about.astro` | 繁 | v1 stub |
| `/zh-hant/services` | `src/pages/zh-hant/services.astro` | 繁 | v1 stub |
| `/writing` | `src/pages/writing/index.astro` | EN | v2 |
| `/writing/[slug]` | `src/pages/writing/[...slug].astro` | EN | v2 |
| `/404` | `src/pages/404.astro` | EN | v1 |

## Astro i18n config

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://forhuman.ca',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-hant'],
    routing: {
      prefixDefaultLocale: false, // EN has no prefix; ZH is /zh-hant/*
    },
  },
});
```

## Why `/` is not `/en/`

We deliberately don't prefix English with `/en/` because:
1. The homepage is bilingual, not English-only. Prefixing suggests separate EN and ZH homepages, which isn't the model.
2. SEO: the root domain gets the strongest signal. `forhuman.ca` should be the canonical URL, not `forhuman.ca/en`.
3. User expectation: typing `forhuman.ca` lands on the bilingual homepage directly.

## Language detection and toggle

### On page load
Don't auto-detect user language via `Accept-Language` header. Every user starts on `/` (bilingual homepage) or whatever URL they typed. They can navigate to their preferred language explicitly via the toggle.

Rationale: auto-detection creates confusing bounce behavior, and the bilingual homepage is designed to welcome both languages equally.

### Language toggle behavior

The toggle appears in the nav of every page except the bilingual homepage.

On `/about`:
```tsx
<LanguageToggle 
  current="en"
  otherLocale={{ label: '繁', href: '/zh-hant/about' }}
/>
```

On `/zh-hant/about`:
```tsx
<LanguageToggle 
  current="zh-hant"
  otherLocale={{ label: 'EN', href: '/about' }}
/>
```

### v1 fallback for unbuilt Chinese pages

For v1, only `/about` and `/services` inner pages exist in English. Their Chinese mirrors are **stubs**.

The Chinese stub pages:
- Render the page's `Nav/Mono` with the toggle showing "EN / 繁" with 繁 active.
- Render a centered message: "即將推出 · Coming soon." 
- Render the bilingual footer (already bilingual, no translation needed).

**Do not** have the English toggle link to `/` on unbuilt Chinese pages. The stub pages exist so the toggle has a destination.

## hreflang tags

Every page includes `<link rel="alternate" hreflang="..." href="..." />` tags so Google knows which language versions exist.

On `/about`:
```html
<link rel="alternate" hreflang="en" href="https://forhuman.ca/about" />
<link rel="alternate" hreflang="zh-Hant" href="https://forhuman.ca/zh-hant/about" />
<link rel="alternate" hreflang="x-default" href="https://forhuman.ca/about" />
```

On `/`:
The homepage is bilingual, so we point hreflang back to itself for both:
```html
<link rel="alternate" hreflang="en" href="https://forhuman.ca/" />
<link rel="alternate" hreflang="zh-Hant" href="https://forhuman.ca/" />
<link rel="alternate" hreflang="x-default" href="https://forhuman.ca/" />
```

## HTML lang attribute

- `/` (bilingual): `<html lang="en">` with specific sections marked `lang="zh-Hant"`. This tells screen readers to switch voice for Chinese content. Example:
  ```html
  <html lang="en">
    <body>
      ...
      <div class="zh-block" lang="zh-Hant">
        <h2>學習本身，才是重點。</h2>
        ...
      </div>
    </body>
  </html>
  ```
- `/about`, `/services`: `<html lang="en">`
- `/zh-hant/about`, `/zh-hant/services`: `<html lang="zh-Hant">`

## URL structure for blog (v2)

```
/writing                 — blog index (EN)
/writing/[slug]          — post (EN)
/zh-hant/writing         — blog index (繁)  [optional]
/zh-hant/writing/[slug]  — post (繁)       [optional, only if post has zh-hant frontmatter]
```

Not every post will be translated. If a post only exists in English, clicking the toggle on that post goes to the Chinese blog index (fallback).

## Slugs

- Use kebab-case English slugs for both languages: `/writing/when-a-student-learns-the-heart` and `/zh-hant/writing/when-a-student-learns-the-heart`.
- This keeps URLs stable regardless of language. Don't translate slugs.

## Canonical URLs

Every page has `<link rel="canonical" href="...">` pointing to its own URL with:
- No trailing slash (except root)
- HTTPS
- No query strings

## Redirects

Set up in hosting config (Vercel / Cloudflare):
- `http://*` → `https://*`
- `http://www.forhuman.ca/*` → `https://forhuman.ca/*` (strip www)
- `forhuman.ca/` → `forhuman.ca` (no trailing slash)
- Legacy `classwith.nicojan.com/*` → `forhuman.ca/*` (when migrating from old site)
