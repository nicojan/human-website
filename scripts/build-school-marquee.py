#!/usr/bin/env python3
"""
Build the school-logo marquee partials from public/images/schools/.

Scans the schools directory, distributes logos round-robin into three rows,
and writes two partial files (one per language) into partials/. inject-
partials.py picks them up and injects them into the home pages via the
matching <!-- include: school-marquee-{en,zh} --> markers.

Alt text is identical for every logo on purpose: the marquee is a marketing
flourish, not a list of named institutions. Screen readers hear the section
heading "Where Students Go Next" plus a short generic label per logo.

Usage:
    python3 scripts/build-school-marquee.py
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHOOLS_DIR = ROOT / "public" / "images" / "schools"
PARTIALS_DIR = ROOT / "partials"

ROW_COUNT = 3
DIRECTIONS = ["ltr", "rtl", "ltr"]
EXTENSIONS = {".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"}

# Number of copies of each row's content inside the track. The CSS animation
# translates by -100%/MARQUEE_COPIES per cycle (one copy width), so the
# loop is seamless as long as one copy is at least V/(MARQUEE_COPIES-1)
# wide. Six copies covers >=5x copy width on screen — safe up to ~5K
# displays for current row sizes. KEEP IN SYNC with the keyframe percent
# in home.css.
MARQUEE_COPIES = 6

REGION_LABEL = {
    "en": "Universities our students attend",
    "zh": "學生就讀的大學",
}

LOGO_ALT = {
    "en": "logo of prestigious university",
    "zh": "知名大學標誌",
}


def list_logos() -> list[str]:
    return sorted(
        [
            p.name
            for p in SCHOOLS_DIR.iterdir()
            if p.is_file() and p.suffix.lower() in EXTENSIONS
        ],
        key=str.lower,
    )


def distribute(items: list[str]) -> list[list[str]]:
    rows: list[list[str]] = [[] for _ in range(ROW_COUNT)]
    for i, item in enumerate(items):
        rows[i % ROW_COUNT].append(item)
    return rows


def render_logo(filename: str, alt: str, hidden: bool) -> str:
    img_alt = "" if hidden else alt
    li_attrs = ' aria-hidden="true"' if hidden else ""
    return (
        f'        <li class="marquee__item"{li_attrs}>'
        f'<img class="outcome-logo" src="/images/schools/{filename}" '
        f'alt="{img_alt}" loading="lazy" /></li>'
    )


def render_row(items: list[str], direction: str, lang: str) -> str:
    alt = LOGO_ALT[lang]
    visible = "\n".join(render_logo(f, alt, hidden=False) for f in items)
    duplicated = "\n".join(render_logo(f, alt, hidden=True) for f in items)
    lead = (
        f'      <ul class="marquee__group">\n'
        f"{visible}\n"
        f'      </ul>'
    )
    echo = (
        f'      <ul class="marquee__group" aria-hidden="true">\n'
        f"{duplicated}\n"
        f'      </ul>'
    )
    groups = "\n".join([lead] + [echo] * (MARQUEE_COPIES - 1))
    return (
        f'  <div class="marquee marquee--{direction}">\n'
        f'    <div class="marquee__track">\n'
        f"{groups}\n"
        f'    </div>\n'
        f'  </div>'
    )


def render_marquee(rows: list[list[str]], lang: str) -> str:
    body = "\n".join(
        render_row(items, DIRECTIONS[i], lang)
        for i, items in enumerate(rows)
    )
    return (
        f'<div class="schools-marquee" role="region" aria-label="{REGION_LABEL[lang]}">\n'
        f"{body}\n"
        f"</div>"
    )


def main() -> int:
    if not SCHOOLS_DIR.is_dir():
        print(f"! schools dir missing: {SCHOOLS_DIR}", file=sys.stderr)
        return 1

    logos = list_logos()
    if not logos:
        print(f"! no logos in {SCHOOLS_DIR}", file=sys.stderr)
        return 1

    rows = distribute(logos)

    PARTIALS_DIR.mkdir(parents=True, exist_ok=True)
    for lang in ("en", "zh"):
        out = PARTIALS_DIR / f"school-marquee-{lang}.html"
        out.write_text(render_marquee(rows, lang) + "\n", encoding="utf-8")
        print(
            f"  ✓ {out.relative_to(ROOT)}  "
            f"({len(logos)} logos, {ROW_COUNT} rows × {MARQUEE_COPIES} copies)"
        )

    return 0


if __name__ == "__main__":
    sys.exit(main())
