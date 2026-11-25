import { Bank } from "../bank/dsl";

/** 2025-pattern top-up items for labour, accounting and economy. */
const lab = new Bank("labour25c");
const acc = new Bank("accounting25b");
const eco = new Bank("economy25b");

lab.t("Code on Wages");
lab.q(3, "A worker paid on a weekly wage period is dismissed on Wednesday for misconduct. Under the Code on Wages, the wages due must be paid:", ["Within two working days of the dismissal", "On the last working day of that week", "Within seven days", "With the next monthly payroll"], "On removal, dismissal, retrenchment or resignation, the two-working-day rule overrides the normal wage-period schedule.");
lab.st(3, "Consider the following about Inspector-cum-Facilitators under the Code on Wages:", [
  "They may advise employers and workers on compliance.",
  "Before prosecuting a first-time contravention, they must give an opportunity to comply within a period.",
  "They are appointed by the Supreme Court.",
], [1, 2], "They are appointed by the appropriate government.");
lab.t("Industrial Relations Code");
lab.q(3, "Which statement correctly distinguishes 'lay-off' from 'retrenchment' under the IR Code?", ["Lay-off is a temporary inability to give work with the worker on the rolls; retrenchment ends the employment for reasons other than punishment", "Both end the employment permanently", "Lay-off is a disciplinary punishment", "Retrenchment requires no compensation"], "Lay-off is temporary (shortage of material, power, breakdown, etc.).");
lab.ar(3, "Voluntary retirement does not amount to retrenchment.", "Retrenchment excludes termination by voluntary retirement, superannuation and non-renewal of a fixed-term contract.", "a", "The statutory exclusions explain A.");
lab.t("OSH Code");
lab.st(3, "Consider the following duties of an employer under the OSH Code:", [
  "Ensure the workplace is free from hazards likely to cause injury or occupational disease.",
  "Provide free annual health examination to employees of a prescribed age group.",
  "Report accidents causing death or serious bodily injury to the authorities.",
], [1, 2, 3], "All three are employer duties under the Code.");
lab.t("Landmark Labour Cases");
lab.q(3, "Which judgment extended maternity benefit to women engaged on muster roll (daily wages) by a municipal body?", ["Municipal Corporation of Delhi v. Female Workers (Muster Roll), 2000", "B. Shah v. Presiding Officer, 1977", "Air India v. Nergesh Meerza, 1981", "Vishaka v. State of Rajasthan, 1997"], "The Court relied on Article 42 and CEDAW.");
lab.st(3, "Consider the following about B. Shah v. Presiding Officer, Labour Court (1977):", [
  "It concerned computation of maternity benefit.",
  "It held that the benefit is payable for all days of the period, including Sundays.",
  "It held that maternity benefit is payable only to permanent employees.",
], [1, 2], "The judgment favoured a liberal computation; it did not restrict benefit to permanent employees.");
lab.t("Labour Market & Statistics");
lab.q(3, "Which statement about 'disguised unemployment' is correct?", ["Removing some workers would not reduce total output, because their marginal productivity is near zero", "It arises when workers move between jobs", "It is captured fully by the PLFS unemployment rate", "It occurs only in manufacturing"], "Disguised unemployment hides inside employment, mostly in family agriculture.");
lab.t("ILO & International Standards");
lab.q(3, "The ILO Declaration on Fundamental Principles and Rights at Work (1998) was amended in 2022 to add:", ["A safe and healthy working environment", "A universal minimum wage", "A right to strike", "A ban on overtime"], "This made C155 and C187 fundamental conventions.");
lab.t("Trade Union Movement");
lab.st(3, "Consider the following about the Trade Unions Act, 1926 (now in the IR Code):", [
  "It granted registered unions immunity from criminal conspiracy for acts in furtherance of a trade dispute.",
  "It required political objects to be financed through a separate political fund.",
  "It made union membership compulsory for all workers.",
], [1, 2], "Membership has always been voluntary.");

