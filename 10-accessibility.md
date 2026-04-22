# Accessibility

The site must meet **WCAG 2.1 AA** minimum. Goal is to go further where feasible.

## Known issue — CTA contrast

White text on brand Terracotta (`#B86F4A`) produces 3.88:1 contrast. **This fails WCAG AA for normal text (needs 4.5:1).**

### Resolution

Create a derived color for button backgrounds only:

```css
:root {
  --action-primary-accessible: #9A5533; /* 4.6:1 with white */
}
```

Use this token in the primary Button component's background. Keep the brand `--terracotta` unchanged for:
- The comma in the wordmark (the brand signature)
- Eyebrow accents at large sizes
- Divider rules
- Bullet dots
- Focus rings

**Do not** use the brand Terracotta as a CTA button background. The button uses `--action-primary-accessible`.

Visually the two shades are very close — most users won't notice. But the AA-compliant version passes accessibility audits and legal requirements.

## Contrast reference table

Tested pairs in use across the site:

| Foreground | Background | Contrast | WCAG AA | WCAG AAA |
|---|---|---|---|---|
| Bark on White | `#322A22` / `#FFFFFF` | 13.9:1 | ✅ | ✅ |
| Bark on Cream | `#322A22` / `#FAF7F2` | 13.4:1 | ✅ | ✅ |
| Bark on Cream-Mid | `#322A22` / `#F2EDE5` | 12.8:1 | ✅ | ✅ |
| Neutral-600 on White | `#6B655C` / `#FFFFFF` | 5.8:1 | ✅ normal | ✅ large |
| Neutral-600 on Cream | `#6B655C` / `#FAF7F2` | 5.6:1 | ✅ normal | ✅ large |
| White on Ink | `#FFFFFF` / `#2B3A4E` | 11.3:1 | ✅ | ✅ |
| White on Action-primary-accessible | `#FFFFFF` / `#9A5533` | 4.6:1 | ✅ normal | ❌ |
| Terracotta on White | `#B86F4A` / `#FFFFFF` | 3.9:1 | ❌ normal, ✅ large | ❌ |
| Terracotta on Cream | `#B86F4A` / `#FAF7F2` | 3.6:1 | ❌ normal, ✅ large | ❌ |

**Reading:** Terracotta is safe for large headings and decorative elements (≥18pt regular or 14pt bold) but **not for body text or button text at normal size**.

## Keyboard navigation

- Every interactive element is reachable via Tab.
- Tab order follows visual order.
- Focus ring: 3px `--terracotta` outline with 2px offset. Use `:focus-visible` to show only on keyboard focus, not mouse click.
- Skip link: add a "Skip to main content" link as the first focusable element on each page. Visible on focus.

```html
<a href="#main" class="skip-link">Skip to main content</a>
...
<main id="main">...</main>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-canvas);
  color: var(--text-primary);
  border: 2px solid var(--terracotta);
  border-radius: var(--radius-md);
  z-index: 1000;
}
```

## Screen reader considerations

### Images

Every image has an `alt` attribute:
- Decorative images: `alt=""` (explicit empty).
- Content images: descriptive, factual. Example: `alt="A graphic novel page open on screen with colored annotations highlighting key passages"`.
- Logo: `alt="Human,"` (the brand name; comma is part of the brand).
- Wordmark in nav (also a link to home): `alt="Human, — home"`.

### Video thumbnails

Each MediaCard video thumbnail is a link that opens a video modal. Mark it up as:

```html
<button aria-label="Play: Annotating a graphic novel together">
  <img src="..." alt="" />
  <span class="play-icon" aria-hidden="true">▶</span>
</button>
```

### Chinese content on bilingual homepage

Mark Chinese-language blocks with `lang="zh-Hant"`. Screen readers will switch pronunciation. Example:

```html
<div lang="zh-Hant">
  <h2>學習本身，才是重點。</h2>
  <p>在 AI 的時代，最重要的問題已經不是學什麼...</p>
</div>
```

