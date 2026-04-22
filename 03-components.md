# Component Inventory

Every component to build, the order to build them in, and the Figma node IDs to reference.

Node IDs correspond to the Figma file containing both the Design System page and the Site pages. To pull the component's exact spec, use the `figma-console:figma_get_component_for_development` MCP tool with the node ID.

## Build order

Build bottom-up. Each row depends only on rows above it.

### Tier 1 — Atoms (primitives, no composition)

| Component | Figma node | Notes |
|---|---|---|
| `Wordmark` | `107:1097` (Colour, None variant) | SVG asset, not a React component. Ship as `.svg` file in `/src/assets/brand/` |
| `Button` | — | Not yet extracted as a marketing atom. Use Terracotta background, White text, 10px radius, 28px × 16px padding. See token file for accessible variant. |
| `Link` | — | Text with `color: var(--text-link)`, underline on hover. |
| `LanguageToggle` | — | "EN / 繁" inline component. 12px Atkinson Bold (EN) / 12px Noto Sans TC (繁), separated by `/` in Neutral 400. |

### Tier 2 — Simple molecules

| Component | Figma node | Notes |
|---|---|---|
| `Eyebrow` | — | Small caps label above section titles. 13px Atkinson Bold, 8% letter-spacing, Neutral 600. Used in section headers. |
| `SectionHeader` | `94:355` | Eyebrow + title, vertical stack. |
| `VerticalChinese` | `94:283` | Three-column stacked-character display. Desktop hero only. |
| `FAQItem` | `94:417` | Question + "+" icon, bottom border. Accordion logic is client-side; use `<details>`/`<summary>` native HTML. |
| `BlogCard` | `94:318` (desktop), `94:638` (mobile) | Image placeholder, date, title, excerpt, author + read time. |
| `MediaCard` | `94:311` (desktop), `94:631` (mobile) | 16:9 video thumbnail with play overlay, caption below. For v1, thumbnails are static images; video opens in Vimeo overlay or similar. |
| `FeatureCard` | `94:420` | Service card with numbered terracotta badge, title, body, "Good for:" line. |
| `PrincipleCard` | `94:302` | Bilingual principle card (EN col + ZH col) — **not used in current homepage** but kept for future. |

### Tier 3 — Complex molecules / organisms

| Component | Figma node | Notes |
|---|---|---|
| `PrinciplePair` | `103:897` (variant set) | Paired principle + video. Variants: `layout=text-left`, `layout=text-right`. Used on Home and Landing. Mobile variant `103:832` always stacks text-above-video. |
| `BilingualBlock` | `94:429` | Side-by-side EN/ZH text for homepage "Learning is the point". |
| `Nav/Bilingual` | `94:257` | Homepage-only nav: EN links left, wordmark center (absolute), ZH links right. No language toggle. |
| `Nav/Mono` | `94:270` | Inner-page nav: wordmark left, EN links + toggle right. |
| `Nav/Mobile` | `94:607` | Mobile nav: wordmark left, hamburger right. Menu drawer is a separate future component. |
| `Hero/Bilingual` | `94:327` | Homepage hero: horizontal EN (headline + sub + primary CTA + secondary link) on left, VerticalChinese on right. |
| `Hero/Mono` | `94:352` | Inner-page hero: headline + subhead, no CTA. |
| `Hero/Mobile/Bilingual` | `94:613` | Mobile home hero: stacked EN block → terracotta rule → ZH block. |
| `CTABand/Bilingual` | `94:358` | Closing CTA with EN text (right-aligned) + button (absolute-centered via FILL flanks) + ZH text (left-aligned). Dark emphasis background. |
| `CTABand/Mono` | `94:368` | Single-language CTA band. |
| `CTABand/Mobile` | `94:647` | Mobile CTA: EN stacked, ZH stacked, full-width button. |
| `Footer/Bilingual` | `94:374` | 4-column footer: brand lockup, site links, contact, location. Bottom copyright row. |
| `Footer/Mono` | `94:398` | 3-column footer. |
| `Footer/Mobile` | `94:656` | Single-column stacked footer. |

### Tier 4 — Page layouts

Each page is a composition of Tier 3 organisms. See `04-pages.md` for section-by-section specs.

## Critical component behaviours

### Nav/Bilingual — wordmark centering