acc.t("Accounting Concepts");
acc.q(3, "Expenditure of ₹2,000 on a calculator, expected to last five years, is charged to the P&L account in the year of purchase. The convention applied is:", ["Materiality", "Consistency", "Going concern", "Dual aspect"], "Small amounts may be expensed even if they benefit more than one period.");
acc.st(3, "Consider the following about the accrual concept:", [
  "Outstanding expenses must be recognised in the year to which they relate.",
  "Income received in advance is shown as income of the year of receipt.",
  "Prepaid expenses are shown as assets.",
], [1, 3], "Income received in advance is a liability, not income of the year of receipt.");
acc.t("Golden Rules & Journal Entries");
acc.q(3, "Goods costing ₹10,000 (selling price ₹12,000) were given as charity. The correct entry is:", ["Charity A/c Dr. To Purchases A/c ₹10,000", "Charity A/c Dr. To Sales A/c ₹12,000", "Drawings A/c Dr. To Purchases A/c ₹10,000", "Purchases A/c Dr. To Charity A/c ₹10,000"], "Goods given away are recorded at cost by crediting Purchases; charity by the business is an expense.");
acc.q(3, "A cheque of ₹5,000 received from Arun and deposited was dishonoured; bank charged ₹100. The entry in the payee's books is:", ["Arun A/c Dr. ₹5,100 To Bank A/c ₹5,100", "Bank A/c Dr. ₹5,100 To Arun A/c ₹5,100", "Arun A/c Dr. ₹5,000; Bank charges A/c Dr. ₹100 To Bank A/c ₹5,100", "Bad debts A/c Dr. To Bank A/c ₹5,100"], "Bank charges caused by the dishonour are recoverable from Arun, so Arun is debited with ₹5,100.");
acc.q(3, "Interest on drawings of ₹1,200 is charged to the proprietor. The entry is:", ["Drawings (or Capital) A/c Dr. To Interest on Drawings A/c", "Interest on Drawings A/c Dr. To Capital A/c", "Cash A/c Dr. To Interest A/c", "Interest A/c Dr. To Drawings A/c"], "It is an income of the business and reduces the owner's capital.");
acc.t("Final Accounts");
acc.q(3, "Salary for March ₹12,000 is outstanding, and insurance of ₹6,000 includes ₹1,500 prepaid. If these adjustments are ignored, net profit will be:", ["Overstated by ₹10,500", "Understated by ₹10,500", "Overstated by ₹13,500", "Understated by ₹13,500"], "Ignoring outstanding salary overstates profit by ₹12,000; ignoring prepaid insurance understates profit by ₹1,500. Net overstatement = ₹10,500.");
acc.q(3, "Goods worth ₹20,000 were destroyed by fire; the insurer admitted a claim of ₹14,000. The loss to be debited to the P&L account is:", ["₹6,000", "₹20,000", "₹14,000", "Nil"], "Only the unrecovered portion is a loss; ₹14,000 is shown as an amount due from the insurer.");
acc.t("Depreciation");
acc.q(3, "A machine costs ₹5,00,000 with residual value ₹50,000 and life 9 years under SLM. At the start of year 4, its remaining useful life is re-estimated at 3 years with the same residual value. Depreciation from year 4 onwards is:", ["₹1,00,000 per year", "₹50,000 per year", "₹1,50,000 per year", "₹75,000 per year"], "Annual SLM = 4,50,000/9 = ₹50,000. After 3 years, book value = ₹3,50,000; depreciable = 3,00,000 over 3 years = ₹1,00,000 per year (a change in estimate is applied prospectively).");
acc.t("Partnership Accounts");
acc.q(3, "In the absence of a partnership deed, a partner who advanced a loan of ₹50,000 to the firm and also worked full-time is entitled to:", ["Interest at 6% p.a. on the loan but no salary", "Salary and 12% interest", "No interest and no salary", "Salary only"], "Section 13 of the Partnership Act: no remuneration; 6% interest on advances beyond capital.");
acc.q(3, "A, B and C share profits 2:2:1. C retires and his share is taken by A and B in the ratio 3:2. The gaining ratio and new ratio of A and B are:", ["Gaining 3:2; new ratio 13:12", "Gaining 1:1; new ratio 1:1", "Gaining 2:2; new ratio 2:2", "Gaining 3:2; new ratio 3:2"], "A gains 3/5 × 1/5 = 3/25; B gains 2/25. A = 10/25 + 3/25 = 13/25; B = 10/25 + 2/25 = 12/25 → 13:12.");
acc.t("Company Accounts");
acc.q(3, "A company forfeited 100 shares of ₹10 each (₹8 called up) on which ₹5 had been received. 60 of these were reissued as fully paid at ₹9 per share. The amount transferred to capital reserve on reissue is:", ["₹180", "₹300", "₹240", "₹120"], "Forfeiture credited ₹5 × 100 = ₹500. On reissue of 60 shares, the discount allowed is ₹1 per share (₹60). Forfeited amount on these 60 = ₹300; transfer to capital reserve = 300 − 60 = ₹240.");
acc.t("Ratio Concepts");
acc.q(3, "Gross profit ratio is 25% on sales of ₹8,00,000. Opening stock ₹90,000; closing stock ₹1,10,000. Inventory turnover ratio is:", ["6 times", "8 times", "4 times", "7.5 times"], "COGS = 75% × 8,00,000 = ₹6,00,000; average stock = ₹1,00,000; turnover = 6 times.");
acc.q(3, "Debtors turnover ratio is 8 times. Taking a 360-day year, the average collection period is:", ["45 days", "30 days", "60 days", "8 days"], "360 ÷ 8 = 45 days.");
acc.t("Auditing");
acc.st(3, "Consider the following types of audit:", [
  "Statutory audit is compulsory under law.",
  "Internal audit is mandatory for every company regardless of size.",
  "Cost audit relates to verification of cost records maintained under law.",
], [1, 3], "Internal audit is mandatory only for prescribed classes of companies.");
acc.q(3, "An auditor reports that, 'except for' the effects of non-provision of a doubtful debt, the statements give a true and fair view. This is:", ["A qualified opinion", "An adverse opinion", "A disclaimer of opinion", "An unmodified opinion"], "Material but not pervasive misstatement → qualified ('except for') opinion.");
acc.t("Insurance Principles");
acc.q(3, "A person insures a neighbour's house without any financial interest in it. The policy is void for lack of:", ["Insurable interest", "Utmost good faith", "Proximate cause", "Contribution"], "The insured must stand to lose financially from the event insured against.");
acc.q(3, "A ship is damaged by sea water entering through a hole made by rats. The insurer pays because the 'proximate cause' is:", ["Perils of the sea", "Rats", "The owner's negligence", "Wear and tear"], "The dominant effective cause of the loss is the sea water, a peril insured against (classic marine illustration).");
acc.t("Cost Accounting");
acc.q(3, "P/V ratio is 40% and fixed costs are ₹2,00,000. Sales required to earn a profit of ₹60,000 are:", ["₹6,50,000", "₹5,00,000", "₹1,04,000", "₹8,00,000"], "(Fixed cost + profit) / P/V ratio = 2,60,000 / 0.40 = ₹6,50,000.");
acc.t("Not-for-Profit Organisations");
acc.q(3, "A club received subscriptions of ₹60,000 during 2025–26, which include ₹4,000 for 2024–25 and ₹6,000 for 2026–27. Subscriptions of ₹3,000 for 2025–26 are outstanding. Income from subscriptions for 2025–26 is:", ["₹53,000", "₹60,000", "₹63,000", "₹50,000"], "60,000 − 4,000 (previous year) − 6,000 (advance) + 3,000 (outstanding) = ₹53,000.");

