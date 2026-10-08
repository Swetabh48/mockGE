/**
 * Call SymPy verifier (Modal HTTP or local python CLI).
 * Used to correct invent answer keys with real math.
 */

import { spawn } from "child_process";
import path from "path";
import type { McqLike } from "./validateMcq";

export type PythonVerifyResult = {
  ok: boolean;
  repaired?: boolean;
  correctOption?: string;
  value?: number;
  explanation?: string;
  trick?: string;
  topic?: string;
  subtopic?: string;
  engine?: string;
  reason?: string;
};

const MATH_VERIFY_URL = (process.env.MATH_VERIFY_URL || "").replace(/\/$/, "");
const MATH_VERIFY_KEY = process.env.MATH_VERIFY_KEY || process.env.MOCKGE_MATH_KEY || "";

function headers(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (MATH_VERIFY_KEY) {
    h.Authorization = `Bearer ${MATH_VERIFY_KEY}`;
    h["x-mockge-math-key"] = MATH_VERIFY_KEY;
  }
  return h;
}

async function verifyViaHttp(q: McqLike): Promise<PythonVerifyResult | null> {
  if (!MATH_VERIFY_URL) return null;
  const payload = {
    stemEn: q.stemEn,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    correctOption: q.correctOption,
    topic: q.topic,
    subtopic: q.subtopic || "",
    explanation: q.explanation,
    trick: q.trick,
  };
  // MATH_VERIFY_URL = Modal verify_mcq endpoint, or a base URL that hosts /verify
  const urls = Array.from(
    new Set([MATH_VERIFY_URL, `${MATH_VERIFY_URL.replace(/\/$/, "")}/verify`]),
  );

  for (const url of urls) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 12_000);
      const res = await fetch(url, {
        method: "POST",
        headers: headers(),
        signal: ctrl.signal,
        body: JSON.stringify(payload),
      });
      clearTimeout(t);
      if (!res.ok) continue;
      const data = (await res.json()) as PythonVerifyResult;
      if (typeof data.ok === "boolean") return data;
    } catch {
      // try next url
    }
  }
  return null;
}

function verifyViaLocalPython(q: McqLike): Promise<PythonVerifyResult | null> {
  return new Promise((resolve) => {
    const script = path.join(process.cwd(), "infra", "math_verify_cli.py");
    const py = process.env.PYTHON_PATH || process.env.PYTHON || "python";
    const child = spawn(py, [script], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
      env: process.env,
    });
    let out = "";
    let err = "";
    const kill = setTimeout(() => {
      child.kill();
      resolve(null);
    }, 8000);
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.stderr.on("data", (d) => {
      err += String(d);
    });
    child.on("error", () => {
      clearTimeout(kill);
      resolve(null);
    });
    child.on("close", (code) => {
      clearTimeout(kill);
      if (code !== 0) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(out.trim()) as PythonVerifyResult);
      } catch {
        resolve(null);
      }
    });
    child.stdin.write(
      JSON.stringify({
        stemEn: q.stemEn,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        topic: q.topic,
        subtopic: q.subtopic || "",
        explanation: q.explanation,
        trick: q.trick,
      }),
    );
    child.stdin.end();
    void err;
  });
}

/** Prefer Modal SymPy; else local python; else null (caller uses TS fallback). */
export async function verifyMcqWithPython(q: McqLike): Promise<PythonVerifyResult | null> {
  const remote = await verifyViaHttp(q);
  if (remote) return remote;
  return verifyViaLocalPython(q);
}

export function applyPythonVerify(q: McqLike, v: PythonVerifyResult): McqLike | null {
  if (!v.ok) {
    // Solved but answer not in options → drop bad invent
    if (v.reason === "solved_value_not_in_options") return null;
    return q; // no_solver → keep for TS fallback
  }
  if (!v.correctOption || !["A", "B", "C", "D"].includes(v.correctOption)) return q;
  return {
    ...q,
    correctOption: v.correctOption,
    explanation: v.explanation || q.explanation,
    trick: v.trick || q.trick,
    topic: v.topic || q.topic,
    subtopic: v.subtopic || q.subtopic,
  };
}
