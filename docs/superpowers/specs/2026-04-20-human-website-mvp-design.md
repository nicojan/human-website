---
title: Human, — Website MVP design
date: 2026-04-20
status: approved
owner: Nico Jan
---

# Human, — Website MVP design

## Context

The predecessor site at `classwith.nicojan.com` (Class with Nico) launches a rebrand under **Human, an Education Collective** (人本・共學社). No new content is authored yet; this MVP adapts the proven Class with Nico structure into Human's brand system and voice, while adding collection-driven content (blog, FAQ, glossary) so Claude Code sessions can grow the site by dropping markdown files.

## Goals

1. Ship a production-grade bilingual (EN + ZH) static site for Human, on the MVP scope below.
2. Keep the Figma → designer-MCP → CSS tokens pipeline as the single source of truth for visual design.
3. Give future Claude Code sessions a repo that is self-describing: one command to run, one command to build, and every convention documented.
4. Every page and every piece of copy that ships must pass the mcp-humanizer guidelines.

## Non-goals

- Dark mode visual design (tokens will be structured to allow it later; no palette shipped).
- Blog commenting, search, or tag landing pages (can follow later).
- Forms or bookings (contact stays at social handles + email).
- Dynamic server-rendered features (site is fully static).

## MVP scope

Seven pages, each bilingual (EN + ZH):

| Page | Type | Notes |
|---|---|---|
| Home | Static | Hero, approach, universities, contact anchor |
| About | Static | Origin story, philosophy, mission |
| What We Teach | Static | Subjects, methods, outcomes |
| FAQ | Collection-driven | `faq` collection rendered in order |
| Useful Words | Collection-driven | `useful_words` collection rendered alphabetically |
| Blog | Collection-driven | `blog` collection; posts authored by **Nico Jan** |
| Privacy | Static | Legal boilerplate for a small education business |

Contact lives as a section on Home plus in every page footer — not a standalone page.

## Architecture (locked)

- **Stack:** Astro 5 with TypeScript (strict), zero UI framework. Vanilla CSS with three-layer tokens.
- **Output:** Fully static HTML in `dist/` — zero runtime JS by default; interactive islands only when essential (e.g., the WeChat/WhatsApp QR modal).
- **Routing:** EN at `/`, ZH at `/zh/`. `<html lang>` set per route. `hreflang` cross-links between translation pairs. Redirect logic: none — language chosen by URL.
- **Content collections:** three Zod-typed collections — `blog`, `useful_words`, `faq` — under `src/content/`. Each entry declares its `lang` and `pair_key` so translations stay linked.
- **Humanizer timing:** **author-time, not build-time.** When I add or edit an MD file, I immediately run the humanizer and write the humanized body back to the file. A `humanized_sha` field in the frontmatter records the SHA of the humanized body; re-runs are skipped when the body hash matches.
- **Design tokens:** primitives generated from the Figma Logo file (colours, spacing, typography). Semantic tokens map primitives to roles. Component CSS never references primitives directly.

## Repo layout

```
/
├── CLAUDE.md                        # operating manual for Claude Code sessions
├── README.md                        # human getting-started
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── src/
│   ├── pages/                       # EN at root; ZH under /zh
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── what-we-teach.astro
│   │   ├── faq.astro
│   │   ├── useful-words.astro
│   │   ├── privacy.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── zh/                      # mirrored ZH tree
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── components/
│   │   ├── Wordmark.astro           # the comma-bearing brand mark
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── LangSwitch.astro
│   │   ├── BilingualBlock.astro     # EN + ZH side-by-side
│   │   ├── ApproachSection.astro
│   │   ├── UniversityGrid.astro
│   │   ├── ContactBlock.astro
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   ├── PostCard.astro
│   │   ├── WordCard.astro
│   │   └── FaqItem.astro
│   ├── content/
│   │   ├── config.ts                # Zod schemas for blog, useful_words, faq
│   │   ├── blog/{en,zh}/
│   │   ├── useful_words/{en,zh}/
│   │   └── faq/{en,zh}/
│   ├── styles/
│   │   ├── tokens.css               # primitives + semantic, exported from MCP/Figma
│   │   ├── reset.css
│   │   └── global.css
│   ├── i18n/
│   │   └── strings.ts               # nav labels, footer strings
│   └── utils/
│       └── i18n.ts                  # helpers for translation pairing
├── public/
│   ├── brand/                       # wordmarks, comma marks, favicons, OG image
│   └── images/
│       └── schools/                 # university logos (carried forward from CWN)
├── scripts/
│   └── humanize.mjs                 # idempotent humanizer runner for MD files
└── docs/
    ├── architecture.md
    ├── content-authoring.md
    ├── i18n.md
    ├── deployment.md
    ├── decisions/                   # ADRs (0001-…, 0002-…)
    └── superpowers/specs/           # design docs including this file
```

## Content model

Each collection's Zod schema:

**blog**
```ts
{ title, summary, date, updated?, author: "Nico Jan" (default),
  lang: "en" | "zh", pair_key, tags: string[], humanized_sha? }
```

**useful_words**
```ts
{ term, pronunciation?, definition, example, etymology?,
  lang, pair_key, humanized_sha? }
```

**faq**
```ts
{ question, answer, category, order: number,
  lang, pair_key, humanized_sha? }
```

Every entry's body is markdown. Blog post bodies render with `BlogPostLayout`; collections render with their own card components.

## Design tokens (three-layer)

