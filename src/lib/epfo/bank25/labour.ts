import { Bank } from "../bank/dsl";

/**
 * 2025-pattern Labour Laws & IR: scenario-based, multi-statement and elimination items.
 * Law as in force after the four Labour Codes (21 Nov 2025), plus continuing case law.
 */
const b = new Bank("labour25");

b.t("Code on Wages");
b.st(3, "With reference to the Code on Wages, 2019, consider the following statements:", [
  "The provisions on timely payment and authorised deductions apply to every employee, without any wage ceiling.",
  "An employer may fix a wage period longer than one month if the employees agree in writing.",
  "Where an employee resigns, the wages due must be paid within two working days of the resignation.",
], [1, 3], "Wage periods may be daily, weekly, fortnightly or monthly — never longer than a month. The other two statements reflect Sections 16–17 of the Code.");
b.st(3, "Consider the following about deductions under the Code on Wages, 2019:", [
  "Total deductions in a wage period ordinarily cannot exceed 50% of the wages.",
  "A fine may be imposed for any act or omission, with or without prior approval of the specified acts.",
  "Recovery of an advance of wages is an authorised deduction.",
  "A fine must be recovered within ninety days of the act or omission.",
], [1, 3, 4], "Fines are allowed only for acts and omissions specified in a notice approved by the appropriate government; the 50% cap, recovery of advances and the 90-day recovery limit are correct.");
b.q(3, "A unit pays a worker ₹15,000 as basic + DA, ₹9,000 as HRA, ₹3,000 as conveyance and ₹3,000 as overtime for the month (total ₹30,000). For computing 'wages' under the Code on Wages, the amount is:", ["₹15,000, since excluded items (₹15,000) do not exceed half of ₹30,000", "₹30,000, since all payments count", "₹18,000, after adding back the excess over 50%", "₹12,000, since overtime is deducted"], "Excluded components (HRA ₹9,000 + conveyance ₹3,000 + overtime ₹3,000) = ₹15,000, which is exactly 50% of total remuneration. The add-back applies only to the amount exceeding one-half, so nothing is added; wages = ₹15,000.");
b.q(3, "A factory pays monthly wages. For the month of June, the salary is credited on 9 July. A worker complains. Under the Code on Wages, which of the following is correct?", ["Payment is late; monthly wages must be paid before the expiry of the 7th day of the following month", "Payment is in time because the Code allows ten days for establishments with over 1,000 workers", "Payment is in time because only daily-rated workers have a deadline", "The deadline is the 15th of the following month for all employers"], "The old Payment of Wages Act gave 10 days to establishments with more than 1,000 workers; the Code on Wages has a uniform rule — before the end of the 7th day of the succeeding month.");
b.hm(3, "Consider the following under the Code on Wages, 2019:", [
  "The Central Government fixes a floor wage which States cannot undercut.",
  "Minimum wages are to be reviewed or revised ordinarily within five years.",
  "Overtime is payable at not less than twice the normal rate.",
  "Minimum wages may differ for men and women doing the same work.",
], 3, "Statements 1–3 are correct. Gender-based differences for the same or similar work are prohibited.");
b.ar(3, "The Code on Wages limits excluded components to half of total remuneration while computing 'wages'.", "Employers had often inflated allowances to depress basic wages on which provident fund, gratuity and bonus are computed.", "a", "The 50% rule in Section 2(y) is designed precisely to curb wage-splitting that reduced social security contributions.");
b.st(3, "With reference to bonus under the Code on Wages, consider the following:", [
  "An employee who has worked for at least thirty days in the accounting year is eligible.",
  "Bonus is payable at a minimum of 8.33% even if the establishment incurs a loss.",
  "A person dismissed for sexual harassment can be disqualified from receiving bonus.",
], [1, 2, 3], "All three are correct: minimum bonus is payable regardless of allocable surplus, and the Code added sexual harassment as a disqualification ground.");
b.q(3, "An employee's salary is ₹16,000 per month and the notified minimum wage for the job is ₹9,000. The establishment declares 12% bonus. The annual bonus computed under the statutory ceiling is:", ["₹12,960", "₹23,040", "₹10,080", "₹15,993"], "Salary for computation is capped at ₹7,000 or the minimum wage, whichever is higher → ₹9,000. Bonus = 9,000 × 12 × 12% = ₹12,960.");
b.q(3, "Which pair of laws, now subsumed in the Code on Wages, earlier had DIFFERENT wage ceilings for coverage, a gap the Code removes by universal coverage?", ["Payment of Wages Act, 1936 (wage ceiling for coverage) and Minimum Wages Act, 1948 (scheduled employments)", "Payment of Bonus Act, 1965 and Factories Act, 1948", "Equal Remuneration Act, 1976 and Trade Unions Act, 1926", "Minimum Wages Act, 1948 and Industrial Disputes Act, 1947"], "Payment of Wages applied only up to a notified wage ceiling and Minimum Wages only to scheduled employments; the Code extends both protections to all employees.");

