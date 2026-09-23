"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Paper = {
  id: string;
  title: string;
  tier: string;
  source: string;
  difficulty: string;
  mode?: string;
  focusSection?: string | null;
  questionCount: number;
  attemptCount: number;
  hasDest: boolean;
};

type Attempt = {
  id: string;
  paperTitle: string;
  tier: string;
  status: string;
  score: number | null;
  maxScore: number | null;
  submittedAt: string | null;
};

type Status = {
  questionBankReady: boolean;
  paperCount: number;
  attemptCount: number;
  ollama: { connected: boolean; message: string };
  backend?: string;
};

type Tab = "mocks" | "pyq" | "reasoning" | "quant" | "english" | "gk" | "tier2";

export function Dashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [status, setStatus] = useState<Status | null>(null);
  const [tab, setTab] = useState<Tab>("mocks");
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const [p, a, s] = await Promise.all([
      fetch("/api/papers").then((r) => r.json()),
      fetch("/api/attempts").then((r) => r.json()),
      fetch("/api/status").then((r) => r.json()),
    ]);
    setPapers(p.papers ?? []);
    setAttempts(a.attempts ?? []);
    setStatus(s);
  }

  useEffect(() => {
    void load();
  }, []);

  async function generateHardMock() {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "tier1",
          mode: status?.ollama?.connected ? "ollama_mix" : "full_seed",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessage(`Hard mock created (${data.questionCount} questions).`);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed");
    } finally {
      setGenerating(false);
    }
  }

  const filtered = useMemo(() => {
    switch (tab) {
      case "mocks":
        return papers.filter((p) => p.tier === "tier1" && (p.mode === "full_mock" || (!p.mode && p.source !== "pyq_style")));
      case "pyq":
        return papers.filter(
          (p) => p.mode === "pyq" || p.source === "pyq_style" || p.title.toLowerCase().includes("pyq"),
        );
      case "tier2":
        return papers.filter((p) => p.tier === "tier2");
      case "reasoning":
        return papers.filter((p) => p.focusSection === "reasoning" || (p.mode === "practice" && p.title.includes("Reasoning")));
      case "quant":
        return papers.filter(
          (p) =>
            p.focusSection === "quant" ||
            (p.mode === "practice" && (p.title.includes("Quantitative") || p.title.includes("Quant"))),
        );
      case "english":
        return papers.filter((p) => p.focusSection === "english" || (p.mode === "practice" && p.title.includes("English")));
      case "gk":
        return papers.filter(
          (p) =>
            p.focusSection === "ga" ||
            (p.mode === "practice" && (p.title.includes("Awareness") || p.title.includes("GK"))),
        );
      default:
        return papers;
    }
  }, [papers, tab]);

  const tabs: { id: Tab; label: string; blurb: string }[] = [
    { id: "mocks", label: "Full Mocks", blurb: "Tier-I · 100 Q · 4×15 min" },
    { id: "pyq", label: "PYQ Style", blurb: "Hard previous-year pattern" },
    { id: "reasoning", label: "Reasoning", blurb: "25 Q · 15 min" },
    { id: "quant", label: "Quant", blurb: "25 Q · 15 min" },
    { id: "english", label: "English", blurb: "25 Q · 15 min" },
    { id: "gk", label: "GK / GA", blurb: "25 Q · 15 min" },
    { id: "tier2", label: "Tier-II", blurb: "Paper-I + DEST" },
  ];

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-6 py-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">SSC CGL 2026 pattern</p>
            <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">mockGE</h1>
            <p className="mt-3 max-w-xl text-sm text-slate-200">
              Sectional timers (15 min × 4), hard-level practice, PYQ-style papers and subject drills.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-xs text-slate-200">
            <span>
              {status?.questionBankReady
                ? `Bank ready · ${status.paperCount} papers`
                : "Bank empty — run npm run db:seed"}
            </span>
            <span>{status?.ollama?.message ?? "Checking model..."}</span>
            {status?.backend && <span>API: {status.backend}</span>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <nav className="flex flex-wrap gap-2 border-b border-[#c5ccd6] pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-left text-sm ${
                tab === t.id
                  ? "border-b-2 border-[#1e3a5f] font-medium text-[#1e3a5f]"
                  : "text-[#5a6577] hover:text-[#1a1f2b]"
              }`}
            >
              <div>{t.label}</div>
              <div className="text-[11px] font-normal text-[#8a93a3]">{t.blurb}</div>
            </button>
          ))}
        </nav>

        <section className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-[#1e3a5f]">
              {tabs.find((t) => t.id === tab)?.label}
            </h2>
            <p className="text-sm text-[#5a6577]">
              {tab === "mocks" &&
                "Official Tier-I lock: Reasoning → GA → Quant → English. 15 minutes each. No carry-over."}
              {tab === "pyq" && "Harder sets modelled on previous-year difficulty and topic mix."}
              {(tab === "reasoning" || tab === "quant" || tab === "english" || tab === "gk") &&
                "Sectional drill at exam pace: 25 questions, 15 minutes, −0.50 marking."}
              {tab === "tier2" && "Paper-I with sectional session timing and DEST practice."}
            </p>
          </div>
          {tab === "mocks" && (
            <button
              type="button"
              disabled={generating}
              onClick={() => void generateHardMock()}
              className="border border-[#1e3a5f] px-3 py-1.5 text-sm text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white disabled:opacity-50"
            >
              {generating ? "Creating..." : "Create new hard mock"}
            </button>
          )}
        </section>

        {message && (
          <p className="border border-[#c5ccd6] bg-white px-4 py-2 text-sm">{message}</p>
        )}

        <PaperTable papers={filtered} emptyHint={emptyHint(tab)} />

        <section>
          <h2 className="font-display mb-3 text-xl text-[#1e3a5f]">Recent attempts</h2>
          {attempts.length === 0 ? (
            <p className="text-sm text-[#5a6577]">No attempts yet.</p>
          ) : (
            <div className="border border-[#c5ccd6] bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#e2e6eb] bg-[#f7f8fa] text-xs uppercase text-[#5a6577]">
                  <tr>
                    <th className="px-4 py-2">Paper</th>
                    <th className="px-4 py-2">Score</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {attempts.slice(0, 12).map((a) => (
                    <tr key={a.id} className="border-b border-[#e2e6eb] last:border-0">
                      <td className="px-4 py-2">{a.paperTitle}</td>
                      <td className="px-4 py-2">
                        {a.score != null ? `${a.score} / ${a.maxScore}` : "—"}
                      </td>
                      <td className="px-4 py-2 capitalize">{a.status.replace("_", " ")}</td>
                      <td className="px-4 py-2 text-right">
                        {a.score != null ? (
                          <Link href={`/report/${a.id}`} className="text-[#1e3a5f] underline">
                            Result
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function emptyHint(tab: Tab) {
  if (tab === "mocks") return "No full mocks. Run npm run db:seed.";
  return "No papers in this section yet. Run npm run db:seed.";
}

function PaperTable({ papers, emptyHint }: { papers: Paper[]; emptyHint: string }) {
  if (papers.length === 0) {
    return <p className="text-sm text-[#5a6577]">{emptyHint}</p>;
  }
  return (
    <ul className="divide-y divide-[#e2e6eb] border border-[#c5ccd6] bg-white">
      {papers.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <div className="font-medium">{p.title}</div>
            <div className="text-xs text-[#5a6577]">
              {p.questionCount} questions · {p.difficulty}
              {p.tier === "tier1" || p.mode === "full_mock"
                ? " · sectional 15×4"
                : p.mode === "practice"
                  ? " · 15 min lock"
                  : ""}
            </div>
          </div>
          <Link
            href={`/exam/${p.id}`}
            className="bg-[#1e3a5f] px-4 py-1.5 text-sm text-white hover:bg-[#152a45]"
          >
            Start
          </Link>
        </li>
      ))}
    </ul>
  );
}
