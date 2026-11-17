import { sectionLayout, bankNeeds } from "../src/lib/epfo/build";
import { BANKS } from "../src/lib/epfo/bank";
import { EPFO_SECTIONS } from "../src/lib/epfo/sections";
const L = sectionLayout();
for (const s of EPFO_SECTIONS) {
  const vals = L.map((r) => r[s.key]);
  const need = bankNeeds(s.key, L).reduce((a, b) => a + b, 0);
  console.log(s.key.padEnd(11), "min", Math.min(...vals), "max", Math.max(...vals), "distinct", new Set(vals).size, "bank need", need, "have", BANKS[s.key].length, need > BANKS[s.key].length ? `SHORT ${need - BANKS[s.key].length}` : "ok");
}
console.log("row sums", [...new Set(L.map((r) => Object.values(r).reduce((a, b) => a + b, 0)))], "L+S", Math.min(...L.map((r) => r.labour + r.social)), Math.max(...L.map((r) => r.labour + r.social)));
console.log("paper 1:", JSON.stringify(L[0]));
console.log("paper 17:", JSON.stringify(L[16]));
