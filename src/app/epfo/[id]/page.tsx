import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpfoPaperApp } from "@/components/epfo/EpfoPaperApp";

export const metadata: Metadata = {
  title: "EPFO APFC Mock Test · mockGE",
  description: "Original UPSC EPFO APFC mock paper — take it online or offline with a printable OMR sheet.",
};

export default async function EpfoPaperPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { id } = await params;
  const { attempt } = await searchParams;
  if (!/^epfo-[emh]\d{2}$/.test(id)) notFound();
  return <EpfoPaperApp paperId={id} attemptId={attempt} />;
}
