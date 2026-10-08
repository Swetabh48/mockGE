"""
CLI: python infra/math_verify_cli.py < mcq.json
Reads one JSON object from stdin, prints verify_mcq result.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from math_verify_core import verify_mcq  # noqa: E402


def main() -> None:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    raw = sys.stdin.read()
    payload = json.loads(raw or "{}")
    print(json.dumps(verify_mcq(payload), ensure_ascii=True))


if __name__ == "__main__":
    main()
