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

echo "→ building school-logo marquee partials"
python3 scripts/build-school-marquee.py

echo "→ injecting shared partials (footer, school-marquee, …)"
python3 scripts/inject-partials.py

echo "→ cleaning public/writing and public/zh-hant/writing"
rm -rf public/writing public/zh-hant/writing
mkdir -p public/writing

echo "→ building hugo (multilingual: en + zh-hant)"
hugo \
  --source blog \
  --destination "$ROOT/public/writing" \
  --minify \
  --gc

# Hugo's multilingual layout puts each language under <publishDir>/<lang>/
# even for the default language when contentDir is set. The URLs Hugo
# generates are already correct (/writing/… and /zh-hant/writing/…); we
# just need the physical paths to match.
if [ -d "public/writing/zh-hant" ]; then
  echo "→ relocating ZH tree → public/zh-hant/writing"
  mkdir -p public/zh-hant
  mv public/writing/zh-hant public/zh-hant/writing
fi

if [ -d "public/writing/en" ]; then
  echo "→ flattening EN tree (public/writing/en/ → public/writing/)"
  # Merge contents without clobbering any Hugo-written siblings.
  (cd public/writing/en && find . -mindepth 1 -maxdepth 1 -print0 \
    | xargs -0 -I {} mv {} ../)
  rmdir public/writing/en
fi

echo "✓ build complete"
echo "  deployable root: $ROOT/public"
