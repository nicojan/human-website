# CLAUDE.md — operating manual for Claude Code sessions

This repo is the bilingual (EN + ZH) website for **Human, an Education Collective**
(人本・共學社). You are almost certainly here to author content, fix something,
or extend a feature. This file is the shortest path to being useful without
breaking anything.

## What this is

- **Astro 5** static site. Zero runtime JS by default.
- **Bilingual routing**: EN at `/`, ZH at `/zh/`. Never add a locale the site
  doesn't already support without updating `src/i18n/strings.ts` and
  `astro.config.mjs`.
- **Three content collections** at `src/content/`: `blog`, `useful_words`, `faq`.
  Every entry has `lang` + `pair_key` so translations stay linked.
- **Three-layer CSS tokens** at `src/styles/tokens.css` (primitives → semantic →
  component-local). Never hardcode colour, spacing, or typography values outside
  this file.
- **The comma in "Human,"** is a defining brand element. It always appears in
  English text. The wordmark lives in `public/brand/` as canonical SVGs; never
  re-type it in a font.

## One-time check before you touch anything

```bash
# You only need to do this once per environment.
node --version            # must be >= 18.17.1; we develop on 24.x
```

## Commands you will actually use

```bash
# Start dev server (sandboxed — see "The '#' path issue" below)
npm run dev               # runs at http://localhost:4321

# Type-check
npm run check

# Build the static site to ./dist
npm run build

# Stamp humanized_sha on any MD whose body has changed
npm run humanize

# CI/pre-commit: fail if any content MD is missing/stale humanized_sha
npm run humanize:check
```

Default `dev`, `build`, and `check` scripts route through `scripts/sandbox.mjs`,
which mirrors the project into `/tmp/human-build` before running Astro. If you
ever move this repo to a path without `#`, the `:raw` variants (`dev:raw`,
`build:raw`, `check:raw`) become safe to use directly.

## The "#" path issue (read this once, save yourself an hour)

The repo lives at `/Volumes/n1TB/GDrive (Class with Nico)/# Human,/Website`.
The `#` in `# Human,` is URL-encoded as `%23` when Astro resolves content paths
internally. A later decoder treats it as a fragment delimiter, truncates the
path at `/Volumes/n1TB/GDrive (Class with Nico)/`, and `astro sync` dies with
`EISDIR`. It's not a bug in our code; it's Astro's URL parsing plus the path.

The fix that ships is `scripts/sandbox.mjs`: it rsyncs the project into
`/tmp/human-build` (no `#`) before every Astro command, then rsyncs `dist/`
back. That's what `npm run dev`, `npm run build`, and `npm run check` do under
the hood. Do **not** try to work around this by symlinking; Node's realpath
will resolve back to the original path.

## Repo map

```
/
├── astro.config.mjs                 # i18n + sitemap config
├── src/
│   ├── pages/                       # routes; EN at root, ZH under /zh/
│   ├── layouts/                     # BaseLayout, BlogPostLayout
│   ├── components/
│   │   ├── content/                 # bilingual static-page bodies
│   │   └── *.astro                  # chrome + content components
│   ├── content/
│   │   ├── config.ts                # Zod schemas
│   │   ├── blog/{en,zh}/
│   │   ├── useful_words/{en,zh}/
│   │   └── faq/{en,zh}/
│   ├── styles/                      # tokens, reset, global
│   ├── i18n/strings.ts              # UI-chrome strings (nav, footer, a11y)
│   └── utils/i18n.ts                # locale helpers
├── public/
│   ├── brand/                       # wordmarks, commas, favicons, OG
│   └── images/schools/              # university logos
├── scripts/
│   ├── humanize.mjs                 # SHA-stamper for humanized content
│   └── sandbox.mjs                  # '#'-path workaround runner
└── docs/                            # architecture, authoring, i18n, deploy
```

## Conventions (non-negotiable)

1. **Commits**: conventional format — `<type>(<scope>): <imperative summary>`.
   Types: `feat`, `fix`, `refactor`, `docs`, `style`, `content`, `a11y`,
   `perf`, `test`, `chore`, `ci`, `build`. Atomic commits only. Content, code,
   and dependency bumps never mixed.
2. **Never `--no-verify`** and never force-push without explicit user consent.
3. **Every MD file has `humanized_sha`** matching `sha256(body)`. Run
   `npm run humanize` after editing any content file. CI should fail on stale
   hashes via `npm run humanize:check`.
4. **Three-layer tokens**: components reference semantic tokens only. If you
   write a primitive value like `#322A22` or `8px` directly in a component's
   CSS, you are doing it wrong.
5. **No em-dashes (`—`) in user-facing content.** AI-typical. Use commas,
   semicolons, or periods.
6. **Blog posts are authored by Nico Jan** (`author: "Nico Jan"` is the default
   in the schema). Never invent a co-author.

## Authoring content

Exact commands live in `docs/content-authoring.md`. The template flow:

1. Draft the English markdown at the right path (e.g.
   `src/content/blog/en/<slug>.md`) with full frontmatter including `lang: en`
   and a `pair_key`.
2. Humanise the draft by calling the mcp-humanizer tools (`humanizer_get_guide`
   for major posts; `humanizer_get_summary` for short entries). Rewrite
   problem passages in place.
3. Write the Chinese pair at `src/content/blog/zh/<slug>.md` with the same
   `pair_key`. Mirror section-level structure; do not translate word-for-word.
4. `npm run humanize` to stamp both files.
5. Commit with `content(<collection>): <slug>`.

## Accessibility expectations

- WCAG 2.1 AA on every page. Verified via Lighthouse.
- Keyboard focus visible on every interactive element (Terracotta ring from
  `--focus-ring`).
- Touch targets `>= 44px`.
- One `<h1>` per page.
- `<html lang>` set per route; inline language changes use
  `<span lang="zh-Hant">` or `<div lang="en-CA">`.
- `prefers-reduced-motion` respected — motion collapses to opacity.
- Never drop below Lighthouse a11y 95. Anything lower means you broke
  something and should fix it before merging.

## Figma + MCP source of truth

- **Figma file "Logo"** (file key `BmnkpzU2LBdw8kzD2mnkcQ`) is the authoritative
  source for colour primitives, spacing, typography scale, and component specs.
- **`mcp-designer-for-human`** mirrors Figma and adds font families, motion,
  elevation, icon system, and component pattern documentation.
- **`mcp-writer-for-human`** owns voice, tone, word choice, glossary,
  formatting rules, and brand *philosophy* — NOT visual rules.
- **`mcp-humanizer`** is a companion for rewriting text to avoid AI tells.

If the Figma file changes token values, update `src/styles/tokens.css`
correspondingly. If the MCPs change, do **not** assume the MCP matches — check
Figma.

## When you're about to do something risky

- Moving the repo? The `#` path issue will still bite you. Read the section
  above.
- Touching the `humanize.mjs` script? Keep it idempotent. It must be safe to
  run any number of times.
- Adding a page? Add it in BOTH locales. A page without a translation pair
  breaks the language switcher's fallback.
- Adding content to a new collection? Update `src/content/config.ts` with a
  Zod schema and update `docs/content-authoring.md`.

## When in doubt

- Read `docs/architecture.md` for the big picture.
- Read `docs/content-authoring.md` for any content task.
- Read `docs/i18n.md` for anything translation-related.
- Check `docs/decisions/` — if someone wrote an ADR, it's load-bearing.
