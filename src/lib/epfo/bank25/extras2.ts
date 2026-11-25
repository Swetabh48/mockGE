import { Bank } from "../bank/dsl";

/** 2025-pattern top-ups: history, polity, social security, accounting, current events, science. */

const h = new Bank("history25c");
h.t("British Expansion & Policies");
h.st(3, "Consider the following about the Subsidiary Alliance:", [
  "It was devised by Lord Wellesley.",
  "Hyderabad was among the first states to accept it.",
  "A ruler who accepted it remained free to conduct his own foreign relations.",
], [1, 2], "The ruler surrendered control of foreign relations, kept a British force at his own cost and accepted a Resident.");
h.st(3, "Consider the following about the Doctrine of Lapse:", [
  "It was applied by Lord Dalhousie.",
  "Satara was the first state annexed under it.",
  "Awadh was annexed under it in 1856.",
], [1, 2], "Awadh was annexed on the ground of alleged misgovernment, not lapse.");
h.ar(3, "Dadabhai Naoroji argued that British rule caused a 'drain of wealth' from India.", "Home charges, such as pensions and salaries of British officials and interest on debt, were paid out of Indian revenues.", "a", "Naoroji set this out in 'Poverty and Un-British Rule in India'.");
h.st(3, "Consider the following about the demands of the early (Moderate) nationalists:", [
  "Expansion and reform of the legislative councils.",
  "Holding the ICS examination simultaneously in India and England.",
  "Complete independence from British rule from 1885 onwards.",
], [1, 2], "Purna Swaraj was adopted only at the Lahore session of 1929.", "Which of the above were demands of the Moderates?");
h.st(3, "Consider the following about Swadeshi enterprises:", [
  "Prafulla Chandra Ray founded Bengal Chemicals.",
  "V. O. Chidambaram Pillai started the Swadeshi Steam Navigation Company.",
  "The Tata Iron and Steel Company was set up by the Government of India.",
], [1, 2], "TISCO was founded in 1907 by the Tata group as a private Indian enterprise.");

h.t("Revolutionaries Abroad");
h.st(3, "Consider the following about the Ghadar movement:", [
  "The Ghadar Party was founded in 1913 on the Pacific coast of North America.",
  "Lala Har Dayal was one of its leading figures.",
  "It relied mainly on petitions to the British Parliament.",
], [1, 2], "It aimed at armed revolt and tried to win over Indian soldiers during the First World War.");
h.ar(3, "The Komagata Maru episode of 1914 deepened anti-British feeling among Indians abroad.", "Most of the ship's Indian passengers were refused entry into Canada, and several were killed in police firing at Budge Budge on their return.", "a", "The episode fed the Ghadar movement.");

h.t("Peasant, Caste & Tribal Movements");
h.st(3, "Consider the following about the Tebhaga movement:", [
  "It took place in Bengal in 1946–47.",
  "Sharecroppers demanded two-thirds of the crop instead of half.",
  "It was led by the Muslim League.",
], [1, 2], "It was led by the Bengal Provincial Kisan Sabha.");
h.st(3, "Consider the following about the Telangana peasant struggle:", [
  "It was directed against the Nizam's rule and oppressive landlords.",
  "Communists played a leading role in it.",
  "It ended the day Hyderabad was integrated into India in 1948.",
], [1, 2], "The armed struggle continued until 1951.");
h.st(3, "Consider the following about the Vaikom Satyagraha (1924–25):", [
  "It demanded that lower castes be allowed to use roads near the Vaikom temple in Travancore.",
  "E. V. Ramasamy (Periyar) took part in it.",
  "It was led by B. R. Ambedkar.",
], [1, 2], "Leaders included T. K. Madhavan and K. P. Kesava Menon.");
h.st(3, "Consider the following about the Bijolia movement:", [
  "It was a peasant movement in Mewar, Rajasthan.",
  "Vijay Singh Pathik was associated with it.",
  "It was the first movement led by Gandhi in India.",
], [1, 2], "Gandhi's first movement in India was at Champaran (1917).");

h.t("Social Reform & Awakening");
h.st(3, "Consider the following about the Aligarh movement:", [
  "Sir Syed Ahmad Khan founded the Muhammadan Anglo-Oriental College in 1875.",
  "It promoted modern, Western education among Muslims.",
  "It launched the Khilafat movement.",
], [1, 2], "The Khilafat movement (1919–24) was led by the Ali brothers and others.");
h.st(3, "Consider the following about the Theosophical Society:", [
  "It was founded in New York in 1875 by Madame Blavatsky and Colonel Olcott.",
  "Its headquarters later moved to Adyar near Madras.",
  "It was founded by Annie Besant.",
], [1, 2], "Annie Besant joined later and led the Society in India.");

