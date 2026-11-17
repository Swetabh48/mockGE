"use client";

/**
 * Reads a photo / scan of the mockGE EPFO OMR sheet entirely in the browser.
 * 1. adaptive threshold  2. find the four corner squares  3. homography
 * 4. pick orientation using the top-left bar  5. measure fill of each bubble.
 * The result is always shown to the candidate for confirmation before scoring.
 */
import { GRID, MARKER, MARKER_CENTERS, ORIENT_BAR, bubbleCenter } from "./omrLayout";
import { MULTI, type Mark } from "./scoring";

export type OmrResult = {
  marks: Mark[];
  fills: number[][];
  uncertain: number[];
  preview: string;
  ok: boolean;
  message: string;
};

type H = number[]; // 3x3 row-major

function solve(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]!]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r]![c]!) > Math.abs(M[p]![c]!)) p = r;
    [M[c], M[p]] = [M[p]!, M[c]!];
    const piv = M[c]![c]!;
    if (Math.abs(piv) < 1e-12) throw new Error("singular");
    for (let k = c; k <= n; k++) M[c]![k]! /= piv;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r]![c]!;
      for (let k = c; k <= n; k++) M[r]![k]! -= f * M[c]![k]!;
    }
  }
  return M.map((row) => row[n]!);
}

/** Homography mapping src[i] → dst[i] (4 points). */
export function homography(src: [number, number][], dst: [number, number][]): H {
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]!;
    const [u, v] = dst[i]!;
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const h = solve(A, b);
  return [...h, 1];
}

export function apply(h: H, x: number, y: number): [number, number] {
  const w = h[6]! * x + h[7]! * y + h[8]!;
  return [(h[0]! * x + h[1]! * y + h[2]!) / w, (h[3]! * x + h[4]! * y + h[5]!) / w];
}

async function loadBitmap(file: Blob): Promise<CanvasImageSource & { width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through (older Safari / HEIC) */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

type Comp = { n: number; minx: number; maxx: number; miny: number; maxy: number; sx: number; sy: number };

export async function readOmrImage(file: Blob, questionCount = 120): Promise<OmrResult> {
  const bmp = await loadBitmap(file);
  const maxSide = 1700;
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  const W = Math.round(bmp.width * scale);
  const Hh = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = Hh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0, W, Hh);
  return readOmrCanvas(canvas, questionCount);
}

