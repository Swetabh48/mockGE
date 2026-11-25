import { Bank } from "../bank/dsl";

/** 2025-pattern Labour Laws: legacy Acts (as asked in 2025), scenarios, cases, HR concepts. */
const b = new Bank("labour25b");

b.t("Labour Legislation – History");
b.st(3, "With reference to the Payment of Wages Act, 1936 (now subsumed in the Code on Wages), consider the following:", [
  "Wages could be paid in current coin or currency notes, or by cheque/bank credit.",
  "No wage period could exceed one month.",
  "Wages in a railway, factory or establishment with more than 1,000 persons had to be paid before the expiry of the tenth day after the wage period.",
], [1, 2, 3], "All three were features of the 1936 Act; the Code on Wages now has a uniform 7-day rule for monthly wages.");
b.hm(3, "Which of the following were permissible deductions under the Payment of Wages Act, 1936?", [
  "Deductions for absence from duty",
  "Deductions for house accommodation supplied by the employer",
  "Deductions for recovery of loans from a welfare fund, subject to conditions",
  "Deductions as a general penalty at the employer's discretion without any notified acts or omissions",
], 3, "Section 7 allowed specified deductions; arbitrary penalties were never authorised.", "How many of the above were permissible?");
b.st(3, "Under the Industrial Disputes Act, 1947, a person employed in a public utility service could not go on strike:", [
  "Without giving notice of strike within six weeks before striking.",
  "Within fourteen days of giving such notice.",
  "During the pendency of conciliation proceedings and seven days after their conclusion.",
], [1, 2, 3], "Section 22 contained all three restrictions; the IR Code now applies the 60-day/14-day notice rule to all industrial establishments.", "Which of the above restrictions applied?");
b.q(3, "Under the ID Act, 1947, which industry could be declared a 'public utility service' by the appropriate government for a limited period?", ["An industry listed in the First Schedule, such as banking or cement", "Any industry with more than 100 workers", "Only railways and posts", "Only government departments"], "Industries in the First Schedule could be declared public utility services for up to six months at a time, extendable.");
b.q(3, "Under the Employees' Compensation Act, loss of one eye (without complications, the other being normal) is classified as:", ["Permanent partial disablement", "Permanent total disablement", "Temporary disablement", "Not an injury under the Act"], "Schedule I lists it as a permanent partial disablement with a prescribed percentage of loss of earning capacity.");
b.st(3, "Consider the following about the Employees' Compensation Act, 1923 (now in the Code on Social Security):", [
  "The employer was not liable if the injury did not disable the worker for more than three days.",
  "The employer was not liable if the accident was directly attributable to the worker being under the influence of drink or drugs, unless it resulted in death or permanent total disablement.",
  "Compensation was payable for occupational diseases listed in a schedule.",
], [1, 2, 3], "All three are well-known features: the 3-day waiting period, the exceptions in Section 3, and Schedule III occupational diseases.");
b.st(3, "Consider the following about the Factories Act, 1948 (now in the OSH Code):", [
  "It required a welfare officer in factories with 500 or more workers.",
  "It required a canteen in factories with more than 250 workers.",
  "It required a creche in factories with 30 or more women workers.",
], [1, 2, 3], "These were the Factories Act thresholds; the OSH Code and rules revise several of them.");
b.st(3, "With reference to the Contract Labour (Regulation and Abolition) Act, 1970, consider the following:", [
  "It applied to establishments employing twenty or more contract workers.",
  "Abolition of contract labour in a process depended on factors such as whether the work was perennial.",
  "Abolition automatically made the contract workers regular employees of the principal employer.",
], [1, 2], "SAIL (2001) held there is no automatic absorption on abolition.");
b.st(3, "Consider the following statements about the Maternity Benefit Act, 1961 as amended in 2017:", [
  "A woman with two or more surviving children is entitled to only twelve weeks of benefit.",
  "A commissioning mother is entitled to twelve weeks from the date the child is handed over.",
  "Two nursing breaks are allowed until the child attains fifteen months.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following situations does NOT entitle a woman to maternity benefit of 26 weeks under the Maternity Benefit Act, as amended?", ["She has two surviving children and expects a third", "She expects her first child and worked 120 days in the preceding year", "She expects her second child and worked 90 days in the preceding year", "She expects her first child after working 85 days in the preceding year"], "With two or more surviving children the entitlement is 12 weeks; the 80-day eligibility is met in the other cases.");
b.st(3, "With reference to the Bonded Labour System (Abolition) Act, 1976, consider the following:", [
  "On commencement of the Act, every bonded debt stood extinguished.",
  "Vigilance Committees are constituted at district and sub-divisional levels.",
  "Offences under the Act are triable by Executive Magistrates.",
], [1, 2, 3], "All three are provisions of the 1976 Act (Sections 6, 13, 21).");
b.st(3, "Consider the following statements about the Sexual Harassment of Women at Workplace Act, 2013:", [
  "An Internal Committee is required in every workplace with ten or more employees.",
  "The Local Committee is constituted by the District Officer.",
  "The Act covers domestic workers.",
], [1, 2, 3], "Domestic workers are covered; complaints by them go to the Local Committee.");

b.t("Code on Wages");
b.q(3, "An establishment fixes a fortnightly wage period ending on the 15th. The latest lawful date of payment under the Code on Wages is:", ["The 17th", "The 22nd", "The 25th", "The last day of the month"], "Fortnightly wages must be paid before the end of the second day after the end of the wage period.");
b.ar(3, "The Code on Wages prohibits discrimination on the ground of gender in recruitment for the same work.", "The Equal Remuneration Act, 1976, now subsumed in the Code, applied only to wages and not to recruitment.", "c", "A is correct. R is false — the Equal Remuneration Act also prohibited discrimination in recruitment (Section 5).");
b.st(3, "Consider the following concepts of wages:", [
  "A minimum wage should provide for bare subsistence and preservation of efficiency.",
  "A living wage is the ideal that also provides for education, health and insurance.",
  "A fair wage is always higher than the living wage.",
], [1, 2], "The Committee on Fair Wages (1948) placed the fair wage between the minimum and the living wage, depending on the capacity of the industry.");
b.q(3, "Which statement best distinguishes the 'national floor wage' from a State's minimum wage under the Code on Wages?", ["The floor wage is a lower bound set by the Centre; States set minimum wages at or above it", "The floor wage replaces all State minimum wages", "The floor wage applies only to central government employees", "States may set minimum wages below the floor wage for agriculture"], "Section 9: no appropriate government shall fix minimum wages below the floor wage.");

b.t("Industrial Relations Code");
b.q(3, "A union calls a strike in a private hospital without notice. Under the IR Code, the strike is:", ["Illegal, because notice is required in all industrial establishments", "Legal, as hospitals are not public utility services under the Code", "Legal if more than half the workers join", "Illegal only if the hospital is a government hospital"], "The IR Code's notice requirement (Section 62) covers every industrial establishment.");
b.st(3, "Consider the following about recognition of negotiating unions under the IR Code:", [
  "A union with 51% or more of the workers on the muster roll is the sole negotiating union.",
  "If no union qualifies, a negotiating council is formed with unions having at least 20% membership.",
  "The method of verifying membership is laid down in the Code itself in detail.",
], [1, 2], "Verification is left to rules made by the appropriate government.");
b.q(3, "Which of the following is a 'protected' feature of an office-bearer of a registered trade union recognised as a protected worker during pendency of proceedings?", ["The employer cannot alter service conditions or dismiss the worker in connection with the dispute without permission", "The worker cannot be transferred for any reason", "The worker is entitled to double wages", "The worker cannot be retired"], "Protected workers are shielded from victimisation during pendency of proceedings.");
b.hm(3, "Which of the following are 'unfair labour practices' on the part of workers or unions under the IR Code?", [
  "Advising or actively supporting an illegal strike",
  "Coercing workers to join a particular union",
  "Staging demonstrations at the residence of management staff",
  "Raising a demand for higher wages through a charter of demands",
], 3, "A charter of demands is legitimate collective bargaining; the first three are listed unfair practices.", "How many of the above are unfair labour practices?");
b.q(3, "Under the IR Code, the worker who has the strongest claim to re-employment when the employer recruits within one year of retrenchment is:", ["The retrenched worker who offers himself for re-employment, in order of seniority", "Any new applicant with better qualifications", "A contract worker of the same employer", "A worker of another establishment"], "Section 72 gives retrenched workers preference within one year.");

b.t("OSH Code");
b.st(3, "With reference to working hours under the OSH Code, consider the following:", [
  "No worker shall be required to work more than eight hours a day.",
  "Overtime requires the consent of the worker.",
  "Overtime is paid at one and a half times the ordinary rate.",
], [1, 2], "Overtime is paid at twice the ordinary rate of wages.");
b.q(3, "A contractor engages 55 workers to work in two establishments located in different States for a single principal employer project. Under the OSH Code, the contractor:", ["Can obtain a single licence covering work in more than one State", "Needs separate licences for each work order", "Is exempt because no single site has 50 workers", "Needs no licence because the principal employer is registered"], "The OSH Code allows a single licence for work in more than one State or the whole country.");
b.ar(3, "The OSH Code treats audio-visual workers in digital productions as covered workers.", "The Cine-Workers and Cinema Theatre Workers Act, 1981 covered only cinema theatres.", "c", "A is correct. R is false — the 1981 Act covered cine workers in film production as well as cinema theatre workers.");

b.t("Constitution & Labour");
b.st(3, "Consider the following Articles and their content:", [
  "Article 23 prohibits begar and other similar forms of forced labour.",
  "Article 24 prohibits employment of children below fourteen in factories, mines or hazardous employment.",
  "Article 39(d) directs equal pay for equal work for both men and women.",
  "Article 43B relates to participation of workers in management.",
], [1, 2, 3], "Article 43B concerns promotion of co-operative societies; participation of workers is Article 43A.");
b.q(3, "Which combination of constitutional provisions has been used by courts to develop the principle of 'equal pay for equal work'?", ["Article 39(d) read with Articles 14 and 16", "Article 21 read with Article 32", "Article 43A read with Article 19", "Article 23 read with Article 24"], "Randhir Singh (1982) read the DPSP in Article 39(d) with Articles 14 and 16.");

b.t("Landmark Labour Cases");
b.q(3, "An employer argues that its in-house canteen, run by a contractor, is outside its control. Which line of reasoning would courts typically apply to test whether canteen workers are its employees?", ["Whether the canteen is a statutory obligation and the degree of control and integration with the establishment", "Only the name on the pay slip", "Only whether the contractor is registered", "Whether workers are union members"], "Courts examine statutory obligation, control and integration (e.g., Indian Petrochemicals v. Shramik Sena, 1999).");
b.st(3, "Consider the following judgments:", [
  "Randhir Singh (1982) — equal pay for equal work recognised as a constitutional goal.",
  "Olga Tellis (1985) — right to livelihood is part of Article 21.",
  "Safdarjung Hospital (1970) — hospitals are always industries.",
], [1, 2], "Safdarjung Hospital held hospitals were NOT industry; it was overruled by Bangalore Water Supply (1978).");
b.ar(3, "In Excel Wear (1978) the Supreme Court struck down the then Section 25-O of the ID Act.", "The Court held that the right to close a business is an aspect of the right to carry on business under Article 19(1)(g).", "a", "The unguided power to refuse permission for closure was held to be an unreasonable restriction.");
b.q(3, "A temporary employee who has worked for years seeks regularisation by court order despite irregular initial appointment. The Constitution Bench precedent most directly against automatic regularisation is:", ["Secretary, State of Karnataka v. Umadevi (2006)", "State of Punjab v. Jagjit Singh (2016)", "D. K. Yadav (1993)", "Bandhua Mukti Morcha (1984)"], "Umadevi held that regularisation cannot be claimed as of right, though Jagjit Singh later secured equal pay for equal work for temporaries.");
b.q(3, "Which case is the leading authority that the domestic inquiry must follow natural justice even when standing orders provide for automatic termination for overstaying leave?", ["D. K. Yadav v. J.M.A. Industries (1993)", "Hussainbhai (1978)", "Bangalore Water Supply (1978)", "B. Shah (1977)"], "The Court read natural justice into Article 21 for termination.");

b.t("ILO & International Standards");
b.st(3, "Consider the following statements about the ILO:", [
  "It is the only tripartite UN agency, with governments, employers and workers represented.",
  "Each member sends two government, one employer and one worker delegate to the International Labour Conference.",
  "Its conventions are binding on a member State even without ratification.",
], [1, 2], "Conventions bind only on ratification; the 1998 Declaration creates an obligation to respect fundamental principles.");
b.mt(3, "Match the ILO instrument with its subject:", [["Convention No. 189", "Domestic workers"], ["Convention No. 190", "Violence and harassment in the world of work"], ["Recommendation No. 202", "Social protection floors"], ["Convention No. 144", "Tripartite consultation"]], "These are frequently examined ILO instruments.", "Instrument", "Subject");
b.q(3, "An Indian IT firm posts an engineer to a country with which India has a Social Security Agreement for 3 years. Which document allows the engineer to keep contributing in India and avoid contributing in the host country?", ["Certificate of Coverage issued by EPFO", "Form 16 from the employer", "An embassy visa endorsement", "An ESIC e-pehchan card"], "Detachment under an SSA is evidenced by a Certificate of Coverage.");

b.t("Trade Union Movement");
b.st(3, "Consider the following about the early trade union movement in India:", [
  "The Madras Labour Union (1918) was organised by B. P. Wadia.",
  "AITUC was founded in 1920 with Lala Lajpat Rai as its first president.",
  "The Trade Unions Act was enacted in 1926 after the Buckingham Mill dispute had exposed unions to civil liability.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Arrange the following central trade union organisations in the order of their formation: 1. BMS 2. HMS 3. CITU 4. INTUC", ["4, 2, 1, 3", "2, 4, 1, 3", "4, 1, 2, 3", "1, 4, 2, 3"], "INTUC (1947), HMS (1948), BMS (1955), CITU (1970).");
b.ar(3, "The Ahmedabad mill strike of 1918 is significant in Indian labour history.", "Gandhi undertook a fast in support of the workers and the dispute was settled through arbitration.", "a", "The strike led to the Majoor Mahajan Sangh and an early model of arbitration.");

b.t("Industrial Relations Concepts");
b.q(3, "In Dunlop's systems model, the 'web of rules' is best understood as:", ["The procedural and substantive rules produced by the actors to govern the workplace", "The network of trade unions in a country", "Rules of an employer's federation", "The International Labour Code"], "The output of the IR system is a web of rules.");
b.q(3, "A firm handles employee complaints in three stages — supervisor, head of department, then a joint grievance committee — before voluntary arbitration. This follows:", ["The Model Grievance Procedure evolved under the Code of Discipline", "The POSH Act procedure", "The CLRA Act procedure", "The ESI Court procedure"], "The Model Grievance Procedure provides graded steps ending in voluntary arbitration.");
b.q(3, "Management's emphasis on discipline that is immediate, consistent, impersonal and preceded by clear warning reflects:", ["McGregor's 'hot stove' rule", "Herzberg's two-factor theory", "Maslow's need hierarchy", "Taylor's differential piece rate"], "The analogy of touching a hot stove.");
b.st(3, "Consider the following about workers' participation in management in India:", [
  "Works Committees were provided under the Industrial Disputes Act, 1947.",
  "Joint Management Councils were introduced in 1958.",
  "Article 43A was part of the original Constitution of 1950.",
], [1, 2], "Article 43A was inserted by the 42nd Amendment (1976).");
b.q(3, "An HR manager finds that higher pay reduces dissatisfaction but does not create enthusiasm; recognition and challenging work do. This is explained by:", ["Herzberg's two-factor theory", "McGregor's Theory X", "Vroom's expectancy theory", "Adams' equity theory"], "Pay is a hygiene factor; recognition and achievement are motivators.");
b.q(3, "An employee who discovers that a colleague with similar output is paid more becomes demotivated and reduces effort. This is best explained by:", ["Equity theory", "Two-factor theory", "Theory Y", "ERG theory"], "Adams' equity theory: perceived inequity of input–outcome ratios.");

b.t("Applied Labour Law");
b.q(3, "A factory (120 workers) pays a worker ₹700 per day. The worker is laid off for 30 working days in a year due to power shortage. Lay-off compensation payable is:", ["₹10,500", "₹21,000", "₹7,000", "₹15,750"], "50% of basic + DA for days of lay-off: 0.5 × 700 × 30 = ₹10,500.");
b.q(3, "A company has 9 employees, all men, at its head office. A woman consultant visiting the office complains of sexual harassment by an employee. Where should the complaint go?", ["The Local Committee constituted by the District Officer", "The company's Internal Committee", "The National Commission for Women only", "The Labour Court"], "Workplaces with fewer than 10 employees need not constitute an Internal Committee.");
b.q(3, "A worker employed for 4 years and 7 months dies in an accident. Under the gratuity law, gratuity is:", ["Payable to the nominee, as the five-year condition does not apply on death", "Not payable, since five years are not completed", "Payable only if the death is work-related", "Payable only to the spouse"], "The continuous-service requirement is waived on death or disablement.");
b.q(3, "A woman worker took 26 weeks of maternity leave during her third year of service. When computing continuous service for gratuity:", ["The maternity leave period is counted as continuous service", "The period is excluded from service", "Only 12 weeks are counted", "It depends on the employer's discretion"], "Statutory maternity leave (as notified, 26 weeks) counts as continuous service for gratuity.");
b.q(3, "An establishment deducts 4% of a worker's wages as a fine for late attendance during a month. Under the Code on Wages, the deduction is:", ["Unlawful, because a fine cannot exceed 3% of wages for the wage period", "Lawful, because late attendance is misconduct", "Lawful if the worker agreed", "Unlawful only if the worker is a woman"], "Fines are capped at 3% of wages in the wage period.");
b.q(3, "A gig worker delivering food through an app is injured on the job. Which framework provides for social security for such a worker?", ["Schemes under the Code on Social Security funded partly by aggregator contributions", "The Employees' Compensation Act as an employee of the aggregator", "The Factories Act", "No law covers gig workers"], "The Code on Social Security provides for schemes for gig and platform workers; they are not treated as employees.");

b.t("Labour Codes – Overview");
b.hm(3, "Consider the following pairs of Code and subsumed law:", [
  "Code on Wages — Payment of Bonus Act",
  "IR Code — Trade Unions Act",
  "Code on Social Security — Inter-State Migrant Workmen Act",
  "OSH Code — Plantations Labour Act",
], 3, "The Inter-State Migrant Workmen Act went into the OSH Code.", "How many of the above pairs are correctly matched?");
b.ar(3, "Labour Codes provide for registration of establishments through a single, electronic process.", "Separate registration under multiple Acts raised compliance costs, especially for small establishments.", "a", "Simplification of compliance is the rationale.");

b.t("Labour Institutions & Schemes");
b.st(3, "Consider the following about the PM Viksit Bharat Rozgar Yojana (2025):", [
  "It was earlier known as the Employment Linked Incentive scheme.",
  "Its benefits are linked to employment in establishments registered with EPFO.",
  "It provides an incentive to first-time employees and to employers for additional hiring.",
], [1, 2, 3], "All three are correct; it covers jobs created from August 2025 to July 2027.");
b.st(3, "With reference to e-Shram, consider the following:", [
  "It is a national database of unorganised workers.",
  "Members of EPFO or ESIC are also eligible to register.",
  "Gig and platform workers can register on it.",
], [1, 3], "Workers covered by EPFO or ESIC are not eligible.");
b.q(3, "The Labour Bureau's CPI-IW is used for revising dearness allowance. Which feature of the 2016 series is correct?", ["It has a base year of 2016 = 100 and wider coverage of centres than the 2001 series", "It uses 2012 as base and covers rural labourers", "It is compiled by the NSO", "It excludes housing"], "The 2016 series covers 88 centres (78 earlier) and includes housing.");
b.ar(3, "Pradhan Mantri Shram Yogi Maan-dhan is called a 'contributory' pension scheme.", "The Government makes a matching contribution equal to the subscriber's contribution.", "b", "Both are true. A is about its contributory nature (subscriber pays); R explains the matching but not why it is called contributory.");

b.t("Wage Concepts & Theories");
b.q(3, "According to the marginal productivity theory, a firm in a competitive labour market hires workers until:", ["The value of the marginal product of labour equals the wage", "Total product is maximised", "Average product equals the wage", "Profits equal wages"], "Profit maximisation implies VMP = W.");
b.st(3, "Consider the following about the need-based minimum wage norms of the 15th Indian Labour Conference (1957):", [
  "They assume three consumption units per earner's family.",
  "They include a net intake of 2,700 calories per average adult.",
  "They include 25% for children's education, medical needs and recreation.",
], [1, 2], "The 25% component was added by the Supreme Court in Reptakos Brett (1991).");

b.t("Human Resource Management");
b.q(3, "A firm wants to determine the relative worth of different jobs to design a fair pay structure. The appropriate tool is:", ["Job evaluation", "Performance appraisal", "Job enrichment", "Exit interview"], "Job evaluation ranks jobs; appraisal rates people.");
b.q(3, "Which appraisal method sets goals jointly by superior and subordinate and evaluates achievement against them?", ["Management by Objectives", "Forced distribution", "Paired comparison", "Graphic rating scale"], "MBO was popularised by Peter Drucker.");
b.q(3, "A firm's separations during the year were 60 and the average workforce was 400. The labour turnover rate (separation method) is:", ["15%", "6.67%", "12%", "20%"], "60 ÷ 400 × 100 = 15%.");

b.t("Industrial Relations Code");
b.q(3, "A union of supervisors drawing ₹45,000 a month raises an industrial dispute about promotion policy. Under the IR Code, the main legal hurdle is that:", ["Supervisory staff drawing wages above the notified limit are not 'workers'", "Supervisors cannot form unions under any law", "Promotion policy can never be an industrial dispute", "Only government can raise such disputes"], "Persons employed mainly in a supervisory capacity drawing wages above ₹18,000 (or as notified) are excluded from 'worker'.");
b.st(3, "Consider the following about the Industrial Tribunal under the IR Code:", [
  "It can adjudicate disputes between trade unions.",
  "It can modify punishment imposed after a domestic inquiry.",
  "Its award becomes enforceable on publication by the appropriate government, subject to the Code.",
], [1, 2, 3], "All three are powers or features under Chapter VII of the IR Code.");
b.ar(3, "The IR Code raised the Chapter X threshold for prior permission from 100 to 300 workers.", "The Code also allows the appropriate government to raise this threshold further by notification.", "b", "Both are true, but R states a separate flexibility rather than explaining the reason for A.");
b.q(3, "Which of the following is a precondition for an employer's lock-out to be lawful under the IR Code?", ["Notice within sixty days before the lock-out, and no lock-out within fourteen days of the notice", "Permission of the Industrial Tribunal in every case", "Consent of 51% of workers", "A prior strike by the workers"], "Lock-out restrictions mirror strike restrictions under Section 62(2).");
b.q(3, "Under the IR Code, a settlement reached between the employer and workers outside conciliation (bipartite) binds:", ["Only the parties to the agreement", "All present and future workers of the establishment", "All establishments in the industry", "The appropriate government"], "Only conciliation settlements and awards bind all workers; bipartite settlements bind the parties.");

b.t("OSH Code");
b.st(3, "Consider the following about the National Occupational Safety and Health Advisory Board under the OSH Code:", [
  "It is tripartite.",
  "It replaces several advisory boards that existed under separate Acts.",
  "It is chaired by the Chief Justice of India.",
], [1, 2], "It is constituted by the Central Government and chaired by the Secretary/Minister as notified — not the CJI.");
b.q(3, "Which of the following establishments is covered by the OSH Code regardless of the number of workers employed?", ["A dock", "A software office with 6 employees", "A retail store with 8 employees", "A restaurant with 9 employees"], "Mines and docks are covered irrespective of employment size.");
b.ar(3, "The OSH Code requires the employer to provide free annual health check-ups to employees of a prescribed age group.", "Early detection of occupational disease reduces long-term costs to workers and employers.", "a", "Preventive health is the rationale.");

b.t("Labour Legislation – History");
b.st(3, "Consider the following about the Rights of Persons with Disabilities Act, 2016:", [
  "It recognises 21 specified disabilities.",
  "It provides reservation of not less than 4% of vacancies in government establishments for persons with benchmark disabilities.",
  "A benchmark disability means a disability of not less than 60%.",
], [1, 2], "Benchmark disability is 40% or more.");
b.st(3, "With reference to the Apprentices Act, 1961, consider the following:", [
  "Apprentices are trainees and not workers, so labour laws generally do not apply to them.",
  "Apprentices receive a stipend.",
  "Employers cannot engage apprentices beyond a prescribed band of their workforce.",
], [1, 2, 3], "The Act prescribes a band (percentage of workforce) for engagement of apprentices.");
b.q(3, "Arrange the following in chronological order: 1. Royal Commission on Labour (Whitley) 2. First National Commission on Labour 3. Second National Commission on Labour 4. Code on Wages", ["1, 2, 3, 4", "2, 1, 3, 4", "1, 3, 2, 4", "3, 1, 2, 4"], "Whitley (1929–31), First NCL (1966–69), Second NCL (1999–2002), Code on Wages (2019).");

b.t("Landmark Labour Cases");
b.q(3, "Which of the following best states the 'dominant nature test' applied in Bangalore Water Supply?", ["Where an organisation has both sovereign/non-industrial and industrial activities, the predominant nature of the activity decides whether it is an industry", "Only profit-making entities are industries", "Government departments are never industries", "All charitable bodies are industries"], "The Court looked at the predominant activity where activities are severable or mixed.");
b.st(3, "Consider the following about the Asiad Workers' case (1982):", [
  "It was a public interest litigation.",
  "It held that labour provided for less than the minimum wage due to economic compulsion is forced labour under Article 23.",
  "It held that Article 24 applies to construction work, which is a hazardous employment.",
], [1, 2, 3], "The Court held construction work hazardous for the purposes of Article 24.");

b.t("ILO & International Standards");
b.q(3, "Which of the following correctly describes the 'Decent Work Agenda' of the ILO?", ["Four pillars — employment creation, rights at work, social protection and social dialogue — with gender equality as a cross-cutting goal", "A treaty banning overtime", "A WTO agreement on labour standards", "A minimum wage set by the ILO for all countries"], "Introduced in 1999 under Director-General Juan Somavía.");
b.ar(3, "The ILO's supervisory system includes the Committee on Freedom of Association.", "The Committee can examine complaints even against countries that have not ratified the freedom of association conventions.", "a", "Membership of the ILO itself creates the obligation, which explains why the Committee exists alongside ratification-based supervision.");

b.t("Labour Market & Statistics");
b.q(3, "In a survey, a person worked 18 days as a farm labourer and spent the rest of the year seeking work. Under the usual status approach (ps+ss), the person is classified as:", ["Unemployed in principal status; not counted as employed in subsidiary status since the work was less than 30 days", "Employed in subsidiary status", "Out of the labour force", "Employed in principal status"], "Subsidiary status requires at least 30 days of work in the reference year.");
b.st(3, "Consider the following measures in labour statistics:", [
  "Worker Population Ratio is employed persons as a share of total population.",
  "Unemployment Rate is unemployed persons as a share of the labour force.",
  "Labour Force Participation Rate excludes persons seeking work.",
], [1, 2], "LFPR includes both the employed and those seeking/available for work.");

b.t("Applied Labour Law");
b.q(3, "A worker's wage is ₹500 per day. The employer fines ₹300 in a month of 26 working days for damage to goods, with prior approval of the act. Under the Code on Wages, the maximum fine permissible in that wage period is:", ["₹390", "₹300", "₹6,500", "₹150"], "Wages for the period = 500 × 26 = ₹13,000; 3% = ₹390. A fine of ₹300 is within the cap.");
b.q(3, "Union X has 42% and Union Y has 23% membership in an establishment; Union Z has 19%. A dispute over the recognition result goes to:", ["The Industrial Tribunal, which adjudicates disputes between trade unions", "The Registrar of Companies", "The High Court only", "The ILO Governing Body"], "The IR Code gives Tribunals jurisdiction over inter-union disputes; here the council would comprise X and Y.");
b.q(3, "A woman employee in a 60-employee firm returns after maternity leave; her child is 10 months old. Which of the following must the employer provide?", ["Access to a creche and two nursing breaks a day", "Paid leave for one more year", "Work from home as a right", "Double wages"], "Creche (50+ employees) and nursing breaks until 15 months; work from home is by mutual agreement.");

export default b.items;
