/**
 * Computed questions for Accounting, Social Security and Economy.
 * Statutory figures used: EPF wage ceiling ₹15,000; EPS 8.33% (max ₹1,250);
 * ESI 0.75% employee / 3.25% employer; gratuity 15/26 × wages × years (cap ₹20 lakh);
 * bonus 8.33%–20% with calculation ceiling ₹7,000 or minimum wage.
 */
import { frac, gcd, inr, num, rs } from "../rng";
import { options, textOptions, type Generator } from "./common";

const r2 = (v: number) => Math.round(v * 100) / 100;

/* ───────────────────────── Accounting ───────────────────────── */

const depSLM: Generator = {
  id: "dep-slm",
  topic: "Depreciation",
  make(r, lvl) {
    const life = r.pick([4, 5, 8, 10]);
    const cost = r.int(10, 90) * 5000;
    const inst = lvl === 1 ? 0 : r.int(2, 12) * 1000;
    const scrap = r.int(1, 8) * 2000;
    const dep = (cost + inst - scrap) / life;
    if (!Number.isInteger(dep)) return depSLM.make(r, lvl);
    const asset = r.pick(["a machine", "a delivery van", "office furniture", "a generator set", "a computer server"]);
    return {
      topic: "Depreciation",
      q: `${asset[0]!.toUpperCase()}${asset.slice(1)} is purchased for ${rs(cost)}${inst ? ` and ${rs(inst)} is spent on its installation` : ""}. Its estimated useful life is ${life} years with a residual value of ${rs(scrap)}. Annual depreciation under the Straight Line Method is:`,
      o: options(dep, [(cost - scrap) / life, (cost + inst) / life, (cost + inst + scrap) / life], (v) => rs(Math.round(v)), 500),
      x: `SLM depreciation = (Cost + installation − residual value) / useful life.\n= (${inr(cost)}${inst ? ` + ${inr(inst)}` : ""} − ${inr(scrap)}) / ${life} = ${inr(cost + inst - scrap)} / ${life} = ${rs(dep)} per year.\nInstallation is capitalised as part of cost (AS 10 / Ind AS 16).`,
    };
  },
};

const depWDV: Generator = {
  id: "dep-wdv",
  topic: "Depreciation",
  make(r, lvl) {
    const cost = r.int(4, 40) * 10000;
    const rate = r.pick([10, 15, 20, 25]);
    const n = lvl === 1 ? 2 : 3;
    const bv = cost * (1 - rate / 100) ** n;
    return {
      topic: "Depreciation",
      q: `Machinery costing ${rs(cost)} is depreciated at ${rate}% per annum on the Written Down Value method. Its book value at the end of ${n} years will be:`,
      o: options(r2(bv), [cost - (cost * rate * n) / 100, r2(cost * (1 - rate / 100) ** (n - 1)), r2(bv - (cost * rate) / 100 / 2)], (v) => rs(r2(v)), 1000),
      x: `WDV: depreciation each year is charged on the opening book value.\nBook value = Cost × (1 − r)ⁿ = ${inr(cost)} × (${num(1 - rate / 100, 2)})^${n} = ${rs(r2(bv))}.\n(SLM at the same rate would give ${rs(cost - (cost * rate * n) / 100)}.)`,
    };
  },
};

const grossProfit: Generator = {
  id: "gross-profit",
  topic: "Final Accounts",
  make(r, lvl) {
    const os = r.int(2, 12) * 5000;
    const pur = r.int(20, 80) * 5000;
    const ret = lvl >= 2 ? r.int(1, 6) * 1000 : 0;
    const carr = lvl >= 2 ? r.int(1, 5) * 1000 : 0;
    const cs = r.int(2, 14) * 5000;
    const cogs = os + pur - ret + carr - cs;
    const sales = cogs + r.int(4, 30) * 2500;
    const salesRet = lvl === 3 ? r.int(1, 4) * 1000 : 0;
    const gp = sales - salesRet - cogs;
    return {
      topic: "Final Accounts",
      q: `From the following, compute Gross Profit: Opening stock ${rs(os)}; Purchases ${rs(pur)}${ret ? `; Purchase returns ${rs(ret)}` : ""}${carr ? `; Carriage inwards ${rs(carr)}` : ""}; Sales ${rs(sales)}${salesRet ? `; Sales returns ${rs(salesRet)}` : ""}; Closing stock ${rs(cs)}.`,
      o: options(gp, [gp + 2 * ret, gp + carr, sales - (os + pur - cs), gp - 2 * cs / 5], (v) => rs(v), 1000, true),
      x: `Cost of goods sold = Opening stock + Purchases${ret ? " − Purchase returns" : ""}${carr ? " + Carriage inwards" : ""} − Closing stock\n= ${inr(os)} + ${inr(pur)}${ret ? ` − ${inr(ret)}` : ""}${carr ? ` + ${inr(carr)}` : ""} − ${inr(cs)} = ${rs(cogs)}.\nGross profit = Net sales − COGS = ${inr(sales)}${salesRet ? ` − ${inr(salesRet)}` : ""} − ${inr(cogs)} = ${rs(gp)}.\nCarriage inwards is a direct expense (Trading A/c).`,
    };
  },
};

