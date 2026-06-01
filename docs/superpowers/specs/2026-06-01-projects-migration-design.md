# Projects migration: pocketdystopia + usefulwords → forhuman.ca

**Date:** 2026-06-01
**Status:** Draft, awaiting review
**Owner:** Nico Jan

## Goal

Surface two existing standalone web projects under the `forhuman.ca` brand as their own subdomains. Each project keeps its own GitHub repo and its own Cloudflare Worker. The `human-website` (forhuman.ca) repo gains only a "Tools for Students" footer band linking out.

| Project | URL | GitHub repo | Cloudflare Worker | Status today |
|---|---|---|---|---|
| Pocket Dystopia | `https://pocketdystopia.forhuman.ca/` | `nicojan/pocket-dystopia` | `pocket-dystopia` | **Already live.** Subdomain bound, auto-deploys from repo on push. |
| Useful Words | `https://usefulwords.forhuman.ca/` | `nicojan/usefulwords` (to create) | `usefulwords` (to create) | **Not migrated.** Currently lives in `Class-with-Nico` repo's `Development/usefulwords/` subdirectory; source files on Google Drive. |
| forhuman.ca (this repo) | `https://forhuman.ca/` | `nicojan/human-website` | `human-website` | Unchanged except for footer addition. |

Old `classwith.nicojan.com/...` URLs are out of scope. No redirects.

## Architectural choice (revised)

The original draft of this spec proposed a single Worker with host-based routing serving all three sites from `public/` subfolders. That was the right answer when both projects were assumed greenfield. After discovering the `pocket-dystopia` Worker + repo were already standalone, the math flipped:

- **Three repos, three Workers** matches the existing pattern (one project is already shaped this way).
- **Blast radius** is bounded per project. A bug in `usefulwords` can't break `forhuman.ca` or `pocketdystopia`.
- **Per-project git history stays clean.** Changes to one site don't pollute the others' commit logs.
- **No coupling.** The three sites share nothing code-wise — different fonts, different design languages, different purposes. Bundling them would be coupling-by-convenience.

Cost: 3 Workers and 3 GitHub repos to maintain. Cloudflare GitHub auto-deploy means the per-Worker operational overhead is near zero. Acceptable.

## Work breakdown

### A. `nicojan/usefulwords` — new GitHub repo

**Local working path:** `/Users/nicojan/dev/human/usefulwords` (sibling to `human-website`).

Repo layout:

```
usefulwords/
├── public/
│   ├── index.html         # copied from Google Drive, with edits below
│   ├── css/
│   │   ├── normalize.css
│   │   └── styles.css
│   ├── js/
│   │   └── nav.js
│   ├── fonts/             # 5 × SFCompactDisplay weights (~1.5 MB total)
│   └── images/            # 6 PNGs
├── wrangler.toml
├── .gitignore             # standard: .DS_Store, node_modules, etc.
└── README.md              # short: what this is, how to deploy, link back to forhuman.ca
```

`wrangler.toml`:

```toml
name = "usefulwords"
compatibility_date = "2026-06-01"

[assets]
directory = "./public"
not_found_handling = "404-page"
html_handling = "auto-trailing-slash"
```

Source-of-truth: copy from `/Volumes/n1TB/GDrive (Class with Nico)/Website/WIP/Class with Nico/Development/usefulwords/`. Exclude `.DS_Store` and `.claude/`.

#### `public/index.html` edits

Useful Words has no `og:url`, `og:image`, or `canonical` tags today. Two changes:

1. Append the footer credit line (see Footer credit section).
2. *(Optional, lightweight)* Add `<meta property="og:url" content="https://usefulwords.forhuman.ca/" />` and a minimal `og:description` so social link previews aren't blank. This is past "minimal touch" but a 2-line gain with no risk. **Recommendation:** include it.

Everything else copied byte-for-byte. External dependencies stay (`http://nicojan.com/contact`, Webflow CDN jQuery from `d1tdp7z6w94jbb.cloudfront.net`).

### B. `nicojan/pocket-dystopia` — touch-ups (in scope)

Pocket Dystopia is already live at the new subdomain. Three small fixes, delivered as a PR on the existing repo:

1. **Footer credit** consistent with Useful Words: `designed with ❤ for Human, by Nico Jan`. Currently the page has a "Nico Jan" link but no Human, attribution.
2. **Pull OG image local.** `og:image` currently points at `https://raw.githubusercontent.com/nicojan/classwithnico/refs/heads/main/Development/pocket-dystopia/og-image-v1.png`. Fragile external dependency. Copy the image into the repo and reference it relatively.
3. **Update `og:url`** from `https://classwith.nicojan.com/pocket-dystopia/` to `https://pocketdystopia.forhuman.ca/`.

**Local working path:** `/Users/nicojan/dev/human/pocket-dystopia` (clone from GitHub). Implementation creates a branch, lands the three changes, opens a PR for review before merge.

### C. `nicojan/human-website` — this repo

**Only change here:** add a "Tools for Students" band to the footer on every page that has a footer. Eleven files:

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

(There is no `public/zh-hant/contact/` mirror today. Pre-existing gap, out of scope.)

The current `.footer__grid` is 3 columns at desktop (`1fr 1.3fr 1fr`). Inserting a 4th column would compress everything. Instead, add a new band **between** the existing grid and `.footer__bottom`:

