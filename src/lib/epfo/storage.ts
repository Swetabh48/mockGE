"use client";

import type { Mark } from "./scoring";
import type { Band, EpfoPaper, EpfoPaperMeta } from "./types";

export type EpfoAttempt = {
  id: string;
  paperId: string;
  paperTitle: string;
  band: Band;
  mode: "online" | "offline";
  marks: Mark[];
  timeSpent?: number[];
  usedSec?: number;
  submittedAt: string;
  score: number;
  maxScore: number;
  correct: number;
  wrong: number;
  unattempted: number;
};

export type OnlineSession = {
  mode: "online";
  startedAt: number;
  marks: Mark[];
  review: boolean[];
  visited: boolean[];
  timeSpent: number[];
  current: number;
};

export type OfflineSession = {
  mode: "offline";
  startedAt: number | null;
  finishedAt: number | null;
};

const ATTEMPTS = "epfo:attempts";
const sessionKey = (id: string) => `epfo:session:${id}`;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked (private mode) — the test still works in memory */
  }
}

export function listAttempts(): EpfoAttempt[] {
  return read<EpfoAttempt[]>(ATTEMPTS, []);
}

export function getAttempt(id: string): EpfoAttempt | undefined {
  return listAttempts().find((a) => a.id === id);
}

export function saveAttempt(a: EpfoAttempt) {
  const all = listAttempts().filter((x) => x.id !== a.id);
  all.unshift(a);
  write(ATTEMPTS, all.slice(0, 200));
}

export function getSession<T extends OnlineSession | OfflineSession>(paperId: string): T | null {
  return read<T | null>(sessionKey(paperId), null);
}

export function saveSession(paperId: string, s: OnlineSession | OfflineSession) {
  write(sessionKey(paperId), s);
}

export function clearSession(paperId: string) {
  try {
    localStorage.removeItem(sessionKey(paperId));
  } catch {
    /* ignore */
  }
}

export function newId(): string {
  const c = globalThis.crypto;
  if (c && "randomUUID" in c) return c.randomUUID().replace(/-/g, "").slice(0, 12);
  return Math.random().toString(36).slice(2, 14);
}

const paperCache = new Map<string, Promise<EpfoPaper>>();

export function fetchPaper(id: string): Promise<EpfoPaper> {
  if (!/^epfo-[emh]\d{2}$/.test(id)) return Promise.reject(new Error("Unknown paper"));
  let p = paperCache.get(id);
  if (!p) {
    p = fetch(`/epfo/papers/${id}.json`).then((r) => {
      if (!r.ok) throw new Error("Paper not found");
      return r.json() as Promise<EpfoPaper>;
    });
    paperCache.set(id, p);
    p.catch(() => paperCache.delete(id));
  }
  return p;
}

export async function fetchIndex(): Promise<EpfoPaperMeta[]> {
  const r = await fetch("/epfo/index.json");
  if (!r.ok) return [];
  const j = (await r.json()) as { papers: EpfoPaperMeta[] };
  return j.papers;
}
