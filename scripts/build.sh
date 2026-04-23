#!/usr/bin/env bash
# Production build.
#
# Rebuilds the Hugo blog into public/writing/ and leaves public/ ready to
# deploy as the site root.
#
# Cloudflare Pages config:
#   Build command:     bash scripts/build.sh
#   Output directory:  public
#   Environment:       HUGO_VERSION=0.122.0

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ injecting shared partials (footer, …)"
python3 scripts/inject-partials.py

echo "→ cleaning public/writing"
rm -rf public/writing
mkdir -p public/writing

echo "→ building hugo"
hugo \
  --source blog \
  --destination "$ROOT/public/writing" \
  --minify \
  --gc

echo "✓ build complete"
echo "  deployable root: $ROOT/public"