eco.t("Fiscal Policy");
eco.st(3, "Consider the following about the FRBM framework:", [
  "The FRBM Act was enacted in 2003.",
  "The N. K. Singh Committee recommended using debt-to-GDP as the primary anchor.",
  "The FRBM Act prohibits the Centre from borrowing.",
], [1, 2], "The Act sets deficit and debt targets; it does not prohibit borrowing.");
eco.t("Money & Banking");
eco.q(3, "Which of the following combinations of RBI actions is the most contractionary?", ["Raise repo rate and sell government securities", "Cut CRR and buy government securities", "Cut repo rate and raise SLR", "Raise SDF rate and buy foreign currency"], "Both a repo hike and OMO sales tighten liquidity.");
eco.t("External Sector");
eco.q(3, "If India's current account deficit widens while capital inflows remain unchanged, the most likely effect, other things equal, is:", ["Pressure on the rupee to depreciate or a fall in forex reserves", "An automatic rise in exports", "A rise in the fiscal deficit", "A fall in imports immediately"], "A larger CAD increases demand for foreign currency.");
eco.t("Industry & Business");
eco.st(3, "Consider the following about Production Linked Incentive (PLI) schemes:", [
  "Incentives are linked to incremental sales of goods manufactured in India.",
  "They cover sectors such as electronics, pharmaceuticals and automobiles.",
  "They provide a one-time subsidy on land purchase.",
], [1, 2], "PLI is output-linked, not a land subsidy.");

export const LABOUR25C = lab.items;
export const ACCOUNTING25B = acc.items;
export const ECONOMY25B = eco.items;
