import { Bank } from "../bank/dsl";

/** 2025-pattern Accounting & Auditing: practical adjustments, error effects, audit and insurance principles. */
const b = new Bank("accounting25");

b.t("Accounting Concepts");
b.q(3, "A trader values closing stock at cost ₹80,000 although its net realisable value is ₹72,000. Which convention is violated and what is the effect?", ["Conservatism; profit and stock are overstated by ₹8,000", "Consistency; profit is understated by ₹8,000", "Materiality; no effect on profit", "Going concern; assets are understated"], "Inventory must be at the lower of cost and NRV; valuing at cost overstates both closing stock and profit by ₹8,000.");
b.hm(3, "Which of the following are fundamental accounting assumptions under AS 1?", [
  "Going concern",
  "Consistency",
  "Accrual",
  "Conservatism",
], 3, "AS 1 names going concern, consistency and accrual; prudence is a consideration in selecting policies, not a fundamental assumption.", "How many of the above are fundamental accounting assumptions?");
b.st(3, "Consider the following statements:", [
  "Provisions are a charge against profit, while reserves are an appropriation of profit.",
  "A reserve can be created even when the business incurs a loss for the year.",
  "Provision for doubtful debts is an application of conservatism.",
], [1, 3], "Reserves are appropriations of profit and cannot be created out of a loss.");
b.ar(3, "Capital introduced by the proprietor is shown on the liabilities side of the balance sheet.", "Under the business entity concept, the business is treated as separate from its owner.", "a", "Because the entity is separate, it owes the capital to the owner.");
b.st(3, "Which of the following costs are excluded from the cost of inventories under AS 2 and recognised as expenses?", [
  "Administrative overheads that do not contribute to bringing inventories to their present location and condition",
  "Abnormal amounts of wasted materials",
  "Freight inward on raw materials",
  "Selling and distribution costs",
], [1, 2, 4], "Freight inward is part of the purchase cost and is included in inventory cost.", "Which of the above are excluded?");
b.q(3, "Which of the following would NOT be treated as revenue expenditure?", ["Legal charges for acquiring a new factory building", "Wages paid to factory workers", "Routine repairs of plant", "Insurance premium on stock"], "Costs of acquiring a fixed asset, including legal charges, are capitalised.");

b.t("Trial Balance & Errors");
b.q(3, "Purchase of office furniture for ₹25,000 on credit from Rajan was entered in the purchases book. The trial balance:", ["Will agree, because it is an error of principle", "Will disagree by ₹25,000", "Will disagree by ₹50,000", "Will agree only after a suspense account is opened"], "Both debit (Purchases) and credit (Rajan) are recorded; only the head is wrong — an error of principle.");
b.q(3, "Sales of ₹14,500 to Mohan were correctly entered in the sales book but posted to Mohan's account as ₹15,400. The effect on the trial balance is:", ["Debit side exceeds credit side by ₹900", "Credit side exceeds debit side by ₹900", "No effect", "Debit side exceeds credit side by ₹1,800"], "Sales credited ₹14,500; Mohan debited ₹15,400 — excess debit of ₹900.");
b.q(3, "Wages paid for installing new machinery, ₹6,000, were debited to Wages account. If not rectified, the net profit for the year will be:", ["Understated by ₹6,000 less any depreciation that would have been charged on it", "Overstated by ₹6,000", "Unaffected", "Understated by exactly ₹12,000"], "The capital cost was expensed, reducing profit; had it been capitalised, only depreciation on it would have reduced profit.");
b.hm(3, "Which of the following errors will NOT affect the agreement of the trial balance?", [
  "Omitting a credit sale entirely from the books",
  "Posting the same amount to the wrong account on the correct side",
  "Recording repair expenses in the Machinery account",
  "Undercasting the sales book",
], 3, "Undercasting the sales book affects only the Sales account side, so the trial balance disagrees; the first three are complete omission, error of commission and error of principle.", "How many of the above will NOT affect the agreement?");
b.q(3, "A suspense account was opened with a credit of ₹1,000. Later it was found that the purchases book was overcast by ₹1,000. The rectifying entry is:", ["Suspense A/c Dr. To Purchases A/c ₹1,000", "Purchases A/c Dr. To Suspense A/c ₹1,000", "Creditors A/c Dr. To Purchases A/c ₹1,000", "Suspense A/c Dr. To Creditors A/c ₹1,000"], "Overcasting the purchases book made Purchases debit excessive; crediting Purchases and debiting Suspense closes the suspense balance.");

