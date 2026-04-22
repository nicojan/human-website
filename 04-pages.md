# Pages — Build Spec

Three pages. Each is composed from the components listed in `03-components.md`. This doc specifies the section order, structure, and component wiring for each page. Copy lives in `05-copy-en.md` and `06-copy-zh.md`.

---

## Routing

| Path | Page | Language | Figma Desktop | Figma Mobile |
|---|---|---|---|---|
| `/` | Home (always bilingual) | EN + 繁 | `94:436` | `94:676` |
| `/about` | About | EN | `116:3112` | `116:3256` |
| `/services` | Services | EN | `116:2185` | `116:2622` |
| `/zh-hant/about` | About | 繁 | *(build when ZH copy ready)* | *(build when ZH copy ready)* |
| `/zh-hant/services` | Services | 繁 | *(build when ZH copy ready)* | *(build when ZH copy ready)* |
| `/writing` | Blog index | EN | *(future)* | *(future)* |
| `/writing/[slug]` | Blog post | EN | *(future)* | *(future)* |
| `/404` | Not found | EN | *(build simple)* | *(build simple)* |

Canonical URLs always end without trailing slash. `forhuman.ca` and `forhuman.ca/` both resolve to Home.

---

## Home — `/`

The homepage is the only always-bilingual page. No language toggle; both languages live on the same page.

### Section order

1. **Nav** — `Marketing/Nav/Bilingual` (`94:257`)
2. **Hero** — `Marketing/Hero/Bilingual` (`94:327`)
3. **Believe block** — `Marketing/BilingualBlock` (`94:429`) wrapped in a section with `WHAT WE BELIEVE · 我們的信念` eyebrow
4. **Principles section** — 5× `Marketing/PrinciplePair` instances alternating `layout=text-left` / `text-right` pattern L-R-L-R-L, with `Marketing/SectionHeader` ("HOW WE TEACH · 我們的教學" / "Five principles, with evidence.")
5. **Outcomes / Logo grid** — Custom section with `SectionHeader` ("OUTCOMES · 學生去向" / "Where students go next.") + 11 university logo cells in a 4-wide grid (desktop) or 2-wide (mobile)
6. **Recent Writing** — `SectionHeader` + `Marketing/BlogCard` × 2 in a row (mobile: stacked) + "All writing →" link
7. **Closing CTA** — `Marketing/CTABand/Bilingual` (`94:358`)
8. **Footer** — `Marketing/Footer/Bilingual` (`94:374`)

### Notable behaviours

- Hero vertical Chinese device is **desktop only**. Mobile hero stacks EN block → terracotta rule → ZH block instead.
- Principle pairs: each pair has `number`, `eyebrow` ("PRINCIPLE · 原則"), `en-title`, `zh-title`, `body`. Eyebrow stays bilingual on homepage.
- Logo cells: for v1, render university names as text-in-bordered-box. For v2, swap in real SVG logos (monochrome, uniform height).
- Blog cards pull from the two most recent MDX posts in `/src/content/blog/`.

### Above-the-fold on mobile (375×667 viewport)

Fits: nav (64px) + top padding (40px) + EN headline 3 lines (~132px) + EN subhead 4 lines (~100px) + CTA (54px) + some bottom padding. Total ≈ 420px. The primary CTA is comfortably above the fold.

---

## About — `/about`

### Section order

1. **Nav** — `Marketing/Nav/Mono` (`94:270`)
2. **Hero** — `Marketing/Hero/Mono` (`94:352`)
   - Headline: "Human, is an education collective."
   - Subhead: "What we believe, how we work, and why it matters."
3. **Why we exist** — Narrow-column section with "WHY WE EXIST" eyebrow, "The question is the point." title, 2 body paragraphs, and a **pullquote** (distinct visual treatment: 3px terracotta left rule, Literata Medium 28px)
4. **What we believe** — 2×2 grid of 4 principle cards (process, love, human-first, communal). Card component used inline here; no separate marketing molecule. Card has title (Literata SemiBold 22) + body (Atkinson Regular 16) in cream-mid surface with 16px radius.
5. **How we work** — Narrow-column section: "HOW WE WORK" eyebrow, "Small on purpose." title, 2 body paragraphs
6. **What we teach** — Narrow-column section: "WHAT WE TEACH" eyebrow, "A liberal arts core." title, 1 body paragraph
7. **BC Benefit Company (emphasized)** — Section has `var(--bg-surface)` (cream-mid) background to distinguish. Opens with a **terracotta pill stamp** reading "REGISTERED IN BC" with white dot indicator. Then eyebrow "HOW WE'RE ORGANIZED", title "A BC Benefit Company.", intro paragraph, lead-in "The three benefits we are committed to:", bulleted list (3 items) with terracotta dot bullets, closing paragraph about teacher compensation.
8. **Who we serve** — Narrow-column section: "WHO WE SERVE" eyebrow, "Students who want to learn how to think." title, body paragraph
9. **Closing CTA** — `Marketing/CTABand/Mono` (`94:368`)
   - Headline: "Want to see if we're the right fit?"
   - Sub: "Fifteen minutes, no obligation."
   - Button: "Book a 15-minute consult"
