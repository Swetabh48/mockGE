import { Bank } from "../bank/dsl";

/** 2025-pattern Social Security: scheme comparisons, eligibility scenarios, EPFO reforms. */
const b = new Bank("social25");

b.t("EPF – Act & Coverage");
b.hm(3, "Which of the following schemes are presently framed and in operation under the EPF & MP Act, 1952?", [
  "Employees' Provident Funds Scheme, 1952",
  "Employees' Family Pension Scheme, 1971",
  "Employees' Deposit Linked Insurance Scheme, 1976",
  "Employees' Pension Scheme, 1995",
], 3, "The Family Pension Scheme, 1971 was replaced by EPS 1995; the other three are in operation.", "How many of the above are in operation?");
b.st(3, "With reference to exemptions under the EPF & MP Act, consider the following:", [
  "A co-operative society employing fewer than fifty persons and working without the aid of power was excluded by Section 16.",
  "An establishment may run its own provident fund trust under Section 17 if its benefits are not less favourable than the statutory scheme.",
  "An exempted establishment may declare interest lower than the EPFO rate if its investments perform poorly.",
], [1, 2], "Exempted trusts must credit interest at least equal to the EPFO rate; any shortfall must be made good by the employer.");
b.q(3, "An employee's basic + DA is ₹24,000. Employer and employee contribute on the statutory wage ceiling only. The monthly amounts credited to the member's EPF account and EPS account respectively are:", ["₹2,350 to EPF (₹1,800 + ₹550) and ₹1,250 to EPS", "₹3,600 to EPF and ₹0 to EPS", "₹1,800 to EPF and ₹1,800 to EPS", "₹2,880 to EPF and ₹1,250 to EPS"], "On ₹15,000: employee 12% = ₹1,800 (EPF); employer 12% = ₹1,800, of which ₹1,250 goes to EPS and ₹550 to EPF. EPF total = ₹2,350.");
b.st(3, "Consider the following about the definition of 'basic wages' for EPF contributions:", [
  "House rent allowance is excluded.",
  "An allowance paid universally, necessarily and ordinarily to all employees is part of basic wages.",
  "An incentive paid only to those who produce beyond a norm forms part of basic wages.",
], [1, 2], "Production incentives linked to extra output are excluded (Bridge & Roof; Vivekananda Vidyamandir).");
b.st(3, "Consider the following decisions of the CBT (EPF) in October 2025 on partial withdrawals:", [
  "Thirteen withdrawal provisions were merged into three categories.",
  "Members may withdraw up to 100% of the eligible balance, but must keep 25% of contributions as minimum balance.",
  "The minimum service for any partial withdrawal was raised to five years.",
], [1, 2], "Minimum service was made a uniform 12 months.");
b.ar(3, "EPFO raised the auto-settlement limit for advance claims to ₹5 lakh in 2025.", "Auto-settlement processes claims through IT checks without manual intervention, reducing settlement time.", "a", "Faster processing is the purpose of auto-settlement.");
b.q(3, "An establishment's EPF dues for March 2025 were deposited in late July 2025. Which combination of charges may EPFO levy?", ["Interest under Section 7Q and damages under Section 14B", "Only interest under Section 7Q", "Only a fixed penalty of ₹500", "Nothing, if the dues are paid before the financial year closes"], "Both 12% simple interest (7Q) and damages (14B) on a graded scale apply to delayed remittance.");
b.st(3, "Consider the following about the Central Board of Trustees (EPF):", [
  "It is chaired by the Union Minister for Labour and Employment.",
  "It has equal representation of employers and employees.",
  "It fixes the EPF interest rate without any role for the Ministry of Finance.",
], [1, 2], "The rate recommended by the CBT is notified after concurrence of the Ministry of Finance.");
b.q(3, "Arrange the following EPF interest rates by financial year, from earliest to latest: 1. 8.10% 2. 8.15% 3. 8.25% (first year it was declared) 4. 8.50%", ["4, 1, 2, 3", "1, 4, 2, 3", "4, 2, 1, 3", "1, 2, 4, 3"], "8.50% (2019–20/2020–21), 8.10% (2021–22), 8.15% (2022–23), 8.25% (2023–24, retained in 2024–25).");

