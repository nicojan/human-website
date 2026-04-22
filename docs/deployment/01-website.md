# Deploy the website to Cloudflare Pages

The deployable tree is `/public`. Hugo generates `/public/writing/` at build time. No npm install. No Node runtime.

## 1. Merge the rebuild

Open [PR #2](https://github.com/nicojan/human-website/pull/2) and merge it into `main`.

If Cloudflare Pages is already configured, it will trigger a build automatically. If not, follow step 2.

## 2. First-time Cloudflare Pages setup

In the Cloudflare dashboard:

1. **Workers & Pages → Create application → Pages → Connect to Git.**
2. Choose `nicojan/human-website`, production branch `main`.
3. Build configuration:
   - **Framework preset:** None
   - **Build command:** `bash scripts/build.sh`
   - **Build output directory:** `public`
   - **Root directory:** `/`
4. **Environment variables** (Production):
   - `HUGO_VERSION=0.122.0` (or the version you want pinned — the Cloudflare Pages build image supports Hugo directly)
   - `NODE_VERSION=20` (optional — no Node is needed, but Pages may expect one)
5. **Custom domains:** add `forhuman.ca` and `www.forhuman.ca`. Point the DNS records at the Pages target.
6. Deploy.

## 3. Verify

After the first deploy:

- Visit `https://forhuman.ca/` — the bilingual hero should render.
- Visit `https://forhuman.ca/writing/` — the Hugo-generated blog lists the sample post.
- Visit `https://forhuman.ca/writing/index.json` — JSON feed with the sample post.
- Visit `https://forhuman.ca/zh-hant/` — Chinese homepage renders.
- Click "Book a Consult" on the home — lands at `/contact/` with a bilingual form.
- In a real browser, run Lighthouse — a11y should be 100 on every page. Performance 90+ (depends on font load over 3G).

If `/writing/` is empty, Hugo didn't build. Check the Pages build log. Most common cause: Hugo version mismatch — bump `HUGO_VERSION` to the newest stable.

## 4. Publishing a blog post

1. `brew install hugo` locally (one-time).
2. Create `blog/content/posts/my-post.md` with the frontmatter template from `blog/archetypes/default.md`. Set `draft: false` and a past-or-present `date`.
3. Humanize via `mcp-humanizer` (for longer posts, call `humanizer_get_guide`; short ones, `humanizer_get_summary`).
4. `bash scripts/build.sh` to preview locally at `public/writing/`.
5. Commit with `content(blog): <slug>` and push. Cloudflare Pages rebuilds automatically.

## 5. Editing the marketing pages

Just edit the HTML in `public/*.html` or `public/zh-hant/*.html`. No build step, no compile. Commit and push — Cloudflare Pages publishes.

Design tokens live in `public/css/tokens.css`. Reference semantic tokens (`var(--action-primary)`, `var(--sp-lg)`) from component CSS; never hardcode hex or px values.

## Troubleshooting

**Cloudflare Pages build fails at `hugo: command not found`.**
Set `HUGO_VERSION` in Pages env vars. `0.122.0` or later works.

**Blog posts don't show up after push.**
Check the post's `date` — Hugo skips future-dated posts by default. Use `buildFuture = true` in `hugo.toml` if you want them visible.

**Fonts 404 / FOUT.**
The site uses Google Fonts over CDN. If your CSP blocks third-party fonts, self-host the WOFF2 files and change the `<link>` to a local path.

**Contact form returns 404 in production.**
You haven't deployed the dashboard endpoint yet (sub-project B). Until then the form either stubs (dev) or shows a network error (prod). See [03-contact-backend.md](03-contact-backend.md).

**Matomo events not recorded.**
`SITE_ID_PLACEHOLDER` is still in `public/js/matomo.js`. See [02-matomo.md](02-matomo.md).