b.t("Industrial Relations Code");
b.q(3, "In an establishment with 600 workers, Union A has 290 members, Union B 180 and Union C 100; 30 workers belong to no union. Under the IR Code, which arrangement follows?", ["A negotiating council of Unions A and B", "Union A alone as the sole negotiating union", "A negotiating council of Unions A, B and C", "No negotiating body, as no union has a majority"], "No union has 51% (A has 48.3%). Unions with at least 20% get seats on the council: A (48.3%) and B (30%). C has 16.7% and is excluded.");
b.q(3, "A factory with 320 workers closes one department and terminates 40 workers, offering compensation but without approaching the government. Under the IR Code, the termination is:", ["Illegal, since retrenchment in establishments with 300 or more workers needs prior permission", "Legal, as compensation was paid", "Legal, since prior permission is needed only for 1,000 or more workers", "Legal, as departmental closure is never retrenchment"], "Chapter X applies to factories, mines and plantations with 300 or more workers; retrenchment without prior permission is illegal and workers are deemed in service.");
b.st(3, "Consider the following statements about strikes under the IR Code, 2020:", [
  "Notice of strike is required only in public utility services.",
  "A strike cannot be held during the pendency of conciliation proceedings and for seven days after their conclusion.",
  "Mass casual leave by half or more of the workers on a given day is treated as a strike.",
], [2, 3], "The IR Code extended the notice requirement to all industrial establishments; statements 2 and 3 are correct.");
b.q(3, "Workers serve a strike notice on 1 August. Conciliation begins on 5 August and fails on 20 August. Under the IR Code, the earliest date on which a lawful strike may begin is:", ["28 August (seven days after conciliation concludes)", "15 August (fourteen days after notice)", "21 August", "30 September (sixty days after notice)"], "Both conditions apply: not within 14 days of notice (i.e., after 15 August) and not during conciliation or within 7 days of its conclusion (20 August + 7 days). The later date governs — 28 August, still within 60 days of notice.");
b.st(3, "With reference to the Grievance Redressal Committee under the IR Code, consider the following:", [
  "It is mandatory for every industrial establishment employing twenty or more workers.",
  "It has an equal number of members from the employer and the workers, not exceeding ten in total.",
  "A worker aggrieved by its decision cannot raise an industrial dispute on the same matter.",
], [1, 2], "A worker dissatisfied with the committee's decision may file an appeal and can then pursue the matter through the conciliation officer, so statement 3 is wrong.");
b.ar(3, "The IR Code requires an employer to contribute fifteen days' wages per retrenched worker to a Worker Re-skilling Fund.", "The fund is meant to help retrenched workers acquire new skills for re-employment.", "a", "The Fund (Section 83) credits the amount to the worker within 45 days to support re-skilling.");
b.hm(3, "Which of the following are excluded from the definition of 'industry' under the IR Code, 2020?", [
  "Domestic service",
  "A charitable hospital wholly run by an organisation engaged in philanthropic service",
  "A commercial bank",
  "Defence research activities of a government department",
], 3, "Domestic service, purely charitable/philanthropic institutions and sovereign functions including defence research, atomic energy and space are excluded; a commercial bank is an industry.", "How many of the above are excluded?");
b.q(3, "A company with 250 workers decides to close down. Under the IR Code, which of the following is required?", ["Sixty days' notice to the government before closure, and closure compensation to workers", "Prior permission of the government", "No notice, only compensation", "Ninety days' notice and permission of the Industrial Tribunal"], "Prior permission is needed only in establishments with 300 or more workers. For 50–299 workers, 60 days' notice of closure is required, plus compensation.");
b.q(3, "Under the IR Code, a worker continuously laid off for 50 days in a year in a 150-worker factory is offered retrenchment. Which statement best describes the legal position?", ["The employer may retrench after the first 45 days by following retrenchment conditions; lay-off compensation already paid can be set off", "Lay-off compensation must continue indefinitely", "The worker becomes a permanent employee by operation of law", "Retrenchment is barred while lay-off lasts"], "Section 67 permits retrenchment after 45 days of lay-off in a 12-month period, with set-off of lay-off compensation paid in the preceding 12 months.");
b.st(3, "Consider the following about standing orders under the IR Code:", [
  "They apply to industrial establishments with 300 or more workers.",
  "An establishment adopting the Central Government's model standing orders is deemed to have certified standing orders.",
  "Matters such as classification of workers and misconduct are among the subjects covered.",
], [1, 2, 3], "All three reflect Chapter IV of the Code.");
b.q(3, "Which of the following situations involves an 'unfair labour practice' by the employer under the IR Code?", ["Transferring a union office-bearer to a distant place mala fide to weaken the union", "Dismissing a worker after a properly conducted domestic inquiry into theft", "Refusing to recognise a union that has only 8% membership as the negotiating union", "Declaring a lawful lock-out after giving notice"], "Mala fide transfer of a union office-bearer is an employer unfair labour practice listed in the Second Schedule; the others are lawful.");
b.ar(3, "A fixed-term worker under the IR Code gets the same wages and benefits as a permanent worker doing similar work.", "Fixed-term employment is a contract that ends automatically on expiry of the term without notice.", "b", "Both are true. R describes how fixed-term contracts end, but parity of wages arises from the statutory mandate, not from the manner of termination.");
b.q(3, "A union has 450 members in a 5,000-worker establishment and applies for registration. Under the IR Code, the application:", ["Qualifies, since 100 workers or 10% — whichever is less — is enough", "Fails, as 10% of 5,000 (500) members are needed", "Fails, as 51% membership is required for registration", "Qualifies only if the employer consents"], "The threshold is 10% or 100 workers, whichever is less — here 100. With 450 members, it qualifies.");
b.st(3, "With reference to adjudication under the IR Code, consider the following:", [
  "An Industrial Tribunal has a Judicial Member and an Administrative Member.",
  "An individual worker may approach the Tribunal directly 45 days after applying to the conciliation officer in disputes over discharge or dismissal.",
  "Labour Courts continue alongside Tribunals as the first forum for all individual disputes.",
], [1, 2], "The Code merges the functions of Labour Courts into Industrial Tribunals.");