b.t("EPS-1995");
b.st(3, "Consider the following about the Employees' Pension Scheme, 1995:", [
  "It is a defined benefit scheme funded by the employer's 8.33% and the Central Government's 1.16%.",
  "Members contribute nothing directly from their wages to EPS in the normal course.",
  "Pension is payable only if the member has completed twenty years of service.",
], [1, 2], "Monthly pension requires ten years of eligible service; twenty years earns a weightage of two years.");
b.q(3, "A member with pensionable salary ₹15,000 and 30 years' service (including weightage) retires at 58. Another member with the same salary and 9 years' service leaves. What do they get?", ["First gets ₹6,429 monthly pension; second gets a withdrawal benefit or scheme certificate", "Both get monthly pension", "First gets ₹4,500; second gets ₹1,000 pension", "Both get only withdrawal benefit"], "15,000 × 30 / 70 = ₹6,428.57 ≈ ₹6,429; with less than ten years of service, no monthly pension is payable.");
b.ar(3, "A member who defers EPS pension from 58 to 60 gets a higher pension.", "EPS provides an increase of 4% for each year of deferment.", "a", "The 2016 amendment allows deferment up to 60 with a 4% annual increase.");
b.st(3, "With reference to family pension under EPS 1995, consider the following:", [
  "Widow pension is 50% of the member pension, subject to the minimum.",
  "Children's pension is paid to two children at a time up to 25 years of age.",
  "A disabled child receives children's pension for life.",
], [1, 2, 3], "All three are correct.");

b.t("EDLI-1976");
b.st(3, "Consider the following about the EDLI Scheme, 1976:", [
  "The employee contributes 0.5% of wages.",
  "The maximum assurance benefit is ₹7 lakh.",
  "An employer may be exempted if a group insurance scheme gives better benefits.",
], [2, 3], "The employee does not contribute; the employer pays 0.5% of wages.");

b.t("ESI Scheme");
b.hm(3, "Which of the following are benefits provided under the ESI Act?", [
  "Sickness benefit",
  "Dependants' benefit",
  "Funeral expenses",
  "Housing benefit",
], 3, "Housing is not an ESI benefit. The benefits are medical, sickness, maternity, disablement, dependants', funeral expenses and unemployment allowance schemes.", "How many of the above are ESI benefits?");
b.q(3, "An ESI-covered worker earns ₹20,000 a month. The employer and employee contributions for the month are respectively:", ["₹650 and ₹150", "₹950 and ₹350", "₹150 and ₹650", "₹800 and nil"], "Employer 3.25% = ₹650; employee 0.75% = ₹150 (rates since July 2019).");
b.st(3, "Consider the following about the ESI Scheme:", [
  "Benefit periods follow contribution periods with a lag of three months.",
  "Medical benefit is available to the insured person's family.",
  "Employment injury benefits require a minimum of 78 days of contribution.",
], [1, 2], "Employment injury benefits are available from day one of insurable employment.");
b.ar(3, "An ESI insured person whose average daily wage is ₹150 does not pay any contribution.", "The employer is also exempt from contributing for such low-wage employees.", "c", "A is true (daily wage up to ₹176); R is false — the employer's 3.25% remains payable.");
b.q(3, "An insured woman under ESI and a woman under the Maternity Benefit Act both deliver their first child. Which statement is correct?", ["Both are entitled to 26 weeks; under ESI the benefit is paid by ESIC, under the MB Act by the employer", "Only the ESI-covered woman gets 26 weeks", "Both get 12 weeks", "The MB Act applies to ESI-covered women in addition, so she gets 52 weeks"], "An employee covered by ESI gets maternity benefit from ESIC; the MB Act does not apply to such employees for the same benefit.");
b.st(3, "With reference to SPREE 2025 of ESIC, consider the following:", [
  "It encouraged voluntary registration of unregistered employers and employees.",
  "Registered employers would not face inspection or demand for periods prior to registration, subject to the scheme's terms.",
  "It made ESI coverage voluntary for all establishments.",
], [1, 2], "Coverage remains mandatory where the Act applies; SPREE was a one-time registration drive.");

b.t("Gratuity");
b.q(3, "Which employee is NOT entitled to gratuity on leaving service?", ["A permanent employee who resigns after 4 years and 2 months", "A fixed-term employee whose 18-month contract ends", "The nominee of an employee who dies after 2 years of service", "An employee retiring on superannuation after 22 years"], "Resignation needs five years of continuous service (for permanent employees); fixed-term employees qualify after one year; death waives the condition.");
b.q(3, "An employee's last drawn wage is ₹52,000 per month and service is 34 years 8 months. Statutory gratuity payable is:", ["₹10,50,000", "₹10,20,000", "₹20,00,000", "₹10,80,000"], "15/26 × 52,000 = ₹30,000 per year; 8 months > 6 months, so 35 years: 30,000 × 35 = ₹10,50,000 (within the ₹20 lakh cap).");
b.ar(3, "Statutory gratuity cannot be attached in execution of a court decree.", "Gratuity is a terminal benefit meant to provide for the employee after separation.", "a", "The protection secures the purpose of gratuity as social security.");