const currentRatio: Generator = {
  id: "current-ratio",
  topic: "Ratio Analysis",
  make(r, lvl) {
    const cash = r.int(2, 10) * 5000, debt = r.int(4, 20) * 5000, stock = r.int(4, 20) * 5000, pre = r.int(1, 4) * 2500;
    const cred = r.int(4, 16) * 5000, bp = r.int(1, 6) * 2500, oe = r.int(1, 4) * 2500;
    const ca = cash + debt + stock + pre, cl = cred + bp + oe;
    if (lvl <= 2) {
      const cr = ca / cl;
      return {
        topic: "Ratio Analysis",
        q: `A firm has Cash ${rs(cash)}, Debtors ${rs(debt)}, Inventory ${rs(stock)}, Prepaid expenses ${rs(pre)}, Creditors ${rs(cred)}, Bills payable ${rs(bp)} and Outstanding expenses ${rs(oe)}. Its current ratio is:`,
        o: options(r2(cr), [r2((ca - stock - pre) / cl), r2(cl / ca), r2(ca / cred)], (v) => `${num(v)} : 1`, 0.25),
        x: `Current assets = ${inr(cash)} + ${inr(debt)} + ${inr(stock)} + ${inr(pre)} = ${rs(ca)}.\nCurrent liabilities = ${inr(cred)} + ${inr(bp)} + ${inr(oe)} = ${rs(cl)}.\nCurrent ratio = ${inr(ca)} / ${inr(cl)} = ${num(cr)} : 1 (ideal benchmark 2 : 1).`,
      };
    }
    const qa = cash + debt;
    const qr = qa / cl;
    return {
      topic: "Ratio Analysis",
      q: `A firm has Cash ${rs(cash)}, Debtors ${rs(debt)}, Inventory ${rs(stock)}, Prepaid expenses ${rs(pre)}, Creditors ${rs(cred)}, Bills payable ${rs(bp)} and Outstanding expenses ${rs(oe)}. Its quick (acid-test) ratio is:`,
      o: options(r2(qr), [r2(ca / cl), r2((qa + pre) / cl), r2((qa + stock) / cl)], (v) => `${num(v)} : 1`, 0.2),
      x: `Quick assets exclude inventory and prepaid expenses: ${inr(cash)} + ${inr(debt)} = ${rs(qa)}.\nCurrent liabilities = ${rs(cl)}.\nQuick ratio = ${inr(qa)} / ${inr(cl)} = ${num(qr)} : 1 (benchmark 1 : 1).`,
    };
  },
};

const workingCapital: Generator = {
  id: "working-capital",
  topic: "Ratio Analysis",
  make(r) {
    const cr = r.pick([2, 2.5, 3, 1.5, 1.75]);
    const cl = r.int(4, 40) * 5000;
    const ca = cr * cl;
    const wc = ca - cl;
    return {
      topic: "Ratio Analysis",
      q: `The current ratio of a company is ${cr} : 1 and its working capital is ${rs(wc)}. Its current assets amount to:`,
      o: options(ca, [cl, wc * cr, ca + cl], (v) => rs(v), 5000),
      x: `Let current liabilities = x. Then current assets = ${cr}x and working capital = ${cr}x − x = ${num(cr - 1)}x.\n${num(cr - 1)}x = ${inr(wc)} → x = ${rs(cl)}.\nCurrent assets = ${cr} × ${inr(cl)} = ${rs(ca)}.`,
    };
  },
};

const brs: Generator = {
  id: "brs",
  topic: "Bank Reconciliation",
  make(r, lvl) {
    const cb = r.int(10, 80) * 1000;
    const unp = r.int(2, 12) * 500;
    const unc = r.int(2, 12) * 500;
    const chg = lvl >= 2 ? r.int(1, 8) * 50 : 0;
    const intr = lvl === 3 ? r.int(2, 9) * 100 : 0;
    const pb = cb + unp - unc - chg + intr;
    return {
      topic: "Bank Reconciliation",
      q: `The cash book of a firm shows a debit (bank) balance of ${rs(cb)}. Cheques issued but not yet presented: ${rs(unp)}; cheques deposited but not yet credited: ${rs(unc)}${chg ? `; bank charges debited only in the pass book: ${rs(chg)}` : ""}${intr ? `; interest credited only in the pass book: ${rs(intr)}` : ""}. The balance as per the pass book is:`,
      o: options(pb, [cb - unp + unc + chg - intr, cb + unp + unc, cb - unp - unc], (v) => rs(v), 100),
      x: `Start with cash book balance ${rs(cb)}.\n+ Cheques issued not presented (bank has not yet paid) ${inr(unp)}\n− Cheques deposited not credited ${inr(unc)}${chg ? `\n− Bank charges ${inr(chg)}` : ""}${intr ? `\n+ Interest credited ${inr(intr)}` : ""}\nPass book balance = ${rs(pb)}.`,
    };
  },
};

