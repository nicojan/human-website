# ADR 0003 — Sandbox build wrapper for the '#' in the project path

**Status:** accepted
**Date:** 2026-04-20

## Context

The repo lives at `/Volumes/n1TB/GDrive (Class with Nico)/# Human,/Website`.
The parent directory `# Human,` contains a `#`. Astro's content-collection
sync converts the project path to a `file://` URL internally; `#` gets
URL-encoded as `%23`; a later URL parser treats `%23` as a fragment
delimiter; the path gets truncated at `/Volumes/n1TB/GDrive (Class with Nico)/`
(the grandparent), and the sync fails with `EISDIR`.

This is not our bug. It's Astro / Vite assuming paths don't contain
URL-reserved characters. But it is our problem because:

- The project directory is inside a Google Drive tree whose structure the
  user has reasons to keep.
- Renaming `# Human,` would ripple through Drive sync, shared links, and
  the wider brand-asset organisation.
- Moving the repo elsewhere breaks the user's normal workflow.

Symlinking doesn't help: Node's `fs.realpath` resolves back to the original
path.

## Decision

`scripts/sandbox.mjs` mirrors the project into `/tmp/human-build` (no
special characters) with rsync, runs the Astro command there, and rsyncs
the `dist/` back into the source tree. Default `npm run dev`, `npm run
build`, and `npm run check` go through this wrapper. `:raw` script variants
preserve the direct Astro commands for cases where the repo moves to a
sane path.

## Why

1. **Doesn't ask the user to move their work.** The path stays. The user's
   file managers, cloud sync, and backups keep working.
2. **Cheap to maintain.** The wrapper is ~80 lines of Node. rsync is a
   dependable tool. No other moving parts.
3. **Caches correctly.** Node_modules in `/tmp` is kept between runs;
   install happens once.
4. **Honest about itself.** The script logs "[sandbox] Mirroring ..." on
   every run so it's never a mystery.

## Alternatives considered

- **Rename the directory.** Simplest technically, disruptive to the user.
  Rejected.
- **Astro fork / patch.** Fragile; every Astro upgrade reopens the issue.
  Rejected.
- **Move to Vite-less framework.** Nuclear; would mean rewriting the site.
  Rejected.
- **Docker container with bind mount.** Adds Docker as a dependency and
  cross-platform performance concerns. Rejected.

## Consequences

**Accepted:**

- An extra rsync pass on every build. A few hundred ms on this-size project;
  unnoticeable.
- Build output lives in two places (`/tmp/human-build/dist` + `./dist`) which
  is slightly surprising if someone reads the repo cold.
- `.astro/` sync artifacts also live in `/tmp/human-build/.astro`, away from
  the source tree. Usually good.

**Gained:**

- The project builds cleanly in a path with `#` in it.
- Future Claude sessions don't have to rediscover this. The ADR + the
  CLAUDE.md gotcha section explain it.

## Revisit when

- The repo moves to a path without special characters. At that point, the
  wrapper becomes unnecessary; update `package.json` to use `:raw` as the
  defaults and deprecate the wrapper (keep it one release for safety).
- Astro fixes the URL-encoding bug upstream. Same: the wrapper becomes
  unnecessary.