b.t("OSH Code");
b.q(3, "A workshop uses electric power and employs 19 workers, while a hand-loom unit without power employs 39 workers. Under the OSH Code, which of them is a 'factory'?", ["Neither", "Only the workshop", "Only the hand-loom unit", "Both"], "Thresholds are 20 workers with power and 40 without power; both units fall just short.");
b.st(3, "Consider the following about contract labour under the OSH Code, 2020:", [
  "Provisions apply to establishments or contractors employing fifty or more contract workers.",
  "Contract labour in core activities is prohibited, subject to specified exceptions.",
  "The principal employer has no obligation even if the contractor fails to provide welfare facilities.",
], [1, 2], "The principal employer must provide welfare facilities if the contractor fails, and may recover the cost.");
b.st(3, "With reference to women's employment under the OSH Code, consider the following:", [
  "Women may work before 6 a.m. and after 7 p.m. with their consent, subject to safety conditions.",
  "Women are permitted to work in mines, subject to conditions prescribed for underground work.",
  "Women cannot be employed in factories carrying out hazardous processes under any circumstances.",
], [1, 2], "The Code allows women in all establishments, including hazardous processes, where adequate safeguards are provided as prescribed.");
b.q(3, "An adult worker worked 186 days in a factory in 2025. How much annual leave with wages is earned for 2026 under the OSH Code?", ["9 days", "12 days", "15 days", "No leave, as 240 days are required"], "Eligibility is 180 days (240 under the old Factories Act). Leave accrues at one day for every twenty days worked: 186 ÷ 20 = 9.3; a fraction of less than half a day is ignored, so 9 days.");
b.hm(3, "Which of the following are entitlements of an inter-State migrant worker under the OSH Code?", [
  "An annual lump-sum amount for a to-and-fro journey to the native place",
  "Coverage even if the worker migrated on his or her own, not through a contractor",
  "A toll-free helpline and registration in a national database",
  "Guaranteed permanent employment at the destination",
], 3, "The first three are provided; permanent employment is not guaranteed.", "How many of the above are provided?");
b.ar(3, "The OSH Code mandates an appointment letter to every employee.", "Written terms of employment help workers prove their status and claim social security benefits.", "a", "Formalisation through appointment letters is the stated rationale.");
b.q(3, "An OSH Code inspector finds that a factory with a hazardous process has no safety committee. Which statement is correct?", ["Safety committees with equal management and worker representation are required in factories carrying on hazardous processes", "Safety committees are required only in mines", "Only factories with 1,000 or more workers need them", "The Code abolished safety committees"], "Safety committees are required in notified establishments, including factories carrying on hazardous processes.");