1. **Primitives** (`--color-bark: #322A22`, `--space-4: 1rem`, `--fs-body: 1.0625rem`) — generated from Figma variables.
2. **Semantic** (`--text-primary: var(--color-bark)`, `--bg-canvas: var(--color-white)`, `--action-primary: var(--color-terracotta)`) — what components reference.
3. **Component-local** (`--nav-link-color: var(--text-primary)`) — defined inside component CSS when a component needs a local alias.

Typography is fluid: headings use `clamp()` so the type scale compresses gracefully on narrow viewports; body stays at 17px fixed (per Apple HIG, preserved by rem units).

## Accessibility (WCAG 2.1 AA baseline)

- All text on background combinations verified ≥ 4.5:1 for body, 3.0:1 for large text (checked via designer-MCP contrast data).
- Keyboard focus visible on every interactive element (Terracotta focus ring from tokens).
- Touch targets ≥ 44×44 px.
- Semantic HTML: one `<h1>` per page, proper landmark regions, descriptive link text (no "click here").
- `<html lang>` set per route; inline language changes use `<span lang="zh-Hant">`.
- `prefers-reduced-motion` respected — all non-essential motion collapses to opacity transitions.
- Images have meaningful `alt`; decorative images use `alt=""`.
- Skip link at the top of every page.

## Internationalisation

- URLs: `/` (EN, default) and `/zh/` (ZH).
- Each content entry links to its translation via `pair_key`. The language switcher resolves to the paired URL when a translation exists; otherwise it falls back to the language index.
- `hreflang` tags on every page: `x-default` (EN), `en-CA`, `zh-Hant`.
- Display-font pairings: Literata (EN display), Atkinson Hyperlegible Next (EN body), Noto Serif TC (ZH display), Noto Sans TC (ZH body), JetBrains Mono (EN code). Fonts served from Google Fonts with `display: swap`.
- The bilingual layout on static pages mirrors Class with Nico: EN column first, ZH column second — but components expose a prop to flip order per page.

## Content workflow (Claude-Code authored)

Adding a blog post (the template flow for all collections):

1. `src/content/blog/en/<slug>.md` written with frontmatter + body (English).
2. `scripts/humanize.mjs` runs on the file — posts the body to mcp-humanizer, writes the humanized body back in place, updates `humanized_sha`.
3. A Chinese pair is written to `src/content/blog/zh/<slug>.md` with matching `pair_key`, sent through the humanizer with `content_type: prose` and language-scoped rules.
4. Commit `content(blog): <slug>` — content only, no code changes.
5. `npm run build` to verify; `npm run dev` to preview via chrome-devtools MCP.

Authorship: every blog post uses `author: "Nico Jan"` by default; a byline and link back to the Human, about section appears on each post.

## Version-control conventions

- **Commit format:** `<type>(<scope>): <imperative summary>`.
  - Types: `feat`, `fix`, `refactor`, `docs`, `style`, `content`, `a11y`, `perf`, `test`, `chore`, `ci`, `build`.
  - Scopes: `tokens`, `layout`, `home`, `about`, `blog`, `faq`, `words`, `i18n`, `deps`, `a11y`, `ci`, `docs`, etc.
- Atomic commits: content, code, and dependency bumps are never mixed.
- Main stays green. Breaking changes announced via ADR.
- Never `--no-verify`; never force-push without explicit ask.
- Attribution footer disabled globally (per user config).

## Documentation (handoff-critical)

- `CLAUDE.md` at root — map, commands, conventions, gotchas, where to look.
- `README.md` — human-facing getting-started.
- `docs/architecture.md` — data flow and render model.
- `docs/content-authoring.md` — exact steps for adding a blog post, FAQ entry, or useful word.
- `docs/i18n.md` — pair keys, translation discipline, humanizer rules per language.
- `docs/deployment.md` — hosting + build + cache policy.
- `docs/decisions/NNNN-<slug>.md` — ADRs for non-obvious choices.

## Deployment

The static build ships to any host that serves `dist/` over HTTPS. The MVP documents two targets (Netlify and Cloudflare Pages) and defaults to Cloudflare Pages for edge caching on a global audience. Actual host configuration lives in `docs/deployment.md` and can be swapped without touching the codebase.

## Testing

- **Build check:** `npm run build` must succeed on every PR.
- **Type check:** `astro check` on CI.
- **Schema check:** Zod validation for every content entry (fails the build on schema drift).
- **Accessibility check:** Lighthouse accessibility score ≥ 95 on Home, About, What We Teach, Blog index, one Blog post. Run via chrome-devtools MCP.
- **Visual spot-check:** chrome-devtools MCP screenshot at 375 / 768 / 1280 for every page pre-push.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Humanizer produces ZH output that subtly changes meaning | Cross-language rules loaded explicitly; EN+ZH pair reviewed together before commit |
| Google Fonts outage degrades typography | `font-display: swap` + system font fallback in tokens |
| Future Claude session unaware of author-time humanization | Pre-commit check in CI fails if `humanized_sha` is missing on modified MD files |
| Figma tokens drift from MCP | `scripts/verify-tokens.mjs` (post-MVP) that diffs Figma variables against generated CSS |
| Blog growth without SEO hygiene | Schema.org BlogPosting on every post, sitemap.xml generated at build, canonical links |

## Open items deferred to post-MVP

- Teachers page (skipped for MVP per user).
- Dark mode palette (token structure ready, palette not shipped).
- Newsletter subscribe.
- Blog search + tag landing pages.
- Contact form with spam protection.
- Analytics beyond a lightweight privacy-respecting counter.
