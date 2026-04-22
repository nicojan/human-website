# Deploy the contact backend (dashboard)

The contact form on `forhuman.ca` posts to `https://dashboard.forhuman.ca/api/contact`. The endpoint lives in [nicojan/human-dashboard](https://github.com/nicojan/human-dashboard). This runbook wires it up end-to-end, including Cloudflare Turnstile for spam protection.

## 1. Set up Cloudflare Turnstile

Cloudflare Turnstile is free and integrates with the Cloudflare account that already hosts forhuman.ca.

1. Cloudflare dashboard → **Turnstile** → Add site.
2. **Site name:** `forhuman.ca contact form`
3. **Domains:** `forhuman.ca`, `www.forhuman.ca`, and `localhost` (for dev testing).
4. **Widget mode:** Managed. (Non-interactive unless Cloudflare flags a session.)
5. **Save.** Copy the **Site key** (starts with `0x4` — public, goes in the HTML) and the **Secret key** (starts with `0x4` — private, goes in Portainer).

## 2. Swap the Turnstile site key on the website

In the website repo, edit two files:

```diff
# public/contact/index.html
- <div class="cf-turnstile" data-sitekey="TURNSTILE_SITE_KEY_PLACEHOLDER" ...
+ <div class="cf-turnstile" data-sitekey="0x4AAA..." ...

# public/zh-hant/contact/index.html — same change
```

Add the Turnstile widget loader to both contact pages' `<head>` (it's not there yet — the placeholder expected you to add it on your own after generating a real key):

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

Insert it alongside the other `<script>` tags before `</body>`, or in the head. Commit and push.

## 3. Merge the dashboard PR

Open [PR #1](https://github.com/nicojan/human-dashboard/pull/1) on `human-dashboard` and merge to `main`. Your existing deploy pipeline (Portainer watching the repo, or a redeploy trigger) should pick it up.

## 4. Add the new env vars + volume in Portainer

Edit the `human-dashboard` stack in Portainer. Under **environment variables**, add:

```
DATA_DIR=/app/data
TURNSTILE_SECRET=<paste the secret from step 1>
CONTACT_ALLOWED_ORIGINS=https://forhuman.ca,https://www.forhuman.ca
```

The updated `docker-compose.yml` in the PR already declares the `human-dashboard-data` named volume mounted at `/app/data`. When you **recreate the stack** (not restart — recreate), the volume attaches automatically.

The data on the volume persists across future stack updates. You never need to touch it manually unless you want to migrate the NDJSON log somewhere else.

## 5. Verify end-to-end

From a fresh browser:

1. Visit `https://forhuman.ca/contact/`.
2. Fill the form with test data. Solve the Turnstile widget (usually non-interactive).
3. Submit. You should see the thank-you message inline.
4. In the dashboard, visit `https://dashboard.forhuman.ca/admin/contact`. Your test submission appears at the top with status **new**.
5. Click **Reply** — opens a pre-filled email with the submission id as a subject tag.
6. Click **Mark replied** → status changes. Refresh to confirm it persists.

## 6. Optional: email notifications

The MVP doesn't email you when a submission arrives — you check `/admin/contact` periodically. If you want push notifications, options in roughly increasing complexity:

- **Gmail filter on replies to contact@forhuman.ca** — trivial. The submission email lands in your inbox naturally when you click Reply.
- **Webhook to a Slack/Discord channel** — add a `fetch()` call to the end of `src/app/api/contact/route.ts` POST handler. Small change, big upside.
- **SMTP via Nodemailer, Resend, or Postmark** — full transactional email with a templated body. Follow-up work.

None of these are required for the MVP.

## Troubleshooting

**Submission returns 403 `origin_not_allowed`.**
Your origin isn't in `CONTACT_ALLOWED_ORIGINS`. Check the env var. Remember: the browser sends `Origin: https://forhuman.ca`, not the canonical URL — match exactly, with scheme, no trailing slash.

**Submission returns 400 `verification_failed`.**
Either the `TURNSTILE_SECRET` on the dashboard and the `data-sitekey` on the website don't belong to the same Turnstile site, or the dashboard's `NODE_ENV` isn't `production` and a dev bypass was expected. The bypass only works when `NODE_ENV !== "production"` — prod requires a real token.

**Submission returns 429 `rate_limited`.**
Same IP hit the endpoint 5 times in 10 minutes. Intended. Wait it out.

**Admin `/admin/contact` shows an empty list after submitting.**
Check the `human-dashboard-data` volume exists and is mounted at `/app/data`. From inside the container: `docker exec human-dashboard ls /app/data` should list `contact_submissions.ndjson`.

**I want to export all submissions to CSV.**
Until the UI grows an export button, you can eyeball it:

```bash
docker exec human-dashboard cat /app/data/contact_submissions.ndjson \
  | jq -r '[.received_at, .parent_name, .email, .message] | @csv'
```
