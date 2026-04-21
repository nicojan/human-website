# Architecture

This doc is the "big picture" for the Human, website. For file-level detail
look at the code; this is about how the parts fit.

## Stack

- **Astro 5** with TypeScript (strict). No UI framework — `.astro` files with
  vanilla CSS are enough for a mostly-static content site.
- **Output**: fully static HTML in `dist/`. Zero runtime JS by default.
  Interactive islands only when essential.
- **Sitemap**: `@astrojs/sitemap` integration generates `sitemap-index.xml`
  at build time with both `en-CA` and `zh-Hant` locale entries.

## Routing

English at `/`, Chinese at `/zh/`. Configured via Astro's `i18n` config:

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'zh'],
  routing: { prefixDefaultLocale: false },
}
```

Every page file exists in both locations:
- `src/pages/about.astro` and `src/pages/zh/about.astro`
- `src/pages/blog/[slug].astro` and `src/pages/zh/blog/[slug].astro`
- etc.

The page files themselves are thin — they pull i18n strings for the
BaseLayout's metadata and render a shared content component for the body.

## Locale detection

At render time, `src/utils/i18n.ts` reads the pathname:

- `/zh` or `/zh/*` → `'zh'`
- everything else → `'en'`

Components call `localeFromPath(Astro.url.pathname)` and then index into
`STRINGS` from `src/i18n/strings.ts` to get UI labels.

## Content model

Three collections, all defined in `src/content/config.ts` with Zod schemas:

| Collection | Purpose | Key frontmatter |
|---|---|---|
| `blog` | Long-form posts by Nico Jan | `title`, `summary`, `date`, `author`, `tags` |
| `useful_words` | Glossary of literary / writing terms | `term`, `definition`, `example`, `etymology` |
| `faq` | Questions & answers | `question`, `category`, `order` |

All three share:
- `lang: 'en' | 'zh'` — the entry's language
- `pair_key: string` — the cross-language identifier (same value for the
  English and Chinese pair)
- `humanized_sha?: string` — SHA-256 of the body, set by `scripts/humanize.mjs`

Collections are loaded with Astro's `glob` loader pointed at each collection
directory. Files live under `src/content/<collection>/<lang>/<slug>.md`.

## Render flow

```
┌──────────────────────┐
│ src/pages/*.astro    │  route, metadata, page-level CSS
└──────────┬───────────┘
           │ imports
           ▼
┌──────────────────────┐
│ BaseLayout.astro     │  <html lang>, head, fonts, skip link, header, footer
└──────────┬───────────┘
           │ renders slot
           ▼
┌──────────────────────┐
│ Content component    │  HomeContent, AboutContent, TeachContent, PrivacyContent
│ OR                   │  OR collection index / detail page
│ getCollection(...)   │
└──────────────────────┘
```

Static pages (Home, About, What We Teach, Privacy) bilingualise in-body:
each has EN and ZH slots in the same component, rendered side-by-side on wide
viewports and stacked on narrow. The URL locale only changes `<html lang>`,
header chrome, and footer chrome.

Collection pages (FAQ, Useful Words, Blog) are monolingual per route: `/faq`
shows English entries only; `/zh/faq` shows Chinese entries only.

## Design tokens

Three layers, all in `src/styles/tokens.css`:

1. **Primitives** — raw values pulled from Figma. Example:
   `--color-bark: #322A22`, `--space-4: 1rem`.
2. **Semantic** — role-based aliases. Example: `--text-primary` aliases
   `--color-bark`, `--action-primary` aliases `--color-terracotta`. Components
   reference this layer, never primitives.
3. **Component-local** — declared inside a component's `<style>` block when
   the component needs a local alias. Example: `--nav-link-color` inside
   Header.astro.

`html[lang^="zh"]` overrides the display and body font stacks so pages served
as primary-Chinese use Noto Serif TC / Noto Sans TC instead of the English
fallback. Inline `[lang="zh-Hant"]` bits inside bilingual pages get the same
treatment via a cascading rule.

## Build + deploy pipeline

1. `npm run dev` / `npm run build` run `scripts/sandbox.mjs`, which rsyncs the
   project into `/tmp/human-build` (no `#` in the path) and executes Astro
   there.
2. After `build`, `dist/` is rsynced back into the source tree.
3. `dist/` contains pure static files: HTML, hashed CSS, hashed assets,
   `sitemap-*.xml`.
4. Deploying is: upload `dist/` to any static host. See
   [`deployment.md`](deployment.md) for specifics.

## Humanizer workflow

The humanizer MCP is used at *author* time, not build time:

1. Claude drafts markdown content.
2. Claude calls `humanizer_get_guide` / `humanizer_get_summary` from the
   humanizer MCP and rewrites the draft to pass the checks (no em-dashes, no
   AI-flagged vocabulary, varied sentence length, etc.).
3. `npm run humanize` stamps `humanized_sha` into frontmatter (SHA of body).
4. Commits ship the humanized body + hash.

`npm run humanize:check` fails if any file's body SHA differs from its stamped
hash — used in CI to prevent shipping un-humanized content.

## What intentionally isn't here

- **No client-side JS framework.** Astro islands are available if interactive
  widgets become necessary, but every component today is static HTML + CSS.
- **No dark mode palette.** The token system is structured to allow it
  (`:root { color-scheme: light }` is explicit), but we haven't designed the
  dark palette yet.
- **No CMS.** Content authors (Claude Code + Nico) edit markdown in the repo.
- **No forms.** Contact is direct channels (email, social) by design.
