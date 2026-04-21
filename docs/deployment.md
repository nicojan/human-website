# Deployment

The site is a pile of static files in `dist/`. Any host that serves HTML over
HTTPS works. Two defaults are documented; either is fine.

## Build

```bash
npm run build
```

This runs through `scripts/sandbox.mjs`, which mirrors the project to
`/tmp/human-build` (avoids the `#`-path issue with Astro) and then executes
`astro build`. The output in `/tmp/human-build/dist` is rsynced back to
`./dist` in the source tree.

What ships:

```
dist/
├── index.html               # /
├── about/index.html         # /about
├── blog/
│   ├── index.html           # /blog
│   └── why-the-comma/
│       └── index.html
├── faq/index.html
├── privacy/index.html
├── useful-words/index.html
├── what-we-teach/index.html
├── zh/                      # same tree, Chinese
├── brand/                   # wordmarks, favicons, OG
├── images/schools/          # university logos
├── _astro/                  # hashed CSS
├── sitemap-index.xml
└── sitemap-0.xml
```

Total weight is a few hundred KB. Fonts are loaded from Google Fonts
(`fonts.googleapis.com`) with `display: swap`.

## Recommended host: Cloudflare Pages

Why: global edge caching, free TLS, automatic deploy on git push, and great
performance for a static audience that's distributed across Canada and Asia.

1. Connect the GitHub repo to a Cloudflare Pages project.
2. Framework preset: **Astro**.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Environment variables: none needed.
6. Add the custom domain (`forhuman.ca`) in the Pages project settings. DNS
   records go on Cloudflare too, which handles TLS automatically.

Deploys happen automatically on every push to `main`. Preview deploys happen
automatically on every PR.

## Alternative host: Netlify

Equally fine. Same build command, same output directory. Netlify has a
similarly good DX; pick Cloudflare if edge-caching latency in Asia matters
most, Netlify if form-handling / functions matter later.

## Custom domain

Plan of record: `forhuman.ca`. Already referenced in `astro.config.mjs` as
the canonical `site:` URL. If you change the domain, update:

- `astro.config.mjs` — `site` field
- `src/layouts/BaseLayout.astro` — fallback `Astro.site` values (there are
  three of them, near the head-meta section)
- `src/layouts/BlogPostLayout.astro` — the JSON-LD `publisher.logo.url`
  fallback
- Any absolute URLs in documentation

## Cache policy

Recommended headers for the host:

| Path pattern | Cache-Control |
|---|---|
| `/_astro/*` | `public, max-age=31536000, immutable` (hashed; safe to cache forever) |
| `/brand/*`, `/images/*` | `public, max-age=604800` (7 days) |
| `*.html` | `public, max-age=0, must-revalidate` |
| `sitemap-*.xml` | `public, max-age=3600` (1 hour) |

Most hosts infer something close to this by default. Only worth overriding
if analytics show asset churn.

## Sitemaps and search

`@astrojs/sitemap` generates `sitemap-index.xml` on every build. The full
URL is `https://forhuman.ca/sitemap-index.xml`. Submit this to Google Search
Console under both the English and Chinese properties (or a single property
for the root domain, with `hreflang` doing the heavy lifting).

The `<link rel="canonical">` on each page points at the English URL for an
English page and the Chinese URL for a Chinese page. `hreflang` links cover
the other direction.

## Analytics

Not currently shipped. When added, pick a privacy-respecting option (Plausible,
Simple Analytics, or Fathom) over Google Analytics. The privacy page promises
we don't run analytics; ship a privacy-policy update in the same commit as
any analytics addition.

## Deployment checklist

Before hitting "Deploy":

- [ ] `npm run check` passes with zero errors
- [ ] `npm run build` produces a `dist/` with all expected pages
- [ ] `npm run humanize:check` exits 0 (no stale SHAs)
- [ ] Lighthouse accessibility >= 95 on home + latest blog post (manually via
      chrome-devtools MCP or `npx lighthouse`)
- [ ] Sitemap `dist/sitemap-index.xml` includes both locales

After deploy:

- [ ] Open `/` and `/zh/` on real devices at least once
- [ ] Check `curl -I` returns `200` for `/`, `/zh/`, `/sitemap-index.xml`,
      `/brand/human-og-1200x630.png`
- [ ] View a post, open DevTools → Console. Zero errors expected.
