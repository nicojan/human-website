# Projects Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring Pocket Dystopia + Useful Words live under `pocketdystopia.forhuman.ca` and `usefulwords.forhuman.ca`, and surface both from a new "Tools for Students" band in the forhuman.ca footer.

**Architecture:** Three separate Cloudflare Workers, three GitHub repos. `nicojan/pocket-dystopia` is already deployed; we add small touch-ups via a PR. `nicojan/usefulwords` is created greenfield from the Google Drive source. `nicojan/human-website` gains only a footer band on 11 pages — no Worker script change.

**Tech Stack:** Static HTML/CSS/JS, Cloudflare Workers with `[assets]` directive, `wrangler` via npx, `gh` CLI for GitHub work, git over HTTPS.

**Spec:** `docs/superpowers/specs/2026-06-01-projects-migration-design.md`

**Source locations:**
- Pocket Dystopia (existing repo): clone from `github.com/nicojan/pocket-dystopia`
- Useful Words (Google Drive source): `/Volumes/n1TB/GDrive (Class with Nico)/Website/WIP/Class with Nico/Development/usefulwords/`

**Working paths:**
- `/Users/nicojan/dev/human/human-website/` (this repo — apex footer change)
- `/Users/nicojan/dev/human/pocket-dystopia/` (clone destination — touch-ups PR)
- `/Users/nicojan/dev/human/usefulwords/` (new repo — first commit + push)

---

## Phase 1 — Pocket Dystopia touch-ups (existing repo, opens a PR)

### Task 1: Clone `nicojan/pocket-dystopia` to the working path

**Files:**
- New directory: `/Users/nicojan/dev/human/pocket-dystopia/`

- [ ] **Step 1: Verify the destination does not already exist**

```bash
ls /Users/nicojan/dev/human/pocket-dystopia 2>&1
```

Expected: `No such file or directory`. If it already exists with content, stop and ask the user before overwriting.

- [ ] **Step 2: Clone the repo via gh**

```bash
gh repo clone nicojan/pocket-dystopia /Users/nicojan/dev/human/pocket-dystopia
```

Expected: clone completes, `main` branch is checked out.

- [ ] **Step 3: Inspect the current state**

```bash
ls /Users/nicojan/dev/human/pocket-dystopia/
grep -nE "og:url|og:image|apple-touch-icon|forhuman" /Users/nicojan/dev/human/pocket-dystopia/index.html | head -10
```

Note the exact current values of `og:url` and `og:image` so the edit in Task 4 is accurate.

### Task 2: Create the working branch

**Files:**
- Modify: branch state in `/Users/nicojan/dev/human/pocket-dystopia/`

- [ ] **Step 1: Create and check out the branch**

```bash
cd /Users/nicojan/dev/human/pocket-dystopia && git checkout -b migrate-to-forhuman
```

Expected: `Switched to a new branch 'migrate-to-forhuman'`.

### Task 3: Pull the OG image into the repo

**Files:**
- Create: `/Users/nicojan/dev/human/pocket-dystopia/og-image.png`

- [ ] **Step 1: Download the image**

```bash
curl -fsSL "https://raw.githubusercontent.com/nicojan/classwithnico/refs/heads/main/Development/pocket-dystopia/og-image-v1.png" -o /Users/nicojan/dev/human/pocket-dystopia/og-image.png
```

Expected: file lands; `file /Users/nicojan/dev/human/pocket-dystopia/og-image.png` reports `PNG image data`.

- [ ] **Step 2: Verify file is non-empty and a real PNG**

```bash
file /Users/nicojan/dev/human/pocket-dystopia/og-image.png && du -h /Users/nicojan/dev/human/pocket-dystopia/og-image.png
```

Expected: `PNG image data, ... `, non-zero size (likely 100–500 KB).

### Task 4: Edit `index.html` — three changes

**Files:**
- Modify: `/Users/nicojan/dev/human/pocket-dystopia/index.html`

Make these three edits to the `<head>` and `<body>`:

- [ ] **Step 1: Update `og:url`**

Find:
```html
<meta
      property="og:url"
      content="https://classwith.nicojan.com/pocket-dystopia/"
    />
```

