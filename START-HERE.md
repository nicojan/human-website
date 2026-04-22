# Claude Code — Start Here

This is your orientation for the `forhuman.ca` marketing site build. Read this first, then proceed through the numbered docs in order.

## What you're building

A bilingual marketing site for **Human, an Education Collective** (a BC Benefit Company providing online tutoring). The design is complete in Figma. Your job is to translate the Figma design into a production Astro site with Tailwind CSS, deployed to Vercel or Cloudflare Pages.

## What you have access to

### 1. The Figma file — source of truth for visual design

File URL: `[Nico will paste the share link here]`

Relevant pages inside the file:
- **Design System** — all tokens, atoms, molecules
- **Logos and Wordmarks v2** — wordmark SVGs to export
- **Site — Desktop** — 3 finished page frames (Home, About, Services)
- **Site — Mobile** — 3 finished page frames (same three, mobile)

Key Figma node IDs (for `figma-console:figma_get_component_for_development`):
- Home Desktop: `94:436`
- Home Mobile: `94:676`
- About Desktop: `116:3112`
- About Mobile: `116:3256`
- Services Desktop: `116:2185`
- Services Mobile: `116:2622`

All component node IDs are listed in `03-components.md`.

### 2. MCP servers — sources of truth for brand and content

You have access to three MCPs. Call them rather than guessing:

- **`mcp-designer-for-human`** (https://mcp-designer-for-human.forhuman.ca/mcp) — colors, typography, spacing, logo assets
- **`mcp-writer-for-human`** (https://mcp-writer-for-human.forhuman.ca/mcp) — voice, tone, copy rules
- **`mcp-humanizer`** (https://mcp-humanizer.nicojan.com/mcp) — editorial humanization (mostly for blog, not marketing)

See `07-mcp-integration.md` for when and how to call each.

### 3. `figma-console-mcp` — read and export from Figma

Use this to:
- Fetch component specs with tokens: `figma-console:figma_get_component_for_development`
- Export wordmark SVGs: navigate to the export frames in Logos and Wordmarks v2 and use `figma-console:figma_take_screenshot` or native Figma export
- Verify visual alignment by taking screenshots of your built site and comparing to Figma

## Reading order

Read these files in this order. Each builds on the previous.

1. `00-README.md` — scope and architecture overview
2. `01-stack-decisions.md` — framework, styling, hosting decisions with rationale
3. `02-design-tokens.md` — CSS variables and Tailwind config
4. `03-components.md` — component inventory, build order, Figma node IDs
5. `04-pages.md` — page-by-page build spec
6. `05-copy-en.md` — English copy for every string on every page
7. `06-copy-zh.md` — Traditional Chinese copy (homepage only for v1)
8. `07-mcp-integration.md` — how to call the MCPs, what's canonical
9. `08-build-checklist.md` — step-by-step with acceptance criteria
10. `09-i18n-and-routing.md` — bilingual routing, hreflang, language toggle
11. `10-accessibility.md` — WCAG AA requirements, known issues, testing

## Decisions Nico has made

- **Astro, not Next.js.** The existing student dashboard at `class.forhuman.ca` is Next.js; the marketing site is separate.
- **Tailwind with CSS variables.** No UI library, no design tokens library, no React runtime in Astro.
- **Bilingual homepage, monolingual inner pages with a language toggle.** ZH inner pages are stubs for v1.
- **No CMS.** Blog posts are MDX files in the repo.
- **No tracking pixel.** Plausible or Fathom only.

## Decisions Nico needs to make (flagged in docs)

- **Primary CTA button contrast.** The brand Terracotta fails WCAG AA for button text. Recommended fix: use `--action-primary-accessible: #9A5533` (a slightly darkened variant). Implementation is specified in `02-design-tokens.md` and `10-accessibility.md`. If Nico disagrees with this approach, he'll say so; otherwise proceed with the darkened variant.

## Decisions you should NOT make unilaterally

- Copy changes. If the copy feels awkward, flag it. Don't rewrite. Copy was finalized with the writer MCP rules.
- Component structure. If a spec seems wrong, call the MCP or re-check Figma. Don't improvise.
- Routing. Follow `09-i18n-and-routing.md` exactly. Any deviation breaks SEO and user expectations.
- Color choices. Every color is a variable. If you need a shade that doesn't exist, ask — don't invent.

## The brand rule that catches people out

The brand name is **"Human,"** — with a trailing comma. Always.

- In running text: "At Human, we believe learning is the point." (The comma is part of the name and continues naturally into the sentence.)
- When the next word starts a new sentence fragment: begin lowercase. "Human, where thinking begins." (not "Human, Where thinking begins.")
- Never typeset the wordmark. Use the SVG from `/src/assets/brand/`. The comma is Terracotta-colored in the vector.

The Chinese name is **人本** (short) or **人本・共學社** (full) — the comma is English-only.

## How to start

```bash
# 1. Read the docs
cat /home/claude/claude-code-handoff/00-README.md

# 2. Initialize the project (once Nico gives you a target repo)
npm create astro@latest forhuman-marketing -- --template minimal --typescript strict
cd forhuman-marketing
npx astro add tailwind

# 3. Verify MCP access
# Call mcp-designer-for-human:get_colour_palette — you should see Bark, Cream, Terracotta, etc.
# Call mcp-writer-for-human:get_brand_context — you should see the "Human," comma rules.

# 4. Verify Figma access
# Call figma-console:figma_get_status — should show connected.
# Call figma-console:figma_get_component_for_development with nodeId "94:436" — should return the Home Desktop page spec.

# 5. Begin Phase 0 of the build checklist.
```

## When you're stuck

1. Re-read the relevant doc. The answer is probably there.
2. Call the relevant MCP for the canonical spec.
3. Inspect the Figma node for exact values.
4. If all three fail, ask Nico with a specific question.

Don't guess and ship. Don't improvise design values. Don't machine-translate Chinese copy. Don't invent components that aren't in the inventory.

## Done criteria

See `08-build-checklist.md` Phase 7. In summary:
- All 3 pages (Home, About, Services) built responsive on desktop and mobile
- Chinese stubs in place at `/zh-hant/about` and `/zh-hant/services`
- Lighthouse: 95+ performance, 100 accessibility, 95+ SEO
- Zero axe DevTools violations
- All CTAs wired to Cal.com / mailto / external URLs
- DNS ready to flip
- Nico has reviewed and approved

Good luck.
