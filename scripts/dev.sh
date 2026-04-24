#!/usr/bin/env bash
# Local development server.
#
# Serves the public/ directory on http://localhost:4321 and rebuilds the
# Hugo blog whenever a file in blog/ changes.
#
# Requires: hugo, python3

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT=${PORT:-4321}

echo "→ building school-logo marquee partials"
python3 scripts/build-school-marquee.py

echo "→ injecting shared partials"
python3 scripts/inject-partials.py

mkdir -p public/writing

cleanup() {
  jobs -p | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "→ starting hugo (watch)"
hugo \
  --source blog \
  --destination "$ROOT/public/writing" \
  --watch \
  --baseURL "http://localhost:$PORT/writing/" \
  --disableFastRender \
  --noHTTPCache \
  &

echo "→ starting http server on :$PORT"
cd public
python3 -m http.server "$PORT"