const interestDrawings: Generator = {
  id: "interest-drawings",
  topic: "Partnership Accounts",
  make(r, lvl) {
    const rate = r.pick([6, 8, 9, 10, 12]);
    if (lvl === 1) {
      const cap = r.int(4, 40) * 10000;
      const add = r.int(1, 8) * 10000;
      const months = r.pick([3, 4, 6, 9]);
      const ic = (cap * rate) / 100 + (add * rate * months) / 1200;
      return {
        topic: "Partnership Accounts",
        q: `A partner's capital on 1 April was ${rs(cap)}. The partner introduced additional capital of ${rs(add)} on ${["", "", "", "1 January", "1 December", "", "1 October", "", "", "1 July"][months] ?? "1 October"} (financial year ends 31 March). Interest on capital is allowed at ${rate}% p.a. The interest for the year is:`,
        o: options(ic, [((cap + add) * rate) / 100, (cap * rate) / 100, ic + (add * rate) / 200], (v) => rs(Math.round(v)), 100),
        x: `Interest on opening capital = ${inr(cap)} × ${rate}% = ${rs((cap * rate) / 100)}.\nAdditional capital earns interest for ${months} months = ${inr(add)} × ${rate}% × ${months}/12 = ${rs((add * rate * months) / 1200)}.\nTotal = ${rs(Math.round(ic))}.`,
      };
    }
    const d = r.int(2, 12) * 500;
    const when = lvl === 2 ? r.pick(["beginning", "end"]) : "middle";
    const m = when === "beginning" ? 6.5 : when === "end" ? 5.5 : 6;
    const ans = (d * 12 * rate * m) / 1200;
    return {
      topic: "Partnership Accounts",
      q: `A partner withdrew ${rs(d)} at the ${when} of every month during the year. Interest on drawings is charged at ${rate}% p.a. The interest on drawings is:`,
      o: options(ans, [(d * 12 * rate * 6) / 1200, (d * 12 * rate * (m === 6.5 ? 5.5 : 6.5)) / 1200, (d * 12 * rate) / 100], (v) => rs(r2(v)), 25),
      x: `Total drawings = 12 × ${inr(d)} = ${rs(12 * d)}.\nAverage period for monthly drawings made at the ${when} of each month = ${m} months.\nInterest = ${inr(12 * d)} × ${rate}% × ${m}/12 = ${rs(r2(ans))}.`,
    };
  },
};

const goodwill: Generator = {
  id: "goodwill",
  topic: "Goodwill",
  make(r, lvl) {
    if (lvl <= 2) {
      const profits = [...Array(lvl === 1 ? 3 : 4)].map(() => r.int(20, 90) * 1000);
      const yp = r.pick([2, 2.5, 3, 4]);
      const avg = profits.reduce((a, b) => a + b, 0) / profits.length;
      const gw = avg * yp;
      return {
        topic: "Goodwill",
        q: `The profits of a firm for the last ${profits.length} years were ${profits.map((p) => rs(p)).join(", ")}. Goodwill is to be valued at ${yp} years' purchase of the average profit. Goodwill is:`,
        o: options(r2(gw), [r2(profits[profits.length - 1]! * yp), r2(avg), r2((profits.reduce((a, b) => a + b, 0) / (profits.length - 1)) * yp)], (v) => rs(Math.round(v)), 1000),
        x: `Average profit = (${profits.map((p) => inr(p)).join(" + ")}) / ${profits.length} = ${rs(r2(avg))}.\nGoodwill = ${inr(r2(avg))} × ${yp} = ${rs(Math.round(gw))}.`,
      };
    }
    const cap = r.int(20, 100) * 10000;
    const nr = r.pick([8, 10, 12, 15]);
    const avgP = (cap * nr) / 100 + r.int(5, 40) * 1000;
    const yp = r.pick([2, 3, 4]);
    const sp = avgP - (cap * nr) / 100;
    return {
      topic: "Goodwill",
      q: `A firm earns an average profit of ${rs(avgP)} on capital employed of ${rs(cap)}. The normal rate of return in the industry is ${nr}%. Goodwill at ${yp} years' purchase of super profit is:`,
      o: options(sp * yp, [avgP * yp, sp, (cap * nr * yp) / 100], (v) => rs(v), 1000),
      x: `Normal profit = ${inr(cap)} × ${nr}% = ${rs((cap * nr) / 100)}.\nSuper profit = ${inr(avgP)} − ${inr((cap * nr) / 100)} = ${rs(sp)}.\nGoodwill = ${inr(sp)} × ${yp} = ${rs(sp * yp)}.`,
    };
  },
};

