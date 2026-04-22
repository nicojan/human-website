# Deploy the website to Cloudflare Workers

The site is served by a Cloudflare **Worker** with static assets — no Worker script, just the `./public` tree served directly from the edge. `wrangler.toml` in the repo root does the wiring.

The deployable tree is `./public`. Hugo generates `./public/writing/` at build time, so the Workers Build step must run `bash scripts/build.sh` before `wrangler deploy`.

## 1. Merge the rebuild

Open [PR #2](https://github.com/nicojan/human-website/pull/2) and merge it into `main`. Also merge [PR #3](https://github.com/nicojan/human-website/pull/3) (Matomo snippet) if you want that in the first deploy.

Cloudflare Workers will trigger a build automatically on push to `main`.

## 2. Update two fields in the Workers dashboard

Open the `human-website` Worker in the Cloudflare dashboard → **Settings → Build**. The dashboard shows "Latest build failed" because these two fields are wrong:

1. **Build command** — currently `None`. Change to: `bash scripts/build.sh`
2. **Environment variables** (under Build configuration or a separate "Variables and Secrets" field for build-time) — add `HUGO_VERSION=0.122.0`

Leave everything else as-is:

- Deploy command: `npx wrangler deploy` (already correct)
- Version command: `npx wrangler versions upload` (already correct)
- Root directory: `/` (already correct)
- Production branch: `main` (already correct)
- Compatibility date and flags: already set to match `wrangler.toml`
- Custom domain: `forhuman.ca` already bound

Kick off a new deploy by re-running the failed build, or push any small change to `main`.

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

**Workers build fails at `hugo: command not found`.**
Set `HUGO_VERSION=0.122.0` (or later) as a build env var. Cloudflare's build image installs Hugo when that variable is present, same as Pages.

**Workers build fails at `wrangler: not found`.**
The project has no `package.json`, so `npx wrangler` has nothing to resolve from. Cloudflare Workers' build step adds `wrangler` to the image automatically if `wrangler.toml` exists — which it does in this repo. If this error still surfaces, add a minimal `package.json` with `wrangler` as a devDependency.

**Blog posts don't show up after push.**
Check the post's `date` — Hugo skips future-dated posts by default. Use `buildFuture = true` in `hugo.toml` if you want them visible.

**Fonts 404 / FOUT.**
The site uses Google Fonts over CDN. If your CSP blocks third-party fonts, self-host the WOFF2 files and change the `<link>` to a local path.

**Contact form returns 404 in production.**
You haven't deployed the dashboard endpoint yet (sub-project B). Until then the form either stubs (dev) or shows a network error (prod). See [03-contact-backend.md](03-contact-backend.md).

**Matomo events not recorded.**
`SITE_ID_PLACEHOLDER` is still in `public/js/matomo.js`. See [02-matomo.md](02-matomo.md).
