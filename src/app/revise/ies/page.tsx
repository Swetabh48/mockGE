import Link from "next/link";
import { IES_SYLLABUS } from "@/lib/exam/iesTaxonomy";
import { IES_REVISE_NOTES } from "@/lib/exam/iesReviseNotes";

export default function IesRevisePage() {
  const paper1 = IES_REVISE_NOTES.filter((n) => n.paper === "ce_paper1" || n.paper === "both");
  const paper2 = IES_REVISE_NOTES.filter((n) => n.paper === "ce_paper2" || n.paper === "both");

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1a1f2b]">
      <header className="border-b border-[#c5ccd6] bg-[#1e3a5f] px-6 py-4 text-white">
        <div className="mx-auto flex max-w-4xl items-end justify-between">
          <div>
            <div className="font-display text-xl">mockGE · IES Civil</div>
            <div className="mt-1 text-sm text-slate-200">Formulas &amp; concept revise</div>
          </div>
          <Link href="/" className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-6 py-8">
        <section>
          <h1 className="font-display text-3xl text-[#1e3a5f]">Civil Engineering revise</h1>
          <p className="mt-2 text-sm text-[#5a6577]">
            High-yield formulas across the ESE Civil syllabus (Paper-I &amp; Paper-II clusters). For
            RAG textbook solutions on reports, drop chapter extracts in{" "}
            <code className="text-xs">data/ies_textbooks/</code> then run{" "}
            <code className="text-xs">npm run ies:textbooks</code>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-[#1e3a5f]">Typically Paper-I subjects</h2>
          {paper1.map((n) => (
            <article key={n.subject} className="border border-[#c5ccd6] bg-white p-5">
              <h3 className="text-lg font-medium text-[#1e3a5f]">{n.title}</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {n.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-[#1e3a5f]">Typically Paper-II subjects</h2>
          {paper2.map((n) => (
            <article key={n.subject} className="border border-[#c5ccd6] bg-white p-5">
              <h3 className="text-lg font-medium text-[#1e3a5f]">{n.title}</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
                {n.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2 className="font-display mb-3 text-xl text-[#1e3a5f]">Syllabus map</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {IES_SYLLABUS.map((s) => (
              <div key={s.key} className="border border-[#c5ccd6] bg-white p-3 text-sm">
                <div className="font-medium text-[#1e3a5f]">{s.title}</div>
                <div className="text-xs text-[#8a93a3]">
                  Typically {s.paper === "both" ? "both papers" : s.paper.replace("ce_", "")}
                </div>
                <ul className="mt-1 text-xs text-[#5a6577]">
                  {s.topics.map((t) => (
                    <li key={t.id}>· {t.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