h.t("Medieval Administration");
h.st(3, "Consider the following about the mansabdari system:", [
  "It was organised under Akbar.",
  "'Zat' fixed personal rank and salary, while 'sawar' indicated the number of horsemen to be maintained.",
  "Mansabs were hereditary.",
], [1, 2], "Mansabs were not hereditary; the emperor could transfer or withdraw them.");
h.st(3, "Consider the following about Shivaji's administration:", [
  "The Ashtapradhan was a council of eight ministers.",
  "Chauth was a levy of one-fourth of the revenue of an area.",
  "The Peshwa was the commander-in-chief of the army.",
], [1, 2], "The Peshwa was the chief minister; the Senapati commanded the army.");
h.st(3, "Consider the following about the iqta system of the Delhi Sultanate:", [
  "An iqta was an assignment of land revenue in return for service.",
  "Iltutmish developed it into an administrative institution.",
  "Iqta holders owned the land permanently and passed it to their heirs.",
], [1, 2], "Iqtas were transferable assignments, not ownership.");

h.t("Art & Culture");
h.st(3, "Consider the following about the Pallavas:", [
  "The Shore Temple at Mamallapuram was built under them.",
  "The rathas of Mamallapuram are monolithic structures.",
  "Their capital was Madurai.",
], [1, 2], "The Pallava capital was Kanchipuram; Madurai was the Pandya capital.");
h.st(3, "Consider the following about the Sun Temple at Konark:", [
  "It was built by Narasimhadeva I of the Eastern Ganga dynasty.",
  "It is designed as a colossal chariot of the Sun god.",
  "It is a classic example of the Dravida style.",
], [1, 2], "It belongs to the Kalinga style, a variant of the Nagara style.");
h.mt(3, "Match the painting school with its feature:", [["Mughal (Jahangir period)", "Naturalistic studies of birds and animals"], ["Kangra", "Pahari paintings of Radha–Krishna in soft, lyrical lines"], ["Kishangarh", "Rajasthani paintings including 'Bani Thani'"], ["Madhubani", "Folk paintings of the Mithila region"]], "Each school has a distinctive style and patronage.", "School", "Feature");
h.st(3, "Consider the following about Indian classical music:", [
  "Purandara Dasa is called the father of Carnatic music.",
  "Khayal is a form of Hindustani music.",
  "Thyagaraja composed mainly in Persian.",
], [1, 2], "Thyagaraja composed mostly in Telugu.");

h.t("Towards Independence");
h.st(3, "Consider the following about the integration of princely states:", [
  "V. P. Menon was Secretary of the States Ministry under Sardar Patel.",
  "Under the Instrument of Accession, states ceded defence, external affairs and communications.",
  "Hyderabad acceded to India before 15 August 1947.",
], [1, 2], "Hyderabad was integrated after Operation Polo in September 1948.");
export const HISTORY25C = h.items;

const p = new Bank("polity25c");
p.t("Centre–State Relations");
p.st(3, "Consider the following about Zonal Councils:", [
  "They were set up under the States Reorganisation Act, 1956.",
  "The Union Home Minister chairs each of them.",
  "They are constitutional bodies under Article 263.",
], [1, 2], "Zonal Councils are statutory; the Inter-State Council is the body under Article 263.");
p.st(3, "Consider the following about inter-State river water disputes:", [
  "Article 262 lets Parliament provide by law for their adjudication.",
  "Parliament may exclude the jurisdiction of the Supreme Court over such disputes.",
  "A tribunal's award binds the parties only after the President gives assent to it.",
], [1, 2], "Once published, an award has the same force as a Supreme Court order; there is no Presidential assent.");