### Vertical Chinese

This is the trickiest case. The visual presentation is stacked characters across three columns, reading right-to-left. For screen readers, the reading order must still be logical.

Solution: render the characters in source order as a normal sentence, then use CSS to visually break and stack them. Screen readers ignore the CSS and read the source.

```html
<p lang="zh-Hant" class="vertical-ch">把話想清楚、把文本讀透、把字寫準。</p>
```

```css
.vertical-ch {
  writing-mode: vertical-rl;
  text-orientation: upright;
}
```

Alternative (which is what the Figma mockup uses): break the sentence into 3 visual columns manually, but include the full sentence as `aria-label` on the container and hide the visual breaks with `aria-hidden`:

```html
<div role="group" aria-label="把話想清楚、把文本讀透、把字寫準。" lang="zh-Hant">
  <div class="col" aria-hidden="true">把話想清楚</div>
  <div class="col" aria-hidden="true">把文本讀透</div>
  <div class="col" aria-hidden="true">把字寫準。</div>
</div>
```

Either approach works. The first is semantically cleaner (real CSS vertical text); the second gives more visual control but requires `aria-hidden` to prevent screen readers from reading fragments.

### The "Human," comma

Screen readers announce "Human comma" by default, which is awkward.

Solution: mark the wordmark as an image with `alt="Human,"`. The screen reader reads "Human comma" but since it's identified as an image, users understand it's a logo, not a typographic error. Alternative: use `aria-label="Human"` (dropping the comma) on links that use the wordmark.

### Nav drawer (mobile)

- Hamburger button: `aria-label="Open menu"` when closed, `aria-label="Close menu"` when open. `aria-expanded="true|false"`.
- Drawer: `role="dialog"`, `aria-modal="true"`.
- Focus trap when open — Tab cycles within the drawer; Escape closes.
- Return focus to the hamburger when closed.

### FAQ accordion

`<details>` and `<summary>` are natively accessible:
- `<summary>` is focusable.
- Space or Enter toggles open/closed.
- Screen readers announce "expanded" / "collapsed" state.

No additional ARIA needed.

### Language toggle

Mark the toggle so screen readers understand it's a language switcher:

```html
<div role="group" aria-label="Language">
  <span class="current" aria-current="true">EN</span>
  <span aria-hidden="true">/</span>
  <a href="/zh-hant/about" lang="zh-Hant" hreflang="zh-Hant">繁</a>
</div>
```

## Motion and animation

- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- Don't animate anything that isn't essential.
- No parallax, no autoplay video.
- FAQ accordion can animate open/closed (200ms ease-out) but must skip animation under reduced-motion.

## Forms (for future Contact page)

When the Contact form is built:
- Every input has a visible `<label>`, not just placeholder text.
- Error messages: inline, red, with icon, announced via `aria-live="polite"`.
- Required fields marked with `aria-required="true"` and visually with `*`.
- Submit button disabled state must still be keyboard-reachable; use `aria-disabled="true"` not native `disabled`.

## Testing checklist

Before launch:

- [ ] axe DevTools: zero violations on every page.
- [ ] Lighthouse Accessibility: 100 on every page.
- [ ] Keyboard only: tab through every interactive element on every page without getting stuck or losing visual focus.
- [ ] Screen reader (VoiceOver): read through every page. Verify reading order, image alt text, and Chinese-block language switching.
- [ ] Screen reader (NVDA on Windows if available): verify same.
- [ ] Zoom: 200% browser zoom should reflow, not clip content.
- [ ] Color inspection: use a colorblindness simulator. Brand palette was designed with this in mind but verify.
- [ ] Reduced motion: enable in OS, verify nothing animates.

## Resources

- WCAG 2.1 quick reference: https://www.w3.org/WAI/WCAG21/quickref/
- axe DevTools: https://www.deque.com/axe/
- WebAIM contrast checker: https://webaim.org/resources/contrastchecker/
- NVDA screen reader (free, Windows): https://www.nvaccess.org/