b.t("Labour Legislation – History");
b.q(3, "Arrange the following labour laws in chronological order of enactment: 1. Payment of Gratuity Act 2. Contract Labour (Regulation and Abolition) Act 3. Payment of Bonus Act 4. Equal Remuneration Act", ["3, 2, 1, 4", "2, 3, 1, 4", "3, 1, 2, 4", "1, 3, 2, 4"], "Payment of Bonus (1965), Contract Labour (1970), Payment of Gratuity (1972), Equal Remuneration (1976).");
b.q(3, "Arrange in chronological order: 1. Trade Unions Act 2. Industrial Disputes Act 3. Workmen's Compensation Act 4. Payment of Wages Act", ["3, 1, 4, 2", "1, 3, 4, 2", "3, 4, 1, 2", "4, 3, 1, 2"], "Workmen's Compensation (1923), Trade Unions (1926), Payment of Wages (1936), Industrial Disputes (1947).");
b.mt(3, "Match the earlier law with the Code that subsumed it:", [["Building and Other Construction Workers Welfare Cess Act, 1996", "Code on Social Security"], ["Building and Other Construction Workers (RE&CS) Act, 1996", "OSH Code"], ["Industrial Employment (Standing Orders) Act, 1946", "IR Code"], ["Equal Remuneration Act, 1976", "Code on Wages"]], "Note the split: the BOCW Cess Act went into the Code on Social Security while the BOCW regulation Act went into the OSH Code.", "Old law", "Code");
b.st(3, "Consider the following statements about the Child and Adolescent Labour (Prohibition and Regulation) Act:", [
  "It was not subsumed into any of the four Labour Codes.",
  "A child below 14 may help the family in a family enterprise after school hours, in non-hazardous work.",
  "Adolescents aged 14–18 may be employed in hazardous occupations with parental consent.",
], [1, 2], "Adolescents cannot be employed in the listed hazardous occupations and processes, consent notwithstanding.");
b.ar(3, "The Industrial Disputes Act, 1947 originally required notice of strike only in public utility services.", "The Act's First Schedule listed industries that could be declared public utility services.", "b", "Both statements are true; the First Schedule enabled declarations, but that is not the reason the notice rule was confined to public utilities.");

b.t("Constitution & Labour");
b.st(3, "Consider the following statements:", [
  "'Welfare of labour, including conditions of work, provident funds and maternity benefit' is a Concurrent List subject.",
  "'Industrial disputes concerning Union employees' is a Union List subject.",
  "'Regulation of labour and safety in mines and oilfields' is a State List subject.",
], [1, 2], "Labour and safety in mines and oilfields is Entry 55 of the Union List.");
b.hm(3, "How many of the following are Directive Principles that bear directly on labour?", [
  "Living wage and decent standard of life",
  "Participation of workers in management of industries",
  "Just and humane conditions of work and maternity relief",
  "Protection against traffic in human beings and forced labour",
], 3, "The first three are DPSPs (Articles 43, 43A, 42); protection against forced labour is a Fundamental Right (Article 23).", "How many of the above are Directive Principles?");
b.q(3, "A State law prohibits workers from forming any association. Which constitutional provision is most directly violated?", ["Article 19(1)(c)", "Article 21", "Article 43A", "Article 24"], "Article 19(1)(c) guarantees the right to form associations or unions, subject to reasonable restrictions under Article 19(4).");

