import type { SectionKey } from "../types";
import type { Item } from "../bank/dsl";
import labour1 from "./labour";
import labour2 from "./labour2";
import social from "./social";
import accounting from "./accounting";
import economy from "./economy";
import polity from "./polity";
import polity2 from "./polity2";
import history from "./history";
import history2 from "./history2";
import current from "./current";
import current2 from "./current2";
import science from "./science";
import science2 from "./science2";
import english from "./english";
import english2 from "./english2";
import { ACCOUNTING25B, ECONOMY25B, LABOUR25C } from "./extras1";
import { ACCOUNTING25C, CURRENT25C, HISTORY25C, POLITY25C, SCIENCE25C, SOCIAL25C } from "./extras2";

/** 2025-pattern bank: analytical, statement- and case-based items (no fact one-liners). */
export const BANKS25: Record<SectionKey, Item[]> = {
  english: [...english, ...english2],
  history: [...history, ...history2, ...HISTORY25C],
  current: [...current, ...current2, ...CURRENT25C],
  polity: [...polity, ...polity2, ...POLITY25C],
  economy: [...economy, ...ECONOMY25B],
  accounting: [...accounting, ...ACCOUNTING25B, ...ACCOUNTING25C],
  labour: [...labour1, ...labour2, ...LABOUR25C],
  social: [...social, ...SOCIAL25C],
  science: [...science, ...science2, ...SCIENCE25C],
  quant: [],
};