const newRatio: Generator = {
  id: "new-ratio",
  topic: "Partnership Accounts",
  make(r) {
    const a = r.int(2, 5), b = r.int(1, 4);
    if (a === b || gcd(a, b) !== 1) return newRatio.make(r, 1);
    const x = r.pick([4, 5, 6, 8]);
    // C gets 1/x, A & B share remaining (x-1)/x in a:b
    const den = (a + b) * x;
    const A = a * (x - 1), B = b * (x - 1), C = a + b;
    const g = gcd(gcd(A, B), C);
    const ans = `${A / g} : ${B / g} : ${C / g}`;
    return {
      topic: "Partnership Accounts",
      q: `P and Q share profits in the ratio ${a} : ${b}. They admit R for a 1/${x} share, which R acquires from P and Q in their existing ratio. The new profit-sharing ratio of P, Q and R is:`,
      o: textOptions(ans, [`${a} : ${b} : 1`, `${a * x} : ${b * x} : ${a + b}`, `${B / g} : ${A / g} : ${C / g}`], () => `${r.int(1, 9)} : ${r.int(1, 9)} : ${r.int(1, 5)}`),
      x: `Remaining share for P and Q = 1 − 1/${x} = ${x - 1}/${x}, divided ${a} : ${b}.\nP = ${x - 1}/${x} × ${a}/${a + b} = ${A}/${den}; Q = ${x - 1}/${x} × ${b}/${a + b} = ${B}/${den}; R = 1/${x} = ${C}/${den}.\nNew ratio = ${A} : ${B} : ${C} = ${ans}.`,
    };
  },
};

const accEquation: Generator = {
  id: "acc-equation",
  topic: "Accounting Equation",
  make(r, lvl) {
    if (lvl === 1) {
      const assets = r.int(20, 200) * 5000;
      const liab = r.int(5, Math.floor(assets / 5000) - 2) * 5000;
      return {
        topic: "Accounting Equation",
        q: `A business has total assets of ${rs(assets)} and outside liabilities of ${rs(liab)}. Its capital (owner's equity) is:`,
        o: options(assets - liab, [assets + liab, liab, assets], (v) => rs(v), 5000),
        x: `Assets = Liabilities + Capital → Capital = ${inr(assets)} − ${inr(liab)} = ${rs(assets - liab)}.`,
      };
    }
    const open = r.int(10, 80) * 5000;
    const addl = r.int(1, 10) * 5000;
    const draw = r.int(1, 8) * 2500;
    const profit = r.int(2, 20) * 5000;
    const close = open + addl + profit - draw;
    return {
      topic: "Accounting Equation",
      q: `A trader's capital at the beginning of the year was ${rs(open)} and at the end ${rs(close)}. During the year he introduced fresh capital of ${rs(addl)} and withdrew ${rs(draw)} for personal use. His profit for the year is:`,
      o: options(profit, [close - open, close - open + addl + draw, profit + 2 * draw], (v) => rs(v), 2500, true),
      x: `Profit = Closing capital + Drawings − Additional capital − Opening capital\n= ${inr(close)} + ${inr(draw)} − ${inr(addl)} − ${inr(open)} = ${rs(profit)} (statement of affairs method).`,
    };
  },
};

const turnoverRatios: Generator = {
  id: "turnover-ratios",
  topic: "Ratio Analysis",
  make(r, lvl) {
    if (lvl === 1) {
      const sales = r.int(20, 100) * 10000;
      const gpPct = r.pick([20, 25, 30, 40]);
      const gp = (sales * gpPct) / 100;
      return {
        topic: "Ratio Analysis",
        q: `Net sales are ${rs(sales)} and the cost of goods sold is ${rs(sales - gp)}. The gross profit ratio is:`,
        o: options(gpPct, [(gp / (sales - gp)) * 100, 100 - gpPct, gpPct / 2], (v) => `${num(v)}%`, 5),
        x: `Gross profit = ${inr(sales)} − ${inr(sales - gp)} = ${rs(gp)}.\nGP ratio = GP / Net sales × 100 = ${gpPct}%. (Dividing by COGS gives mark-up, not GP ratio.)`,
      };
    }
    const os = r.int(4, 20) * 5000, cs = r.int(4, 20) * 5000;
    const avg = (os + cs) / 2;
    const t = r.pick([4, 5, 6, 8, 10]);
    const cogs = avg * t;
    return {
      topic: "Ratio Analysis",
      q: `Opening inventory is ${rs(os)}, closing inventory is ${rs(cs)} and cost of goods sold for the year is ${rs(cogs)}. The inventory turnover ratio is:`,
      o: options(t, [r2(cogs / cs), r2(cogs / os), t + 2], (v) => `${num(v)} times`, 1),
      x: `Average inventory = (${inr(os)} + ${inr(cs)}) / 2 = ${rs(avg)}.\nInventory turnover = COGS / Average inventory = ${inr(cogs)} / ${inr(avg)} = ${t} times.`,
    };
  },
};

