# Copy — Traditional Chinese (繁體中文)

Chinese copy is currently finalized **only for the bilingual homepage**. About and Services Chinese translations are deferred until the founder can review with a native Taiwan-convention editor.

This is intentional — launching with an English-only About / Services page and a bilingual homepage is better than launching with machine-translated Chinese that violates the brand voice rules.

## Scope for v1

- ✅ Homepage ZH strings (this file)
- ✅ Bilingual CTA and footer labels (already bilingual in the EN copy doc)
- ⏳ About ZH — build `/zh-hant/about` when copy is signed off
- ⏳ Services ZH — build `/zh-hant/services` when copy is signed off
- ⏳ Blog in ZH — separate scope

## Language toggle behaviour for v1

On inner pages (`/about`, `/services`), the "EN / 繁" toggle appears in the nav. Clicking "繁" currently has nowhere to go.

**v1 behaviour:** The 繁 button links to `/` (the homepage, which is always bilingual). In code:
```tsx
<a href="/" class="...">繁</a>
```

When Chinese inner pages are built in v2, update this to route to the mirror page (`/zh-hant/about`, etc.).

**Don't:** disable the toggle or hide it. Parents need to see it's bilingual even if some pages don't yet have a Chinese version.

---

## Homepage ZH strings

These live on the homepage alongside their English counterparts — not as a separate page.

### Nav (ZH links)

```
課程   關於   文章   聯絡
```

### Hero — vertical Chinese display (desktop)

3 columns, reading right-to-left. Each column is stacked characters top-to-bottom.

```
Right column (read 1st): 把話想清楚
Middle column (read 2nd): 把文本讀透
Left column (read 3rd):  把字寫準。
```

The full sentence this abbreviates: "我們幫助學生把話想清楚、把文本讀透、把字寫準。" The vertical treatment drops the subject ("我們幫助學生") as a design choice — the parallel three-verb phrases are what matter visually.

### Hero — horizontal Chinese (mobile)

Mobile replaces the vertical treatment with a horizontal stacked block below the English block:

```
Headline: 我們幫助學生把話想清楚、把文本讀透、把字寫準。
Sub: 一對一教學，聚焦英文文學、寫作與批判思考。從溫哥華連線授課。
```

### Eyebrows (bilingual — appear on homepage only)

```
WHAT WE BELIEVE · 我們的信念
HOW WE TEACH · 我們的教學
OUTCOMES · 學生去向
RECENT WRITING · 近期文章
```

### "Learning is the point" block

```
Title: 學習本身，才是重點。

Body:
在 AI 的時代，最重要的問題已經不是學什麼，而是學習的過程裡如何保有自己。當答案隨手可得，思考的肌肉就容易鬆弛。我們的教學，就是讓那塊肌肉練回來。
```

### Principles — ZH titles only (bodies stay English on homepage)

```
01. 好奇心，而非順從。
02. 細讀，也讓思考出聲。
03. 看得見的進步。
04. 帶得走的研究習慣。
05. 人先於工具。

Eyebrow per card: PRINCIPLE · 原則
```

### Closing CTA

```
Headline: 想聊聊嗎？
Sub: 15 分鐘，沒有壓力。我們會先聽。
Button (shared with EN): Book a consult · 預約諮詢
```

### Footer bilingual labels

```
Brand line (ZH): 人本・共學社
Column headers:
  SITE · 網站
  CONTACT · 聯絡方式
  BASED IN · 所在地

Site links:
  Services · 課程
  About · 關於
  Writing · 文章
  Contact · 聯絡

Location:
  溫哥華・卑詩省

Bottom tagline:
  Made with care, not haste. · 用心，而非倉促。
```

---

## Character conventions (important)

Per the brand style guide:
- Use 臺 (not 台) for Taiwan-related content — though we don't reference Taiwan in these strings.
- Use 裡 (not 裏) — appears in "學習的過程裡" above.
- Use full-width punctuation throughout: 。，、；：？！「」『』
- Use the middle dot ・ (U+30FB), not a period, in "人本・共學社" and "溫哥華・卑詩省".
- No em dashes in Chinese copy. No 破折號 ——.
- English tokens inside Chinese prose get half-width spaces: "在 AI 的時代" (not "在AI的時代").
- Numbers in body prose: Arabic numerals ("15 分鐘", not "十五分鐘").

---

## Typography for Chinese text

Use these fonts:
- **Noto Serif TC** (Medium, SemiBold) for headlines and display
- **Noto Sans TC** (Regular, Medium, Bold) for body and UI

Line heights are ~10% looser than English at the same size because Chinese characters have denser visual weight. In the tokens, this is `--lh-relaxed: 1.65` for Chinese body.

Do not mix EN and ZH fonts in the same line (e.g., don't render "We help 學生" in one font stack). The CSS stack handles this via font fallback: `"Atkinson Hyperlegible Next", "Noto Sans TC", sans-serif` — English chars hit Atkinson, Chinese chars fall through to Noto Sans TC.

---

## Do NOT translate these yet

The About and Services pages in Chinese are **deferred to v2**. Do not machine-translate them for launch. The founder will work with a native reviewer to produce canonical Chinese versions.

If Claude Code is asked to stub out a Chinese About / Services page, it should:
1. Copy the English structure
2. Insert a "Coming soon · 即將推出" message as the body
3. Keep all structural labels and footer bilingual

Do NOT insert machine-translated Chinese prose for the body of deferred pages.

---

## Future: Blog Chinese translations

For v2, each blog post should have an optional `zh-hant` field in frontmatter. If present, it generates a Chinese mirror at `/zh-hant/writing/[slug]`. Posts without a ZH version are only accessible in English. No partial translation — either the full post is translated or none of it.