p.t("Constitutional Amendments");
p.st(3, "Consider the following about the procedure under Article 368:", [
  "An amendment Bill may be introduced in either House of Parliament.",
  "The President must give assent to an amendment Bill duly passed.",
  "A Bill affecting federal provisions must be ratified by the legislatures of all States.",
], [1, 2], "Ratification by at least half of the States is required; the 24th Amendment made assent obligatory.");
p.hm(3, "Consider the following languages:", ["Bodo", "Konkani", "Maithili", "Santhali"], 3, "Konkani was added by the 71st Amendment (1992).", "How many of the above were added to the Eighth Schedule by the 92nd Amendment?");
p.st(3, "Consider the following about the Preamble:", [
  "The 42nd Amendment added 'socialist', 'secular' and 'integrity'.",
  "In Kesavananda Bharati the Supreme Court held that the Preamble is part of the Constitution.",
  "The Preamble can be enforced in a court like a Fundamental Right.",
], [1, 2], "The Preamble is a key to interpretation but is not enforceable on its own.");
p.st(3, "Consider the following about the 97th Constitutional Amendment (2011):", [
  "It added the right to form co-operative societies to Article 19(1)(c).",
  "It inserted Article 43B on promoting co-operative societies.",
  "In 2021 the Supreme Court upheld Part IXB in full, including provisions on State co-operatives.",
], [1, 2], "The Court struck down the parts of Part IXB dealing with State co-operatives for want of State ratification.");

p.t("Judiciary");
p.mt(3, "Match the case with the principle it is best known for:", [["Kesavananda Bharati (1973)", "Basic structure doctrine"], ["Indira Nehru Gandhi v. Raj Narain (1975)", "Free and fair elections as part of the basic structure"], ["Minerva Mills (1980)", "Balance between Fundamental Rights and Directive Principles"], ["S. R. Bommai (1994)", "Limits on the use of Article 356"]], "Landmark Constitution Bench decisions.", "Case", "Principle");
p.st(3, "Consider the following about writs:", [
  "Habeas corpus can be issued against private individuals as well as the State.",
  "Mandamus cannot be issued against the President or a Governor.",
  "Certiorari can be issued against a private company.",
], [1, 2], "Certiorari lies against judicial and quasi-judicial authorities, and is not available against private bodies.");
p.st(3, "Consider the following about tribunals:", [
  "Article 323A provides for administrative tribunals for public servants.",
  "Articles 323A and 323B were inserted by the 42nd Amendment.",
  "Tribunals under Article 323B can be set up only by Parliament.",
], [1, 2], "Under Article 323B, both Parliament and State legislatures can set up tribunals.");

p.t("Union Finance & Parliament");
p.st(3, "Consider the following about the funds of the Union:", [
  "The Contingency Fund of India is placed at the disposal of the President.",
  "Payments from the Public Account of India do not need a parliamentary appropriation.",
  "The President's salary is charged on the Contingency Fund of India.",
], [1, 2], "The President's emoluments are charged on the Consolidated Fund of India.");
p.st(3, "Consider the following about financial committees of Parliament:", [
  "All members of the Estimates Committee are from the Lok Sabha.",
  "The Public Accounts Committee has members from both Houses.",
  "A Minister can be elected a member of the Public Accounts Committee.",
], [1, 2], "Ministers cannot be members of the financial committees.");
p.st(3, "Consider the following about the Speaker of the Lok Sabha:", [
  "On dissolution of the House, the Speaker remains in office until the new House first meets.",
  "The President appoints the pro tem Speaker.",
  "The Speaker resigns by writing to the President.",
], [1, 2], "The Speaker addresses the resignation to the Deputy Speaker.");
p.st(3, "Which of the following are special powers of the Rajya Sabha?", [
  "It can authorise the creation of new All-India Services.",
  "It alone can move a no-confidence motion against the Council of Ministers.",
  "It can reject a Money Bill.",
], [1], "No-confidence motions lie only in the Lok Sabha; the Rajya Sabha can only recommend changes to a Money Bill within 14 days.", "Which of the above is/are correct?");

p.t("Union Executive");
p.st(3, "Consider the following about the impeachment of the President:", [
  "The charges may be initiated in either House of Parliament.",
  "A 14 days' written notice signed by at least one-fourth of the members of that House is required.",
  "Nominated members of Parliament cannot take part in the impeachment.",
], [1, 2], "Nominated members, who do not vote in the Presidential election, can take part in impeachment.");
p.st(3, "Who among the following are part of the electoral college for the President of India?", [
  "Elected members of the Legislative Assemblies of Delhi and Puducherry",
  "Nominated members of the Rajya Sabha",
  "Members of State Legislative Councils",
], [1], "The 70th Amendment added the elected members of the Assemblies of Delhi and Puducherry.", "Which of the above is/are correct?");
p.st(3, "Consider the following about the Attorney General of India:", [
  "The President appoints a person qualified to be a Supreme Court judge.",
  "The Attorney General can speak in either House of Parliament but cannot vote.",
  "The Attorney General is a member of the Union Cabinet.",
], [1, 2], "The Attorney General is not a member of the Cabinet.");