b.t("Maternity & Other Benefits");
b.st(3, "Consider the following about maternity protection in India:", [
  "Under the Maternity Benefit Act, an establishment with 50 or more employees must provide a creche.",
  "Work from home after maternity benefit may be allowed by mutual agreement where the work permits.",
  "PMMVY gives ₹5,000 for the first child and, under PMMVY 2.0, ₹6,000 for a second child if it is a girl.",
], [1, 2, 3], "All three are correct.");

b.t("NPS, UPS & APY");
b.mt(3, "Match the scheme with the correct feature:", [["Unified Pension Scheme", "Assured 50% of average basic pay after 25 years"], ["National Pension System", "Defined contribution with market-linked returns"], ["Atal Pension Yojana", "Guaranteed ₹1,000–5,000 pension, entry age 18–40"], ["PM Shram Yogi Maan-dhan", "₹3,000 pension with matching government contribution"]], "Each scheme's defining feature.", "Scheme", "Feature");
b.st(3, "Consider the following about the Unified Pension Scheme (UPS):", [
  "It is available as an option to Central Government employees covered under NPS.",
  "It guarantees a minimum pension of ₹10,000 per month after at least ten years of service.",
  "Family pension under UPS is 60% of the pension being drawn.",
  "It came into effect from 1 April 2025.",
], [1, 2, 3, 4], "All four are correct.");
b.st(3, "Consider the following about Atal Pension Yojana:", [
  "The pension amount is guaranteed by the Government of India.",
  "Income-tax payers can join the scheme after 2022.",
  "On the death of both the subscriber and spouse, the accumulated corpus is returned to the nominee.",
], [1, 3], "From 1 October 2022, income-tax payers are not eligible.");
b.q(3, "A 38-year-old self-employed taxpayer wants a guaranteed government-backed monthly pension from 60. Which statement is correct?", ["She cannot join APY because income-tax payers are ineligible; she may consider NPS", "She can join APY since the entry age limit is 50", "She can join PM-SYM since there is no income limit", "She must join EPF"], "APY bars taxpayers (since 2022); PM-SYM is for unorganised workers with income up to ₹15,000 aged 18–40; NPS is open to all.");
b.ar(3, "NPS is a defined contribution scheme.", "In NPS, the pension depends on contributions and the returns earned on them.", "a", "R explains A.");
b.st(3, "Consider the following about NPS Vatsalya:", [
  "It allows parents to open an NPS account for a minor.",
  "The account converts to a regular NPS account when the child turns 18.",
  "It is administered by EPFO.",
], [1, 2], "NPS Vatsalya is regulated by PFRDA.");

b.t("Insurance & Health Schemes");
b.mt(3, "Match the scheme with its cover:", [["PMJJBY", "₹2 lakh on death due to any cause"], ["PMSBY", "₹2 lakh on accidental death or total disability"], ["PM-JAY", "₹5 lakh per family per year for hospitalisation"], ["PMJDY RuPay card (after Aug 2018)", "₹2 lakh accident insurance"]], "Note that PMSBY covers only accidents while PMJJBY covers death from any cause.", "Scheme", "Cover");
b.st(3, "Consider the following about Ayushman Bharat PM-JAY:", [
  "Since October 2024, all senior citizens aged 70 and above are eligible irrespective of income.",
  "It provides cashless secondary and tertiary hospitalisation.",
  "It is implemented by ESIC.",
], [1, 2], "It is implemented by the National Health Authority.");
b.q(3, "A 52-year-old bank account holder wants both life cover (any cause) and accident cover under government micro-insurance schemes. Which is correct?", ["She can join PMSBY but not PMJJBY, since PMJJBY enrolment is up to age 50", "She can join both", "She can join PMJJBY only", "She can join neither"], "PMJJBY enrolment age is 18–50 (cover till 55); PMSBY is 18–70.");

b.t("Social Assistance Schemes");
b.hm(3, "Which of the following are components of the National Social Assistance Programme?", [
  "Indira Gandhi National Old Age Pension Scheme",
  "National Family Benefit Scheme",
  "Annapurna",
  "Atal Pension Yojana",
], 3, "APY is a contributory pension scheme under PFRDA, not part of NSAP.", "How many of the above are NSAP components?");
b.ar(3, "NSAP is described as a step towards fulfilling Article 41 of the Constitution.", "Article 41 directs the State to make provision for public assistance in old age, sickness and disablement.", "a", "R explains A.");

