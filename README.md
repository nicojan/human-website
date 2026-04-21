# Human, — website

Bilingual (English + 繁體中文) static site for **Human, an Education Collective**
(人本・共學社). Built with Astro 5 and a Figma-driven design token system.

## What's here

Seven pages, each available at `/` (English) and `/zh/` (Traditional Chinese):

- **Home** — hero, approach, universities, contact
- **About** — origin, philosophy, note from Nico
- **What We Teach** — subjects, methods, audience
- **FAQ** — collection-driven Q&A
- **Useful Words** — glossary
- **Blog** — posts by Nico Jan, Markdown-authored
- **Privacy** — plain-English statement

## Getting started

```bash
npm install
npm run dev        # local dev at http://localhost:4321
npm run build      # produces ./dist
npm run check      # type-check
```

Node 18.17.1 or later.

## Writing content

See [`docs/content-authoring.md`](docs/content-authoring.md) for the full flow.

The short version:

```bash
# 1. Create the English file at src/content/<collection>/en/<slug>.md
#    with frontmatter matching the Zod schema in src/content/config.ts.
# 2. Mirror it at src/content/<collection>/zh/<slug>.md with the same pair_key.
# 3. Stamp the humanized SHA:
npm run humanize
# 4. Commit both files together with a `content(<collection>)` message.
```

## Docs

- [`docs/architecture.md`](docs/architecture.md) — stack, data flow, render model
- [`docs/content-authoring.md`](docs/content-authoring.md) — how to add blog posts, FAQ, glossary
- [`docs/i18n.md`](docs/i18n.md) — translation conventions and the language switcher
- [`docs/deployment.md`](docs/deployment.md) — hosting + build + cache policy
- [`docs/decisions/`](docs/decisions/) — architectural decision records
- [`CLAUDE.md`](CLAUDE.md) — the operating manual for Claude Code sessions
- [`docs/superpowers/specs/`](docs/superpowers/specs/) — design specs

## Brand system

Colour, typography, spacing, and component patterns come from the Figma file
"Logo" (design-system page), mirrored into `mcp-designer-for-human`. Voice and
tone live in `mcp-writer-for-human`. The humanizer MCP checks text for
AI-typical patterns before anything ships.

## Licence

© Human Education Collective Ltd. All rights reserved. The brand assets in
`public/brand/` are proprietary.