p.t("Elections & Representation");
p.st(3, "Consider the following about appointment of Election Commissioners under the 2023 Act:", [
  "The selection committee consists of the Prime Minister, the Leader of Opposition (or leader of the largest opposition party) and a Union Cabinet Minister.",
  "The Chief Election Commissioner can be removed only in the manner of a Supreme Court judge.",
  "The Chief Justice of India is a member of the selection committee.",
], [1, 2], "The 2023 Act replaced the interim arrangement (which had included the CJI) set by the Supreme Court in Anoop Baranwal.");
p.st(3, "Consider the following about delimitation:", [
  "The 84th Amendment froze the allocation of Lok Sabha seats among States until the first Census after 2026.",
  "The 2002 delimitation redrew constituency boundaries on the basis of the 2001 Census without changing the number of seats in each State.",
  "The Delimitation Commission is a constitutional body under Article 324.",
], [1, 2], "The Commission is set up under a Delimitation Act passed by Parliament; Article 324 is about the Election Commission.");

p.t("State Government & Local Bodies");
p.st(3, "Consider the following about State Legislative Councils:", [
  "Parliament can create or abolish a Council if the State Assembly passes a resolution by special majority.",
  "Such a law is not treated as an amendment of the Constitution for Article 368.",
  "A Governor can abolish the Council by an executive order.",
], [1, 2], "Creation or abolition is under Article 169 by a law of Parliament.");
p.st(3, "Consider the following about planning committees:", [
  "Article 243ZD provides for a District Planning Committee.",
  "A Metropolitan Planning Committee is for metropolitan areas with a population of ten lakh or more.",
  "Both were added by the 73rd Amendment.",
], [1, 2], "Both were added by the 74th Amendment (Part IXA).");
p.st(3, "Consider the following about linguistic minorities:", [
  "Article 350A asks States to provide instruction in the mother tongue at the primary stage.",
  "Article 350B provides for a Special Officer for Linguistic Minorities appointed by the President.",
  "The Special Officer reports to the Chief Justice of India.",
], [1, 2], "The Special Officer reports to the President, and reports are laid before Parliament.");
export const POLITY25C = p.items;

const s = new Bank("social25c");
s.t("Concepts & Global Models");
s.st(3, "Consider the following about social security standards:", [
  "The Beveridge Report of 1942 laid the foundation of the British welfare state.",
  "ILO Convention No. 102 (1952) sets minimum standards for social security.",
  "India has ratified ILO Convention No. 102.",
], [1, 2], "India has not ratified Convention 102.");
s.st(3, "Consider the following about the constitutional position of social security:", [
  "Social security and social insurance are in the Concurrent List.",
  "Relief of the disabled and unemployable is in the State List.",
  "Old-age pensions and provident funds are exclusively Union subjects.",
], [1, 2], "Provident funds, invalidity and old-age pensions and maternity benefits are in Entry 24 of the Concurrent List.");
s.ar(3, "The National Social Assistance Programme gives effect to a Directive Principle.", "Article 41 asks the State to provide public assistance in cases of old age, sickness and disablement.", "a", "NSAP was launched in 1995.");
s.st(3, "Consider the following about a Universal Basic Income (UBI):", [
  "The Economic Survey 2016-17 discussed UBI as an idea for India.",
  "A UBI is paid unconditionally to individuals.",
  "India has implemented a nationwide UBI.",
], [1, 2], "India has not adopted UBI.");
s.st(3, "Consider the following about population ageing in India:", [
  "The share of people aged 60 and above is projected to roughly double by 2050.",
  "Most elderly Indians receive a contributory pension.",
  "Elderly women are more likely than elderly men to be widowed and financially dependent.",
], [1, 3], "Most elderly people, especially from the informal sector, have no contributory pension.");

