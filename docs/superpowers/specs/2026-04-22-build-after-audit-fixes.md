# Human, website — post-audit build snapshot

**Date:** 2026-04-22
**Scope:** Record of what changed on `main` after the 2026-04-22 audit landed, and what the site currently ships.
**Supersedes:** `2026-04-22-current-build-audit-brief.md` for any questions about build truth. The audit brief captured intent; this doc captures outcome.

Companion to `2026-04-22-website-design.md` (design intent) and the retired audit brief `2026-04-22-current-build-audit-brief.md` (pre-fix inventory). Where those disagree with this doc, this doc wins.

---

## 1. What shipped in this pass

Landed on `main` in the same commit block:

- **Above-the-fold reveal is immediate.** `public/js/site.js` now checks `getBoundingClientRect()` at init, reveals any `[data-animate]` element already in view, and only registers the IntersectionObserver for elements that are genuinely below the fold. The previous build left the About and Services heroes at `opacity: 0` until a scroll event fired.
- **`/zh` no longer 404s.** A tiny redirect stub at `public/zh/index.html` meta-refreshes (and JS-replaces) to `/zh-hant/`. Canonical URLs remain `/zh-hant/*`; the stub exists only so a typed `/zh` survives.
- **Footer wordmark lockup no longer carries the retired descriptor.** The `.footer__descriptor` CSS rule and every `<span class="footer__descriptor">an Education Collective.</span>` in HTML (six marketing pages + 404 + blog partial) are removed. `<title>` and `og:title` still reference the legal name — the rule is visual-lockup only.
- **Outcomes section moved to the Ink block.** Homepage (EN + ZH) now uses `section--emphasis` instead of `section--surface`. Logos are unified via `filter: brightness(0) invert(1); opacity: 0.7` on `.outcome-logo`, list bullets are killed, and the grid is a clean 4×3 on desktop (12 total). SFU replaces the previous 11th slot; Western stays.
- **Principles are four, not five.** Homepage heading is now `Four Principles, with Evidence` / `四個原則，附證據。` and the fifth card (`05 Human first, tools second.`) is deleted from both `/` and `/zh-hant/`. The philosophical twin of that principle already lives on the About page, so nothing about the brand voice is lost.
- **Copy passes the humanizer.** Three `x, not y` AI tells are rewritten:
  - Homepage Principle 01 ZH: `好奇心，而非順從。` → `以好奇為先。`
  - About → Liberal Arts Core: `how to think, not what to think.` → `how to think about anything they encounter.`
  - About → Learning is communal: `not between a person and a screen, and not in isolation.` → `A screen alone cannot teach a child to think out loud.`
- **Inner-page heroes carry a ZH kicker.** About, Services, and Contact each have a `<span class="eyebrow page-hero__kicker" lang="zh-Hant">` above the H1 so the bilingual signal is present on the first screen, not only in the footer.
- **Footer Services column is bilingual on EN pages.** Home, About, Services, Contact all now pair each service label with its Chinese counterpart (`K–12 academic English · K–12 英文課`, etc.). The ZH homepage mirror has the reverse pairing.
- **Dead social links removed.** `https://instagram.com/` and `https://wa.me/` placeholders are deleted from every footer (EN + ZH + blog partial) and from the Contact sidebar / `zh-hant/contact` sidebar. Email and WeChat remain. Re-add once brand handles exist.
- **Hero type polish.** `.hero__headline` clamp capped one step down (`3.75rem` instead of `4.25rem`) so the English lede fits in two or three lines inside the `1.3fr` grid column on a 1440px viewport. `.hero__en` max-width bumped to 60rem for safety at wider tracks.
- **ZH vertical-column reading order is now annotated in HTML.** The 3-column hero block on `/` and `/zh-hant/` has an HTML comment warning future editors that `flex-direction: row-reverse` is load-bearing and must not be "fixed" by reordering spans.

Not in scope this pass, logged for the next:

- Figma Desktop Bridge parity pass (bridge was offline during the audit).
- Writing / blog index visual pass.
- Mobile viewport audits at 390px and 768px.
- Lighthouse perf pass once the scroll-animation fix has been live a week.
- Replacing the remaining JPG university logos (`Smith.jpg`, `Sauder.jpg`) with transparent PNG/SVG — the `brightness(0) invert(1)` filter turns their white backgrounds into white blocks on the Ink section.

---

## 2. Current routing

URL-based bilingual with `/` as the English canonical and `/zh-hant/*` as the Chinese canonical.

| Route | Status | Notes |
|---|---|---|
| `/` | Complete | Bilingual hero, four principles, Ink Outcomes block |
| `/about/` | Complete | EN only; ZH kicker added in hero |
| `/services/` | Complete | EN only; ZH kicker added in hero |
| `/contact/` | Complete | EN form; ZH kicker added in hero |
| `/404.html` | Complete | Trimmed chrome |
| `/zh` | Redirect | Meta-refresh + JS redirect to `/zh-hant/` |
| `/zh-hant/` | Complete | Bilingual hero (EN preserved), four principles, Ink Outcomes block |
| `/zh-hant/about/` | Stub | "Coming soon", links to `/about/` |
| `/zh-hant/services/` | Stub | "Coming soon", links to `/services/` |
| `/zh-hant/contact/` | Complete | Full ZH form |
| `/zh-hant/404.html` | Complete | Trimmed chrome |
| `/writing/*` | Complete | Hugo, EN-only for now |

