# Projects migration: pocketdystopia + usefulwords → forhuman.ca

**Date:** 2026-06-01
**Status:** Draft, awaiting review
**Owner:** Nico Jan

## Goal

Bring two legacy static projects under the `forhuman.ca` Cloudflare Worker as their own subdomains, with minimal disturbance to either codebase. One repo, one deploy, three custom domains bound to the same Worker.

| Project | New URL | Source today |
|---|---|---|
| Pocket Dystopia | `https://pocketdystopia.forhuman.ca/` | `classwith.nicojan.com/pocket-dystopia/` (also in `Class-with-Nico` GitHub repo at `Development/pocket-dystopia/`) |
| Useful Words | `https://usefulwords.forhuman.ca/` | `classwith.nicojan.com/usefulwords/` (also in `Class-with-Nico` GitHub repo at `Development/usefulwords/`) |

Old `classwith.nicojan.com/...` URLs are out of scope. No redirects, no link-tracking, no domain reclamation.

## Architecture

Today: `wrangler.toml` has only an `[assets]` directive. Cloudflare serves `./public/` 1:1.

Change: introduce a tiny Worker entry script that inspects the `Host` header and prefixes the path before delegating to the `ASSETS` binding. The apex domain is also served via the same delegate call, so behavior at `forhuman.ca` is preserved.

```
forhuman.ca/*                  →  public/*                  (unchanged)
pocketdystopia.forhuman.ca/*   →  public/pocketdystopia/*   (host-prefixed)
usefulwords.forhuman.ca/*      →  public/usefulwords/*      (host-prefixed)
forhuman.ca/pocketdystopia/*   →  404                       (blocked)
forhuman.ca/usefulwords/*      →  404                       (blocked)
```

Apex blocking exists so each project has exactly one canonical URL.

### Worker script (`src/worker.js`)

About 25 lines. Sketch:

```js
const HOST_TO_PREFIX = {
  'pocketdystopia.forhuman.ca': '/pocketdystopia',
  'usefulwords.forhuman.ca':    '/usefulwords',
};
const APEX_BLOCKED = /^\/(pocketdystopia|usefulwords)(\/|$)/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prefix = HOST_TO_PREFIX[url.hostname];

    if (prefix) {
      url.pathname = prefix + url.pathname;
      return env.ASSETS.fetch(new Request(url, request));
    }

    if (APEX_BLOCKED.test(url.pathname)) {
      const notFoundUrl = new URL('/404.html', request.url);
      const res = await env.ASSETS.fetch(new Request(notFoundUrl, request));
      return new Response(res.body, { status: 404, headers: res.headers });
    }

    return env.ASSETS.fetch(request);
  },
};
```

### `wrangler.toml` change

Add one line:

```toml
main = "src/worker.js"
```

Everything else stays. `[assets]` continues to declare the directory, the `not_found_handling`, and the `html_handling`. The default binding name `ASSETS` is used.

**Side-effect to be aware of:** with `main` set, the Worker handles every request — apex included. Apex behavior should be identical to today (delegates to `env.ASSETS.fetch`), but the failure mode shifts from "Cloudflare can't fail" to "Worker bug breaks apex." Mitigation: the script is intentionally trivial and exercised in dev before deploy.

## File tree (additions)

```
public/
├── pocketdystopia/
│   ├── index.html         # copied, with edits below
│   ├── styles.css         # verbatim
│   └── og-image.png       # pulled local from raw.githubusercontent.com
└── usefulwords/
    ├── index.html         # copied, with edits below
    ├── css/               # verbatim
    │   ├── normalize.css
    │   └── styles.css
    ├── js/                # verbatim
    │   └── nav.js
    ├── fonts/             # verbatim (~1.5 MB — five SFCompactDisplay weights)
    └── images/            # verbatim

src/
└── worker.js              # new

wrangler.toml              # +1 line: main = "src/worker.js"
```

Repo size impact: ~1.7 MB. Acceptable.

`.DS_Store` and `.claude/` directories from the source folders are **not** copied.

## Per-project edits (minimal touch)

### `public/pocketdystopia/index.html`

1. `og:url`: `https://classwith.nicojan.com/pocket-dystopia/` → `https://pocketdystopia.forhuman.ca/`
2. `og:image`: replace `https://raw.githubusercontent.com/nicojan/classwithnico/refs/heads/main/Development/pocket-dystopia/og-image-v1.png` with the relative path `og-image.png` (file copied alongside).
3. Remove the `<link rel="apple-touch-icon" href="apple-touch-icon.png" />` line — the file does not exist in source, the link currently 404s, and copying a broken reference is worse than removing it.
4. Append footer credit (see Footer credit section below).

No other edits. Inline `onclick="generateNightmare()"`, lowercase `<!doctype>`, existing meta tags — all left as-is.

### `public/usefulwords/index.html`

1. Useful Words has no `og:url`, `og:image`, or `canonical` tags. Nothing to update on that front.
2. Append footer credit (see Footer credit section).

The page's existing external dependencies stay untouched:
- jQuery served from `https://d1tdp7z6w94jbb.cloudfront.net/...` (Webflow CDN, has not gone away in years)
- `http://nicojan.com/contact` link (insecure HTTP, kept as-is per minimal-touch)

### Footer credit (both projects)

Single line, appended before `</body>` or inside whatever the existing footer wrapper is on each page. Exact wording:

```html
<p class="forhuman-credit">
  designed with ❤ for
  <a href="https://forhuman.ca" target="_blank" rel="noopener">Human,</a>
  by <a href="https://nicojan.com" target="_blank" rel="noopener">Nico Jan</a>
</p>
```

