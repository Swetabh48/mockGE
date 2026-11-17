import { Bank, nearYears } from "./dsl";

/** Economy: committees, plans, institutions (table-driven) and core concepts. */
const b = new Bank("economy1");

type C = [string, string, 1 | 2 | 3];
const COMMITTEES: C[] = [
  ["Narasimham Committee (1991, 1998)", "Banking sector reforms", 1],
  ["Suresh Tendulkar Committee (2009)", "Methodology for estimating poverty", 2],
  ["C. Rangarajan Expert Group (2014)", "Review of poverty measurement", 2],
  ["Raja Chelliah Committee (1991)", "Tax reforms", 2],
  ["Urjit Patel Committee (2014)", "Revising and strengthening the monetary policy framework", 2],
  ["Bimal Jalan Committee (2019)", "Economic capital framework of the RBI", 3],
  ["R. N. Malhotra Committee (1994)", "Reforms in the insurance sector", 2],
  ["N. K. Singh Committee (2017)", "Review of the FRBM Act", 3],
  ["Nachiket Mor Committee (2013)", "Comprehensive financial services for small businesses and low-income households", 3],
  ["Shanta Kumar Committee (2015)", "Restructuring of the Food Corporation of India", 2],
  ["M. S. Swaminathan Commission (2004–06)", "National Commission on Farmers", 1],
  ["Vijay Kelkar Committee (2015)", "Revisiting and revitalising the PPP model of infrastructure", 3],
  ["Abid Hussain Committee (1997)", "Small-scale industries", 3],
  ["A. M. Khusro Committee (1989)", "Agricultural credit system", 3],
  ["Y. V. Reddy (14th Finance Commission)", "Devolution of central taxes for 2015–20", 3],
  ["Kirit Parikh Committee (2022)", "Review of domestic gas pricing", 3],
];
const comSubjects = COMMITTEES.map((c) => c[1]);
COMMITTEES.forEach(([c, s, d], i) => {
  b.t("Committees");
  if (i % 2 === 0) b.pool(d, `The ${c} is associated with:`, s, comSubjects, `${c}: ${s}.`);
  else b.pool(d, `Which committee/body is associated with "${s}"?`, c, COMMITTEES.map((x) => x[0]), `${c} dealt with ${s.toLowerCase()}.`);
});

type P = [string, string, string, 1 | 2 | 3];
const PLANS: P[] = [
  ["First Five-Year Plan", "1951–56", "Agriculture and irrigation, based on the Harrod–Domar model", 1],
  ["Second Five-Year Plan", "1956–61", "Rapid industrialisation with heavy industries, based on the Mahalanobis model", 1],
  ["Third Five-Year Plan", "1961–66", "Self-reliant and self-generating economy; disrupted by wars and drought, followed by plan holidays", 2],
  ["Fourth Five-Year Plan", "1969–74", "Growth with stability and progressive achievement of self-reliance", 2],
  ["Fifth Five-Year Plan", "1974–78", "Removal of poverty (Garibi Hatao) and self-reliance; terminated early", 2],
  ["Sixth Five-Year Plan", "1980–85", "Poverty eradication and technological self-reliance", 3],
  ["Seventh Five-Year Plan", "1985–90", "Food, work and productivity", 3],
  ["Eighth Five-Year Plan", "1992–97", "Human resource development, in the context of economic reforms (Rao–Manmohan model)", 2],
  ["Ninth Five-Year Plan", "1997–2002", "Growth with social justice and equity", 3],
  ["Tenth Five-Year Plan", "2002–07", "Doubling per capita income in ten years; monitorable targets", 3],
  ["Eleventh Five-Year Plan", "2007–12", "Faster and more inclusive growth", 2],
  ["Twelfth Five-Year Plan", "2012–17", "Faster, more inclusive and sustainable growth", 2],
];
PLANS.forEach(([pl, per, focus, d], i) => {
  b.t("Planning");
  if (i % 2 === 0) b.pool(d, `The main thrust of the ${pl} (${per}) was:`, focus, PLANS.map((p) => p[2]), `${pl} (${per}): ${focus}.`);
  else b.pool(d, `"${focus}" was the focus of which plan?`, `${pl} (${per})`, PLANS.map((p) => `${p[0]} (${p[1]})`), `It was the ${pl} (${per}).`);
});

