# Build Checklist

Step-by-step implementation order. Each step has acceptance criteria.

Don't claim a step done until all criteria pass. If something is ambiguous, call the relevant MCP before guessing.

---

## Phase 0 — Setup

- [ ] Create new repo `forhuman-marketing` (or fold into existing monorepo if you have one).
- [ ] Initialize Astro project: `npm create astro@latest` → minimal template, TypeScript strict.
- [ ] Add Tailwind: `npx astro add tailwind`.
- [ ] Configure Tailwind with the design tokens from `02-design-tokens.md`.
- [ ] Create `/src/styles/tokens.css` with the full CSS variable block from `02-design-tokens.md`.
- [ ] Import `tokens.css` in `src/layouts/Base.astro`.
- [ ] Install fonts:
  - [ ] Self-host Atkinson Hyperlegible Next (get from brailleinstitute.org, put in `/public/fonts/`).
  - [ ] Self-host Literata (`@fontsource/literata` or download from Google Fonts).
  - [ ] Self-host Noto Serif TC and Noto Sans TC (`@fontsource/noto-serif-tc`, `@fontsource/noto-sans-tc`).
  - [ ] Preload Literata Medium and Atkinson Regular in `<head>`.
  - [ ] Use `font-display: swap`.
- [ ] Set up i18n routing (Astro's built-in — see `09-i18n-and-routing.md`).
- [ ] Deploy placeholder to Vercel or Cloudflare Pages, confirm DNS.

**Acceptance:** `npm run dev` serves a blank page on localhost with the correct fonts loaded and tokens applied to a test element.

---

## Phase 1 — Assets and atoms

- [ ] Export wordmark SVGs from Figma (from the "04 · Export Frames" section of the Logos and Wordmarks v2 page). Save to `/src/assets/brand/`:
  - [ ] `human-wordmark-colour-on-white.svg`
  - [ ] `human-wordmark-colour-on-ink.svg`
  - [ ] `human-wordmark-mono-white.svg`
  - [ ] `human-comma-terracotta.svg`
  - [ ] `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`
  - [ ] `apple-touch-icon.png` (180×180)
  - [ ] `human-og-1200x630.png`
- [ ] Build `Wordmark` Astro component that handles the safe-zone padding clipping in CSS:
  ```astro
  <a href="/" class="wordmark-inline inline-block">
    <img src="/brand/human-wordmark-colour-on-white.svg" alt="Human," class="h-8 w-auto" />
  </a>
  ```
  with either `clip-path: inset(15% 14.32%)` + negative margin, OR export a pre-cropped version for inline UI.
- [ ] Build `Button` component:
  - [ ] Variants: `primary` (Terracotta bg), `secondary` (Ink bg).
  - [ ] Sizes: `md` (default, 17px text), `lg` (19px text for hero CTAs).
  - [ ] Honor the WCAG contrast issue: by default, use `--action-primary-accessible: #9A5533` for the primary variant background to hit 4.5:1. Keep brand Terracotta as the "brand accent" in other uses.
  - [ ] Focus ring: 3px Terracotta outline, 2px offset.
  - [ ] Hover: darken background 10%.
- [ ] Build `Link` component (text links).
- [ ] Build `LanguageToggle` component (for inner pages).
- [ ] Build `Eyebrow` component (11px Atkinson Bold, 8% letter-spacing, Neutral 600 default; accepts optional color prop).

**Acceptance:** 
- Wordmark renders flush-left when placed in a flex row next to text, with no visible safe-zone padding offset.
- Primary button passes WCAG AA contrast check (4.5:1 minimum). Test with axe DevTools or similar.
- All atoms render correctly in an isolated Storybook or Astro dev route.

---

## Phase 2 — Marketing molecules

Build in this order. Test each in isolation before moving on.

- [ ] `SectionHeader` — eyebrow + title, 16px gap.
- [ ] `BilingualBlock` — 2-column EN/ZH layout with 96px gap (desktop) / stacked (mobile). Accepts `enTitle`, `enBody`, `zhTitle`, `zhBody`, optional `eyebrow`.
- [ ] `Nav/Bilingual` — homepage nav. Wordmark absolutely positioned at `left: 50%; transform: translateX(-50%)`. EN links left, ZH links right. Collapse to mobile at breakpoint.
- [ ] `Nav/Mono` — inner-page nav. Wordmark left, links + toggle right.
- [ ] `Nav/Mobile` — mobile nav. Wordmark left, hamburger right. Hamburger opens full-screen menu drawer (build the drawer too, with all 4 nav items + language toggle).
- [ ] `Hero/Bilingual` — horizontal EN + `VerticalChinese` right. Desktop only — mobile version is different.
- [ ] `Hero/Mono` — simple title + subhead.
- [ ] `Hero/Mobile/Bilingual` — stacked EN block → terracotta `<hr>` → ZH block.
- [ ] `VerticalChinese` — 3-column stacked character display. Reading right-to-left.
- [ ] `PrinciplePair` — variant prop `layout: 'text-left' | 'text-right'`. Internally uses flex-row or flex-row-reverse. Mobile is always single column, text-above-video.
- [ ] `MediaCard` — 16:9 video thumbnail with play button overlay, caption below. For v1, clicking the play button opens a Vimeo embed in a modal.
- [ ] `BlogCard` — image placeholder, date, title, excerpt, author + read time. Subtle 1px neutral-200 border on white bg.
- [ ] `FeatureCard` — numbered Terracotta badge + title, body, "Good for:" row.
- [ ] `FAQItem` — `<details>`/`<summary>` native accordion. `+` icon rotates to `×` when open. Answer slides down with CSS transition.
- [ ] `CTABand/Bilingual` — dark emphasis band with 3-element layout. EN (right-aligned, flex-1) + button (hug) + ZH (left-aligned, flex-1).
- [ ] `CTABand/Mono` — title left, button right, on dark emphasis.
- [ ] `Footer/Bilingual` — 4 columns: brand, site, contact, location. Bottom row with copyright.
- [ ] `Footer/Mono` — 3 columns.

**Acceptance:**
- Each component renders with the correct Figma spacing, typography, and colors.
- Each is keyboard accessible (Tab through all interactive elements, visible focus rings).
- Each has proper ARIA where needed (`aria-label` on wordmark link, `aria-expanded` on nav drawer, etc.).
- Each resizes correctly between desktop (1440) and mobile (375) — use Chrome DevTools responsive mode.

---

## Phase 3 — Page composition

Build pages in this order: Home → About → Services.

For each page:

- [ ] Create the Astro page file at the correct path (`src/pages/index.astro`, etc.).
- [ ] Compose the page from molecules per `04-pages.md`.
- [ ] Pull copy from `05-copy-en.md` (EN) and `06-copy-zh.md` (ZH for Home only).
- [ ] Set page meta (title, description, og image) per `05-copy-en.md`.
- [ ] Test responsive behavior at 375px, 768px, 1440px viewport widths.
- [ ] Run Lighthouse and fix any failed checks (performance, accessibility, SEO).
- [ ] Test with screen reader (VoiceOver on Mac, NVDA on Windows).

### Home-specific

- [ ] Vertical Chinese renders correctly on desktop (3 columns, right-to-left reading order).
- [ ] On mobile, vertical Chinese is replaced by horizontal block (no rotation attempts).
- [ ] Blog cards pull from `/src/content/blog/` — build 2 placeholder posts for launch.
- [ ] Logo grid uses text-in-box for v1. Wire up real SVGs post-launch.

### About-specific

- [ ] Pullquote in "Why we exist" has 3px Terracotta left rule.
- [ ] BC Benefit Company section has Surface (cream-mid) background, distinct from surrounding sections.
- [ ] "REGISTERED IN BC" stamp pill at top of BC section, Terracotta bg with white dot + white text.
- [ ] Bulleted list in BC section uses Terracotta dots (6px circles, not standard disc bullets).

### Services-specific

- [ ] FAQItem accordions work with keyboard (Space/Enter toggles, Escape closes).
- [ ] FAQ groups have semantic structure: `<h2>` for group label, each FAQ as `<details>`.
- [ ] Feature cards are identical heights in their row (flex `stretch` align).

**Acceptance per page:**
- Visual: matches Figma at both breakpoints within ±4px tolerance on spacing, exact on colors and type.
- Performance: Lighthouse performance score ≥ 95.
- Accessibility: Lighthouse a11y score = 100. No axe DevTools violations.
- SEO: Lighthouse SEO score ≥ 95.

---

## Phase 4 — i18n and routing

- [ ] Configure Astro i18n with `defaultLocale: 'en'` and `locales: ['en', 'zh-hant']`.
- [ ] Home (`/`) is the only bilingual page — build it once.
- [ ] About and Services have EN-only versions at `/about` and `/services`.
- [ ] Stub `/zh-hant/about` and `/zh-hant/services` with "Coming soon · 即將推出" placeholder (see `06-copy-zh.md`).
- [ ] Language toggle on inner pages links to the mirror — for v1, points to `/` since ZH inner pages don't exist yet.
- [ ] Add `hreflang` tags to each page's `<head>` pointing to mirror versions.
- [ ] Add `<html lang="en">` or `<html lang="zh-Hant">` per page.

**Acceptance:**
- Navigating between `/about` and `/zh-hant/about` (stub) works.
- Language toggle visible on every inner page.
- Google can index both language versions without duplicate-content penalties.

---

## Phase 5 — Accessibility pass

- [ ] Run axe DevTools on every page. Zero violations.
- [ ] Run Lighthouse accessibility audit. Score 100 on every page.
- [ ] Keyboard-only navigation: can Tab through every interactive element on every page without getting stuck.
- [ ] Focus rings visible on every interactive element (Terracotta, 3px, 2px offset).
- [ ] Screen reader test with VoiceOver: every page reads in logical order, no orphan elements, all images have alt text, all interactive elements announce their role.
- [ ] Contrast: every text/background pair passes WCAG AA (4.5:1 for normal, 3:1 for large 18pt+).
- [ ] The Primary CTA button uses the accessible Terracotta variant (4.5:1+), NOT the brand Terracotta (3.88:1).
- [ ] All `alt` text follows the rule: describe what is shown, not what it means. Keep factual and brief.
- [ ] All video thumbnails have descriptive alt text ("A graphic novel open on screen with annotations", not "Close reading moment").

---

## Phase 6 — Performance pass

- [ ] Total page weight (all assets) for Home: ≤ 200KB gzipped (excluding fonts).
- [ ] Largest Contentful Paint (LCP): ≤ 1.5s on fast 3G.
- [ ] Cumulative Layout Shift (CLS): ≤ 0.05.
- [ ] First Input Delay (FID): ≤ 100ms.
- [ ] Images: use Astro's `<Image>` component for automatic optimization, srcset, and AVIF/WebP.
- [ ] Fonts: preload the two primary faces (Literata Medium, Atkinson Regular). Subset to Latin + Traditional Chinese for Noto fonts.
- [ ] No client-side JavaScript except where necessary (nav drawer, FAQ accordion uses native HTML so no JS needed there).
- [ ] Minify HTML/CSS/JS. Enable Brotli.

---

## Phase 7 — Pre-launch

- [ ] Confirm every CTA button leads to the correct destination:
  - [ ] "Book a consult" / "Book a 15-minute consult" → Cal.com booking URL (Nico to provide).
  - [ ] Email links → `mailto:hi@forhuman.ca`.
  - [ ] WeChat → QR code popup or external WeChat profile URL.
  - [ ] Instagram → profile URL.
  - [ ] WhatsApp → `https://wa.me/` link (Nico to provide).
- [ ] Test on real devices: iPhone SE (375×667), iPhone 15 (393×852), iPad (768×1024), MacBook (1440×900).
- [ ] Test in Safari, Chrome, Firefox, Edge.
- [ ] Verify fonts load correctly in Chinese on Windows (Noto Sans TC fallback chain).
- [ ] Verify no console errors or warnings in any browser.
- [ ] 404 page built and reachable.
- [ ] Sitemap.xml generated and submitted to Google Search Console.
- [ ] Robots.txt present and correct.
- [ ] Analytics installed (Plausible or Fathom per `01-stack-decisions.md`).
- [ ] Final review by Nico before swapping DNS.

---

## What "done" means

The site is done for v1 when:
1. Every page passes all acceptance criteria in Phase 3.
2. Every accessibility check in Phase 5 passes.
3. Every performance target in Phase 6 is hit.
4. Every pre-launch item in Phase 7 is checked.
5. Nico has reviewed and approved.

Things NOT required for v1 but worth tracking as v2:
- Chinese mirror pages for About and Services
- Blog system (the Writing page and individual posts)
- Real university logos (currently text placeholders)
- Real video content (currently play-button placeholders)
- Founder page (`/nico` or `/founder`) — the personal bio that was removed from About
- Dark mode
- Newsletter signup / Contact form