b.t("Landmark Labour Cases");
b.st(3, "With reference to the Bangalore Water Supply case (1978), consider the following:", [
  "It laid down the 'triple test' of systematic activity, employer–employee co-operation and production of goods or services.",
  "It held that charitable hospitals can never be an industry.",
  "It was decided by a seven-judge bench.",
], [1, 3], "The case adopted the dominant nature test and held that even charitable activities can be industry if the triple test is met; the IR Code later excluded certain wholly charitable institutions by statute.");
b.mt(3, "Match the case with the principle it is known for:", [["People's Union for Democratic Rights (1982)", "Paying less than minimum wage can amount to forced labour"], ["Vishaka (1997)", "Guidelines against sexual harassment at the workplace"], ["SAIL v. National Union Waterfront Workers (2001)", "No automatic absorption of contract labour"], ["Vivekananda Vidyamandir (2019)", "Universally paid allowances are basic wages for PF"]], "Each case is a staple of labour-law questions.", "Case", "Principle");
b.q(3, "A worker employed through a contractor claims that the factory owner is the real employer because the owner supervises the work, pays through the contractor and owns the tools. Which judgment supports looking at the 'real employer' behind such arrangements?", ["Hussainbhai v. Alath Factory Thozhilali Union (1978)", "Excel Wear v. Union of India (1978)", "Kameshwar Prasad v. State of Bihar (1962)", "Umadevi (2006)"], "Hussainbhai held that where the owner controls and benefits from the work, interposition of intermediaries does not defeat the employment relationship.");
b.ar(3, "Courts have held that government employees have no fundamental right to strike.", "The right to form unions under Article 19(1)(c) does not include the right to achieve every objective of the union, such as striking.", "a", "This reasoning, from All India Bank Employees' Association (1962), underlies later rulings like T.K. Rangarajan (2003).");

b.t("ILO & International Standards");
b.st(3, "Consider the following about the ILO's fundamental conventions:", [
  "Occupational safety and health conventions C155 and C187 became fundamental conventions after 2022.",
  "India has ratified C138 (minimum age) and C182 (worst forms of child labour).",
  "India has ratified C87 (freedom of association) and C98 (collective bargaining).",
], [1, 2], "India has not ratified C87 and C98.");
b.hm(3, "Which of the following are among the nine branches of social security in ILO Convention No. 102?", [
  "Employment injury benefit",
  "Family benefit",
  "Housing benefit",
  "Invalidity benefit",
], 3, "Housing is not among the nine branches.", "How many of the above are among them?");
b.ar(3, "India participates actively in ILO standard-setting even though it has not ratified C87 and C98.", "The 1998 Declaration obliges all ILO members to respect fundamental principles, including freedom of association, whether or not they have ratified the conventions.", "b", "Both are true; R explains an obligation, but it is not why India participates in standard-setting.");

b.t("Industrial Relations Concepts");
b.q(3, "Management and union in a cement plant agree that wages will rise by 8% in exchange for multi-skilling and flexible shift deployment. This is best described as:", ["Productivity bargaining", "Distributive bargaining over a fixed pie", "Compulsory adjudication", "Conciliation"], "Pay is traded for changes in work practices that raise productivity.");
b.q(3, "A union negotiator first consults members to reconcile conflicting demands of senior and junior workers before meeting management. In Walton and McKersie's framework this is:", ["Intra-organisational bargaining", "Attitudinal structuring", "Integrative bargaining", "Distributive bargaining"], "Intra-organisational bargaining reconciles differences within one party.");
b.st(3, "Consider the following perspectives on industrial relations:", [
  "The unitary view treats conflict as abnormal and unions as unnecessary.",
  "The pluralist view accepts conflict as natural and seeks to institutionalise it through bargaining.",
  "The Marxist view sees industrial conflict as rooted in the wider class structure of society.",
], [1, 2, 3], "All three are standard characterisations (Fox; Flanders; Hyman).");
b.q(3, "Which feature distinguishes voluntary arbitration from adjudication under the IR Code?", ["Arbitration rests on a written agreement of the parties; adjudication follows a reference or an application under the Code", "Arbitration awards cannot be enforced", "Adjudication is conducted by the trade union", "Arbitration is available only in public utility services"], "Section 42 provides for voluntary reference to arbitration by written agreement.");