Phrased "for Human, by Nico Jan" rather than "by Nico Jan for Human," so the comma in **Human,** sits naturally before "by" instead of dangling at the end of the line. The comma is brand-required (per CLAUDE.md, it's a defining brand element).

Each project gets its own tiny scoped style block (or one rule in its existing CSS file) so the credit reads centred, small, with the existing site's foreground colour. Not a shared partial — these are two independent sites and that's fine for a 4-line addition.

## Apex site changes: "Tools for Students" footer band

The existing footer is hand-duplicated in **11 files**:

```
public/index.html
public/about/index.html
public/contact/index.html
public/services/index.html
public/privacy/index.html
public/404.html
public/zh-hant/index.html
public/zh-hant/about/index.html
public/zh-hant/services/index.html
public/zh-hant/privacy/index.html
public/zh-hant/404.html
```

(There is no `public/zh-hant/contact/` mirror today. That's a pre-existing gap in the bilingual mirror and is out of scope for this migration.)

The current `.footer__grid` is three columns at desktop (`1fr 1.3fr 1fr`). Inserting a 4th column would compress the layout. Instead, add a **new band** between the existing grid and `.footer__bottom`:

```html
<div class="footer__tools">
  <span class="footer__heading">Tools for Students · <span lang="zh-Hant">學生工具</span></span>
  <ul class="footer__list footer__list--inline">
    <li><a href="https://pocketdystopia.forhuman.ca/">Pocket Dystopia</a></li>
    <li><a href="https://usefulwords.forhuman.ca/">Useful Words</a></li>
  </ul>
</div>
```

CSS additions in `public/css/components.css` (next to existing footer rules):

```css
.footer__tools {
  display: flex;
  flex-direction: column;
  gap: var(--sp-base-sm);
  padding-block: var(--sp-lg);
  border-block-start: 1px solid var(--border-subtle, currentColor);
}

.footer__list--inline {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-md);
}
```

If `--border-subtle` doesn't exist as a token, the implementation step uses whatever semantic border token the design system already provides — confirmed at build time, not invented here. Same rule applies to spacing tokens: use existing semantic tokens, never hardcode.

Project names ("Pocket Dystopia", "Useful Words") are not translated — they are brands.

## Cloudflare dashboard work

Steps you (Nico) take after the code lands and deploys:

1. Cloudflare → **Workers & Pages** → **human-website**.
2. Top nav: click **Domains** tab (or **Settings → Domains & Routes**).
3. Click **+ Add** → **Custom domain**.
4. Enter `pocketdystopia.forhuman.ca`. Confirm. Cloudflare auto-creates a proxied CNAME pointing to the Worker.
5. Repeat for `usefulwords.forhuman.ca`.
6. SSL certificates are issued automatically; first hit may take ~30–60s to propagate.

Verify each subdomain returns the right project page. Verify `forhuman.ca/pocketdystopia/` and `forhuman.ca/usefulwords/` return the apex 404.

## Sequencing

Recommended order to avoid a broken-link window:

1. Land all code in this repo (Worker, project folders, footer band) and merge to `main`.
2. Bind both subdomains as custom domains on the Worker (dashboard steps above).
3. Cloudflare auto-deploys when `main` updates — or trigger via `npx wrangler deploy`.
4. Smoke-test all three hostnames.

If the order is reversed (deploy before domains bound), the subdomain URLs return Cloudflare's "no route" page until step 2 completes. Footer links on `forhuman.ca` would also temporarily 404. Not catastrophic, but avoidable.

## Out of scope

- Redirects from `classwith.nicojan.com/pocket-dystopia` and `classwith.nicojan.com/usefulwords`.
- Code modernization in either project: extracting inline `onclick` handlers, replacing Webflow's CDN jQuery, fixing the `http://` link in Useful Words, normalizing indentation, dead-CSS removal.
- Accessibility audit / Lighthouse pass on the migrated projects. The apex site's `Lighthouse a11y = 100` merge gate **does not apply** to the subdomain projects — they were not built to that bar and bringing them up is a separate effort.
- `/zh-hant/` mirrors of either project. Pocket Dystopia is EN-only; Useful Words is already EN/ZH inline.
- Re-organizing project folders under a `public/projects/` umbrella. Two projects at top level matches the existing flat layout (`public/about/`, `public/services/`, etc.).
- Pocket Dystopia OG image redesign — only the existing v1 image is copied local.

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Worker bug breaks apex site | Low | Script is ~25 lines; dev-test via `wrangler dev` before deploy; apex code path is a single `env.ASSETS.fetch(request)` call with no transformation |
| Subdomain custom-domain binding lag | Low | Standard CF custom-domain flow, well-trodden |
| Footer edits diverge across 11 files | Medium | Implementation plan adds a verification step: grep the inserted text appears in every file in the list before commit |
| Webflow CDN jQuery goes away | Very low | Out of scope; would only affect Useful Words if it happened; can be fixed later by inlining jQuery or replacing nav.js |
| GitHub raw URL for OG image rots | N/A | Mitigated by pulling local |

## Verification before declaring done

- [ ] `pocketdystopia.forhuman.ca/` serves the Pocket Dystopia page.
- [ ] `usefulwords.forhuman.ca/` serves the Useful Words page.
- [ ] Both subdomain pages show the "designed with ❤ for Human," footer credit.
- [ ] `forhuman.ca/pocketdystopia/` returns 404 with the apex 404 page.
- [ ] `forhuman.ca/usefulwords/` returns 404 with the apex 404 page.
- [ ] `forhuman.ca/` and every existing apex route still serves correctly (no regression).
- [ ] Apex footer on every page in the 11-file list shows the "Tools for Students · 學生工具" band with two working links.
- [ ] Both subdomain pages render without console errors in a modern browser.
- [ ] No `.DS_Store` or `.claude/` artefacts committed.
