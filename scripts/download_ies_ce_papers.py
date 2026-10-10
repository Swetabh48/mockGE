#!/usr/bin/env python3
"""
Download UPSC ESE/IES Civil Engineering objective Paper-I / Paper-II PDFs.

Prefer official upsc.gov.in URLs. NewtonDesk is used only as a curated link index
(see PAPER_SOURCES). Skips GS / Engineering Aptitude papers.

Usage:
  python scripts/download_ies_ce_papers.py
"""

from __future__ import annotations

import hashlib
import json
import re
import ssl
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "iesce" / "pdfs"
MANIFEST = ROOT / "iesce" / "manifest.json"

# Direct official / Drive URLs for Civil Engineering objective papers only.
# paper: 1 = CE Paper-I (pre-2017 dual CE, or historical), 2 = CE Paper-II / post-2017 CE discipline paper.
# Post-2017 UPSC naming: Prelims Paper-II = Engineering discipline (Civil).
PAPER_SOURCES: list[dict] = [
    # Official UPSC Prelims Civil (discipline Paper-II → store as paper 2)
    {
        "year": 2026,
        "paper": 2,
        "url": "https://www.upsc.gov.in/sites/default/files/QP_ESPE26_CivilEngg_II_09022026.pdf",
        "note": "UPSC ESE 2026 Prelims Civil Engg (official Paper-II)",
    },
    {
        "year": 2025,
        "paper": 2,
        "url": "https://www.upsc.gov.in/sites/default/files/QP-ESEP-25-CIVIL-ENGINEERING-P-II-090625.pdf",
        "note": "UPSC ESE 2025 Prelims Civil Engg (official Paper-II)",
    },
    {
        "year": 2024,
        "paper": 2,
        "url": "https://www.upsc.gov.in/sites/default/files/QP-EnggServcPrelExam-24-CIVIL-ENGINEERING-190224.pdf",
        "note": "UPSC ESE 2024 Prelims Civil Engg (official Paper-II)",
    },
    {
        "year": 2023,
        "paper": 2,
        "url": "https://www.upsc.gov.in/sites/default/files/ESEP23-P-II_CivilEngg_20022023.pdf",
        "note": "UPSC ESE 2023 Prelims Civil Engg (official Paper-II)",
    },
    {
        "year": 2022,
        "paper": 2,
        "url": "https://www.upsc.gov.in/sites/default/files/QP-ESEP-22-PAPER-II-CivislEngg-210222.pdf",
        "note": "UPSC ESE 2022 Prelims Civil Engg (official Paper-II)",
    },
    # Additional years — Google Drive / mirror links from public indexes (Civil only)
    {
        "year": 2021,
        "paper": 2,
        "url": "https://drive.google.com/uc?id=1fXS3nBgeCm96IEppOyXtUeVSwGJA5kJE&export=download",
        "note": "ESE 2021 Civil objective",
    },
    {
        "year": 2020,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1YlcYp4LFqZRWNqPTMVoK3anhVN6NHeaL",
        "note": "ESE 2020 Civil objective",
    },
    {
        "year": 2019,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1fOfDxn6rfhUyL4rFGr1QVz49BxDkU77u",
        "note": "ESE 2019 Civil objective",
    },
    {
        "year": 2018,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1DnmRK3Ob7tXWma3qaNsV7I9znk-3VHKx",
        "note": "ESE 2018 Civil objective",
    },
    {
        "year": 2017,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1xjVfR0k4dVG_yDOxR_duPhIAnvBNcBhb",
        "note": "ESE 2017 Civil objective",
    },
    # Pre-2017 dual CE papers
    {
        "year": 2016,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1H4ISPyw_0L0fwAoMTlrbsu0BMndld9vX",
        "note": "IES 2016 CE Paper-I",
    },
    {
        "year": 2016,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=15uK11LdlRoAkJODN2E_8Mp178lEm8HIx",
        "note": "IES 2016 CE Paper-II",
    },
    {
        "year": 2015,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1kY8PtHUirNeslQ4ZomXb_WD4ZxthZPgC",
        "note": "IES 2015 CE Paper-I",
    },
    {
        "year": 2015,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1nkJFL2HYyaJM__88M6Kr_g4oJ0QLOtUY",
        "note": "IES 2015 CE Paper-II",
    },
    {
        "year": 2014,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1DNPx5Xi099zxWvQO-F1vGLWreIxlHxN4",
        "note": "IES 2014 CE Paper-I",
    },
    {
        "year": 2014,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1XeU1D9TsO1qg_OOTruNacKy5K5DUHUZm",
        "note": "IES 2014 CE Paper-II",
    },
    {
        "year": 2013,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=18yUXNmRMn8e9SFfuxMWwOjLeOvkAiSMu",
        "note": "IES 2013 CE Paper-I",
    },
    {
        "year": 2013,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1g7Qj2GOc2dXYlAUQ0GSvdVzIPk5-DYrc",
        "note": "IES 2013 CE Paper-II",
    },
    {
        "year": 2012,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1w6bvw0Tti3E2euEvC-wCXpGY0rhQi_0k",
        "note": "IES 2012 CE Paper-I",
    },
    {
        "year": 2012,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1807pSz7oKdGe_tn7kgRVyTvMPom8LF9p",
        "note": "IES 2012 CE Paper-II",
    },
    {
        "year": 2011,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1QkcqrLCLGkcIqBP-cjG2Oa0B06e820do",
        "note": "IES 2011 CE Paper-I",
    },
    {
        "year": 2011,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1KBQvesoaH7VEqsF_q4cj2i4kpkFm-gZw",
        "note": "IES 2011 CE Paper-II",
    },
    {
        "year": 2010,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1UWHOIgNJxotr9vhxttwIBoiantKb-2qo",
        "note": "IES 2010 CE Paper-I",
    },
    {
        "year": 2010,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1RMuL5tWhR5CYLtwyJEqwLMcBCyoW37G7",
        "note": "IES 2010 CE Paper-II",
    },
    {
        "year": 2009,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1-oO2MdHR167WML5qISyyCXe30Oo-omUA",
        "note": "IES 2009 CE Paper-I",
    },
    {
        "year": 2009,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1Wy9CBF_o4eIIAZRSVFnu6fNPV2heVn6F",
        "note": "IES 2009 CE Paper-II",
    },
    {
        "year": 2008,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1fvTkTDdmAr1QwI8sdG0u_RWeNgucGtUs",
        "note": "IES 2008 CE Paper-I",
    },
    {
        "year": 2008,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1Kcjtvi9zCA7zdBcqByqj5L_PFcsBMshF",
        "note": "IES 2008 CE Paper-II",
    },
    {
        "year": 2007,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1NqmU_ra0K0PggbpkBx0k4-7_kqGT6bm7",
        "note": "IES 2007 CE Paper-I",
    },
    {
        "year": 2007,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=11pBPLWLnxwcvFEna0oAMaDlhXrB8fUdv",
        "note": "IES 2007 CE Paper-II",
    },
    {
        "year": 2006,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1RGx2-Yr_JpN7HZMIj4x9KNcgOLx3636-",
        "note": "IES 2006 CE Paper-I",
    },
    {
        "year": 2006,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1UY70KF20DrT5zE92s3QoawE34-kbLjGH",
        "note": "IES 2006 CE Paper-II",
    },
    {
        "year": 2005,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1BTj5O_ZcQA1IJGUCU_gV02OFQQ40Ap6F",
        "note": "IES 2005 CE Paper-I",
    },
    {
        "year": 2005,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1OL9aEoVmSLOB7zZM0iDdlv-8KJ5xDP64",
        "note": "IES 2005 CE Paper-II",
    },
    {
        "year": 2003,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1Rh4yaLzYY-SoceGQRM9oWuiEE43B9r5A",
        "note": "IES 2003 CE Paper-I",
    },
    {
        "year": 2003,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=12iGS6hVyq8PcRoTDQEtXa3IJjWoSiHq_",
        "note": "IES 2003 CE Paper-II",
    },
    {
        "year": 2002,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1wXpA_ymujMtDKmzP124mrFvNk_HKrpkg",
        "note": "IES 2002 CE Paper-I",
    },
    {
        "year": 2002,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1aK569E_4UnvRSGj5reaxDFh49ERP6Vbn",
        "note": "IES 2002 CE Paper-II",
    },
    {
        "year": 2001,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1ph0O1cbkwm4f4wEI-UamfF7MrE8JSKVQ",
        "note": "IES 2001 CE Paper-I",
    },
    {
        "year": 2001,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1Q5uv7_9Ds2IIXviNNmLJ8gdE138cIiCV",
        "note": "IES 2001 CE Paper-II",
    },
    {
        "year": 2000,
        "paper": 1,
        "url": "https://drive.google.com/uc?export=download&id=1vPnDxiVCgGwpWpUZyJUONrJDix9mLqCc",
        "note": "IES 2000 CE Paper-I",
    },
    {
        "year": 2000,
        "paper": 2,
        "url": "https://drive.google.com/uc?export=download&id=1Xcqb3jQxXt2UwL06-9Xio5hYY_yofPpl",
        "note": "IES 2000 CE Paper-II",
    },
]

