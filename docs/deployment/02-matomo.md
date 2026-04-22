# Deploy Matomo to the NAS

Self-hosted analytics at `analytics.forhuman.ca`, routed through your existing Cloudflare Tunnel. No host ports exposed.

The stack lives in [nicojan/human-matomo](https://github.com/nicojan/human-matomo). This runbook walks through deploying it via Portainer.

## 1. Generate the secrets

On your machine:

```bash
openssl rand -base64 32   # → MATOMO_DATABASE_PASSWORD
openssl rand -base64 32   # → MARIADB_ROOT_PASSWORD
```

Keep these somewhere safe (1Password, Bitwarden, etc.). You'll paste them into Portainer in a moment.

## 2. Create the Portainer stack

In Portainer → **Stacks → Add stack**:

1. **Name:** `human-matomo`
2. **Build method:** Repository
3. **Repository URL:** `https://github.com/nicojan/human-matomo`
4. **Reference:** `refs/heads/main`
5. **Compose path:** `docker-compose.yml`
6. **Environment variables** (paste the two values from step 1):
   - `MATOMO_DATABASE_PASSWORD`
   - `MARIADB_ROOT_PASSWORD`
7. **Deploy the stack.**

Wait until both containers show "healthy" — the `matomo_db` healthcheck takes 30–60 seconds on first boot.

## 3. Add the Cloudflare Tunnel route

You already have `cloudflared` running on the NAS routing `*.forhuman.ca`. Add one public hostname to that tunnel's configuration.

**If you manage the tunnel via the Cloudflare Zero Trust dashboard:**

1. Zero Trust → Networks → Tunnels → select your NAS tunnel → Public Hostnames → Add.
2. Subdomain: `analytics`. Domain: `forhuman.ca`.
3. Type: `HTTP`. URL: `matomo:80`. (Docker DNS resolves `matomo` because both containers are on the `synobridge` network.)
4. Additional application settings → HTTP Settings → HTTP Host Header: `analytics.forhuman.ca`.
5. Save.

**If you manage it via a local `config.yml`:** add an ingress entry:

```yaml
ingress:
  - hostname: analytics.forhuman.ca
    service: http://matomo:80
    originRequest:
      httpHostHeader: analytics.forhuman.ca
  # ... existing entries ...
  - service: http_status:404
```

Restart `cloudflared`.

## 4. Run the Matomo installer

Visit `https://analytics.forhuman.ca`. Matomo's first-run installer appears.

Walk through:

1. **System Check** — confirm green.
2. **Database Setup:**
   - Database Server: `matomo_db`
   - Login: `matomo`
   - Password: the `MATOMO_DATABASE_PASSWORD` from step 1
   - Database Name: `matomo`
   - Table Prefix: `matomo_`
3. **Super User:**
   - Username: `nico` (or whatever you prefer)
   - Password: a strong one you'll remember
   - Email: `contact@forhuman.ca`
4. **Setup a Website:**
   - Website Name: `forhuman.ca`
   - Website URL: `https://forhuman.ca`
   - Website time zone: `America/Vancouver`
   - Ecommerce: No
5. **JavaScript Tracking Code** — the installer shows a snippet. **Copy the numeric site id** from the snippet (it's the number after `setSiteId`, usually `1`). You'll paste it into the website repo next.
6. **Congratulations** — log in.

## 5. Harden Matomo

In Matomo, go through:

- **Settings → General → Trusted Hostnames** → add `analytics.forhuman.ca`.
- **Settings → General → Force SSL** → enable.
- **Privacy → Anonymize data**:
  - Anonymize IP (last 2 bytes).
  - Disable browser fingerprint.
  - Optionally: auto-delete visitor logs older than 180 days.
- **Privacy → Users opt-out** → the iframe snippet is useful for a future `/privacy` page on `forhuman.ca`.
- **Personal → Plugins → Custom Dimensions** → create two **action-scoped** dimensions so the tracker's extra context surfaces in reports:
  1. `pageLanguage` — active (ID **1**). Values: `en`, `zh-hant`.
  2. `pageSection` — active (ID **2**). Values: `home`, `about`, `services`, `writing`, `contact`, `other`.

  The IDs must match `setCustomDimension` in `public/js/matomo.js`. Unknown IDs are silently dropped by Matomo, so creating them later is safe; reports just stay empty until then.

## 6. Wire the website to Matomo

The site id lives at the top of `public/js/matomo.js`:

```js
const SITE_ID = '1';
```

The same file also pushes page views, heartbeat time, outbound links + downloads (with `.webm|.mp4|.m4a|.mov|.avif|.webp|.opus` added), visible content impressions, custom dimensions 1 + 2, and the following custom events:

| Category     | When it fires                                                |
| ------------ | ------------------------------------------------------------ |
| `CTA`        | clicks on `.button--primary`, `.hero__cta`, `.link-cta`, closing-cta |
| `Navigation` | clicks on `.nav__links a`                                    |
| `Language`   | internal link that crosses `/` ⇄ `/zh-hant/`                 |
| `FAQ`        | `<details.faq-item>` open / close                            |
| `Video`      | first `play` on any `<video>`                                |
| `Form`       | first focus + submit on `.contact-form`                      |
| `Scroll`     | depth milestones at 25 / 50 / 75 / 100 %                     |
| `JSError`    | `window.onerror` + `unhandledrejection`                      |

If you add new surfaces (e.g. a search box, a newsletter form, a booking widget), extend the `wire()` block in `public/js/matomo.js` to emit matching events — don't sprinkle `_paq.push` calls across pages.

## 7. Verify tracking

From a fresh browser (or incognito) with Do Not Track **off**:

1. Visit `https://forhuman.ca/`.
2. Open DevTools → Network → filter for `matomo.php`. You should see a POST.
3. In the Matomo dashboard, open "Real-time Map" or "Visitor Log". Your hit appears within a few seconds.

## Backups

Schedule a nightly `mariadb-dump` via your existing backup stack. From the NAS shell:

```bash
docker exec matomo_db mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" matomo \
  > /volume1/backups/matomo-$(date +%F).sql
```

## Troubleshooting

**`503 Origin DNS error` when visiting `analytics.forhuman.ca`.**
The tunnel can't resolve `matomo`. Confirm the `matomo` container joined `synobridge` (it should — see `docker-compose.yml`). Also confirm `cloudflared` joined `synobridge`. Both must be on the same user-defined Docker network.

**Matomo installer refuses the database password.**
Check Portainer → stack env vars. Regenerate passwords if a special character tripped `docker compose`. Avoid `$`, `` ` ``, and unescaped quotes.

**Tracking events not logged.**
`public/js/matomo.js` is skipped on `localhost`, `*.local`, `*.test`, and under Do Not Track. Verify you're on a real hostname with DNT off. Also check the site id matches (see Matomo → Admin → Websites).

**Updating Matomo.**
Pull the latest `matomo:5-apache` image in Portainer and recreate only the `matomo` container. Matomo runs its own DB migration on first hit — accept the prompt.