b.t("Final Accounts");
b.q(3, "Rent received in advance ₹4,000 is given as an adjustment. The correct treatment is:", ["Deduct ₹4,000 from rent received in the P&L account and show it as a liability in the balance sheet", "Add ₹4,000 to rent received and show it as an asset", "Show it only in the balance sheet as an asset", "Ignore it until the next year"], "Income received in advance is not earned; it is a current liability.");
b.q(3, "Debtors are ₹1,05,000. Bad debts to be written off ₹5,000; provision for doubtful debts at 5%; provision for discount at 2%. The net debtors shown in the balance sheet are:", ["₹93,100", "₹95,000", "₹92,610", "₹93,000"], "1,05,000 − 5,000 = 1,00,000; less 5% PDD = 95,000; less 2% discount on 95,000 = 1,900 → ₹93,100.");
b.q(3, "Operating profit is best computed as:", ["Gross profit − operating expenses (administration, selling and distribution) + operating incomes", "Net profit + all incomes", "Sales − purchases", "Gross profit + non-operating income"], "Non-operating items such as interest received or loss on sale of assets are excluded.");
b.q(3, "A trial balance shows Capital ₹2,00,000 (credit) and Drawings ₹30,000 (debit); net profit for the year is ₹50,000. Closing capital is:", ["₹2,20,000", "₹2,50,000", "₹2,80,000", "₹1,80,000"], "2,00,000 + 50,000 − 30,000 = ₹2,20,000.");
b.ar(3, "A capital account with a debit balance indicates that the proprietor's drawings and losses exceed capital and profits.", "Capital account normally shows a credit balance as it represents the owner's claim on the business.", "a", "A debit balance arises when the owner's claim becomes negative.");

b.t("Depreciation");
b.q(3, "A machine bought for ₹2,00,000 is depreciated at 10% p.a. on WDV. At the end of year 2 it is sold for ₹1,50,000. The profit or loss on sale is:", ["Loss of ₹12,000", "Profit of ₹12,000", "Loss of ₹10,000", "Profit of ₹2,000"], "WDV after 2 years = 2,00,000 × 0.9² = ₹1,62,000; sale ₹1,50,000 → loss ₹12,000.");
b.st(3, "Consider the following about depreciation methods:", [
  "SLM charges an equal amount every year.",
  "WDV charges a higher amount in earlier years.",
  "WDV can reduce the book value to zero after the useful life.",
], [1, 2], "A fixed rate on a reducing balance never reaches zero.");

b.t("Partnership Accounts");
b.q(3, "A and B share profits 3:2. C is admitted for a 1/5 share, which he takes equally from A and B. The new ratio is:", ["5 : 3 : 2", "3 : 2 : 1", "12 : 8 : 5", "2 : 2 : 1"], "A gives 1/10 and B gives 1/10. A = 3/5 − 1/10 = 1/2; B = 2/5 − 1/10 = 3/10; C = 1/5 → 5 : 3 : 2.");
b.q(3, "Under the Garner v. Murray rule, the deficiency of an insolvent partner is borne by the solvent partners in the ratio of:", ["Their capitals standing just before dissolution", "Their profit-sharing ratio", "Equally", "Their drawings"], "The rule applies in the absence of an agreement, using capitals before dissolution.");

b.t("Company Accounts");
b.st(3, "Consider the following under the Companies Act, 2013:", [
  "Securities premium can be used to issue fully paid bonus shares.",
  "Securities premium can be used to pay dividends.",
  "Shares cannot ordinarily be issued at a discount, except sweat equity shares.",
], [1, 3], "Dividends cannot be paid out of securities premium.");