s.t("Social Assistance Schemes");
s.st(3, "Consider the following about the National Social Assistance Programme:", [
  "The Indira Gandhi National Old Age Pension Scheme covers BPL persons aged 60 and above.",
  "The National Family Benefit Scheme pays a lump sum on the death of the primary breadwinner.",
  "NSAP is run under an Act of Parliament.",
], [1, 2], "NSAP is a centrally sponsored scheme, not a statutory one.");
s.st(3, "Consider the following about the e-Shram portal:", [
  "Unorganised workers aged 16 to 59 can register on it.",
  "Registered workers get a universal account number on an e-Shram card.",
  "Members of EPFO and ESIC are encouraged to register on it as unorganised workers.",
], [1, 2], "Workers covered by EPFO or ESIC are not eligible to register as unorganised workers.");

s.t("Pension & Insurance Schemes");
s.st(3, "Consider the following about Atal Pension Yojana:", [
  "Income-tax payers have not been allowed to join since October 2022.",
  "It assures a fixed monthly pension of ₹1,000 to ₹5,000 from age 60.",
  "The pension depends only on market returns, without any guarantee.",
], [1, 2], "The Government guarantees the chosen pension amount.");
s.st(3, "Consider the following about PM Shram Yogi Maan-dhan (PM-SYM):", [
  "The Central Government makes a matching contribution.",
  "LIC is the fund manager.",
  "Members of EPFO, ESIC or NPS can also join it.",
], [1, 2], "Workers already covered under EPF, ESI or NPS are excluded.");
s.q(3, "A 30-year-old bank customer joins both PMJJBY and PMSBY. What is the total annual premium payable?", ["₹456", "₹436", "₹330", "₹350"], "PMJJBY ₹436 + PMSBY ₹20 = ₹456 a year.");
s.st(3, "Consider the following about health insurance schemes:", [
  "The Rashtriya Swasthya Bima Yojana was subsumed in PM-JAY.",
  "Treatment under PM-JAY is cashless at empanelled hospitals.",
  "Beneficiary families pay the premium under PM-JAY.",
], [1, 2], "The premium is funded by the Centre and States.");

s.t("ESI & Maternity Benefits");
s.st(3, "Consider the following about cash benefits under the ESI scheme:", [
  "Sickness benefit is paid at 70% of average daily wages for up to 91 days in a year.",
  "Maternity benefit is paid at 100% of average daily wages.",
  "Dependants' benefit is paid only as a one-time lump sum.",
], [1, 2], "Dependants' benefit is a monthly payment, shared among dependants at 90% of wages.");
s.st(3, "Consider the following about the Maternity Benefit (Amendment) Act, 2017:", [
  "Paid leave is 26 weeks for a woman with fewer than two surviving children.",
  "A woman adopting a child below three months gets 12 weeks' leave.",
  "A creche is mandatory for establishments with 10 or more employees.",
], [1, 2], "The creche requirement applies to establishments with 50 or more employees.");

s.t("Code on Social Security");
s.st(3, "Consider the following about gig and platform workers under the Code on Social Security, 2020:", [
  "Aggregators contribute 1–2% of annual turnover, capped at 5% of the amount payable to such workers.",
  "A National Social Security Board advises on schemes for them.",
  "They are treated as regular employees of the platform.",
], [1, 2], "The Code defines them separately from employees.");
s.ar(3, "Contributory schemes such as EPF are classed as social insurance.", "In social insurance, benefits depend on contributions made during working life.", "a", "Social assistance, by contrast, is financed from general taxes and paid on need.");
export const SOCIAL25C = s.items;

