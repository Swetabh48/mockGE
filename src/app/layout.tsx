import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "mockGE · SSC CGL Practice",
  description:
    "Computer-based mock tests for SSC Combined Graduate Level Examination — Tier-I and Tier-II Paper-I.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plex.variable} ${sourceSerif.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
