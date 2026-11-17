import { Dashboard } from "@/components/Dashboard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const { exam } = await searchParams;
  const initialExam = exam === "epfo" ? "epfo_apfc" : exam === "ies" ? "ies_civil" : "ssc_cgl";
  return <Dashboard initialExam={initialExam} />;
}