type I = [string, number, 1 | 2 | 3];
const INSTITUTIONS: I[] = [
  ["the Reserve Bank of India began operations", 1935, 1],
  ["the RBI was nationalised", 1949, 2],
  ["fourteen major commercial banks were nationalised", 1969, 1],
  ["six more private banks were nationalised", 1980, 2],
  ["NABARD was established", 1982, 2],
  ["SEBI was given statutory powers", 1992, 2],
  ["the Insurance Regulatory and Development Authority (IRDA) was established by an Act", 1999, 2],
  ["the Fiscal Responsibility and Budget Management Act was enacted", 2003, 2],
  ["the Foreign Exchange Management Act came into force (replacing FERA)", 2000, 3],
  ["the Goods and Services Tax was rolled out nationwide (1 July)", 2017, 1],
  ["the Insolvency and Bankruptcy Code was enacted", 2016, 2],
  ["the Monetary Policy Committee was constituted", 2016, 2],
  ["the Life Insurance Corporation of India was formed", 1956, 2],
  ["the Unit Trust of India was set up", 1964, 3],
  ["the Small Industries Development Bank of India (SIDBI) was set up", 1990, 3],
  ["the Industrial Development Bank of India (IDBI) was set up", 1964, 3],
];
INSTITUTIONS.forEach(([e, y, d], i) => {
  const ce = e[0]!.toUpperCase() + e.slice(1);
  const stem = i % 2 === 0 ? `In which year did the following happen?
${ce}.` : `${ce} — in which year?`;
  b.t("Economic Institutions").q(d, stem, [String(y), ...(nearYears(y, stem) as [string, string, string])], `${ce} in ${y}.`);
});

b.t("National Income");
b.q(1, "GDP measures the market value of all final goods and services produced:", ["Within the domestic territory of a country in a year", "By the citizens of a country anywhere in the world", "Only by the government", "Only in the manufacturing sector"], "GNP adds net factor income from abroad to GDP.");
b.q(2, "GNP is equal to:", ["GDP + Net factor income from abroad", "GDP − Depreciation", "GDP + Indirect taxes", "NDP + Subsidies"], "NNP = GNP − depreciation.");
b.q(2, "National Income in India is conventionally:", ["NNP at factor cost", "GDP at market prices", "GNP at market prices", "NDP at market prices"], "NNP at factor cost (now basic prices framework) is called national income.");
b.q(2, "GVA at basic prices plus product taxes minus product subsidies equals:", ["GDP at market prices", "NNP at factor cost", "Personal income", "Disposable income"], "India adopted GVA at basic prices from the 2011–12 series.");
b.q(1, "The current base year for India's GDP series (as used through 2025) is:", ["2011–12", "2004–05", "2017–18", "2001–02"], "MoSPI shifted from 2004–05 to 2011–12 in January 2015 and has planned a revision to 2022–23.");
b.q(2, "Which agency releases GDP estimates in India?", ["National Statistics Office (MoSPI)", "RBI", "NITI Aayog", "Ministry of Finance"], "The NSO releases advance, provisional and revised estimates.");
b.q(2, "The 'expenditure method' of measuring GDP sums:", ["Consumption + Investment + Government expenditure + Net exports", "Wages + Rent + Interest + Profit", "Value added by all sectors", "Taxes + Subsidies"], "GDP = C + I + G + (X − M).");
b.q(2, "Transfer payments such as old-age pensions are excluded from national income because:", ["They are not payments for current productive services", "They are too small", "They are paid in cash", "They are taxable"], "Including them would amount to double counting.");
b.q(3, "Which of the following is included in India's GDP?", ["Imputed rent of owner-occupied houses", "Sale of second-hand cars (full value)", "Purchase of shares", "Old-age pensions"], "Imputed rent is included; financial transactions and second-hand sales (except dealer margins) are not.");
b.q(2, "Per capita income is obtained by dividing national income by:", ["Total population", "Working population", "Number of households", "Number of taxpayers"], "It is a rough measure of average living standards.");
b.q(2, "The sector contributing the largest share of India's GVA is:", ["Services (tertiary) sector", "Agriculture", "Manufacturing", "Mining"], "Services contribute over half of GVA, while agriculture employs the largest share of workers.");
b.q(2, "'Green GDP' attempts to adjust conventional GDP for:", ["Depletion of natural resources and environmental degradation", "Agricultural output only", "Exports of green products", "Inflation"], "It reflects sustainability concerns.");

export default b.items;
