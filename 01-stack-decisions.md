# Stack Decisions

## Framework: Astro

**Why Astro:**
- The marketing site is content-heavy and static. Astro ships zero JS by default, making it the fastest possible option for readers and for SEO.
- Island architecture lets us add interactive bits (video player, FAQ accordion, language toggle) only where needed, without Next.js's all-or-nothing client bundling.
- Native MDX support means the blog integrates cleanly as content files, no CMS needed initially.
- Bilingual routing via Astro's i18n is straightforward and static.
- Separate from `class.forhuman.ca` (Next.js) means independent deployment cadence, no coupling.

**What Astro is not good for:**
- Heavily interactive apps. But this is a marketing site — interactivity is limited to an accordion, language toggle, and video thumbnails.
- Server-rendered personalization. Not needed here.

**If the requirements change** — e.g., a Contact form that needs server-side email, or booking embedded directly instead of linking to Cal.com — Astro supports server routes too, so we don't have to migrate.

## Styling: Tailwind CSS with brand tokens

- Tailwind's config reads our CSS variables, so every class like `bg-canvas` or `text-bark` maps to the actual brand token.
- Design token values come from `mcp-designer-for-human` (the canonical source) and are mirrored in Figma variables. When the MCP updates, Tailwind config updates in the same commit.
- No hardcoded hex values in components. Ever. If a component needs a color, it goes through the token layer.

## TypeScript

- Strict mode on.
- Types for all page props and component APIs.
- Astro's default TS setup, no changes needed.

## Content: MDX for blog, Astro components for pages

- Blog posts in `/src/content/blog/` as MDX.
- Pages in `/src/pages/` using Astro components, consuming copy from constants (per `05-copy-en.md` and `06-copy-zh.md`) — or, if you prefer, structured content collections.

## Hosting: Vercel (preferred) or Cloudflare Pages

Either works. Vercel's DX is slightly tighter; Cloudflare Pages is free and fast. The site is static so the choice is mostly about preferred tooling.

**DNS:** `forhuman.ca` currently managed via Cloudflare. Keep the CNAME / nameserver arrangement that already exists; just add a deployment target.

## Fonts

- **Literata** (variable) — headings, display. Google Fonts or self-host with `fontsource`.
- **Atkinson Hyperlegible Next** — body, UI. Self-host; it's not on Google Fonts.
- **Noto Serif TC** and **Noto Sans TC** — Chinese headings and body respectively. Google Fonts (self-host if performance matters).

Use `font-display: swap` and preload the two primary faces (Literata Medium, Atkinson Regular) to avoid layout shift.

## What we are NOT using

- ❌ **CMS** — no Sanity, no Contentful, no Notion API. MDX in the repo is fine for now. Add a CMS when the team grows past one editor.
- ❌ **Analytics pixel** — add Plausible or Fathom if needed later. No Google Analytics (privacy-first brand posture).
- ❌ **React** (in Astro) — we don't need React for marketing. Any interactive bits can be plain JS or Astro's `<script>` blocks.
- ❌ **Client-side i18n library** — Astro's static i18n is enough. No runtime translation.
- ❌ **A UI library** like shadcn/ui — we have our own design system.

## Directory structure

```
forhuman-marketing/
├── src/
│   ├── components/
│   │   ├── atoms/          # Button, Link, Wordmark
│   │   ├── molecules/      # Hero, PrinciplePair, etc.
│   │   └── layouts/        # PageLayout, BlogLayout
│   ├── content/
│   │   └── blog/           # MDX posts
│   ├── pages/
│   │   ├── index.astro              # Home (bilingual)
│   │   ├── about.astro              # About EN
│   │   ├── services.astro           # Services EN
│   │   ├── english-teacher-vancouver.astro  # Landing EN
│   │   ├── writing/
│   │   │   └── [...slug].astro      # Blog posts
│   │   └── zh-hant/                 # Chinese mirror
│   │       ├── about.astro
│   │       └── ...
│   ├── styles/
│   │   ├── tokens.css     # CSS variable definitions (from mcp-designer-for-human)
│   │   └── global.css     # Global styles, font imports
│   ├── i18n/
│   │   ├── en.ts          # English strings
│   │   └── zh-hant.ts     # Traditional Chinese strings
│   └── assets/
│       └── brand/         # Wordmark SVGs exported from Figma
├── public/
│   └── fonts/             # Self-hosted Atkinson Hyperlegible
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