Language toggle on inner EN pages points to the canonical ZH sibling (not the stub for About/Services — the stub lives at the sibling URL anyway). Canonical tags and `hreflang` stays pointed at `/zh-hant/`.

---

## 3. Scroll reveal — the contract

`public/js/site.js` handles `[data-animate]` in three states:

1. **`prefers-reduced-motion: reduce`:** add `.is-visible` to every animated element immediately. No observer.
2. **Already in the viewport at init time:** add `.is-visible` immediately (no observer registration).
3. **Below the fold at init time:** register the IntersectionObserver, reveal on first intersection, then `unobserve()` so the element never re-animates.

Observer options: `rootMargin: 0px 0px -10% 0px`, `threshold: 0.01`. The `-10%` keeps a small gap at the bottom so items don't pop in too eagerly.

The CSS side is unchanged: `[data-animate]` starts at `opacity: 0; transform: translateY(16px)` and transitions via `duration-slow ease-out`. `prefers-reduced-motion` replaces the transform with a 100ms opacity fade.

---

## 4. Outcomes section — the contract

- Section class: `section section--emphasis outcomes`.
- Background: `--bg-emphasis` (Ink `#2B3A4E`). Text: `--text-inverse`. Eyebrow/H2/subhead inherit the Ink-block overrides already defined in `layout.css`.
- Grid: `list-style: none`, `padding-left: 0`, 2-col at `<40rem`, 3-col at `40–64rem`, 4-col at `≥64rem`. Exactly 12 logos — no orphans.
- Logo treatment: `.outcome-logo { filter: brightness(0) invert(1); opacity: 0.7 }`. Hover raises to `opacity: 1`.
- Logo order (EN): Berkeley, UBC, McGill, U of T, Queen's, HKU, SFU, Western, Ivey, Smith, Beedie, Sauder.
- **Known visual debt:** `Smith.jpg` and `Sauder.jpg` have white JPG backgrounds. Under `brightness(0) invert(1)` those backgrounds become white rectangles on the Ink block. Transparent PNG / SVG replacements are a follow-up; acceptable interim because the rectangles are slightly below the fold and only visible on desktop.

---

## 5. Content-voice invariants (updated)

The audit burned three `x, not y` constructions. Keep them out going forward:

- No `x, not y` parallelisms in any hero, headline, principle title, or body paragraph.
- No Chinese `而非` / `而不是` construction in principle titles or eyebrows.
- When a principle expresses a stance, express the stance — don't contrast it with the foil. (`以好奇為先。` over `好奇心，而非順從。`.)
- Homepage hero headline sits in 2–3 lines on a 1440px viewport. If a copy edit pushes it to 4 lines, trim the copy rather than widening the container further.

---

## 6. What the audit deliberately left in place

These survived because they're by design (per Figma / the 2026-04-22 design spec) even though a less-informed reader would flag them:

- **Homepage nav is bilingual and has no CTA button or language toggle.** Per Figma. The EN/ZH link columns sit either side of a larger wordmark. Inner pages switch to the single-row nav with toggle and CTA. The 2026-04-22 audit initially flagged this as a "doubling" bug; it is not.
- **ZH homepage closing CTA uses `closing-cta__en` for the Chinese line and `closing-cta__zh` for the English line.** The CSS classes are inverted semantically because the intent is "primary language dominant, secondary echoed at 95% opacity." Refactor to cleaner class names is a follow-up, not a blocker.
- **`/zh-hant/about/` and `/zh-hant/services/` are stubs.** Shipping stubs keeps the language toggle non-broken. Full translations come in v2.
- **Base font size is 17px.** Matches Apple HIG body text; Figma file uses the same base. Rem-based values are correct.

---

## 7. How to regenerate this from code

- Routing: `public/*/index.html` plus the `/zh/` redirect stub.
- Tokens: `public/css/tokens.css` (three layers).
- Shared CSS: `public/css/{base,layout,components,home,pages,writing}.css`.
- Shared JS: `public/js/{site,matomo,latest-posts,contact}.js`.
- Blog: `blog/content/posts/*.md` and `blog/layouts/{_default,partials}/*.html`.
- Build: `bash scripts/build.sh` (outputs into `public/writing/`).
- Dev: `bash scripts/dev.sh` (`http://localhost:4321`).

Canonical copy lives in `05-copy-en.md` and `06-copy-zh.md`. When those disagree with what's actually rendered, update the copy docs to match (or fix the HTML if the copy docs are the intent).

---

## 8. Next pass triggers

Re-run the audit when any of these happen:

- Figma file gets a major revision (new pages, new components, new tokens).
- A new marketing page is added in either language.
- A new nav item is added (always add in both locales).
- Instagram / WhatsApp brand profiles go live (re-add footer + sidebar links).
- Mobile audit completes (may surface viewport-specific issues hidden at 1440px).
- Lighthouse perf pass completes (may force changes to video loading, font loading, or scroll animation cadence).
