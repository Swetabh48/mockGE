/**
 * 2025-pattern social security calculations (the 2025 paper asked an employees'
 * compensation computation with a given relevant factor and an ESI contribution).
 * Statutory figures: compensation wage ceiling ₹15,000 (2020 notification); death 50% ×
 * wages × relevant factor (min ₹1,20,000); permanent total disablement 60% × wages ×
 * relevant factor (min ₹1,40,000); EDLI = 35 × average wages (ceiling ₹15,000) + 50% of
 * average PF balance (max ₹1,75,000), subject to ₹2.5 lakh minimum and ₹7 lakh maximum.
 */
import { inr, rs } from "../rng";
import { SOCIAL_GENERATORS } from "./applied";
import { options, type Generator } from "./common";

const FACTORS = [228.54, 224.0, 216.91, 207.98, 197.06, 184.17, 169.44, 153.65, 136.53, 120.39, 104.31];

const compensation: Generator = {
  id: "employees-compensation",
  topic: "Employees' Compensation",
  make(r) {
    const wage = r.int(10, 40) * 1000;
    const f = r.pick(FACTORS);
    const kind = r.pick(["death", "ptd", "ppd"] as const);
    const w = Math.min(wage, 15000);
    if (kind === "death") {
      const amt = Math.max(120000, Math.round(0.5 * w * f));
      return {
        topic: "Employees' Compensation",
        q: `An employee drawing monthly wages of ${rs(wage)} dies in an accident arising out of and in the course of employment. The relevant factor applicable to the deceased is ${f}. Taking the wage ceiling of ₹15,000 notified for computing compensation, the compensation payable is:`,
        o: options(amt, [Math.round(0.5 * wage * f), Math.round(0.6 * w * f), Math.round(0.5 * w * f * 1.1)], (v) => rs(Math.round(v)), 5000),
        x: `For death: 50% of monthly wages × relevant factor, subject to a minimum of ₹1,20,000.\nWages for computation = min(${inr(wage)}, 15,000) = ${inr(w)}.\n0.5 × ${inr(w)} × ${f} = ${rs(Math.round(0.5 * w * f))} → payable ${rs(amt)}.`,
      };
    }
    if (kind === "ptd") {
      const amt = Math.max(140000, Math.round(0.6 * w * f));
      return {
        topic: "Employees' Compensation",
        q: `An employee earning ${rs(wage)} a month suffers permanent total disablement from an employment injury. If the relevant factor is ${f} and compensation wages are capped at ₹15,000, the compensation is:`,
        o: options(amt, [Math.round(0.5 * w * f), Math.round(0.6 * wage * f), Math.round(0.6 * w * f * 0.9)], (v) => rs(Math.round(v)), 5000),
        x: `Permanent total disablement: 60% of monthly wages × relevant factor (minimum ₹1,40,000).\n0.6 × ${inr(w)} × ${f} = ${rs(Math.round(0.6 * w * f))} → payable ${rs(amt)}.`,
      };
    }
    const loss = r.pick([10, 20, 30, 40, 50, 60]);
    const ptd = Math.max(140000, Math.round(0.6 * w * f));
    const amt = Math.round((ptd * loss) / 100);
    return {
      topic: "Employees' Compensation",
      q: `An employment injury causes a permanent partial disablement certified as ${loss}% loss of earning capacity. The employee's monthly wages are ${rs(wage)} (ceiling ₹15,000 for computation) and the relevant factor is ${f}. Compensation payable is:`,
      o: options(amt, [ptd, Math.round((0.5 * w * f * loss) / 100), Math.round((0.6 * wage * f * loss) / 100)], (v) => rs(Math.round(v)), 1000),
      x: `Permanent partial disablement: the percentage loss of earning capacity × compensation for permanent total disablement.\nPTD amount = 60% × ${inr(w)} × ${f} = ${rs(Math.round(0.6 * w * f))}${0.6 * w * f < 140000 ? " → raised to the ₹1,40,000 minimum" : ""}.\n${loss}% of ${rs(ptd)} = ${rs(amt)}.`,
    };
  },
};

const edli: Generator = {
  id: "edli-benefit",
  topic: "EDLI-1976",
  make(r) {
    const wage = r.int(8, 30) * 500;
    const w = Math.min(wage, 15000);
    const bal = r.int(4, 60) * 10000;
    const bonus = Math.min(0.5 * bal, 175000);
    const raw = 35 * w + bonus;
    const amt = Math.min(700000, Math.max(250000, raw));
    return {
      topic: "EDLI-1976",
      q: `An EPF member in continuous service dies. Average monthly wages over the last 12 months were ${rs(wage)} and the average balance in the member's PF account over that period was ${rs(bal)}. The assurance benefit under the EDLI Scheme is:`,
      o: options(amt, [35 * wage, 35 * w, Math.min(700000, 35 * w + 0.5 * bal + 50000)], (v) => rs(Math.round(v)), 10000),
      x: `EDLI = 35 × average monthly wages (ceiling ₹15,000) + 50% of the average PF balance (bonus capped at ₹1,75,000), subject to a minimum of ₹2.5 lakh and a maximum of ₹7 lakh.\n35 × ${inr(w)} = ${rs(35 * w)}; bonus = min(50% × ${inr(bal)}, 1,75,000) = ${rs(bonus)}.\nTotal ${rs(raw)}${raw !== amt ? ` → limited to ${rs(amt)}` : ""}.`,
    };
  },
};

export const SOCIAL25_GENERATORS: Generator[] = [...SOCIAL_GENERATORS, compensation, edli];