const breakEven: Generator = {
  id: "break-even",
  topic: "Cost Accounting",
  make(r, lvl) {
    const sp = r.int(10, 60) * 5, vc = sp - r.int(2, 8) * 5;
    const cpu = sp - vc;
    const units = r.int(10, 80) * 100;
    const fc = cpu * units;
    if (lvl === 1) {
      return {
        topic: "Cost Accounting",
        q: `Fixed costs are ${rs(fc)}, selling price is ₹${sp} per unit and variable cost is ₹${vc} per unit. The break-even point in units is:`,
        o: options(units, [Math.round(fc / sp), Math.round(fc / vc), units * 2], (v) => `${inr(Math.round(v))} units`, 100),
        x: `Contribution per unit = ${sp} − ${vc} = ₹${cpu}.\nBEP (units) = Fixed cost / Contribution per unit = ${inr(fc)} / ${cpu} = ${inr(units)} units.`,
      };
    }
    const pv = (cpu / sp) * 100;
    if (lvl === 2) {
      return {
        topic: "Cost Accounting",
        q: `A product sells at ₹${sp} with a variable cost of ₹${vc} per unit. Fixed costs are ${rs(fc)}. The break-even sales (in ₹) are:`,
        o: options(fc / (cpu / sp), [fc, units * vc, fc / (vc / sp)], (v) => rs(Math.round(v)), 1000),
        x: `P/V ratio = Contribution/Sales = ${cpu}/${sp} = ${num(pv)}%.\nBEP sales = Fixed cost / P/V ratio = ${inr(fc)} / ${num(cpu / sp, 4)} = ${rs(Math.round(fc / (cpu / sp)))}.`,
      };
    }
    const target = r.int(2, 20) * cpu * 100;
    const need = (fc + target) / cpu;
    return {
      topic: "Cost Accounting",
      q: `Fixed costs are ${rs(fc)}; selling price ₹${sp} and variable cost ₹${vc} per unit. How many units must be sold to earn a profit of ${rs(target)}?`,
      o: options(need, [units, target / cpu, (fc + target) / sp], (v) => `${inr(Math.round(v))} units`, 100),
      x: `Required units = (Fixed cost + Target profit) / Contribution per unit\n= (${inr(fc)} + ${inr(target)}) / ${cpu} = ${inr(need)} units.`,
    };
  },
};

const fifo: Generator = {
  id: "fifo",
  topic: "Inventory Valuation",
  make(r) {
    const lots = [
      { q: r.int(2, 6) * 50, p: r.int(10, 20) },
      { q: r.int(2, 6) * 50, p: 0 },
      { q: r.int(2, 6) * 50, p: 0 },
    ];
    lots[1]!.p = lots[0]!.p + r.int(1, 4);
    lots[2]!.p = lots[1]!.p + r.int(1, 4);
    const total = lots.reduce((a, l) => a + l.q, 0);
    const issue = r.int(Math.ceil(lots[0]!.q / 50) + 1, Math.floor((total - 50) / 50)) * 50;
    // FIFO: closing stock is from latest lots
    let rem = total - issue;
    let val = 0;
    const parts: string[] = [];
    for (let i = 2; i >= 0 && rem > 0; i--) {
      const take = Math.min(rem, lots[i]!.q);
      val += take * lots[i]!.p;
      parts.push(`${take} × ₹${lots[i]!.p}`);
      rem -= take;
    }
    // LIFO closing for distractor
    let rem2 = total - issue;
    let lifo = 0;
    for (let i = 0; i < 3 && rem2 > 0; i++) {
      const take = Math.min(rem2, lots[i]!.q);
      lifo += take * lots[i]!.p;
      rem2 -= take;
    }
    const avgP = lots.reduce((a, l) => a + l.q * l.p, 0) / total;
    return {
      topic: "Inventory Valuation",
      q: `Purchases during a month: ${lots.map((l, i) => `${["1st", "10th", "20th"][i]} — ${l.q} units @ ₹${l.p}`).join("; ")}. ${issue} units were issued on the 25th. Value of closing stock under FIFO is:`,
      o: options(val, [lifo, Math.round(avgP * (total - issue)), val + 50 * lots[0]!.p], (v) => rs(v), 50),
      x: `Under FIFO the earliest units are issued first, so the ${total - issue} units left come from the latest purchases: ${parts.join(" + ")} = ${rs(val)}.`,
    };
  },
};

/* ───────────────────────── Social security ───────────────────────── */

