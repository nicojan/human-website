# CLAUDE.md — operating manual for Claude Code sessions

You are working in the bilingual marketing website for **Human, an Education Collective** (人本・共學社). This file is the shortest path to being useful without breaking the architecture.

## What this is

- **Hybrid static site**: hand-written HTML, CSS, and vanilla JS at the top level; Hugo for the blog at `/writing/`. No Node toolchain for the marketing pages.
- **Bilingual routing**: EN at `/`, Traditional Chinese at `/zh-hant/`.
- **Hugo blog** with EN and `zh-hant` language sections. Output is generated into `public/writing/` at build time and is gitignored.
- **Three-layer design tokens** at `public/css/tokens.css` (primitive → semantic → component-local). Never hardcode colour, spacing, or typography values outside this file.
- **The comma in "Human,"** is a defining brand element and always appears in English text. The wordmark lives in `public/brand/` as canonical SVGs — never re-type it in a font.

## Commands

```bash
bash scripts/dev.sh       # local dev at http://localhost:4321
bash scripts/build.sh     # production build (outputs into public/, including public/writing/)
```

Hugo must be installed: `brew install hugo` on macOS.

## Repo map

```
/
├── public/                   # deployable tree
│   ├── *.html, css/, js/, brand/, images/, videos/
│   └── writing/              # gitignored, built by Hugo
├── blog/                     # Hugo source
├── scripts/                  # build.sh, dev.sh
├── docs/
│   └── superpowers/specs/    # design specs
└── README.md
```

## Design tokens

All values come from the Figma design system, mirrored by `mcp-designer-for-human`. The layered approach:

1. **Primitives** in `public/css/tokens.css` (Layer 1): hex values, raw spacing, raw type sizes.
2. **Semantic tokens** (Layer 2) in the same file: `--text-primary`, `--bg-canvas`, `--action-primary`, etc. These reference primitives.
3. **Component-local** (Layer 3): component CSS references semantic tokens only.

**Never hardcode a hex or a pixel value in a component's CSS.** If you find yourself typing `#B86F4A` anywhere outside `tokens.css`, you're skipping the semantic layer.

## Conventions (non-negotiable)

1. **Commits** — conventional format: `<type>(<scope>): <imperative summary>`. Atomic commits only. No mixing content with code.
2. **Never `--no-verify`** and never force-push without explicit user consent.
3. **No em dashes** in user-visible copy. Use commas, semicolons, or split sentences.
4. **Title case** for buttons, nav, and section-title fragments per `mcp-writer-for-human`. Sentence case with terminal punctuation for section titles that are complete sentences with a verb.
5. **Canadian English** spelling (colour, centre, programme).
6. **All emails** render as `contact@forhuman.ca`. The old `hi@forhuman.ca` is retired.
7. **Blog posts are by Nico Jan.** Default `author: "Nico Jan"` in the archetype.
8. **ZH character conventions**: 臺 not 台, 裡 not 裏, full-width punctuation, half-width space around English tokens in Chinese prose.

## Authoring content

### Marketing pages
Edit the HTML directly. Reference semantic tokens from CSS. Run any user-visible string past `mcp-humanizer` rules (avoid `leverage`, `facilitate`, `comprehensive`, `seamless`, the `x, not y` construction, and so on).

### Blog posts
1. Draft EN at `blog/content/en/posts/<slug>.md` with frontmatter including `title`, `date`, `summary`.
2. Humanize through `mcp-humanizer` (use `humanizer_get_summary` for short posts, `humanizer_get_guide` for long ones).
3. If translating: create `blog/content/zh-hant/posts/<slug>.md` with matching frontmatter but Chinese content. Mirror section-level structure; do not translate word-for-word.
4. `bash scripts/build.sh` to regenerate `public/writing/`.
5. Commit with `content(blog): <slug>`.

## Accessibility expectations

- WCAG 2.1 AA on every page. Lighthouse a11y = 100 is the merge gate.
- Keyboard focus visible on every interactive element (Terracotta ring from `--focus-ring`).
- Touch targets ≥ 44 px.
- One `<h1>` per page.
- `<html lang>` set per route; inline language changes use `<span lang="zh-Hant">` or `<span lang="en">`.
- `prefers-reduced-motion` respected — motion collapses to opacity.

## Figma + MCP source of truth

- **Figma file "Logo"** (file key `BmnkpzU2LBdw8kzD2mnkcQ`) is the authoritative source for colour primitives, spacing, typography scale, and component specs.
- **`mcp-designer-for-human`** mirrors Figma and adds font families, motion, elevation, icon system, and component pattern documentation.
- **`mcp-writer-for-human`** owns voice, tone, word choice, glossary, formatting rules, and brand philosophy — not visual rules.
- **`mcp-humanizer`** is the rewriter that makes machine-generated prose sound like it was written by a human.

If Figma token values change, update `public/css/tokens.css`. If the MCP data changes, verify against Figma before blindly trusting the MCP.

## When you're about to do something risky

- **Moving the repo?** Watch out for the `#` in `# Human,/Website`. It used to break Astro's content resolver (that's why the old repo had a `sandbox.mjs` script). Plain-HTML files are unaffected; Hugo is also unaffected. But if you add any Node tooling later, test its URL-resolving behaviour first.
- **Adding a page?** Add it in both locales (EN + ZH) so the language toggle fallback doesn't break. If the Chinese version is deferred, stub it with a "Coming soon · 即將推出" page that keeps structural labels bilingual.
- **Adding a new content type?** Add it under Hugo in `blog/content/` with a new section, or handle it in plain HTML under `public/`. Don't invent a third authoring path.

## When in doubt

- Read `docs/superpowers/specs/2026-04-22-website-design.md` for the big picture.
- Check the copy docs (`05-copy-en.md`, `06-copy-zh.md`) for canonical page text before generating new copy.
- If a token value seems off, call the designer MCP and the writer MCP — don't guess.
