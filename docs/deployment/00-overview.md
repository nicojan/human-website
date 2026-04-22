# Deployment overview

This is the shortest path from the three open PRs to a live, working site. Each of the three pieces has its own runbook — follow them in order, but the order you do it in is **website first, then Matomo, then the dashboard contact endpoint**. That order lets each step actually verify the one before it.

## What exists now

Three repos, four PRs:

1. **[nicojan/human-website](https://github.com/nicojan/human-website)**
   - [PR #2 — Rebuild](https://github.com/nicojan/human-website/pull/2) — the whole site rewritten as hand-written HTML + Hugo for `/writing/`. Base for everything else.
   - [PR #3 — Matomo tracking](https://github.com/nicojan/human-website/pull/3) — stacked on top of #2. Adds `public/js/matomo.js`.
2. **[nicojan/human-matomo](https://github.com/nicojan/human-matomo)** — a new repo, `main` branch. Docker Compose for Matomo 5 + MariaDB behind your Cloudflare Tunnel.
3. **[nicojan/human-dashboard](https://github.com/nicojan/human-dashboard)**
   - [PR #1 — Contact backend](https://github.com/nicojan/human-dashboard/pull/1) — `POST /api/contact` + admin list view.

## Order of operations

1. **[Website](01-website.md)** — merge PR #2 and deploy to Cloudflare Pages. The site is live with a stubbed contact form that console-logs (dev) or 404s (prod) when someone submits.
2. **[Matomo](02-matomo.md)** — deploy the stack, run the installer, grab the site id. Merge PR #3 (after swapping the site id) so the website starts reporting visits.
3. **[Contact backend](03-contact-backend.md)** — merge dashboard PR #1, add the Turnstile secrets + data volume, swap the Turnstile site key on the website. The contact form now writes to `/admin/contact`.

Each step verifies the one before it. Once all three runbooks are done you've got a bilingual marketing site, your own analytics, and a working intake funnel.

## Emergency rollback

- **Website:** Cloudflare Pages keeps every deploy as an addressable URL. Roll back by promoting a prior deploy in the dashboard.
- **Matomo:** `docker compose down` on the NAS stack. The volumes `human-matomo` and `human-matomo-db` survive; your data is safe.
- **Dashboard:** revert the merge commit on `main` and let the next build pick it up. No data loss — the `/app/data` volume persists.

## If you hit trouble

Each runbook has a "Troubleshooting" section at the bottom. If the problem isn't in there, grep the relevant repo's spec under `docs/superpowers/specs/` — every non-obvious choice is documented.