10. **Footer** — `Marketing/Footer/Mono` (`94:398`)

### Section backgrounds (alternating rhythm)

Canvas → Canvas (Why) → Warm (Believe) → Canvas (How) → Warm (Teach) → **Surface (BC)** → Warm (Who) → Emphasis (CTA) → Canvas (Footer)

The Surface background on BC is intentional — breaks the warm/canvas rhythm to mark it as the page's most important section.

### Pullquote component spec

```tsx
<blockquote class="flex pl-8 border-l-[3px] border-terracotta">
  <p class="font-display font-medium text-[28px] leading-[40px] -tracking-[0.01em] text-bark">
    Education's purpose is not optimization. It is not scores. It is not AI-readiness. It is becoming more fully human.
  </p>
</blockquote>
```

---

## Services — `/services`

### Section order

1. **Nav** — `Marketing/Nav/Mono` (`94:270`)
2. **Hero** — `Marketing/Hero/Mono` (`94:352`)
   - Headline: "Four ways we work."
   - Subhead: "One-on-one online tutoring in English literature, writing, and critical thinking."
3. **Services cards** — `SectionHeader` ("WHAT WE OFFER" / "Each service, close-up.") + 2×2 grid of `Marketing/FeatureCard` (mobile: stacked 4-tall)
4. **FAQ** — `SectionHeader` ("QUESTIONS" / "What families usually ask.") + 3 labeled groups (LESSONS, PROGRESS, LOGISTICS) each containing `Marketing/FAQItem` rows
5. **Closing CTA** — `Marketing/CTABand/Mono` (`94:368`)
6. **Footer** — `Marketing/Footer/Mono` (`94:398`)

### FAQ group structure

Each group has:
- A small caps label (11px Atkinson Bold, 8% letter-spacing, Neutral 600)
- A vertical stack of FAQItems, each with bottom border

```tsx
<div class="flex flex-col gap-4">
  <h3 class="text-[11px] font-bold tracking-[0.08em] text-text-secondary">LESSONS</h3>
  <div class="flex flex-col">
    {lessonsFaqs.map(faq => <FAQItem {...faq} />)}
  </div>
</div>
```

### FAQItem open state (not in Figma — spec here)

Default (closed):
- `<summary>` has the question text (left) and `+` icon (right), 24px Atkinson Regular, Neutral 400
- Bottom border 1px Neutral 200
- Padding 24px top/bottom

Open state (when `<details>` is open):
- `+` rotates to `-` (or actually a minus) via `[open] summary .icon { transform: rotate(45deg) }`
- Answer slides down below summary: 16px top margin, 17px Atkinson Regular, text-secondary color, line-height 26px
- Answer copy is in `05-copy-en.md`

---

## Footer links

All footer nav links:
- `/services` → Services page
- `/about` → About page
- `/writing` → Blog index (build v2)
- mailto:hi@forhuman.ca
- External: WeChat QR (popup on click), Instagram URL, WhatsApp URL

The bilingual footer has all links labeled in both languages: "Services · 課程", "About · 關於", etc.

---

## Common issues to avoid

1. **Don't recreate the wordmark by typing "Human," in Literata.** Use the SVG asset from `/src/assets/brand/human-wordmark-colour-on-white.svg`. The terracotta comma is part of the vector.

2. **Don't hardcode colors.** Use the CSS variables from `02-design-tokens.md`. If you need a shade not in the palette, ask — don't invent.

3. **Don't make the `/` path monolingual.** The homepage is always bilingual. Language toggles only appear on `/about`, `/services`, and future inner pages.

4. **Don't use em dashes in parent-facing body copy.** The brand uses commas. Em dashes are fine in blog posts and editorial.

5. **Don't break the hero's primary CTA to a sub-link.** It should be a button. The secondary CTA "Or, learn more..." was removed in final audit — don't re-add it.
