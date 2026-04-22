# Human, — Marketing Site Build Plan

This folder contains everything Claude Code needs to build `forhuman.ca` — the Human, marketing site.

## What's in this folder

| File | Purpose |
|---|---|
| `00-README.md` | This file — overview, architecture, sequencing |
| `01-stack-decisions.md` | Framework, hosting, and infrastructure choices with rationale |
| `02-design-tokens.md` | CSS variables and design tokens (auto-generated from Figma + MCP) |
| `03-components.md` | Component inventory — what to build, in what order, with Figma node IDs |
| `04-pages.md` | Page-by-page build spec with section-level structure |
| `05-copy-en.md` | All English copy, page by page, ready to consume |
| `06-copy-zh.md` | All Traditional Chinese copy, page by page |
| `07-mcp-integration.md` | How to call MCPs during development, what to update in `mcp-designer-for-human` |
| `08-build-checklist.md` | Step-by-step implementation order with acceptance criteria |
| `09-i18n-and-routing.md` | Bilingual routing strategy, language switching, SEO |
| `10-accessibility.md` | A11y requirements, known issues, contrast fixes |

## Scope

**In scope:** Marketing site at `forhuman.ca`
- Home page (bilingual, always shows both EN + ZH)
- About page (monolingual, with EN/繁 toggle routing to mirror page)
- Services page (monolingual)
- Landing page `/english-teacher-vancouver` (monolingual, SEO)
- Blog (to be built from Figma once designed — shares components)
- Contact route (simple form, TBD)

**Out of scope:** 
- `class.forhuman.ca` student dashboard (existing Next.js app, separate repo)
- Authentik SSO integration (not needed for marketing site)
- Video hosting / player (we'll hotlink Vimeo or similar; player is just a thumbnail+play overlay)
- Booking system (CTAs link to Cal.com externally)

## One-paragraph summary

forhuman.ca is a static marketing site built with **Astro**, styled with **Tailwind CSS** configured to match the brand's CSS variables, deployed to **Vercel** (or Cloudflare Pages). The Figma file is the source of truth for layout and visual tokens; `mcp-designer-for-human` is the source of truth for brand rules and component specifications; `mcp-writer-for-human` is the source of truth for copy voice and formatting. When in doubt, consult the MCPs before committing.

## Working with this handoff

1. Read `01-stack-decisions.md` first to understand the architecture.
2. Set up the project per `01-stack-decisions.md` — Astro, Tailwind, TypeScript, i18n.
3. Build design tokens from `02-design-tokens.md`. Don't improvise values.
4. Build components bottom-up per `03-components.md`. Test each in isolation.
5. Compose pages per `04-pages.md`. Pull copy from `05-copy-en.md` and `06-copy-zh.md`.
6. Run the checklist in `08-build-checklist.md`. Don't claim done until it all passes.
7. Call MCPs when you need clarification — don't guess.

## What's already in Figma

- Full design system with 4 variable collections (Primitives, Semantic, Spacing, Typography)
- Brand marks: `logo/wordmark-en`, `logo/wordmark-zh`, `logo/comma-mark`, all as component sets with colour/background variants
- 16 marketing molecule components (Desktop + Mobile variants): Nav, Hero, PrinciplePair, MediaCard, BlogCard, FeatureCard, FAQItem, CTABand, Footer, SectionHeader, BilingualBlock, VerticalChinese
- 8 page frames: Home, About, Services, Landing × Desktop + Mobile

Figma file URL: [paste when ready — same file as Design System, pages "Site — Desktop" and "Site — Mobile"]