b.t("Accounting Standards");
b.mt(3, "Match the Ind AS with its subject:", [["Ind AS 2", "Inventories"], ["Ind AS 16", "Property, plant and equipment"], ["Ind AS 115", "Revenue from contracts with customers"], ["Ind AS 116", "Leases"]], "Key Ind AS numbers.", "Standard", "Subject");
b.q(3, "After the year-end but before approval of accounts, a major debtor is declared insolvent; the debt existed at the year-end. Under the standard on events after the reporting period, this is:", ["An adjusting event — the provision for bad debts should be updated", "A non-adjusting event to be disclosed only", "Ignored", "An extraordinary item of the next year"], "It provides evidence of a condition existing at the reporting date.");

b.t("Ratio Concepts");
b.q(3, "Current ratio is 2.5 : 1 and quick ratio 1.5 : 1. If current liabilities are ₹80,000, inventory (the only non-quick current asset) is:", ["₹80,000", "₹1,20,000", "₹2,00,000", "₹40,000"], "Current assets = 2.5 × 80,000 = ₹2,00,000; quick assets = 1.5 × 80,000 = ₹1,20,000; inventory = ₹80,000.");
b.q(3, "A company's current ratio is 2 : 1. It pays creditors ₹20,000 in cash. The current ratio will:", ["Increase", "Decrease", "Remain unchanged", "Become 1 : 1"], "Equal reduction in current assets and liabilities raises a ratio above 1. E.g., 1,00,000/50,000 → 80,000/30,000 = 2.67.");

b.t("Auditing");
b.q(3, "The primary objective of an independent financial audit is to:", ["Express an opinion on whether the financial statements give a true and fair view", "Detect every fraud and error", "Prepare the financial statements", "Advise management on tax planning"], "Fraud detection is incidental; the auditor gives reasonable, not absolute, assurance.");
b.st(3, "Consider the following about audit evidence and procedures:", [
  "Vouching examines documentary evidence supporting entries in the books.",
  "Verification establishes the existence, ownership and valuation of assets and liabilities.",
  "Test checking means examining every transaction in detail.",
], [1, 2], "Test checking examines a representative sample.");
b.q(3, "An auditor could not verify inventory forming 40% of total assets because of restrictions imposed by management, and the effects could be pervasive. The appropriate report is:", ["Disclaimer of opinion", "Unmodified opinion", "Qualified opinion only", "Adverse opinion"], "Pervasive scope limitation leads to a disclaimer; pervasive misstatement leads to an adverse opinion.");
b.q(3, "If the auditor concludes that misstatements are material and pervasive (not merely a scope limitation), the opinion is:", ["Adverse opinion", "Disclaimer of opinion", "Unmodified opinion with emphasis of matter", "Qualified 'except for' opinion"], "Adverse: the statements do not give a true and fair view.");
b.st(3, "Consider the following about statutory audit of companies in India:", [
  "The auditor is appointed at the AGM for a term from one AGM to the sixth AGM.",
  "Listed companies must rotate individual auditors after one term of five years.",
  "The Comptroller and Auditor General appoints auditors of government companies.",
], [1, 2, 3], "All three reflect Sections 139 and 139(5) of the Companies Act, 2013.");
b.ar(3, "Internal control evaluation helps the auditor decide the extent of test checks.", "Strong internal controls reduce the risk of material misstatement going undetected.", "a", "Better controls permit smaller samples.");
b.q(3, "Which of the following best describes 'audit trail' in accounting software (required from April 2023)?", ["A tamper-proof log of every change to books of account, which cannot be disabled", "A list of auditors appointed", "The auditor's working papers", "A record of stock movements only"], "Rule 3 of the Companies (Accounts) Rules mandates an edit log.");
b.st(3, "Consider the following about the CAG of India:", [
  "The CAG is appointed by the President under Article 148.",
  "The CAG's reports on Union accounts are submitted to the President, who lays them before Parliament.",
  "The CAG audits the accounts of all private limited companies.",
], [1, 2], "The CAG audits government companies and bodies funded by government, not all private companies.");