The wordmark must be horizontally centered on the viewport width, not between the nav link groups. Because the EN links and ZH links are different widths, a simple `justify-content: space-between` won't center the wordmark.

**Implementation:**
```html
<nav class="relative flex items-center justify-between px-16 py-6 border-b border-default">
  <div class="flex gap-8">...EN links...</div>
  <a href="/" class="absolute left-1/2 -translate-x-1/2">
    <img src="/brand/human-wordmark-colour-on-white.svg" class="h-8 w-auto" />
  </a>
  <div class="flex gap-8">...ZH links...</div>
</nav>
```

The absolute positioning is how Figma implements it, and it matches the natural CSS pattern.

### Wordmark — safe-zone cropping for inline UI

The SVG has 14% left padding and 15% top padding as brand safe-zone. For inline UI, clip it:

```css
.wordmark-inline {
  clip-path: inset(15% 14.32% 15% 14.32%);
  margin: -3% -4.4%;  /* compensate for clipped space */
}
```

Or, simpler, export a separate SVG without the safe-zone for UI use only (keeping the canonical 800×200 for brand documentation).

### PrinciplePair — alternating layout

On desktop, principles alternate text-left/text-right down the page. In code:

```tsx
{principles.map((p, i) => (
  <PrinciplePair 
    key={i}
    number={p.num}
    title={p.title}
    body={p.body}
    videoUrl={p.videoUrl}
    layout={i % 2 === 0 ? 'text-left' : 'text-right'}
  />
))}
```

Mobile always uses text-above-video (single column), so the mobile variant ignores the `layout` prop.

### CTABand/Bilingual — button as fulcrum

The button must land at the true horizontal center of the band. Because EN and ZH text blocks have different natural widths, using `justify-content: space-between` will center the button between them (which is off-center).

**Implementation:**
```tsx
<section class="flex items-center px-24 py-32 bg-emphasis gap-16">
  <div class="flex-1 flex flex-col items-end text-right text-inverse">
    <h2>{enHeadline}</h2>
    <p class="opacity-75">{enSub}</p>
  </div>
  <button class="bg-action-primary text-inverse px-9 py-5 rounded-lg">{ctaLabel}</button>
  <div class="flex-1 flex flex-col items-start text-left text-inverse">
    <h2 class="font-zh-display">{zhHeadline}</h2>
    <p class="opacity-75 font-zh-body">{zhSub}</p>
  </div>
</section>
```

`flex-1` on each side ensures equal space on either side of the button regardless of content width.

### VerticalChinese — reading order

Chinese reads right-to-left when stacked in columns. The visual rightmost column is read first. In CSS:

```tsx
<div class="flex gap-5">
  {columns.slice().reverse().map((chars, i) => (
    <div key={i} class="flex flex-col">
      {chars.split('').map((ch, j) => (
        <span key={j} class="font-zh-display text-9xl">{ch}</span>
      ))}
    </div>
  ))}
</div>
```

`.slice().reverse()` is intentional — the data is stored in reading order (col 1 = first to read), but CSS lays out LTR, so we reverse before rendering. Alternatively, use `flex-direction: row-reverse`.

### Language toggle — routing behaviour

- On homepage (always bilingual): no toggle visible.
- On inner pages: toggle sits in nav right area. Clicking "繁" navigates to the mirror page in `/zh-hant/...`.
- Mirror pages share content structure. If a translation is missing, fall back to English and log to console (dev) / silently (prod).

### FAQ accordion — progressive enhancement

Use native `<details>`/`<summary>` — no JS required, accessible by default.

```tsx
<details class="border-b border-default py-6">
  <summary class="flex justify-between items-center cursor-pointer list-none">
    <span class="text-body-md font-medium">{question}</span>
    <span class="text-2xl text-neutral-400 transition-transform group-open:rotate-45">+</span>
  </summary>
  <div class="mt-4 text-body-sm text-text-secondary">{answer}</div>
</details>
```

Style the open state with `[open]:` Tailwind variant or `details[open] > summary` CSS.

## What to get from Figma for each component

When building a component, call:

```
figma-console:figma_get_component_for_development
  nodeId: "94:327"  // for example, Hero/Bilingual
```

This returns the full token-annotated spec, image render, and child structure. Use this as the source of truth for spacing, colors, typography.