const epfSplit: Generator = {
  id: "epf-split",
  topic: "EPF & EPS Contributions",
  make(r, lvl) {
    const w = r.int(16, 30) * 500;
    const ceil = Math.min(w, 15000);
    const ee = Math.round(0.12 * w);
    const eps = Math.round(0.0833 * ceil);
    const erEpf = Math.round(0.12 * w) - eps;
    if (lvl < 3) {
      return {
        topic: "EPF & EPS Contributions",
        q: `An employee's monthly basic wages plus DA are ${rs(w)}. Of the employer's 12% contribution, how much is credited to the Employees' Pension Scheme (EPS) account?`,
        o: options(eps, [Math.round(0.0367 * w), ee, Math.round(0.0833 * w) + 100], (v) => rs(v), 50),
        x: `Employer's 12% = ${rs(Math.round(0.12 * w))}. Of this, 8.33% of wages (on a wage ceiling of ₹15,000) goes to EPS: 8.33% × ${inr(ceil)} = ${rs(eps)}.\nThe balance ${rs(erEpf)} (3.67%) goes to the EPF account. The employee's own 12% (${rs(ee)}) goes entirely to EPF.`,
      };
    }
    const wHigh = r.int(36, 80) * 500;
    const epsH = 1250;
    const erH = Math.round(0.12 * wHigh) - epsH;
    return {
      topic: "EPF & EPS Contributions",
      q: `An employee draws basic wages plus DA of ${rs(wHigh)} per month and both employer and employee contribute 12% on actual wages. How much of the employer's share goes to the EPF (provident fund) account each month?`,
      o: options(erH, [Math.round(0.0367 * wHigh), Math.round(0.12 * wHigh), Math.round(0.12 * wHigh) - Math.round(0.0833 * wHigh)], (v) => rs(v), 50),
      x: `Employer's 12% of ${inr(wHigh)} = ${rs(Math.round(0.12 * wHigh))}.\nEPS share is capped at 8.33% of ₹15,000 = ₹1,250.\nEPF share = ${inr(Math.round(0.12 * wHigh))} − 1,250 = ${rs(erH)}.`,
    };
  },
};

const gratuity: Generator = {
  id: "gratuity",
  topic: "Gratuity",
  make(r, lvl) {
    const wage = r.int(10, 90) * 1000;
    const yrs = r.int(6, 30);
    const months = lvl === 1 ? 0 : r.int(1, 11);
    const counted = yrs + (months > 6 ? 1 : 0);
    const g = Math.round((15 / 26) * wage * counted);
    return {
      topic: "Gratuity",
      q: `An employee retires after ${yrs} years${months ? ` and ${months} months` : ""} of continuous service. Last drawn monthly wages (basic + DA) are ${rs(wage)}. Gratuity payable under the statutory formula (non-seasonal establishment) is:`,
      o: options(g, [Math.round((15 / 30) * wage * counted), Math.round((15 / 26) * wage * (months > 6 ? yrs : yrs + 1)), Math.round((15 / 26) * wage * yrs * 1.1)], (v) => rs(v), 1000),
      x: `Gratuity = 15/26 × last drawn wages × completed years of service.\n${months ? `${months} months is ${months > 6 ? "more than six months, so it counts as a full year" : "not more than six months, so it is ignored"} → ${counted} years.\n` : ""}= 15/26 × ${inr(wage)} × ${counted} = ${rs(g)} (well within the ₹20 lakh ceiling).\nThe divisor 26 reflects working days in a month.`,
    };
  },
};

const esi: Generator = {
  id: "esi",
  topic: "ESI Contributions",
  make(r, lvl) {
    const w = r.int(20, 42) * 500;
    const ee = Math.ceil(w * 0.0075);
    const er = Math.ceil(w * 0.0325);
    const total = ee + er;
    if (lvl <= 2) {
      return {
        topic: "ESI Contributions",
        q: `An insured employee earns gross wages of ${rs(w)} in a month. What is the total ESI contribution (employer + employee) payable for that month?`,
        o: options(total, [Math.round(w * 0.0475), er, Math.round(w * 0.065)], (v) => rs(v), 10),
        x: `Employee share 0.75% = ${rs(w * 0.0075)} → ${rs(ee)}; employer share 3.25% = ${rs(w * 0.0325)} → ${rs(er)} (rounded up to the next rupee).\nTotal = ${rs(total)} (4% of wages; rates in force since 1 July 2019).`,
      };
    }
    return {
      topic: "ESI Contributions",
      q: `An employee whose average daily wage is ₹${r.int(140, 175)} works in an ESI-covered factory and earns ${rs(w)} in a month. Which statement about the month's contribution is correct?`,
      o: [
        `Only the employer pays 3.25% (≈ ${rs(er)}); the employee's share is exempt`,
        `Both pay — employee 0.75% and employer 3.25%`,
        `Neither pays, as low-wage employees are excluded from coverage`,
        `Only the employee pays 0.75%`,
      ],
      x: `Employees whose average daily wage is up to ₹176 are exempt from paying their own 0.75% share, but they remain covered and the employer must still pay 3.25% of wages. Here employer share ≈ ${rs(er)}.`,
    };
  },
};

