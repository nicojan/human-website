# ADR 0002 — Humanise at author time, not at build time

**Status:** accepted
**Date:** 2026-04-20

## Context

Every piece of user-facing content on this site must pass the mcp-humanizer
guidelines before shipping. The humaniser catches AI-typical patterns:
em-dashes, inflated vocabulary, three-item parallel lists, hedging clichés,
etc. Two options for when to run it:

- **Build-time**: a pre-build hook reads every MD file, sends the body through
  the humaniser, rewrites the body, then Astro builds from the updated files.
- **Author-time**: Claude rewrites the body during drafting and commits the
  humanised version. A build-time check only verifies a hash.

## Decision

Humanise at **author time**. The humaniser runs while Claude is drafting.
Humanised text is committed directly.

Build-time only runs `scripts/humanize.mjs --check`, which verifies every
content file's body SHA matches the `humanized_sha` in its frontmatter. CI
fails if any file is stale or unstamped.

## Why

1. **Git diffs become meaningful.** A commit to a blog post shows the actual
   words that shipped. With build-time humanization, diffs would show the
   pre-humanised draft and the humanised output would be a build artifact
   nobody reviews.
2. **Builds stay pure.** `npm run build` runs only Astro, with zero external
   MCP calls. CI doesn't need MCP credentials. Build time is predictable.
3. **Cache-friendly.** No rewriting of content on every build means Astro's
   incremental build stays hot.
4. **Review is easier.** A PR that introduces a post shows the exact shipped
   text. A reviewer can read it and say yes or no. A build-time humanised
   output would mean "here's the draft, please trust the humaniser".
5. **Humaniser version stability.** If the humaniser's rules change, shipped
   content doesn't silently change at the next deploy. It changes when
   someone edits the file and re-runs the humaniser deliberately.

## Why not build-time

Build-time humanization has one real advantage: authors can write sloppy
drafts and let the build clean up. But this advantage is a bug for us:

- It hides the rewriting from review.
- It couples every deploy to the humaniser service being up.
- It makes the build non-deterministic (same input can produce different
  output if the humaniser changes).

## Consequences

**Accepted:**

- Claude Code must call the humaniser during drafting, not lazily.
- The `humanized_sha` field must be kept in sync. `npm run humanize` makes
  that one command.
- Adding a commit-time Git hook is left to individual developers; CI catches
  stragglers.

**Gained:**

- Reviewable diffs.
- Deterministic builds.
- Humaniser decoupled from the deploy pipeline.

## Revisit when

- The humaniser gains a "suggest-only" mode and we want a non-destructive
  workflow. At that point we'd still keep humanization author-time, but the
  tool's output would be a list of suggestions instead of a rewrite.
- Author volume grows past ~1 post a week and the humaniser-at-author-time
  latency becomes a bottleneck. At that point a queue-based async
  humanization workflow may be worth it.
