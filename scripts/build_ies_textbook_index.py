#!/usr/bin/env python3
"""
Chunk text notes / extracted PDF text from data/ies_textbooks/ into
data/ies_textbook_index/chunks.jsonl for RAG solutions.

Place .txt / .md extracts (or run pdftotext yourself) in data/ies_textbooks/.
PDF binaries are gitignored — convert locally.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "data" / "ies_textbooks"
OUT_DIR = ROOT / "data" / "ies_textbook_index"
OUT = OUT_DIR / "chunks.jsonl"


def chunk_text(text: str, source: str, size: int = 900, overlap: int = 120) -> list[dict]:
    text = re.sub(r"\s+", " ", text).strip()
    chunks = []
    i = 0
    n = 0
    while i < len(text):
        piece = text[i : i + size]
        if len(piece) < 80:
            break
        chunks.append({"id": f"{source}-{n}", "source": source, "text": piece})
        n += 1
        i += size - overlap
    return chunks


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    SRC.mkdir(parents=True, exist_ok=True)
    rows: list[dict] = []

    # Built-in starter notes so RAG works before user drops textbooks
    starter = SRC / "_starter_ce_notes.txt"
    if not starter.exists():
        starter.write_text(
            """
Solid Mechanics. Axial stress σ = P/A. Strain ε = δ/L. Hooke: σ = Eε. Bending σ = My/I.
Shear τ = VQ/(Ib). Torsion τ/r = T/J = Gθ/L. Euler Pcr = π²EI/Le².

Fluid Mechanics. Continuity AV = const. Bernoulli p/ρg + v²/2g + z. Darcy hf = fLV²/(2gD).
Laminar circular pipe: umax = 2 Vavg. Reynolds Re = ρVD/μ.

Geotech. e = Vv/Vs; n = e/(1+e); S = wG/e. Saturated e = wG. Darcy q = kiA.
Terzaghi qult = cNc + γDf Nq + 0.5 γ B Nγ. Tv = Cv t / Hdr².

Environmental. BOD5 = L0(1-e^{-kt}). COD ≥ BOD. Overflow rate = Q/A for settling tanks.

Transportation. SSD = vt + v²/(2gf). Superelevation e = V²/(gR) within IRC limits.

Surveying. Rise/fall: if FS > BS then fall. HI = RL + BS; RL = HI − FS.

RCC IS 456. Max concrete strain in flexure 0.0035. Partial factors 1.5 (DL+LL), 1.15 steel.
OPC initial setting ≥ 30 min, final ≤ 600 min.
""".strip(),
            encoding="utf-8",
        )

    for path in sorted(SRC.iterdir()):
        if path.suffix.lower() not in {".txt", ".md"}:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        rows.extend(chunk_text(text, path.name))

    with OUT.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"Indexed {len(rows)} chunks from {SRC} -> {OUT}")


if __name__ == "__main__":
    main()