```html
<div class="footer__tools">
  <span class="footer__heading">Tools for Students · <span lang="zh-Hant">學生工具</span></span>
  <ul class="footer__list footer__list--inline">
    <li><a href="https://pocketdystopia.forhuman.ca/">Pocket Dystopia</a></li>
    <li><a href="https://usefulwords.forhuman.ca/">Useful Words</a></li>
  </ul>
</div>
```

CSS additions in `public/css/components.css` near the existing footer rules:

```css
.footer__tools {
  display: flex;
  flex-direction: column;
  gap: var(--sp-base-sm);
  padding-block: var(--sp-lg);
  border-block-start: 1px solid var(--border-subtle);
}

.footer__list--inline {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-md);
}
```

If `--border-subtle` does not exist as a semantic token, fall back to whatever semantic border token the design system already provides. Resolve at implementation time; never hardcode.

Project names ("Pocket Dystopia", "Useful Words") are not translated — they are brands.

**No Worker script, no `wrangler.toml` changes, no `public/pocketdystopia/`, no `public/usefulwords/` folders in this repo.**

## Footer credit (shared shape across both project repos)

For Useful Words (and optionally Pocket Dystopia), append before `</body>`:

```html
<p class="forhuman-credit">
  designed with ❤ for
  <a href="https://forhuman.ca" target="_blank" rel="noopener">Human,</a>
  by <a href="https://nicojan.com" target="_blank" rel="noopener">Nico Jan</a>
</p>
```

Phrased "for Human, by Nico Jan" so the brand-required comma in **Human,** sits naturally before "by" rather than dangling at the end of the line.

Each project styles `.forhuman-credit` to match its own aesthetic — centred, small, foreground colour. One CSS rule in each project's existing stylesheet; no shared partial (they're independent sites).

## Cloudflare dashboard work

Steps after the Useful Words repo is created and pushed:

1. **Workers & Pages → Create → Workers** → Import from Git.
2. Connect to GitHub if not already connected. Select `nicojan/usefulwords`.
3. Name the worker `usefulwords`. Branch: `main`. Build command: `none`. Deploy command: `npx wrangler deploy`. (Match the `pocket-dystopia` Worker's settings.)
4. Confirm; first deploy runs.
5. **Workers & Pages → usefulwords → Domains → + Add Domain → Custom Domain → `usefulwords.forhuman.ca` → Confirm.** Cloudflare auto-creates the DNS record and issues SSL.
6. Verify `https://usefulwords.forhuman.ca/` loads.

For Pocket Dystopia: nothing to do at the Cloudflare layer. The Worker is already set up and the domain is already bound.

## Sequencing

1. Make the apex footer change in this repo (`nicojan/human-website`). Commit and merge. Cloudflare auto-deploys `forhuman.ca`. The "Tools for Students" links will appear on the live site, with Useful Words temporarily broken (no DNS yet) and Pocket Dystopia already working.
2. Create `nicojan/usefulwords` GitHub repo with the file copy + wrangler.toml + footer credit.
3. Stand up the `usefulwords` Cloudflare Worker (steps 1–4 above).
4. Bind `usefulwords.forhuman.ca` as the custom domain (step 5).
5. *(Optional)* Make the optional touch-ups to `nicojan/pocket-dystopia`.

Step 1 can land anytime — the Useful Words footer link will 404 (CF "no route") until step 4 completes. If you want zero broken-link window, do steps 2–4 first and then step 1 last.

## Out of scope

- Redirects from `classwith.nicojan.com/...`.
- Code modernization in either project (inline `onclick` handlers, Webflow CDN jQuery, `http://` link to nicojan.com, dead CSS).
- Accessibility audit / Lighthouse pass on the migrated projects. The apex site's `Lighthouse a11y = 100` merge gate **does not apply** to these subdomain projects.
- `/zh-hant/` mirrors of either project. Pocket Dystopia is EN-only; Useful Words is already EN/ZH inline.
- Re-organizing or renaming the existing `pocket-dystopia` Worker / GitHub repo. Both stay as-is.
- Building any shared component library across the three projects.

## Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Footer edits diverge across 11 files | Medium | Implementation step grep-verifies the inserted markup appears in every file in the list before commit |
| Useful Words assets break after move | Low | All references in `index.html` are relative (`css/styles.css`, `images/...`, `js/nav.js`). Verified by grep — no root-absolute paths exist |
| Webflow CDN jQuery goes away | Very low | Out of scope; would only affect Useful Words; can be fixed later by inlining |
| `nicojan/usefulwords` repo name conflict | Very low | Verify before creation that the slug is free on GitHub |
| Cloudflare GitHub integration prompts re-auth | Low | Standard flow; you've already done it for `pocket-dystopia` |

## Verification before declaring done

- [ ] `pocketdystopia.forhuman.ca/` still serves Pocket Dystopia (no regression on existing setup).
- [ ] `usefulwords.forhuman.ca/` serves Useful Words.
- [ ] Useful Words page shows the "designed with ❤ for Human," footer credit.
- [ ] `forhuman.ca/` and every existing apex route still serves correctly.
- [ ] Apex footer on all 11 listed pages shows the "Tools for Students · 學生工具" band with two working links.
- [ ] Both subdomain links from the apex footer resolve to the correct project page.
- [ ] No `.DS_Store` or `.claude/` artefacts committed in any repo.
