import type { SectionKey } from "../types";
import type { Item } from "./dsl";
import english from "./english";
import history from "./history";
import current from "./current";
import polity from "./polity";
import economy from "./economy";
import accounting from "./accounting";
import labour from "./labour";
import social from "./social";
import science from "./science";

export const BANKS: Record<SectionKey, Item[]> = {
  english,
  history,
  current,
  polity,
  economy,
  accounting,
  labour,
  social,
  science,
  quant: [],
};