UA = "mockGE-ies-downloader/1.0 (+educational; Civil Engg PYQ only)"


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def download(url: str, dest: Path, timeout: int = 90) -> tuple[bool, str]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            data = resp.read()
            ctype = (resp.headers.get("Content-Type") or "").lower()
            # Google Drive HTML interstitial
            if b"%PDF" not in data[:1024] and (
                "text/html" in ctype or data[:15].lower().startswith(b"<!DOCTYPE")
            ):
                return False, "not_pdf_html_interstitial"
            if len(data) < 5000:
                return False, f"too_small_{len(data)}"
            dest.write_bytes(data)
            return True, sha256_bytes(data)
    except urllib.error.HTTPError as e:
        return False, f"http_{e.code}"
    except Exception as e:
        return False, re.sub(r"\s+", " ", str(e))[:120]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    entries: list[dict] = []
    ok = 0
    fail = 0
    for src in PAPER_SOURCES:
        year = src["year"]
        paper = src["paper"]
        url = src["url"]
        dest = OUT_DIR / str(year) / f"paper{paper}.pdf"
        status = "skipped_exists"
        digest = ""
        if dest.exists() and dest.stat().st_size > 5000:
            digest = sha256_bytes(dest.read_bytes())
            ok += 1
        else:
            print(f"GET {year} paper{paper} …")
            success, info = download(url, dest)
            if success:
                status = "downloaded"
                digest = info
                ok += 1
                print(f"  OK -> {dest.relative_to(ROOT)} ({digest[:12]}...)")
            else:
                status = f"failed:{info}"
                fail += 1
                print(f"  FAIL {info}")
                if dest.exists() and dest.stat().st_size < 5000:
                    dest.unlink(missing_ok=True)
            time.sleep(0.6)
        entries.append(
            {
                "year": year,
                "paper": paper,
                "iesPaper": f"ce_paper{paper}",
                "sourceUrl": url,
                "path": str(dest.relative_to(ROOT)).replace("\\", "/"),
                "sha256": digest,
                "status": status,
                "note": src.get("note", ""),
            }
        )

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        json.dumps({"updated": time.strftime("%Y-%m-%d"), "papers": entries}, indent=2),
        encoding="utf-8",
    )
    print(f"\nDone: {ok} available, {fail} failed -> {MANIFEST}")


if __name__ == "__main__":
    main()