Replace with:
```html
<meta
      property="og:url"
      content="https://pocketdystopia.forhuman.ca/"
    />
```

(If the current value is already different — e.g., the repo's deployed version was already updated — match the surrounding format and set it to `https://pocketdystopia.forhuman.ca/`.)

- [ ] **Step 2: Update `og:image` to the local file**

Find:
```html
<meta
      property="og:image"
      content="https://raw.githubusercontent.com/nicojan/classwithnico/refs/heads/main/Development/pocket-dystopia/og-image-v1.png"
    />
```

Replace with:
```html
<meta
      property="og:image"
      content="https://pocketdystopia.forhuman.ca/og-image.png"
    />
```

(Absolute URL — OG image references should be absolute so social scrapers can resolve them.)

- [ ] **Step 3: Add the footer credit before `</body>`**

Find the existing footer area. The current page has a `<a href="https://nicojan.com">Nico Jan</a>` link near the bottom; **replace whatever credit line exists** with the canonical credit. If no credit line exists, insert before `</body>`:

```html
<p class="forhuman-credit">
  designed with ❤ for
  <a href="https://forhuman.ca" target="_blank" rel="noopener">Human,</a>
  by <a href="https://nicojan.com" target="_blank" rel="noopener">Nico Jan</a>
</p>
```

- [ ] **Step 4: Add `.forhuman-credit` styles to `styles.css`**

Append to `/Users/nicojan/dev/human/pocket-dystopia/styles.css`:

```css
.forhuman-credit {
  position: fixed;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.5;
  pointer-events: auto;
  margin: 0;
  padding: 0 1rem;
}
.forhuman-credit a {
  color: inherit;
}
```

(Pocket Dystopia is a dark, full-bleed page with a fixed die button — a fixed footer credit at the bottom-centre matches the existing aesthetic. If visual review on the next step shows it overlaps the die button, switch `position: fixed` to inline placement above the die button.)

- [ ] **Step 5: Verify changes via grep**

```bash
cd /Users/nicojan/dev/human/pocket-dystopia
grep -c "pocketdystopia.forhuman.ca/og-image.png" index.html   # expect: 1
grep -c "pocketdystopia.forhuman.ca/" index.html               # expect: ≥2 (og:url + og:image)
grep -c "raw.githubusercontent.com" index.html                 # expect: 0
grep -c "classwith.nicojan.com" index.html                     # expect: 0
grep -c "forhuman-credit" index.html                           # expect: 1
grep -c "forhuman-credit" styles.css                           # expect: 1
```

Every line should match expected. Fix and re-run until all pass.

- [ ] **Step 6: Local visual smoke test**

```bash
cd /Users/nicojan/dev/human/pocket-dystopia
python3 -m http.server 8765 &
SERVER_PID=$!
sleep 1
open http://localhost:8765/
```

Open the page in a browser. Verify:
- Page loads, dystopia generator works (click the die).
- Footer credit appears bottom-centre, faint.
- Footer credit doesn't visually conflict with the die button. If it does, switch to inline (not fixed) placement and re-test.

Stop the server: `kill $SERVER_PID`.

### Task 5: Commit, push, open PR

**Files:**
- Commit: changes in `/Users/nicojan/dev/human/pocket-dystopia/`

- [ ] **Step 1: Stage and commit**

```bash
cd /Users/nicojan/dev/human/pocket-dystopia
git status
git add og-image.png index.html styles.css
git commit -m "feat: align with forhuman.ca — local OG image, credit, og:url"
```

- [ ] **Step 2: Push the branch**

```bash
git push -u origin migrate-to-forhuman
```

- [ ] **Step 3: Open PR via gh CLI**

```bash
gh pr create --title "Align with forhuman.ca: local OG image + credit" --body "$(cat <<'EOF'
## Summary

- Pull the OG image into the repo so social previews no longer depend on the old `classwithnico` GitHub raw URL.
- Update `og:url` to `https://pocketdystopia.forhuman.ca/`.
- Add a "designed with ❤ for Human, by Nico Jan" footer credit.

## Test plan

- [ ] OG image loads at `pocketdystopia.forhuman.ca/og-image.png` after deploy.
- [ ] Social link previews show the dystopia art (debug via https://www.opengraph.xyz/).
- [ ] Footer credit visible bottom-centre, doesn't conflict with the die button.
- [ ] No external `raw.githubusercontent.com` references remain.
EOF
)"
```

Expected: PR URL is returned. **Report the URL back to the user before proceeding.**

---

## Phase 2 — Useful Words greenfield repo

### Task 6: Create local directory and copy source files

**Files:**
- New directory tree: `/Users/nicojan/dev/human/usefulwords/`

- [ ] **Step 1: Confirm source is reachable**

```bash
ls "/Volumes/n1TB/GDrive (Class with Nico)/Website/WIP/Class with Nico/Development/usefulwords/" | head -5
```

Expected: see `index.html`, `css/`, `js/`, `fonts/`, `images/`.

- [ ] **Step 2: Create the destination**

```bash
mkdir -p /Users/nicojan/dev/human/usefulwords/public
```

- [ ] **Step 3: Copy source files into `public/`, excluding macOS/IDE artefacts**

```bash
cd "/Volumes/n1TB/GDrive (Class with Nico)/Website/WIP/Class with Nico/Development/usefulwords"
rsync -av --exclude=".DS_Store" --exclude=".claude" --exclude=".claude/" ./ /Users/nicojan/dev/human/usefulwords/public/
```

- [ ] **Step 4: Verify file inventory matches the source**

```bash
cd /Users/nicojan/dev/human/usefulwords/public
ls
find . -name ".DS_Store" -o -name ".claude" 2>&1
du -sh fonts images css js
```

Expected:
- Files present: `index.html`, `css/`, `js/`, `fonts/`, `images/`.
- No `.DS_Store` or `.claude/` entries returned by `find`.
- `fonts/` ~1.5 MB, `images/` ~40 KB, `css/` ~24 KB, `js/` ~104 KB.

### Task 7: Edit `public/index.html` — footer credit + OG meta

**Files:**
- Modify: `/Users/nicojan/dev/human/usefulwords/public/index.html`

- [ ] **Step 1: Add `og:url` and `og:description` meta tags**

In the `<head>`, immediately after the existing `<meta content="Useful Words" property="og:title" />` line, insert:

```html
<meta content="https://usefulwords.forhuman.ca/" property="og:url" />
<meta content="A bilingual EN/ZH reference for nouns, verbs, adjectives, and transitions. Built for students by Nico Jan." property="og:description" />
<meta content="A bilingual EN/ZH reference for nouns, verbs, adjectives, and transitions. Built for students by Nico Jan." name="description" />
```

- [ ] **Step 2: Add the footer credit before `</body>`**

Append immediately before `</body>`:

```html
<p class="forhuman-credit">
  designed with ❤ for
  <a href="https://forhuman.ca" target="_blank" rel="noopener">Human,</a>
  by <a href="https://nicojan.com" target="_blank" rel="noopener">Nico Jan</a>
</p>
```

- [ ] **Step 3: Add `.forhuman-credit` styles to `public/css/styles.css`**

Append to the end of `/Users/nicojan/dev/human/usefulwords/public/css/styles.css`:

```css
.forhuman-credit {
  text-align: center;
  font-size: 0.75rem;
  opacity: 0.5;
  margin: 2rem auto 1rem;
  padding: 0 1rem;
}
.forhuman-credit a {
  color: inherit;
}
```

(Useful Words uses a tall scrolling layout — the credit sits at the bottom of the content, not fixed.)

- [ ] **Step 4: Verify**

```bash
cd /Users/nicojan/dev/human/usefulwords/public
grep -c 'property="og:url"' index.html       # expect: 1
grep -c 'property="og:description"' index.html # expect: 1
grep -c 'forhuman-credit' index.html         # expect: 1
grep -c 'forhuman-credit' css/styles.css     # expect: 1
```

### Task 8: Create `wrangler.toml`, `.gitignore`, and `README.md`

**Files:**
- Create: `/Users/nicojan/dev/human/usefulwords/wrangler.toml`
- Create: `/Users/nicojan/dev/human/usefulwords/.gitignore`
- Create: `/Users/nicojan/dev/human/usefulwords/README.md`

- [ ] **Step 1: Write `wrangler.toml`**

```toml
# Cloudflare Workers — static assets deploy for usefulwords.forhuman.ca.
#
# No Worker script. The "assets" directive tells Cloudflare to serve the
# contents of ./public directly from the edge, with /404.html returned
# for any missing route.

name = "usefulwords"
compatibility_date = "2026-06-01"

[assets]
directory = "./public"
not_found_handling = "404-page"
html_handling = "auto-trailing-slash"
```

- [ ] **Step 2: Write `.gitignore`**

```
# System
.DS_Store
Thumbs.db
*~

# Editor / agent
.claude/
.vscode/
.idea/

# Node (only if wrangler ever pulls deps locally)
node_modules/
.wrangler/
```

- [ ] **Step 3: Write `README.md`**

```markdown
# Useful Words

A bilingual EN/ZH reference for nouns, verbs, adjectives, and transitions — built for students.

Live at <https://usefulwords.forhuman.ca/>.

## Deploy

Static files in `./public/` are served by Cloudflare Workers via the `[assets]` directive. No build step.

```bash
npx wrangler deploy
```

In production, Cloudflare auto-deploys on push to `main` (configured in the dashboard).

## Project of

[Human, an Education Collective](https://forhuman.ca) — by Nico Jan.
```

### Task 9: Initialize git and make the first commit

**Files:**
- Git repo init in `/Users/nicojan/dev/human/usefulwords/`

- [ ] **Step 1: Initialize**

```bash
cd /Users/nicojan/dev/human/usefulwords
git init -b main
```

- [ ] **Step 2: Stage and commit**

```bash
git add .gitignore README.md wrangler.toml public/
git status
git commit -m "feat: initial commit — Useful Words static site"
```

Expected: commit succeeds, no `.DS_Store` or `.claude/` in the staged tree.

### Task 10: Create the GitHub repo and push

**Files:**
- Remote: `github.com/nicojan/usefulwords`

- [ ] **Step 1: Verify the repo name is free**

```bash
gh repo view nicojan/usefulwords 2>&1 | head -3
```

Expected: `GraphQL: Could not resolve to a Repository` (404 — the name is free). If the repo exists already, stop and ask the user.

- [ ] **Step 2: Create the repo and push**

```bash
cd /Users/nicojan/dev/human/usefulwords
gh repo create nicojan/usefulwords --public --source=. --description="A bilingual EN/ZH word reference for students, at usefulwords.forhuman.ca" --push
```

Expected: repo is created public on GitHub, current branch pushed.

- [ ] **Step 3: Verify the push**

```bash
gh repo view nicojan/usefulwords --web=false | head -10
```

Expected: repo exists, default branch is `main`.

---

## Phase 3 — Cloudflare dashboard (user-executed, document only)

The implementer (you, Claude) does not have Cloudflare API access. Stop after Phase 2 finishes and surface these steps to the user:

> **User action required — Cloudflare dashboard:**
>
> 1. **Workers & Pages → Create → Workers** → **Import from Git**.
> 2. Connect GitHub if not already; pick `nicojan/usefulwords`.
> 3. Name the Worker `usefulwords`. Branch `main`. Build command: leave blank. Deploy command: `npx wrangler deploy`. (Mirror the `pocket-dystopia` Worker's settings.)
> 4. Confirm — first deploy runs.
> 5. **Workers & Pages → usefulwords → Domains → + Add Domain → Custom Domain →** `usefulwords.forhuman.ca` → **Confirm**. Cloudflare auto-creates the DNS record and issues SSL.
> 6. Wait ~60s, then `curl -I https://usefulwords.forhuman.ca/` should return `HTTP/2 200`.

Do not start Phase 4 until the user confirms `usefulwords.forhuman.ca` resolves to the Useful Words page, OR explicitly says "proceed anyway" knowing the apex footer link will 404 briefly.

---

## Phase 4 — Apex site footer band (`nicojan/human-website`)

### Task 11: Add CSS for `.footer__tools` and `.footer__list--inline`

**Files:**
- Modify: `/Users/nicojan/dev/human/human-website/public/css/components.css` around line 930 (after the existing `.footer__heading` rule)

- [ ] **Step 1: Read the existing footer CSS for context**

```bash
sed -n '870,945p' /Users/nicojan/dev/human/human-website/public/css/components.css
```

Note the indentation level (the file uses 2-space inside a `@layer` or similar block — match it).

- [ ] **Step 2: Append the new rules**

Find the end of the `.footer__heading` rule. Immediately after its closing `}`, insert:

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

- [ ] **Step 3: Verify the tokens resolve**

```bash
cd /Users/nicojan/dev/human/human-website
grep -c "\\-\\-border-subtle:" public/css/tokens.css   # expect: 1
grep -c "\\-\\-sp-base-sm:" public/css/tokens.css      # expect: 1
grep -c "\\-\\-sp-md:" public/css/tokens.css           # expect: 1
grep -c "\\-\\-sp-lg:" public/css/tokens.css           # expect: 1
```

All four counts must be 1.

### Task 12: Add the EN markup to all 6 EN pages

**Files:** (insert markup before the existing `<div class="footer__bottom">` in each)
- Modify: `/Users/nicojan/dev/human/human-website/public/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/about/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/contact/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/services/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/privacy/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/404.html`

- [ ] **Step 1: For each EN file, find this exact block:**

```html
      </div>

      <div class="footer__bottom">
```

and replace it with:

```html
      </div>

      <div class="footer__tools">
        <span class="footer__heading">Tools for Students · <span lang="zh-Hant">學生工具</span></span>
        <ul class="footer__list footer__list--inline">
          <li><a href="https://pocketdystopia.forhuman.ca/">Pocket Dystopia</a></li>
          <li><a href="https://usefulwords.forhuman.ca/">Useful Words</a></li>
        </ul>
      </div>

      <div class="footer__bottom">
```

Apply to each of the 6 EN files listed above.

- [ ] **Step 2: Verify all 6 EN files were updated**

```bash
cd /Users/nicojan/dev/human/human-website
for f in public/index.html public/about/index.html public/contact/index.html public/services/index.html public/privacy/index.html public/404.html; do
  printf "%-40s  " "$f"
  grep -c "footer__tools" "$f"
done
```

Every line must end with `1`. Any `0` means a file was missed — fix before moving on.

### Task 13: Add the ZH markup to all 5 ZH pages

**Files:** (insert markup before the existing `<div class="footer__bottom">` in each)
- Modify: `/Users/nicojan/dev/human/human-website/public/zh-hant/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/zh-hant/about/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/zh-hant/services/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/zh-hant/privacy/index.html`
- Modify: `/Users/nicojan/dev/human/human-website/public/zh-hant/404.html`

ZH pages use `<span lang="en">English</span> · 中文` order (the inverse of EN pages). Use this exact ZH block:

- [ ] **Step 1: For each ZH file, find this exact block:**

```html
      </div>

      <div class="footer__bottom">
```

and replace it with:

```html
      </div>

      <div class="footer__tools">
        <span class="footer__heading"><span lang="en">Tools for Students</span> · 學生工具</span>
        <ul class="footer__list footer__list--inline">
          <li><a href="https://pocketdystopia.forhuman.ca/">Pocket Dystopia</a></li>
          <li><a href="https://usefulwords.forhuman.ca/">Useful Words</a></li>
        </ul>
      </div>

      <div class="footer__bottom">
```

Apply to each of the 5 ZH files listed above.

- [ ] **Step 2: Verify all 5 ZH files were updated**

```bash
cd /Users/nicojan/dev/human/human-website
for f in public/zh-hant/index.html public/zh-hant/about/index.html public/zh-hant/services/index.html public/zh-hant/privacy/index.html public/zh-hant/404.html; do
  printf "%-50s  " "$f"
  grep -c "footer__tools" "$f"
done
```

Every line must end with `1`.

- [ ] **Step 3: Global sanity check — total of 11 hits across the repo**

```bash
cd /Users/nicojan/dev/human/human-website
grep -rl "footer__tools" public/ | wc -l
```

Expected: `12` (11 HTML files + 1 CSS file). If it's anything else, list which files do and don't have it.

### Task 14: Local dev test of the new footer band

**Files:** no file changes — verification only.

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/nicojan/dev/human/human-website
bash scripts/dev.sh &
DEV_PID=$!
sleep 2
```

- [ ] **Step 2: Open every footer-bearing page in a browser**

```bash
for path in / /about/ /contact/ /services/ /privacy/ /404.html /zh-hant/ /zh-hant/about/ /zh-hant/services/ /zh-hant/privacy/ /zh-hant/404.html; do
  echo "Open: http://localhost:4321${path}"
done
open http://localhost:4321/
```

Manually verify on at least:
- One EN page: `Tools for Students · 學生工具` heading visible, two links work and open the subdomain pages.
- One ZH page: `Tools for Students · 學生工具` heading visible (EN first, then ZH), two links work.
- The new band sits between the existing footer grid and the copyright row. Border-block-start is visible above the band.
- Layout doesn't break at mobile width (< 40rem) or tablet (40–64rem).

- [ ] **Step 3: Stop the dev server**

```bash
kill $DEV_PID 2>/dev/null
```

### Task 15: Commit and push human-website

- [ ] **Step 1: Stage and commit**

```bash
cd /Users/nicojan/dev/human/human-website
git status
git add public/css/components.css public/index.html public/about/index.html public/contact/index.html public/services/index.html public/privacy/index.html public/404.html public/zh-hant/index.html public/zh-hant/about/index.html public/zh-hant/services/index.html public/zh-hant/privacy/index.html public/zh-hant/404.html
git commit -m "feat(footer): add Tools for Students band linking to subdomain projects"
```

- [ ] **Step 2: Push**

```bash
git push origin main
```

Cloudflare auto-deploys forhuman.ca on push to `main`. Wait ~60s, then verify the live footer in the next phase.

---

## Phase 5 — Final verification

### Task 16: Run the spec's verification checklist against the live site

- [ ] **Step 1: HTTP smoke test of all three hostnames**

```bash
for url in https://forhuman.ca/ https://pocketdystopia.forhuman.ca/ https://usefulwords.forhuman.ca/; do
  echo -n "$url  "
  curl -sI -o /dev/null -w "%{http_code}\n" "$url"
done
```

Expected: every URL returns `200`.

- [ ] **Step 2: Verify the new footer band appears on the live apex**

```bash
curl -s https://forhuman.ca/ | grep -c "footer__tools"
curl -s https://forhuman.ca/zh-hant/ | grep -c "footer__tools"
```

Both expected: `1`.

- [ ] **Step 3: Verify the apex footer links resolve to the right pages**

```bash
curl -sI https://pocketdystopia.forhuman.ca/ | head -1
curl -sI https://usefulwords.forhuman.ca/ | head -1
```

Both expected: `HTTP/2 200`.

- [ ] **Step 4: Pull the PR for Pocket Dystopia through to merge**

If the user merged the Phase 1 PR before this point, verify the deployed `pocketdystopia.forhuman.ca` reflects the changes:

```bash
curl -s https://pocketdystopia.forhuman.ca/ | grep -cE "forhuman-credit|og-image.png"
```

Expected: ≥ 2 (credit class + og-image reference).

- [ ] **Step 5: Confirm the spec's verification checklist**

Walk through every checkbox in the "Verification before declaring done" section of `docs/superpowers/specs/2026-06-01-projects-migration-design.md`. Each must be marked complete. If any fails, file a follow-up — do not silently move on.

---

## Notes for the implementer

- **TDD substitution.** This is a static-site migration with no test framework. Verification is done via `grep`, `curl`, and visual browser checks. Each task lists the exact verification commands and expected outputs. Treat a failed verification as a failed test — fix and re-verify before moving on.
- **Frequent commits.** Each phase's edits commit at the end of the phase. Don't batch across phases.
- **No `--no-verify` ever.** If a commit hook fails on `human-website`, stop and fix the underlying issue.
- **Bilingual asymmetry.** EN footer uses `English · <span lang="zh-Hant">中文</span>`. ZH footer uses `<span lang="en">English</span> · 中文`. Brand names ("Pocket Dystopia", "Useful Words") are never translated.
- **The Human, comma.** Every footer credit MUST preserve the comma in `Human,`. Do not strip it for grammatical cleanup — it's a brand element.