b.t("Insurance Principles");
b.hm(3, "Which of the following are fundamental principles of insurance?", [
  "Utmost good faith",
  "Insurable interest",
  "Indemnity",
  "Speculation",
], 3, "Speculation is not a principle; others include proximate cause, subrogation, contribution and mitigation of loss.", "How many of the above are principles of insurance?");
b.q(3, "After a fire, an insured trader makes no effort to save goods that could easily have been moved. The insurer can reduce the claim because the trader violated the principle of:", ["Mitigation of loss", "Subrogation", "Contribution", "Insurable interest"], "The insured must act as a prudent uninsured person and take reasonable steps to minimise loss.");
b.q(3, "Which type of insurance contract is NOT a contract of indemnity?", ["Life insurance", "Fire insurance", "Marine insurance", "Motor insurance (own damage)"], "Life cannot be valued in money; the insurer pays the sum assured.");
b.q(3, "Goods worth ₹1,00,000 are insured with two insurers for ₹60,000 and ₹40,000. A loss of ₹50,000 occurs. Under the principle of contribution, the second insurer pays:", ["₹20,000", "₹25,000", "₹30,000", "₹40,000"], "Rateable proportion: 40,000/1,00,000 × 50,000 = ₹20,000.");
b.ar(3, "After paying a claim for a damaged car, the insurer can sue the negligent third party.", "Under subrogation, the insurer steps into the shoes of the insured after indemnifying him.", "a", "R explains A.");
b.q(3, "Stock worth ₹2,00,000 is insured for ₹1,50,000 under a policy with an average clause. A fire causes a loss of ₹80,000. The claim admissible is:", ["₹60,000", "₹80,000", "₹1,50,000", "₹40,000"], "Claim = loss × (sum insured / value) = 80,000 × 1,50,000/2,00,000 = ₹60,000.");

b.t("Special Transactions");
b.q(3, "A bill of exchange drawn on 15 January for 2 months after date (no holiday issues) matures on:", ["18 March", "15 March", "17 March", "16 March"], "15 March + 3 days of grace = 18 March.");
b.q(3, "Under GST, a trader buys goods for ₹1,00,000 + 18% GST and sells them intra-State for ₹1,50,000 + 18% GST. The net GST payable to the government after input tax credit is:", ["₹9,000", "₹27,000", "₹18,000", "₹4,500"], "Output tax ₹27,000 − input credit ₹18,000 = ₹9,000 (CGST + SGST).");

b.t("Cost Accounting");
b.q(3, "Fixed costs are ₹1,20,000, selling price ₹50 and variable cost ₹30 per unit. Actual sales are 9,000 units. The margin of safety in units is:", ["3,000 units", "6,000 units", "9,000 units", "4,000 units"], "BEP = 1,20,000/20 = 6,000 units; MoS = 9,000 − 6,000 = 3,000 units.");
b.q(3, "Annual demand is 4,800 units, ordering cost ₹150 per order and carrying cost ₹4 per unit per year. The economic order quantity is:", ["600 units", "400 units", "800 units", "1,200 units"], "EOQ = √(2 × 4,800 × 150 / 4) = √3,60,000 = 600.");

b.t("Government Accounting");
b.st(3, "Consider the following about the public finances of the Union:", [
  "No money can be withdrawn from the Consolidated Fund of India except under appropriation made by law.",
  "The Contingency Fund is placed at the disposal of the President to meet unforeseen expenditure.",
  "Provident fund deposits of government employees are credited to the Public Account.",
], [1, 2, 3], "Articles 266 and 267; GPF and small savings go to the Public Account.");

b.t("Bank Reconciliation");
b.q(3, "The pass book shows an overdraft of ₹12,000. Cheques issued but not presented ₹3,000; cheques deposited but not credited ₹5,000; bank charges ₹200 not in the cash book. The overdraft as per cash book is:", ["₹9,800", "₹14,200", "₹10,200", "₹13,800"], "Treat the overdraft as a negative balance. Cash book balance = pass-book balance − cheques issued but not presented + cheques deposited but not credited + bank charges not yet entered in the cash book = −12,000 − 3,000 + 5,000 + 200 = −9,800, i.e. an overdraft of ₹9,800.");

export default b.items;