export function readOmrCanvas(canvas: HTMLCanvasElement, questionCount = 120): OmrResult {
  const W = canvas.width;
  const Hh = canvas.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const data = ctx.getImageData(0, 0, W, Hh).data;
  const gray = new Uint8Array(W * Hh);
  for (let i = 0, j = 0; i < gray.length; i++, j += 4) {
    gray[i] = (data[j]! * 299 + data[j + 1]! * 587 + data[j + 2]! * 114) / 1000;
  }
  // integral image for adaptive threshold
  const integ = new Float64Array((W + 1) * (Hh + 1));
  for (let y = 0; y < Hh; y++) {
    let row = 0;
    for (let x = 0; x < W; x++) {
      row += gray[y * W + x]!;
      integ[(y + 1) * (W + 1) + (x + 1)] = integ[y * (W + 1) + (x + 1)]! + row;
    }
  }
  const win = Math.max(15, Math.round(Math.min(W, Hh) / 9));
  const half = win >> 1;
  const dark = new Uint8Array(W * Hh);
  for (let y = 0; y < Hh; y++) {
    const y0 = Math.max(0, y - half), y1 = Math.min(Hh, y + half + 1);
    for (let x = 0; x < W; x++) {
      const x0 = Math.max(0, x - half), x1 = Math.min(W, x + half + 1);
      const s = integ[y1 * (W + 1) + x1]! - integ[y0 * (W + 1) + x1]! - integ[y1 * (W + 1) + x0]! + integ[y0 * (W + 1) + x0]!;
      const mean = s / ((x1 - x0) * (y1 - y0));
      const g = gray[y * W + x]!;
      dark[y * W + x] = g < mean * 0.78 && g < 170 ? 1 : 0;
    }
  }

  // connected components (4-neighbour)
  const labels = new Int32Array(W * Hh);
  const comps: Comp[] = [];
  const stack = new Int32Array(W * Hh);
  for (let i = 0; i < dark.length; i++) {
    if (!dark[i] || labels[i]) continue;
    const id = comps.length + 1;
    const c: Comp = { n: 0, minx: W, maxx: 0, miny: Hh, maxy: 0, sx: 0, sy: 0 };
    let sp = 0;
    stack[sp++] = i;
    labels[i] = id;
    while (sp) {
      const p = stack[--sp]!;
      const x = p % W, y = (p / W) | 0;
      c.n++;
      c.sx += x;
      c.sy += y;
      if (x < c.minx) c.minx = x;
      if (x > c.maxx) c.maxx = x;
      if (y < c.miny) c.miny = y;
      if (y > c.maxy) c.maxy = y;
      if (x > 0 && dark[p - 1] && !labels[p - 1]) { labels[p - 1] = id; stack[sp++] = p - 1; }
      if (x < W - 1 && dark[p + 1] && !labels[p + 1]) { labels[p + 1] = id; stack[sp++] = p + 1; }
      if (y > 0 && dark[p - W] && !labels[p - W]) { labels[p - W] = id; stack[sp++] = p - W; }
      if (y < Hh - 1 && dark[p + W] && !labels[p + W]) { labels[p + W] = id; stack[sp++] = p + W; }
    }
    comps.push(c);
  }

  const minSide = Math.min(W, Hh);
  const cands = comps
    .map((c) => {
      const w = c.maxx - c.minx + 1, h = c.maxy - c.miny + 1;
      return { ...c, w, h, cx: c.sx / c.n, cy: c.sy / c.n, fill: c.n / (w * h), ar: w / h };
    })
    .filter((c) => c.ar > 0.6 && c.ar < 1.65 && c.fill > 0.8 && c.w > minSide * 0.012 && c.w < minSide * 0.11);

  const fail = (message: string): OmrResult => ({
    marks: Array(questionCount).fill(null),
    fills: [],
    uncertain: [],
    preview: canvas.toDataURL("image/jpeg", 0.6),
    ok: false,
    message,
  });

  if (cands.length < 4) {
    return fail("Could not find the four black corner squares. Retake the photo with the whole sheet visible on a plain background, in good light.");
  }

  const corners: [number, number][] = [[0, 0], [W, 0], [0, Hh], [W, Hh]];
  const picked = corners.map(([X, Y]) => {
    let best = cands[0]!;
    let bd = Infinity;
    for (const c of cands) {
      const d = Math.hypot(c.cx - X, c.cy - Y) / Math.sqrt(c.n);
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    return best;
  });
  if (new Set(picked).size < 4) return fail("Corner squares were not distinct — make sure all four squares are inside the photo.");
  const sizes = picked.map((p) => Math.sqrt(p.n));
  if (Math.max(...sizes) / Math.min(...sizes) > 2.6) {
    return fail("The corner squares look inconsistent. Hold the camera parallel to the sheet and retake the photo.");
  }

  const imgPts: [number, number][] = picked.map((p) => [p.cx, p.cy]);
  // sheet corner order TL, TR, BL, BR → rotations of the sheet in the photo
  const rotations: number[][] = [
    [0, 1, 2, 3],
    [2, 0, 3, 1],
    [3, 2, 1, 0],
    [1, 3, 0, 2],
  ];
  const sampleDark = (h: H, x: number, y: number, w: number, hh: number) => {
    let d = 0, n = 0;
    for (let i = 0; i <= 8; i++)
      for (let j = 0; j <= 4; j++) {
        const [u, v] = apply(h, x + (w * i) / 8, y + (hh * j) / 4);
        const px = Math.round(u), py = Math.round(v);
        if (px < 0 || py < 0 || px >= W || py >= Hh) continue;
        n++;
        d += dark[py * W + px]!;
      }
    return n ? d / n : 0;
  };
  let best: { h: H; score: number } | null = null;
  for (const rot of rotations) {
    try {
      const dst = rot.map((k) => imgPts[k]!);
      const h = homography(MARKER_CENTERS, dst);
      const bar = sampleDark(h, ORIENT_BAR.x + 1, ORIENT_BAR.y + 0.8, ORIENT_BAR.w - 2, ORIENT_BAR.h - 1.6);
      const opp = sampleDark(h, 210 - ORIENT_BAR.x - ORIENT_BAR.w + 1, 297 - ORIENT_BAR.y - ORIENT_BAR.h + 0.8, ORIENT_BAR.w - 2, ORIENT_BAR.h - 1.6);
      const score = bar - opp;
      if (!best || score > best.score) best = { h, score };
    } catch {
      /* degenerate */
    }
  }
  if (!best || best.score < 0.4) {
    return fail("Could not tell which way up the sheet is. Use the mockGE OMR sheet and keep the top black bar visible.");
  }
  const h = best.h;

  // bubble fill
  const fills: number[][] = [];
  const [ax, ay] = apply(h, 100, 150);
  const [bx, by] = apply(h, 100 + GRID.r, 150);
  const rPx = Math.max(2, Math.hypot(bx - ax, by - ay));
  const inner = rPx * 0.62;
  for (let q = 0; q < questionCount; q++) {
    const row: number[] = [];
    for (let o = 0; o < 4; o++) {
      const [cxm, cym] = bubbleCenter(q, o);
      const [cx, cy] = apply(h, cxm, cym);
      let d = 0, n = 0;
      const R = Math.ceil(inner);
      for (let dy = -R; dy <= R; dy++)
        for (let dx = -R; dx <= R; dx++) {
          if (dx * dx + dy * dy > inner * inner) continue;
          const px = Math.round(cx + dx), py = Math.round(cy + dy);
          if (px < 0 || py < 0 || px >= W || py >= Hh) continue;
          n++;
          d += dark[py * W + px]!;
        }
      row.push(n ? d / n : 0);
    }
    fills.push(row);
  }

  const marks: Mark[] = [];
  const uncertain: number[] = [];
  fills.forEach((f, q) => {
    const order = [0, 1, 2, 3].sort((a, b) => f[b]! - f[a]!);
    const f1 = f[order[0]!]!, f2 = f[order[1]!]!;
    if (f1 >= 0.42) {
      if (f2 >= 0.42 && f2 >= f1 * 0.6) {
        marks.push(MULTI);
        uncertain.push(q);
      } else {
        marks.push(order[0]!);
        if (f2 >= 0.3) uncertain.push(q);
      }
    } else if (f1 >= 0.26 && f1 - f2 >= 0.18) {
      marks.push(order[0]!);
      uncertain.push(q);
    } else {
      marks.push(null);
      if (f1 >= 0.22) uncertain.push(q);
    }
  });

  // overlay preview
  ctx.lineWidth = Math.max(1.5, rPx * 0.25);
  for (let q = 0; q < questionCount; q++) {
    for (let o = 0; o < 4; o++) {
      const [cxm, cym] = bubbleCenter(q, o);
      const [cx, cy] = apply(h, cxm, cym);
      const m = marks[q];
      const isSel = m === o || (m === MULTI && fills[q]![o]! >= 0.42);
      if (!isSel && !uncertain.includes(q)) continue;
      ctx.beginPath();
      ctx.arc(cx, cy, rPx * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = m === MULTI ? "#d32f2f" : uncertain.includes(q) ? "#f59e0b" : "#16a34a";
      if (!isSel) ctx.strokeStyle = "rgba(245,158,11,0.6)";
      ctx.stroke();
    }
  }
  for (const p of picked) {
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    ctx.strokeRect(p.minx - 3, p.miny - 3, p.w + 6, p.h + 6);
  }

  const answered = marks.filter((m) => m !== null).length;
  void MARKER;
  return {
    marks,
    fills,
    uncertain,
    preview: canvas.toDataURL("image/jpeg", 0.65),
    ok: true,
    message:
      answered === 0
        ? "Sheet found, but no marked bubbles were detected. Check that bubbles are darkened fully, or enter answers manually."
        : `Read ${answered} marked question${answered === 1 ? "" : "s"}. ${uncertain.length ? `${uncertain.length} look faint or doubtful — highlighted in amber below; please check them.` : "Please confirm against your sheet before scoring."}`,
  };
}