b.t("Applied Labour Law");
b.q(3, "A worker's last drawn wages are ₹780 per day and service is 7 years 9 months. The establishment (220 workers) retrenches the worker. Retrenchment compensation plus the Worker Re-skilling Fund credit due to this worker total:", ["₹105,300", "₹93,600", "₹94,770", "₹81,900"], "8 years count (9 months > 6). Compensation = 15 × 780 × 8 = ₹93,600; Re-skilling Fund = 15 × 780 = ₹11,700. Total ₹1,05,300.");
b.q(3, "A worker is paid ₹600 per day for an 8-hour day. In a week, the worker works 8 hours on five days and 11 hours on one day. The overtime payment due under the Code on Wages is:", ["₹450", "₹225", "₹675", "₹300"], "Hourly rate = ₹75. Overtime = 3 hours at twice the rate = 3 × 150 = ₹450.");
b.q(3, "In a dispute over a dismissed worker, the Industrial Tribunal finds the misconduct proved but the punishment disproportionate. It may:", ["Substitute a lesser punishment and give consequential relief", "Only uphold the dismissal", "Only order reinstatement with full back wages", "Refer the case back to the employer without any order"], "The power earlier in Section 11A of the ID Act is retained in the IR Code.");
b.q(3, "A suspended worker's inquiry is delayed beyond 90 days for reasons not attributable to the worker. Under the IR Code, subsistence allowance after the first 90 days becomes:", ["75% of wages", "50% of wages", "100% of wages", "Nil"], "Subsistence allowance is 50% for the first 90 days and 75% thereafter if the delay is not due to the worker.");
b.hm(3, "Consider the following thresholds:", [
  "Works Committee — 100 workers",
  "Standing orders — 300 workers",
  "Prior permission for closure — 300 workers",
  "Grievance Redressal Committee — 20 workers",
], 4, "All four thresholds are correct under the IR Code.");

b.t("Labour Codes – Overview");
b.st(3, "Consider the following statements about the four Labour Codes:", [
  "The Code on Wages received assent in 2019 and the other three Codes in 2020.",
  "All four Codes came into effect on 21 November 2025.",
  "Together they consolidate 44 central labour laws.",
], [1, 2], "They consolidate 29 central laws; some State laws and the Child Labour Act remain separate.");
b.q(3, "Which feature of the Labour Codes reduces discretionary 'inspector raj'?", ["Web-based, randomised inspection schemes run by Inspector-cum-Facilitators", "Abolition of all penalties", "Inspection only after union complaints", "Self-certification without any inspection"], "The Codes provide for randomised, web-based inspection and a facilitative role for inspectors.");
b.ar(3, "Fine-only offences under the Labour Codes can be compounded.", "Compounding allows first-time minor violations to be settled by paying a sum instead of facing prosecution.", "a", "Compounding is meant to decriminalise minor first offences.");
b.q(3, "Which of the following is NOT a change brought by the Labour Codes?", ["Making employment exchanges compulsory for all recruitment", "Recognising gig and platform workers", "Introducing a national floor wage", "Mandating appointment letters"], "Employment exchanges were renamed Career Centres; the Codes do not make them compulsory for every recruitment.");

b.t("Labour Market & Statistics");
b.q(3, "In a district, the population is 20 lakh, the labour force 9 lakh and employed persons 8.55 lakh. What are the LFPR, WPR and unemployment rate respectively?", ["45%, 42.75%, 5%", "42.75%, 45%, 5%", "45%, 42.75%, 4.5%", "47.4%, 42.75%, 5%"], "LFPR = 9/20 = 45%; WPR = 8.55/20 = 42.75%; UR = (9 − 8.55)/9 = 5%.");
b.st(3, "Consider the following about the Periodic Labour Force Survey (PLFS):", [
  "It is conducted by the National Statistics Office.",
  "Since 2025 it also provides monthly estimates of key indicators in Current Weekly Status.",
  "It uses Current Daily Status as its only measure of activity.",
], [1, 2], "PLFS reports usual status and Current Weekly Status estimates.");
b.ar(3, "Unemployment measured by Current Weekly Status is usually higher than by usual status.", "CWS captures short-term unemployment in the reference week that usual status (365 days) may not.", "a", "Shorter reference periods pick up spells of unemployment that the longer usual status smooths out.");

export default b.items;