const bonus: Generator = {
  id: "bonus",
  topic: "Payment of Bonus",
  make(r, lvl) {
    const minWage = r.pick([6000, 6500, 8000, 9500, 11000]);
    const salary = r.int(12, 40) * 500;
    const pct = lvl === 1 ? 8.33 : r.pick([10, 12, 15, 20]);
    const base = Math.min(salary, Math.max(7000, minWage));
    const ann = Math.round((base * 12 * pct) / 100);
    return {
      topic: "Payment of Bonus",
      q: `An eligible employee earns ${rs(salary)} per month. The notified minimum wage for the employment is ${rs(minWage)} per month. If the establishment declares bonus at ${pct}%, the annual bonus payable is (statutory computation):`,
      o: options(ann, [Math.round((salary * 12 * pct) / 100), Math.round((7000 * 12 * pct) / 100) === ann ? Math.round((minWage * 12 * pct) / 100) + 500 : Math.round((7000 * 12 * pct) / 100), Math.round((base * pct) / 100) * 11], (v) => rs(v), 100),
      x: `For computing bonus, salary is capped at ₹7,000 or the minimum wage, whichever is higher: max(7,000, ${inr(minWage)}) = ${rs(Math.max(7000, minWage))}.\nSalary for computation = min(${inr(salary)}, ${inr(Math.max(7000, minWage))}) = ${rs(base)}.\nAnnual bonus = ${inr(base)} × 12 × ${pct}% = ${rs(ann)}. Bonus must lie between 8.33% and 20%.`,
    };
  },
};

const epsPension: Generator = {
  id: "eps-pension",
  topic: "EPS-1995 Pension",
  make(r, lvl) {
    const sal = lvl === 1 ? 15000 : r.int(16, 30) * 500;
    const svc = r.int(10, 35);
    const pen = Math.round((sal * svc) / 70);
    return {
      topic: "EPS-1995 Pension",
      q: `Under the Employees' Pension Scheme, 1995, a member retires at 58 with pensionable salary of ${rs(sal)} and pensionable service of ${svc} years (including any weightage). The monthly member pension is:`,
      o: options(pen, [Math.round((sal * svc) / 60), Math.round((sal * svc) / 100), Math.round(sal / 2)], (v) => rs(v), 50),
      x: `Monthly pension = (Pensionable salary × Pensionable service) / 70\n= (${inr(sal)} × ${svc}) / 70 = ${rs(pen)}.\nPensionable salary is the average of the last 60 months' wages (subject to the ₹15,000 ceiling), and the minimum pension is ₹1,000.`,
    };
  },
};

const maternity: Generator = {
  id: "maternity",
  topic: "Maternity Benefit",
  make(r) {
    const adw = r.int(30, 90) * 10;
    const weeks = r.pick([26, 12]);
    const days = weeks * 7;
    const amt = adw * days;
    return {
      topic: "Maternity Benefit",
      q: `A woman employee entitled to ${weeks} weeks of maternity benefit has an average daily wage of ₹${adw}. Following the Supreme Court's view in B. Shah v. Presiding Officer (1977) that the benefit covers all days of the period, the total maternity benefit is:`,
      o: options(amt, [adw * weeks * 6, adw * weeks * 5, adw * 30 * Math.round(weeks / 4.33)], (v) => rs(v), 1000),
      x: `The benefit is paid for every day of the ${weeks}-week period including Sundays: ${weeks} × 7 = ${days} days.\nAmount = ₹${adw} × ${days} = ${rs(amt)}. (Using 6 days/week would wrongly give ${rs(adw * weeks * 6)}.)`,
    };
  },
};

/* ───────────────────────── Economy ───────────────────────── */