const a = new Bank("accounting25c");
a.t("Ratio Concepts");
a.q(3, "A firm has current assets of ₹4,00,000, which include inventory of ₹1,00,000 and prepaid expenses of ₹20,000. Its current liabilities are ₹2,00,000. What is its quick ratio?", ["1.4 : 1", "2 : 1", "1.5 : 1", "1.9 : 1"], "Quick assets = 4,00,000 − 1,00,000 − 20,000 = 2,80,000; 2,80,000 / 2,00,000 = 1.4.");
a.t("Inventory Valuation");
a.st(3, "When prices are rising, consider the following:", [
  "FIFO gives a higher closing inventory than the weighted average method.",
  "FIFO shows a higher profit than the weighted average method.",
  "LIFO is permitted under Ind AS 2.",
], [1, 2], "Ind AS 2 does not allow LIFO.");
a.t("Partnership Accounts");
a.q(3, "Profits of a firm for the last three years were ₹60,000, ₹80,000 and ₹1,00,000. Goodwill is to be valued at two years' purchase of average profits. What is the goodwill?", ["₹1,60,000", "₹2,40,000", "₹80,000", "₹1,20,000"], "Average = 2,40,000 / 3 = 80,000; × 2 = 1,60,000.");
a.q(3, "A and B share profits 3 : 2. C is admitted for a 1/5 share, and the new ratio of A, B and C is 2 : 2 : 1. What is the sacrificing ratio of A and B?", ["A alone sacrifices (1 : 0)", "3 : 2", "1 : 1", "2 : 3"], "A: 3/5 − 2/5 = 1/5; B: 2/5 − 2/5 = 0. Only A sacrifices.");
a.t("Accounting Concepts");
a.hm(3, "Consider the following items:", ["Wages paid for installing a new machine", "Repairs to an existing building", "Legal fees paid for acquiring land", "Insurance premium on the factory"], 2, "Installation wages and legal fees on acquisition are capitalised.", "How many of the above are capital expenditure?");
a.st(3, "Consider the following about provisions and reserves:", [
  "A provision is a charge against profit.",
  "A reserve is an appropriation of profit.",
  "Provision for doubtful debts is a reserve.",
], [1, 2], "It is a provision made for a known liability or loss of uncertain amount.");
a.st(3, "Consider the following about contingent liabilities:", [
  "They are disclosed in notes to accounts rather than recognised in the balance sheet.",
  "A guarantee given for another company's loan is an example.",
  "They are always recognised as provisions.",
], [1, 2], "A provision is recognised only when an outflow is probable and can be reliably estimated.");
export const ACCOUNTING25C = a.items;

const c = new Bank("current25c");
c.t("Defence & Security");
c.st(3, "After the Pahalgam attack in April 2025, India took which of the following steps?", [
  "Closed the Attari Integrated Check Post.",
  "Cancelled visas issued to Pakistani nationals under the SAARC Visa Exemption Scheme.",
  "Expelled all staff of the Pakistan High Commission and closed the mission.",
], [1, 2], "India declared defence advisers persona non grata and cut the High Commission's strength, but did not close it.", "Which of the above is/are correct?");
c.t("Science & Space (Current)");
c.st(3, "Consider the following about the Bharat Forecast System launched in 2025:", [
  "It is a weather forecasting model used by the India Meteorological Department.",
  "It works at a resolution of about 6 km, among the finest for global models.",
  "It was developed by NASA for India.",
], [1, 2], "It was developed by the Indian Institute of Tropical Meteorology, Pune.");
c.st(3, "Consider the following about Mission Mausam:", [
  "It aims to make India 'weather-ready and climate-smart'.",
  "It is implemented through IMD, IITM and NCMRWF.",
  "It is run by the Ministry of Agriculture.",
], [1, 2], "It is run by the Ministry of Earth Sciences.");
c.st(3, "Consider the following about Shubhanshu Shukla's spaceflight in 2025:", [
  "It was part of the Axiom-4 commercial mission.",
  "The crew travelled on a SpaceX Dragon spacecraft.",
  "He became the first Indian to go to space.",
], [1, 2], "Rakesh Sharma flew in 1984; Shukla was the first Indian on the ISS.");
c.t("Appointments & Personalities");
c.st(3, "Consider the following about financial regulators:", [
  "Sanjay Malhotra became Governor of the RBI in December 2024.",
  "Tuhin Kanta Pandey became Chairman of SEBI in 2025.",
  "Madhabi Puri Buch was given a second term as SEBI Chairperson.",
], [1, 2], "Her term ended in February 2025.");
export const CURRENT25C = c.items;

