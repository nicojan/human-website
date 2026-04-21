# ADR 0001 — Astro over plain HTML

**Status:** accepted
**Date:** 2026-04-20

## Context

The predecessor site (Class with Nico) was Webflow-exported static HTML: seven
pages, hand-maintained, no build step. The Human, rebrand needs:

- Bilingual routing (`/` and `/zh/`)
- Three content types that grow over time (blog, FAQ, glossary)
- Markdown-driven content so Claude Code can add entries by dropping files
- Clean content schemas so drift surfaces at build time, not in production

Plain HTML can do the first two if we hand-roll them. The third and fourth
are where the cost piles up: every content type means a template system, a
frontmatter parser, a list-building step, sitemap generation, and i18n
plumbing.

## Decision

Use **Astro 5** with TypeScript strict mode. No UI framework. Static output.

## Why not plain HTML + a small Node build script

- We'd write ~100 lines of glue per content type: frontmatter parse, template
  render, index build, hash-link assets, sitemap. That's a mini-framework
  that only we maintain.
- Adding a collection needs a new template + new generator + new
  glue-to-everything-else. Astro gives us that for free with Zod-typed
  collections.
- Bilingual routing has subtle hreflang / sitemap / canonical-URL concerns
  that Astro's `i18n` config handles. Hand-rolling this is the kind of thing
  that ships quietly-broken.

## Why not Next.js / SvelteKit / similar

Overshoot. Those are full-stack frameworks with SSR, server actions, and
hydration stories we don't need. Static content sites pay the dependency
cost without benefit. Astro specifically targets this shape of site with
zero client JS by default.

## Why not 11ty (Eleventy)

Close second. Equally good at static generation, smaller dependency tree.
Lost on three things:

1. TypeScript story isn't as tight. Schema-typed content collections are a
   first-class Astro feature.
2. i18n story is more DIY; fewer out-of-the-box conveniences like
   `prefixDefaultLocale`, sitemap i18n output.
3. Team familiarity. Future Claude sessions are more likely to know Astro.

## Consequences

**Accepted:**

- A `node_modules/` directory. We run `npm install` once and commit the
  lockfile.
- A build step. `npm run build` takes a few seconds. Dev uses `astro dev`.
- A dependency on Astro's release cadence. Major Astro versions ship roughly
  every 9–12 months and occasionally need small code updates.
- A supply chain of transitive deps. Non-zero risk, mitigated by auditing
  regularly and keeping the dependency surface small (we have four direct
  deps as of this ADR).

**Gained:**

- Zod-typed content. Schema drift fails the build.
- i18n routing done right.
- MD collections with `glob` loader.
- Sitemap integration.
- Future-ready: if we ever need an interactive island, Astro already knows
  how to hydrate one.

## Revisit when

- Astro 5 is end-of-life and an Astro 6 upgrade requires more than a
  weekend. If the site is still under active growth, pay the upgrade cost.
  If it's static and dormant, consider a content-freeze migration to plain
  HTML.
- The dependency tree grows to > 50 direct deps. That means scope creep has
  happened and we should reassess.
