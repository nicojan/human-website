# Design Tokens

These are the canonical design tokens for forhuman.ca. They mirror the Figma variables and the values exposed by `mcp-designer-for-human`. **Do not invent new values.** If something isn't in this file, ask before adding.

When this file and the MCP disagree, the MCP wins. This file is a local snapshot for speed — re-sync via `mcp-designer-for-human:get_colour_palette` and `mcp-designer-for-human:get_typography` when making changes.

## CSS Variables — `src/styles/tokens.css`

```css
:root {
  /* ============ PRIMITIVE COLORS ============ */
  /* Raw palette. Don't use these directly in components — use semantic tokens below. */
  
  /* Primary */
  --bark: #322A22;
  --cream: #FAF7F2;
  --cream-mid: #F2EDE5;
  --white: #FFFFFF;
  --ink: #2B3A4E;
  
  /* Secondary */
  --sage: #5B7254;
  --sage-deep: #3D5236;
  --sage-light: #E8EDE6;
  --terracotta: #B86F4A;
  --terracotta-light: #F5E6DB;
  --clay: #C9906D;
  --rose: #B5454A;
  --rose-light: #F5DEDE;
  --ochre: #C08B2E;
  --ochre-light: #FBF3E0;
  --ink-light: #E0E4EA;
  --slate: #3D6B80;
  --slate-light: #DDE8EE;
  
  /* Neutrals */
  --neutral-200: #E5E1DB;
  --neutral-400: #B0A99E;
  --neutral-600: #6B655C;
  
  /* ============ SEMANTIC TOKENS ============ */
  /* Use these in components. */
  
  /* Text */
  --text-primary: var(--bark);
  --text-secondary: var(--neutral-600);
  --text-tertiary: var(--neutral-400);
  --text-disabled: var(--neutral-400);
  --text-placeholder: var(--neutral-400);
  --text-inverse: var(--white);
  --text-brand: var(--terracotta);
  --text-link: var(--ink);
  
  /* Backgrounds */
  --bg-canvas: var(--white);
  --bg-warm: var(--cream);
  --bg-surface: var(--cream-mid);
  --bg-surface-hover: var(--neutral-200);
  --bg-emphasis: var(--ink);
  
  /* Borders */
  --border-default: var(--neutral-200);
  --border-strong: var(--neutral-400);
  --border-brand: var(--terracotta);
  
  /* Actions */
  --action-primary: var(--terracotta);
  --action-primary-hover: #A0603F;  /* darken 10% */
  --action-secondary: var(--ink);
  --action-secondary-hover: #1E2C3D;
  
  /* Accents */
  --accent: var(--terracotta);
  --accent-discovery: var(--ochre);
  --accent-discovery-bg: var(--ochre-light);
  
  /* Interactive */
  --link-default: var(--ink);
  --link-hover: #1E2C3D;
  --focus-ring: var(--terracotta);
  --surface-active: var(--neutral-200);
  
  /* Status */
  --status-success-fg: var(--sage);
  --status-success-bg: var(--sage-light);
  --status-warning-fg: var(--ochre);
  --status-warning-bg: var(--ochre-light);
  --status-error-fg: var(--rose);
  --status-error-bg: var(--rose-light);
  --status-info-fg: var(--slate);
  --status-info-bg: var(--slate-light);
  
  /* ============ SPACING ============ */
  /* 4px base unit. */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 20px;
  --sp-6: 24px;
  --sp-8: 32px;
  --sp-10: 40px;
  --sp-12: 48px;
  --sp-16: 64px;
  --sp-20: 80px;
  --sp-24: 96px;
  --sp-32: 128px;
  
  /* ============ RADIUS ============ */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* ============ TYPOGRAPHY ============ */
  --font-display: "Literata", "Noto Serif TC", Georgia, serif;
  --font-body: "Atkinson Hyperlegible Next", "Noto Sans TC", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-chinese-display: "Noto Serif TC", "Literata", Georgia, serif;
  --font-chinese-body: "Noto Sans TC", "Atkinson Hyperlegible Next", -apple-system, sans-serif;
  
  /* Type scale — display */
  --text-display-1: 72px;  /* Homepage hero headline desktop */
  --text-display-2: 56px;  /* Inner page hero desktop */
  --text-display-3: 44px;  /* Section titles desktop */
  
  /* Type scale — heading */
  --text-h1: 40px;
  --text-h2: 36px;
  --text-h3: 28px;
  --text-h4: 24px;
  --text-h5: 22px;
  --text-h6: 20px;
  
  /* Type scale — body */
  --text-body-lg: 20px;   /* Hero subhead */
  --text-body-md: 18px;   /* Primary body */
  --text-body: 17px;      /* Default body */
  --text-body-sm: 16px;   /* Secondary body */
  --text-body-xs: 15px;   /* Metadata, small labels */
  
  /* Type scale — utility */
  --text-caption: 13px;   /* Eyebrows, captions */
  --text-micro: 11px;     /* Footer fine print */
  
  /* Line heights */
  --lh-tight: 1.1;    /* Display */
  --lh-snug: 1.2;     /* Headings */
  --lh-normal: 1.5;   /* Body */
  --lh-relaxed: 1.65; /* Chinese body (denser character needs more space) */
  
  /* Letter spacing */
  --ls-tight: -0.02em;   /* Display, headings */
  --ls-normal: 0;
  --ls-wide: 0.08em;     /* Eyebrows, caps */
}

/* ============ MOBILE OVERRIDES ============ */
@media (max-width: 767px) {
  :root {
    --text-display-1: 36px;
    --text-display-2: 32px;
    --text-display-3: 28px;
    --text-h1: 28px;
    --text-h2: 26px;
    --text-h3: 22px;
    --text-body-lg: 17px;
    --text-body-md: 16px;
  }
}

/* ============ DARK MODE (defer — not in v1) ============ */
/* @media (prefers-color-scheme: dark) { ... } */
```

## Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Direct tokens (use sparingly — prefer semantic)
        bark: 'var(--bark)',
        cream: 'var(--cream)',
        'cream-mid': 'var(--cream-mid)',
        ink: 'var(--ink)',
        terracotta: 'var(--terracotta)',
        sage: 'var(--sage)',
        ochre: 'var(--ochre)',
        'neutral-200': 'var(--neutral-200)',
        'neutral-400': 'var(--neutral-400)',
        'neutral-600': 'var(--neutral-600)',
        
        // Semantic (preferred in components)
        canvas: 'var(--bg-canvas)',
        warm: 'var(--bg-warm)',
        surface: 'var(--bg-surface)',
        emphasis: 'var(--bg-emphasis)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-inverse': 'var(--text-inverse)',
        'text-brand': 'var(--text-brand)',
        'border-default': 'var(--border-default)',
        'border-brand': 'var(--border-brand)',
        'action-primary': 'var(--action-primary)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        'zh-display': 'var(--font-chinese-display)',
        'zh-body': 'var(--font-chinese-body)',
      },
      spacing: {
        // Tailwind's 1-unit = 0.25rem = 4px matches our --sp-1
        // so use Tailwind's native spacing scale directly.
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontSize: {
        'display-1': ['var(--text-display-1)', { lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--ls-tight)' }],
        'display-2': ['var(--text-display-2)', { lineHeight: 'var(--lh-tight)', letterSpacing: 'var(--ls-tight)' }],
        'display-3': ['var(--text-display-3)', { lineHeight: 'var(--lh-snug)', letterSpacing: 'var(--ls-tight)' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: 'var(--lh-normal)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--lh-normal)' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: 'var(--lh-normal)' }],
        caption: ['var(--text-caption)', { letterSpacing: 'var(--ls-wide)' }],
      },
    },
  },
} satisfies Config;
```

## CTA button — contrast caveat (important)

The primary CTA button currently uses:
- Background: `--action-primary` (Terracotta #B86F4A)
- Text: `--text-inverse` (White)
- Contrast: **3.88:1** — fails WCAG AA for normal text.

**Fix options for Claude Code to implement:**

1. **Recommended:** Darken the Terracotta used for buttons only (not the brand accent). Create a `--action-primary-accessible: #9A5533` that hits 4.5:1. Keep `--terracotta` unchanged as a brand accent color.

2. Alternative: Use Ink (`--action-secondary`) as the primary button background with White text (12:1+). This changes the visual feel of the CTA to a more institutional one.

3. Alternative: Use larger button text (18px+) to make the button qualify as WCAG "large text" (3:1 acceptable). Button text is currently 17px Medium, just below the threshold.

Decision needed from Nico before launch. Until resolved, the button passes "large text" at 17px Medium but Claude Code should implement a fix in v1.

## Wordmark assets

Export from Figma: File → Export → select the frames in "04 · Export Frames" section of the Logos and Wordmarks v2 page.

Ship to `/src/assets/brand/`:
- `human-wordmark-colour-on-white.svg` — default nav/footer on light bg
- `human-wordmark-colour-on-ink.svg` — for dark emphasis blocks
- `human-wordmark-mono-white.svg` — fallback
- `human-comma-terracotta.svg` — standalone comma (if needed)
- `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`
- `apple-touch-icon-180x180.png`
- `human-og-1200x630.png` — social sharing image

The wordmark SVG viewBox is 800×200 with ~14% left padding (safe zone). For inline UI use, either wrap in a clipping container with negative offset, or use CSS `clip-path: inset(...)` to crop the safe-zone padding. Figma mockups use a wrapper frame technique — Claude Code should replicate this in CSS.