const nationalIncome: Generator = {
  id: "national-income",
  topic: "National Income",
  make(r, lvl) {
    if (lvl === 1) {
      const gdp = r.int(150, 400) * 1000;
      const nfia = r.int(-60, 60) * 100;
      const dep = r.int(10, 40) * 1000;
      const nnp = gdp + nfia - dep;
      return {
        topic: "National Income",
        q: `In an economy, GDP at market prices is ₹${inr(gdp)} crore, net factor income from abroad is ₹${inr(nfia)} crore and depreciation is ₹${inr(dep)} crore. NNP at market prices is:`,
        o: options(nnp, [gdp - dep, gdp + nfia, gdp - nfia - dep], (v) => `₹${inr(v)} crore`, 1000),
        x: `GNP = GDP + NFIA = ${inr(gdp)} ${nfia >= 0 ? "+" : "−"} ${inr(Math.abs(nfia))} = ${inr(gdp + nfia)}.\nNNP = GNP − Depreciation = ${inr(gdp + nfia)} − ${inr(dep)} = ₹${inr(nnp)} crore.`,
      };
    }
    if (lvl === 2) {
      const real = r.int(100, 300) * 1000;
      const defl = r.pick([110, 115, 120, 125, 130, 140, 150]);
      const nominal = (real * defl) / 100;
      return {
        topic: "National Income",
        q: `Nominal GDP of a country is ₹${inr(nominal)} crore and real GDP (at base-year prices) is ₹${inr(real)} crore. The GDP deflator is:`,
        o: options(defl, [Math.round((real / nominal) * 10000) / 100, defl - 100, defl + 10], (v) => num(v), 5),
        x: `GDP deflator = (Nominal GDP / Real GDP) × 100 = (${inr(nominal)} / ${inr(real)}) × 100 = ${defl}.\nPrices have risen ${defl - 100}% over the base year.`,
      };
    }
    const re = r.int(30, 60) * 1000, rr = r.int(20, 50) * 1000, ndcr = r.int(1, 5) * 1000, ce = r.int(5, 15) * 1000, ip = r.int(8, 20) * 1000;
    const te = re + ce;
    const fd = te - rr - ndcr;
    if (fd <= ip) return nationalIncome.make(r, 2);
    const kind = r.pick(["fiscal", "primary", "revenue"]);
    const ans = kind === "fiscal" ? fd : kind === "primary" ? fd - ip : re - rr;
    return {
      topic: "Fiscal Policy",
      q: `Budget data (₹ crore): Revenue receipts ${inr(rr)}; Non-debt capital receipts ${inr(ndcr)}; Revenue expenditure ${inr(re)} (of which interest payments ${inr(ip)}); Capital expenditure ${inr(ce)}. The ${kind} deficit is:`,
      o: options(ans, [fd, fd - ip, re - rr, te - rr], (v) => `₹${inr(v)} crore`, 1000),
      x: `Total expenditure = ${inr(re)} + ${inr(ce)} = ${inr(te)}.\nFiscal deficit = Total expenditure − (Revenue receipts + Non-debt capital receipts) = ${inr(te)} − ${inr(rr + ndcr)} = ${inr(fd)}.\nPrimary deficit = Fiscal deficit − Interest = ${inr(fd - ip)}.\nRevenue deficit = Revenue expenditure − Revenue receipts = ${inr(re - rr)}.\nAnswer (${kind}): ₹${inr(ans)} crore.`,
    };
  },
};

const moneyInflation: Generator = {
  id: "money-inflation",
  topic: "Money & Inflation",
  make(r, lvl) {
    if (lvl === 1) {
      const c0 = r.int(150, 200) + r.int(0, 9) / 10;
      const infl = r.pick([3, 4, 5, 6, 7, 8]);
      const c1 = Math.round(c0 * (1 + infl / 100) * 10) / 10;
      const real = ((c1 - c0) / c0) * 100;
      return {
        topic: "Money & Inflation",
        q: `A consumer price index rose from ${c0} to ${c1} over a year. The inflation rate (rounded to one decimal) is:`,
        o: options(Math.round(real * 10) / 10, [Math.round((c1 - c0) * 10) / 10, Math.round(((c1 - c0) / c1) * 1000) / 10, Math.round(real * 10) / 10 + 1], (v) => `${num(v, 1)}%`, 0.5),
        x: `Inflation = (New index − Old index)/Old index × 100 = (${c1} − ${c0})/${c0} × 100 ≈ ${num(real, 1)}%.`,
      };
    }
    if (lvl === 2) {
      const nom = r.pick([7, 8, 9, 10, 11, 12]);
      const inf = r.pick([3, 4, 5, 6]);
      const real = nom - inf;
      return {
        topic: "Money & Inflation",
        q: `A fixed deposit pays ${nom}% per annum while inflation is ${inf}%. Using the Fisher approximation, the real rate of interest is about:`,
        o: options(real, [nom + inf, nom / inf, inf], (v) => `${num(v)}%`, 1),
        x: `Fisher approximation: real rate ≈ nominal rate − inflation = ${nom} − ${inf} = ${real}%.\n(Exact: (1.${String(nom).padStart(2, "0")}/1.0${inf} − 1) × 100 ≈ ${num(((1 + nom / 100) / (1 + inf / 100) - 1) * 100)}%.)`,
      };
    }
    const crr = r.pick([4, 5, 8, 10, 20]);
    const dep = r.int(1, 20) * 100;
    const mult = 100 / crr;
    return {
      topic: "Money & Inflation",
      q: `In a simple banking model, the cash reserve ratio is ${crr}% and banks keep no excess reserves. A fresh deposit of ₹${dep} crore can lead to a maximum total deposit creation of:`,
      o: options(dep * mult, [dep * crr, dep / crr, dep * (mult - 1)], (v) => `₹${inr(v)} crore`, 100),
      x: `Deposit (money) multiplier = 1 / CRR = 1 / ${crr / 100} = ${num(mult)}.\nTotal deposits = ${dep} × ${num(mult)} = ₹${inr(dep * mult)} crore (of which new credit = ₹${inr(dep * (mult - 1))} crore).`,
    };
  },
};

export const ACCOUNTING_GENERATORS: Generator[] = [
  depSLM, depWDV, grossProfit, currentRatio, workingCapital, brs, interestDrawings, goodwill, newRatio, accEquation, turnoverRatios, breakEven, fifo,
];
export const SOCIAL_GENERATORS: Generator[] = [epfSplit, gratuity, esi, bonus, epsPension, maternity];
export const ECONOMY_GENERATORS: Generator[] = [nationalIncome, moneyInflation];

export { frac };