b.t("Code on Social Security");
b.st(3, "Consider the following under the Code on Social Security, 2020:", [
  "ESI coverage can be made mandatory for an establishment with even one employee in a hazardous occupation.",
  "Aggregators must contribute 1–2% of annual turnover, subject to a cap of 5% of payments to gig and platform workers.",
  "Gig workers are deemed to be employees of the aggregator.",
], [1, 2], "The Code does not make gig workers employees.");
b.q(3, "Under the Code on Social Security, a commuting accident on the way to work is deemed to arise out of employment:", ["If it occurs while commuting between residence and place of work, subject to the nexus with employment", "Never", "Only if the employer provided the vehicle", "Only for women employees"], "The Code extends employees' compensation to such commuting accidents.");
b.hm(3, "Which of the following laws were subsumed in the Code on Social Security?", [
  "Employment Exchanges (Compulsory Notification of Vacancies) Act, 1959",
  "Cine-Workers Welfare Fund Act, 1981",
  "Payment of Bonus Act, 1965",
  "Unorganised Workers' Social Security Act, 2008",
], 3, "The Payment of Bonus Act went into the Code on Wages.", "How many of the above?");

b.t("Concepts & Global Models");
b.st(3, "Consider the following statements:", [
  "A pay-as-you-go pension system uses current contributions to pay current pensions.",
  "A fully funded system is more exposed to demographic ageing than a PAYG system.",
  "A defined benefit scheme places investment risk on the sponsor.",
], [1, 3], "PAYG systems are more exposed to ageing because fewer workers support more pensioners.");
b.ar(3, "Social insurance schemes such as EPF and ESI cover a minority of India's workforce.", "Most Indian workers are in informal employment outside the coverage thresholds of these laws.", "a", "Informality explains limited coverage.");
b.q(3, "Which pair correctly contrasts the Bismarckian and Beveridgean models?", ["Bismarckian — contributory, employment-linked; Beveridgean — universal, flat-rate, tax-financed", "Bismarckian — universal; Beveridgean — means-tested only", "Both are private insurance models", "Bismarckian — tax-financed; Beveridgean — employer-funded"], "Germany's 1880s social insurance vs the UK's 1942 Beveridge plan.");

b.t("Social Security – History & Institutions");
b.q(3, "Arrange the following in chronological order: 1. ESI Act 2. EPF Act 3. Payment of Gratuity Act 4. Unorganised Workers' Social Security Act", ["1, 2, 3, 4", "2, 1, 3, 4", "1, 3, 2, 4", "2, 3, 1, 4"], "ESI (1948), EPF (1952), Gratuity (1972), UWSS (2008).");
b.st(3, "Consider the following about EPFO's digital initiatives:", [
  "UAN was launched in 2014.",
  "The Centralised Pension Payment System lets pensioners receive pension in any bank account.",
  "Aadhaar seeding with UAN is optional for filing ECR.",
], [1, 2], "Aadhaar seeding is mandatory for ECR filing.");

b.t("Applied Social Security");
b.q(3, "An employer with 30 employees each earning ₹12,000 (basic + DA) pays EPF contributions. The total monthly employer outgo towards EPF, EPS, EDLI and administrative charges (0.50%) is:", ["₹46,800", "₹43,200", "₹48,600", "₹45,000"], "Per employee: 12% = ₹1,440; EDLI 0.5% = ₹60; admin 0.5% = ₹60 → ₹1,560 × 30 = ₹46,800.");
b.q(3, "A worker earning ₹14,000 a month is covered by both EPF and ESI. The employee's total statutory monthly deduction for these two is:", ["₹1,785", "₹1,680", "₹2,135", "₹1,575"], "EPF 12% = ₹1,680; ESI 0.75% = ₹105; total ₹1,785.");
b.q(3, "Two employees earn ₹15,000 and ₹22,000 (basic + DA). The second joined in 2016 directly at that salary and both work in a covered establishment. Which statement is correct?", ["The first is a mandatory EPF/EPS member; the second is an excluded employee who may join EPF voluntarily but not EPS", "Both are mandatory members of EPS", "Neither can join EPF", "The second must contribute 12% to EPS"], "New entrants above ₹15,000 after September 2014 are excluded employees and cannot join EPS.");

export default b.items;
