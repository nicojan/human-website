# Parked: Traditional Chinese blog translations

These are the Chinese versions of the EN posts under `blog/content/posts/`. They came from the old website's bilingual blog; the founder-reviewed translation work is preserved here for when the ZH blog ships in v2.

## Why these aren't live

Per [`docs/superpowers/specs/2026-04-22-website-design.md`](../../../docs/superpowers/specs/2026-04-22-website-design.md) §10 and the design constraint in `06-copy-zh.md`, the `/writing/` blog is English-only in v1. ZH blog is v2 work.

Hugo ignores directories under `content/` that start with a dot (same as `.git`), so this folder doesn't affect the build.

## When v2 ships

1. Add a `[languages.zh-hant]` block to `blog/hugo.toml` alongside the existing `[languages.en]`, with its own `contentDir` and `weight = 2`.
2. Move EN posts from `blog/content/posts/` to `blog/content/en/posts/` (requires matching `contentDir = "content/en"` on the EN language block).
3. Move these files into `blog/content/zh-hant/posts/<slug>.md`. Match the `translationKey` field on both languages so Hugo pairs them.
4. Update the website's `latest-posts.js` to probe `/zh-hant/writing/index.json` first and fall back to `/writing/index.json`.
5. Update the nav links on `/zh-hant/*` pages to point at `/zh-hant/writing/` instead of `/writing/`.

Each post's frontmatter already carries a `translationKey` matching its English pair, so the pairing work is already done — the files just need to move.