const sc = new Bank("science25c");
sc.t("Biology & Health");
sc.st(3, "Consider the following about iron in the diet:", [
  "Vitamin C improves absorption of iron from plant foods.",
  "Tea or coffee taken with meals can reduce iron absorption.",
  "Plant foods contain haem iron, which is absorbed better than iron from meat.",
], [1, 2], "Haem iron is found in meat; plant foods contain non-haem iron, which is absorbed less well.");
sc.st(3, "Consider the following about heat stress:", [
  "Wet-bulb temperature reflects both heat and humidity.",
  "High humidity reduces the body's ability to cool by evaporation of sweat.",
  "Heat stroke is milder than heat exhaustion.",
], [1, 2], "Heat stroke is a medical emergency; heat exhaustion is less severe.");
sc.mt(3, "Match the disease with its main animal reservoir or vector:", [["Nipah virus", "Fruit bats"], ["Kyasanur Forest Disease", "Ticks"], ["H5N1 avian influenza", "Birds"], ["Rabies", "Dogs"]], "Zoonoses move from animals to humans.", "Disease", "Source");
sc.st(3, "Consider the following about iodine and the thyroid:", [
  "Iodine deficiency can cause goitre.",
  "Thyroxine regulates the basal metabolic rate.",
  "Iodised salt is potassium chloride with added iodine.",
], [1, 2], "Iodised salt is common salt (sodium chloride) fortified with potassium iodate or iodide.");
sc.st(3, "Consider the following about salt and blood pressure:", [
  "The WHO recommends that adults consume less than 5 g of salt a day.",
  "High sodium intake raises the risk of hypertension.",
  "Potassium-rich foods raise blood pressure.",
], [1, 2], "Potassium helps lower blood pressure.");
sc.st(3, "Consider the following about food preservation:", [
  "Pasteurisation heats milk to kill harmful microbes without boiling it.",
  "Irradiation makes food radioactive.",
  "Refrigeration slows the growth of microbes.",
], [1, 3], "Irradiated food does not become radioactive.");

sc.t("Physics & Earth Science");
sc.q(3, "An earthquake of magnitude 7 releases roughly how much more energy than one of magnitude 5?", ["About 1,000 times", "About 100 times", "About 20 times", "About 2 times"], "Each unit of magnitude means about 32 times more energy; 32 × 32 ≈ 1,000.");
sc.ar(3, "Lakes in cold regions freeze from the top, so aquatic life survives below.", "Water is densest at about 4 °C, and ice is less dense than liquid water.", "a", "Ice floats and insulates the water beneath.");
sc.st(3, "Consider the following about the decibel scale:", [
  "An increase of 10 dB means a tenfold increase in sound intensity.",
  "Long exposure to sound above about 85 dB can damage hearing.",
  "The decibel scale is linear.",
], [1, 2], "The scale is logarithmic.");
sc.st(3, "Consider the following about the light-year:", [
  "It is a unit of distance.",
  "It equals about 9.46 × 10¹² km.",
  "Sunlight takes about a year to reach the Earth.",
], [1, 2], "Sunlight takes about 8 minutes 20 seconds.");
sc.q(3, "Why do stars twinkle while planets generally do not?", ["Stars are point sources whose light is bent unevenly by turbulent air; planets appear as small discs that average out the changes", "Stars give out flashes of light, while planets shine steadily", "Planets are hotter than stars", "Stars are nearer to the Earth than planets"], "Atmospheric refraction affects a point source more noticeably.");
sc.st(3, "Consider the following about lightning safety:", [
  "Lightning is among the leading causes of deaths from natural hazards in India.",
  "The 'Damini' app gives lightning alerts.",
  "Lying flat on open ground is the safest position during lightning.",
], [1, 2], "Crouch low with feet together and minimise ground contact; do not lie flat.");
sc.st(3, "Consider the following about LIGO-India:", [
  "It is designed to detect gravitational waves.",
  "It is being built in Hingoli district, Maharashtra.",
  "It is an optical telescope for viewing distant galaxies.",
], [1, 2], "It is a laser interferometer, not a telescope.");
sc.st(3, "Consider the following about dark matter:", [
  "It does not emit or absorb light in any detectable way.",
  "Its existence is inferred from gravitational effects such as galaxy rotation curves.",
  "It is made of ordinary atoms of hydrogen and helium.",
], [1, 2], "It is not made of ordinary (baryonic) matter.");

sc.t("Chemistry in Daily Life");
sc.mt(3, "Match the polymer with its use:", [["Teflon (PTFE)", "Non-stick coating on cookware"], ["Bakelite", "Electrical switches and handles"], ["Nylon", "First fully synthetic fibre"], ["PVC", "Pipes and cable insulation"]], "Polymers chosen for their properties.", "Polymer", "Use");
sc.ar(3, "Detergents clean well even in hard water.", "The calcium and magnesium salts of detergents are soluble, unlike those of soaps.", "a", "Soaps form insoluble scum in hard water.");
sc.st(3, "Consider the following about neem-coated urea:", [
  "Urea contains about 46% nitrogen.",
  "Neem coating slows the release of nitrogen in the soil.",
  "Neem coating makes it easier to divert urea for industrial use.",
], [1, 2], "Neem coating discourages diversion to industry.");
export const SCIENCE25C = sc.items;
