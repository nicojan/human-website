# MCP Integration

The site is built with three MCPs as living sources of truth. Claude Code should treat these as first-class resources to consult during development, not just at planning time.

## The three MCPs

### `mcp-designer-for-human`
URL: `https://mcp-designer-for-human.forhuman.ca/mcp`

**Purpose:** Design system canon. Colors, typography, spacing, component specs, accessibility standards, logo assets.

**When to call during development:**
- Before inventing any design decision — call `get_colour_palette`, `get_typography`, `get_spacing` to verify.
- Before building a component — call `get_components` to see if a canonical spec exists.
- When pairing colors — call `get_contrast_ratios` or `get_accessibility_standards`.
- When asked about the logo — call `get_logo_for_context` for the right variant; `get_logo_asset` for the actual bytes.
- For dark-mode (v2) — call `get_dark_mode`.

**When NOT to call:**
- For writing, content, or copy decisions — those belong to `mcp-writer-for-human`.
- For humanizing AI-flavored prose — that's `mcp-humanizer`.

### `mcp-writer-for-human`
URL: `https://mcp-writer-for-human.forhuman.ca/mcp`

**Purpose:** Voice, tone, word choice, formatting rules, cross-language guidelines.

**When to call during development:**
- Before writing any UI string or copy (error messages, placeholder text, empty states, button labels).
- When deciding between em dash and comma in parent-facing copy.
- When checking Canadian vs. American spelling.
- When formatting the brand name in prose — call `get_brand_context` to verify the "Human," comma rule.

**Key calls:**
- `get_style_for_task` — composite tool; pass `task_type`, `language`, `audience`. Returns everything for that context.
- `get_brand_context` — full brand identity block (names, philosophy, comma rules).
- `get_tone_for_context` — tone calibration for specific writing situations.

### `mcp-humanizer`
URL: `https://mcp-humanizer.nicojan.com/mcp`

**Purpose:** Turn AI-flavored text into something that reads like a human wrote it.

**When to call:**
- Mostly for editorial content (blog posts), not marketing copy (which is already rule-governed by the writer MCP).
- If a component generates dynamic text — e.g., an AI-summarized blog post excerpt — run it through the humanizer before rendering.
- Note: the humanizer's em-dash recommendation is **overridden by the writer MCP's comma preference** in parent-facing copy. This is documented in the writer MCP.

---

## Updates needed to `mcp-designer-for-human`

The MCP is already the source of truth for the palette and semantic tokens, which match the Figma variables used throughout the mockups. **No palette or token updates are needed.**

However, the MCP's `get_components` currently returns only dashboard component specs (`button`, `input`, `card`, `modal`, etc.) — it does **not** include the marketing molecules we built in Figma. This is a gap.

**Suggested update to the MCP:** Add a new component category for marketing molecules. These are the components that need canonical specs added:

```
Marketing/Hero/Bilingual
Marketing/Hero/Mono
Marketing/Nav/Bilingual
Marketing/Nav/Mono
Marketing/Nav/Mobile
Marketing/SectionHeader
Marketing/BilingualBlock
Marketing/PrinciplePair (variants: text-left, text-right)
Marketing/BlogCard
Marketing/MediaCard
Marketing/FeatureCard
Marketing/FAQItem
Marketing/CTABand/Bilingual
Marketing/CTABand/Mono
Marketing/Footer/Bilingual
Marketing/Footer/Mono
Marketing/VerticalChinese
```

For each, the MCP should expose:
- Variants, sizes, states (default, hover, focus, disabled where applicable)
- Anatomy (slot names, required vs. optional content)
- Layout constraints (max widths, spacing rules)
- Token references (which semantic tokens each element uses)
- Behaviour (e.g., FAQItem accordion open/closed)
- Accessibility notes (focus order, ARIA roles)

**How to build this:** Each marketing molecule in Figma has the structure needed. Call `figma-console:figma_get_component_for_development` on each Figma node ID (listed in `03-components.md`) and the response has all the data needed to populate the MCP. A small script could iterate through the components and generate the MCP entries.

This is a **nice-to-have for v1** — Claude Code can build from the Figma specs directly. The MCP update is a v1.5 cleanup for downstream consistency.

---

## Updates needed to `mcp-writer-for-human`

The writer MCP already has the brand voice, word choice, and formatting rules. The latest copy (this handoff) follows those rules.

**One gap:** the current copy in this handoff is not yet stored in the writer MCP. If you want the site's canonical copy to live in the MCP (useful for future updates, A/B tests, etc.), add a new endpoint like `get_site_copy(page, language)` that returns the structured copy for each page.

This is **not required for v1**. The copy lives in this handoff and, after build, in `/src/i18n/` or content collections. Storing it in the MCP is a future refactor.

---

## Runtime MCP usage (production)

The MCPs are **build-time tools**, not runtime. The production site should not call them. All MCP data is baked into the build:
- Design tokens → compiled to CSS variables
- Copy strings → compiled to Astro components / content collections
- Logo SVGs → exported and shipped to `/src/assets/`

If a strategic decision is made later to make the site dynamic (e.g., A/B testing copy via MCP), that's a separate architectural choice.

---

## How Claude Code should start

When Claude Code first opens this project, it should:

1. Read `00-README.md` through `10-accessibility.md` in order.
2. Call `figma-console:figma_get_status` to verify Figma access.
3. Call `mcp-designer-for-human:get_colour_palette` to verify the design tokens in `02-design-tokens.md` are current.
4. Call `mcp-writer-for-human:get_brand_context` to verify brand rules.
5. Begin implementation per `08-build-checklist.md`.

If any of the MCP responses conflict with this handoff, **the MCP is authoritative**. This handoff is a local snapshot; the MCPs update over time.
