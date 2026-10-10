#!/usr/bin/env python3
"""Find Civil Engineering prelims PDF links on UPSC previous-papers page."""

from __future__ import annotations

import re
import urllib.request

URL = "https://www.upsc.gov.in/examinations/previous-question-papers?field_exam_name_value=Engineering+Services"
UA = "Mozilla/5.0 (compatible; mockGE/1.0)"


def main() -> None:
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    html = urllib.request.urlopen(req, timeout=90).read().decode("utf-8", "ignore")
    # Drupal file links often look like /sites/default/files/....pdf
    for m in re.finditer(
        r'href="([^"]+\.pdf)"[^>]*>\s*([^<]*Civil[^<]*)',
        html,
        flags=re.I,
    ):
        href, text = m.group(1), re.sub(r"\s+", " ", m.group(2)).strip()
        if "main" in text.lower() and re.search(r"paper\s*[-–]?\s*i\b", text, re.I):
            # mains conventional — skip for prelims focus unless clearly prelims
            if "preliminary" not in text.lower() and "prelim" not in href.lower():
                continue
        if not href.startswith("http"):
            href = "https://www.upsc.gov.in" + href
        print(f"{text} | {href}")


if __name__ == "__main__":
    main()
