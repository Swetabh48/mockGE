"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function GenerateAdminPage() {
  const [status, setStatus] = useState<{
    ready?: boolean;
    message?: string;
    paperCount?: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string>("");

  useEffect(() => {
    void fetch("/api/generate")
      .then((r) => r.json())
      .then(setStatus);
  }, []);

  async function create(tier: "tier1" | "tier2") {
    setBusy(true);
    setLog("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setLog(`Created paper ${data.paperId} (${data.questionCount} questions).`);
    } catch (e) {
      setLog(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef1f4] px-6 py-10 text-[#1a1f2b]">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#1e3a5f] underline">
          Back to dashboard
        </Link>
        <h1 className="font-display mt-4 text-3xl text-[#1e3a5f]">Paper generation</h1>
        <p className="mt-2 text-sm text-[#5a6577]">
          Create Tier-I / Tier-II mocks from the algorithmic SSC-style question bank.
        </p>

        <div className="mt-6 border border-[#c5ccd6] bg-white p-4 text-sm">
          <div>Status: {status?.message ?? "Loading..."}</div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => void create("tier1")}
            className="bg-[#1e3a5f] px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            Create Tier-I mock
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void create("tier2")}
            className="border border-[#1e3a5f] px-4 py-2 text-sm text-[#1e3a5f] disabled:opacity-50"
          >
            Create Tier-II mock
          </button>
        </div>
        {log && <p className="mt-4 text-sm text-[#2f6b4f]">{log}</p>}
      </div>
    </div>
  );
}
