# Site-wide UI/UX cohesion pass + About redesign

- **Date:** 2026-06-11
- **Status:** Approved direction (pending spec review)
- **Author:** Nico Jan (with Claude Code)
- **Scope decision:** De-tell site-wide + fully restructure About. Copy *and* visual/structural in scope; revised copy must pass `mcp-humanizer`.

## Context

The marketing site (`forhuman.ca`) is a hand-written hybrid static site. The token
system (`public/css/tokens.css`) is sound and brand-rich. The home page is
distinctive and on-brand (video hero, bilingual vertical Chinese, alternating
editorial principle rows, school marquee, dark punctuation blocks). The **About**
page is the generic-template rendering of the same ideas, and several
**AI-design tells from the brand's own `mcp-designer-for-human` ban list** appear
across the whole site through shared CSS.

This is a *full-brand* surface, so terracotta / Literata / cream are allowed
(unlike the "quiet web tool" brief). What is **not** allowed is the ban list
(AP-01…AP-54), which applies to everything under the brand.

## Goals

1. Remove the AI-design artefacts catalogued below, site-wide.
2. Make every page feel like one cohesive, sleek, professional brand.
3. Preserve (don't regress) the strong accessibility foundation — Lighthouse a11y = 100.
4. Redesign About as the text-forward "manifesto", a quiet sibling of home.
5. Keep all copy meaning intact (humanizer AR-001) while removing textual tells.

## Non-goals

- No rebuild of the home video hero or principle-row mechanics (light de-tell only).
- No new content types, no Node tooling, no token-primitive changes unless Figma-backed.
- No copy rewrites beyond lines that are themselves artefacts or are factually redundant.

## Audit findings (brand ban-list codes)

| Artefact | Where | Code | Severity |
|---|---|---|---|
| Uppercase letterspaced eyebrows | `.eyebrow` (base.css) — every page | AP-01 / AP-06 | ban |
| Uppercase footer / FAQ group headings | components.css `.footer__heading`, `.faq-group__heading` | AP-06 | ban |
| Left-border callout (pullquote) | About `.pullquote` (pages.css) | AP-02 | ban |
| Feature-card grid w/ accent top-stripe | About `.about-principle`; Services `.service-card` | AP-08 / AP-09 | ban |
| Stat-banner row (1:1 / Weekly / No ghostwriting) | About `.about-signal-grid` | AP-13 | avoid |
| Alternating tinted section stripes | About + Services `section--warm`/`--canvas` rhythm | AP-18 | ban |
| Badge above heading ("REGISTERED IN BC" stamp) | About `.pill--stamp` | AP-11 / AP-46 | — |
| Uniform padding / fade-up everything | `.section`, `[data-animate]` site-wide | AP-47 / AP-53 | avoid |
| "It is not X. It is not Y. It is Z." anaphora | About pullquote copy | AP-49 | ban (textual) |
| Redundant eyebrow ("What We Offer" ×2) | Services | — | UX |

Positives to preserve: token system; bilingual handling; focus ring; reduced-motion;
skip links; 44px targets; the video hero and principle rows on home.

## Design principles (the cohesive direction)

1. **Quiet kickers, not eyebrows.** Lowercase, muted (`--text-secondary`),
   family-default tracking, medium weight. Delete purely ceremonial ones.
   Hierarchy comes from heading size/weight (AR-04), not from all-caps labels.
2. **Calm section rhythm.** Mostly one canvas; sections separated by space and
   type, not cream/white banding. Keep the **dark ink blocks as deliberate
   punctuation** (BC commitment, closing CTA). Vary padding at true boundaries.
3. **No decorative chrome.** No accent top-stripes on cards, no left-border
   callouts, no stat banners, no badges-above-headings. Whitespace + hairlines
   do the grouping (AR-05).
4. **Editorial typography over cards** where the content is prose or a short list.
5. **Restrained motion / numerals.** Keep scroll-in + reduced-motion, but stop
   staggering everything; tone oversized terracotta numerals.
6. **One accent discipline.** Terracotta stays the single functional accent;
   semantic colours only for real state.

## Global system changes

### `base.css`
- `.eyebrow` / `.label`: remove `text-transform: uppercase`; set
  `letter-spacing: normal` (or a hair, ~0.01em); `font-weight: var(--fw-medium)`;
  keep `color: var(--text-secondary)`; bump size slightly toward `--fs-caption`
  for readability. Confirm contrast (neutral-600 on cream/white ≥ 4.5:1 — passes).

### `components.css`
- `.footer__heading`, `.faq-group__heading`: drop uppercase + heavy tracking;
  match the new kicker treatment.
- `.pill--stamp`: drop `text-transform: uppercase` + the `::before` "•"; or retire
  the class on About in favour of an inline label folded into the section header.
- `.media-video`: reconsider the `2px solid var(--accent)` border (decorative
  brand-colour border on every video). Prefer a hairline or no border.
- Eyebrow text in footer headings is markup (Title Case) uppercased by CSS; once
  CSS stops uppercasing, render lowercase. **Footer markup is partial-injected** —
  edit `partials/footer-{en,zh}.html` then run `python3 scripts/inject-partials.py`
  (or rely on the Cloudflare build). Do NOT edit per-page footer blocks directly.

### `layout.css`
- Reduce reliance on `section--warm`/`--canvas` alternation for rhythm. Pages move
  to mostly `--canvas` with the two `--emphasis` blocks kept. `section-header`
  spacing reviewed for boundary-vs-group rhythm.

### `site.js`
- Keep behaviour. Optionally narrow `[data-animate-stagger]` usage so not every
  group cascades. No functional change required for de-telling.

## Per-page changes

### Home (light touch)
- Convert eyebrows to quiet kickers; the "Principle · 原則" eyebrow on every row is
  redundant with the big number — drop it or merge.
- Tone `.principle__number` (smaller / less saturated) so it reads as editorial
  numeral, not a decorative process-strip (AP-48).
- Keep video hero, belief block, principle rows, marquee, outcomes, closing CTA.

### Services
- Remove the duplicate "What We Offer" (hero kicker vs section eyebrow): keep one.
- Lighten `.service-card`: drop card-as-everything heaviness; drop the uppercase
  `service-card__quick-label` / `service-card__good strong` micro-labels (AP-06,
  AP-27 bold-lead-in feel). Prefer a cleaner two-tier layout (title + body +
  one quiet detail line), hairline-separated, on canvas — fewer boxes.
- FAQ accordion is genuine content; keep, just de-tell the group headings.

### About (full editorial rebuild — the main event)
New section flow on a mostly-canvas page, dark blocks as punctuation:

1. **Opening statement (hero).** Keep "Human, is an education collective." Drop the
   "ABOUT" kicker (pure ceremony). Generous space; optional quiet ZH pairing.
2. **Why we exist.** Editorial lede prose, comfortable measure. Replace the
   left-border pullquote with a **standalone display-type statement** in Literata
   (no left bar, no box) — a real typographic moment. Revise the anaphora copy
   (AP-49) to pass humanizer while preserving meaning.
3. **Principles (believe).** Replace the 2×2 card grid with a **numbered editorial
   list** (01–04), EN + ZH title pair + body, flush-left, separated by hairlines
   or whitespace. No cards, no top-stripes. A quieter, text-only cousin of home's
   principle rows.
4. **How we work.** Prose + fold the 1:1 / Weekly / No-ghostwriting facts into a
   **restrained descriptive list** (term + sentence), not a big-number stat banner.
5. **What we teach.** Prose (optionally EN/ZH paired).
6. **BC Benefit Company.** Keep the **dark ink section** (earned contrast — a legal
   commitment). Replace the "REGISTERED IN BC" stamp badge with a quiet inline label
   or fold into the header. Keep the three commitments as a clean dash-marker list.
7. **Who we serve.** Prose.
8. **Closing CTA.** Keep the shared component.

### Contact / Privacy / 404 (inherit global)
- No structural change; they inherit the kicker/heading de-tell automatically.
  Verify the privacy "PRIVACY NOTICE" kicker and contact kicker read well lowercase.

### Blog (`blog/layouts`, `writing.css`)
- Inherit global kicker/heading changes. Verify list + post templates still read
  cleanly; tag pills already fine. No structural rebuild.

## Copy revisions (humanizer-compliant)

- About anaphora quote → rewrite preserving the claim (purpose isn't
  optimization/scores/AI-readiness; it's becoming more fully human), breaking the
  uniform "It is not… It is not… It is…" rhythm. No em-dashes (AR-002).
- Services duplicate kicker → remove one.
- Any other revised user-visible string → run `humanizer_check_text` until
  `prohibitions_clear` is true; preserve meaning (AR-001). Apply EN copy only;
  ZH copy mirrors structure (run past ZH conventions in CLAUDE.md §8).

## Accessibility guardrails (must hold)

- Contrast: body ≥ 4.5:1, large/UI ≥ 3:1. New kicker colour (`--text-secondary`
  = neutral-600 #6B655C) passes on white (5.07) and cream. Terracotta stays
  large-text/graphic only.
- One `<h1>` per page; `lang` on inline language switches; visible focus ring;
  touch targets ≥ 44px; `prefers-reduced-motion` honoured.
- No meaning carried by colour alone.

## Implementation sequence (reviewable phases)

1. **Global system layer** — base.css eyebrow/label; components.css footer/FAQ/
   pill/media-video; layout.css section rhythm. Verify every page still renders.
2. **Services** — dedupe kicker, lighten cards, de-tell micro-labels.
3. **Home polish** — kicker conversion, principle number/eyebrow tone.
4. **About rebuild** — EN then ZH, new structure + pages.css About block rewrite.
5. **Utility + blog** — verify inherited changes; footer partials re-injected.
6. **Copy pass** — humanizer-validate revised strings (EN), mirror ZH.
7. **Verify** — visual before/after at desktop + mobile; Lighthouse a11y per page;
   reduced-motion check; bilingual parity.

## Verification plan

- Screenshots (desktop 1440 + mobile 390) of every changed page, EN + ZH.
- Lighthouse accessibility on home/services/about (target 100).
- Grep for residual `text-transform: uppercase` on label-like classes.
- `humanizer_check_text` green on all revised copy.
- Build via `bash scripts/build.sh`; confirm partial injection intact.
