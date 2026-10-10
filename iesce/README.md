# IES / ESE Civil Engineering PDFs

Downloaded official / indexed Civil Paper-I and Paper-II objective PDFs live under `pdfs/{year}/paper{1|2}.pdf`.

```bash
npm run ies:download
npm run ies:import          # text-layer PDFs (~2000–2008)
npm run ies:ocr             # RapidOCR two-column for scanned PDFs (≥2009)
npm run ies:seed            # load into Postgres
npm run ies:corpus          # rebuild training corpus
```

`manifest.json` records source URLs and checksums. GS / Engineering Aptitude papers are intentionally excluded.

## Scanned PDFs (≈2009+)

UPSC uploads for later years are **image-only**. The default OCR path is **RapidOCR** (`rapidocr-onnxruntime`) with left/right column splitting:

```bash
pip install rapidocr-onnxruntime pymupdf pillow
npm run ies:ocr
# or a subset:
python scripts/ocr_ies_ce_rapid.py --years 2017,2018,2019 --max-pages 40 --force
```

Raw page text is saved under `ocr_text/`. Optional Gemini vision OCR: `npm run ies:ocr-gemini`.
