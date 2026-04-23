#!/usr/bin/env python3
"""
Expand <!-- include: NAME --> markers in public/**/*.html using the
partials in partials/NAME.html.

The output is idempotent: each run rewrites whatever sits between a
matching include/endinclude marker pair, so edits to the partial
propagate into every page on the next build.

Usage:
    python3 scripts/inject-partials.py [--check]

Options:
    --check   Exit non-zero if any file is out of sync with the
              partials. Useful in CI to guard against forgotten edits.

Design notes:
- Partials are plain HTML fragments. Leading/trailing whitespace is
  trimmed so consecutive builds don't grow the file.
- The marker's own indentation is preserved and applied to each line
  of the injected partial, keeping diffs clean.
- The Hugo-generated `public/writing/` tree is skipped because Hugo
  owns those files during a build.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PARTIALS_DIR = ROOT / "partials"
PUBLIC_DIR = ROOT / "public"

# A few files live outside public/ but need the same shared partial content —
# Hugo's security sandbox blocks reading files outside its project root, so
# instead of importing we mirror the partial into its layout tree. The value
# is the canonical partial name (minus .html) in partials/.
MIRRORED_TARGETS: dict[Path, str] = {
    ROOT / "blog" / "layouts" / "partials" / "footer.html": "footer-en",
}

MARKER_PATTERN = re.compile(
    r"(?P<indent>[ \t]*)"
    r"<!-- include: (?P<name>[\w-]+) -->"
    r".*?"
    r"<!-- endinclude: (?P=name) -->",
    flags=re.DOTALL,
)


def load_partials() -> dict[str, str]:
    return {
        path.stem: path.read_text(encoding="utf-8").strip("\n")
        for path in sorted(PARTIALS_DIR.glob("*.html"))
    }


def reindent(block: str, indent: str) -> str:
    """Prefix every non-empty line in the block with the marker's indent."""
    return "\n".join(
        f"{indent}{line}" if line else line for line in block.splitlines()
    )


def expand(content: str, partials: dict[str, str]) -> str:
    def replace(match: re.Match[str]) -> str:
        name = match.group("name")
        indent = match.group("indent")
        partial = partials.get(name)
        if partial is None:
            print(
                f"  ! unknown partial: {name}",
                file=sys.stderr,
            )
            return match.group(0)
        body = reindent(partial, indent)
        return (
            f"{indent}<!-- include: {name} -->\n"
            f"{body}\n"
            f"{indent}<!-- endinclude: {name} -->"
        )

    return MARKER_PATTERN.sub(replace, content)


def main() -> int:
    check_only = "--check" in sys.argv[1:]

    partials = load_partials()
    if not partials:
        print("! no partials found in partials/", file=sys.stderr)
        return 1

    changed: list[Path] = []
    for html in sorted(PUBLIC_DIR.rglob("*.html")):
        rel = html.relative_to(PUBLIC_DIR)
        # Hugo owns public/writing/ — skip it.
        if rel.parts and rel.parts[0] == "writing":
            continue

        original = html.read_text(encoding="utf-8")
        updated = expand(original, partials)
        if updated != original:
            changed.append(html)
            if not check_only:
                html.write_text(updated, encoding="utf-8")

    # Mirror specific partials into layout trees that can't import them
    # (e.g. Hugo's sandboxed readFile).
    for target, source_name in MIRRORED_TARGETS.items():
        source = partials.get(source_name)
        if source is None:
            print(
                f"  ! mirrored partial {source_name} not found for {target.relative_to(ROOT)}",
                file=sys.stderr,
            )
            continue
        desired = source + "\n"
        existing = target.read_text(encoding="utf-8") if target.exists() else None
        if existing != desired:
            changed.append(target)
            if not check_only:
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(desired, encoding="utf-8")

    rel_changed = [p.relative_to(ROOT) for p in changed]

    if check_only:
        if rel_changed:
            print(
                f"✗ {len(rel_changed)} file(s) out of sync with partials:",
                file=sys.stderr,
            )
            for p in rel_changed:
                print(f"    {p}", file=sys.stderr)
            return 1
        print("✓ partials in sync")
        return 0

    if rel_changed:
        for p in rel_changed:
            print(f"  ✓ {p}")
    print(f"✓ injected partials into {len(rel_changed)} file(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
