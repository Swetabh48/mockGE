import { Bank } from "../bank/dsl";

/** 2025-pattern Polity: appointments, finance, procedure, relations — analytical items. */
const b = new Bank("polity25b");

b.t("Union Executive");
b.st(3, "Consider the following about the election of the Vice-President:", [
  "The electoral college consists of all members (elected and nominated) of both Houses of Parliament.",
  "Members of State Legislative Assemblies also vote.",
  "The election is by proportional representation by single transferable vote and secret ballot.",
], [1, 3], "State legislators vote in the presidential election, not in the vice-presidential election.");
b.st(3, "Consider the following about the removal of the Vice-President:", [
  "A resolution is passed by the Rajya Sabha by a majority of all its then members and agreed to by the Lok Sabha.",
  "At least fourteen days' notice of the intention to move the resolution is required.",
  "The grounds for removal are specified in the Constitution.",
], [1, 2], "The Constitution prescribes no grounds for removal of the Vice-President.");
b.hm(3, "Who among the following participate in the election of the President of India?", [
  "Elected members of the Rajya Sabha",
  "Nominated members of the Lok Sabha",
  "Elected members of the Legislative Assembly of Puducherry",
  "Elected members of State Legislative Councils",
], 2, "Elected MPs and elected MLAs (including Delhi and Puducherry) vote; nominated members and MLCs do not.", "How many of the above participate?");
b.q(3, "Which of the following statements about the Attorney-General of India is correct?", ["He or she is entitled to audience in all courts in India and can take part in parliamentary proceedings without a vote", "He or she is a member of the Union Cabinet", "He or she holds office for a fixed term of five years", "He or she cannot engage in private practice at all"], "Article 76 and 88; the AG holds office during the pleasure of the President.");
b.st(3, "Consider the following about the Council of Ministers:", [
  "Ministers hold office during the pleasure of the President.",
  "A person who is not a Member of Parliament can be a minister for up to six months.",
  "The Council is collectively responsible to both Houses of Parliament.",
], [1, 2], "Collective responsibility is to the Lok Sabha only.");

b.t("Parliament");
b.st(3, "With reference to the Rajya Sabha, consider the following:", [
  "It is not subject to dissolution.",
  "The Deputy Chairman is elected from among its members.",
  "The Vice-President votes in the Rajya Sabha on all questions as its Chairman.",
], [1, 2], "The Chairman has only a casting vote in case of a tie.");
b.q(3, "A minister introduces a Bill providing for the imposition of a new tax and also for creation of a new regulatory body. Such a Bill is:", ["A Financial Bill under Article 117(1), introducible only in the Lok Sabha on the President's recommendation", "A Money Bill under Article 110", "An ordinary Bill that can be introduced in either House", "A Constitution Amendment Bill"], "A Money Bill must deal only with Article 110 matters; including other matters makes it a Financial Bill (Category I).");
b.mt(3, "Match the parliamentary committee with its main function:", [["Estimates Committee", "Suggests economies in the estimates; all members from the Lok Sabha"], ["Public Accounts Committee", "Examines CAG reports on appropriation and finance accounts"], ["Committee on Public Undertakings", "Examines reports and accounts of public sector undertakings"], ["Business Advisory Committee", "Allots time for government and other business in the House"]], "The PAC and COPU each have 22 members (15 Lok Sabha + 7 Rajya Sabha) but different mandates.", "Committee", "Function");
b.st(3, "Consider the following about the Department-related Standing Committees:", [
  "They examine Demands for Grants of ministries.",
  "Each has members from both Houses.",
  "They can examine Bills referred to them.",
], [1, 2, 3], "All three are correct; there are 24 such committees.");
b.ar(3, "A no-confidence motion can be moved only in the Lok Sabha.", "The Council of Ministers is collectively responsible to the Lok Sabha.", "a", "R explains A.");
b.q(3, "Which of the following requires a 'special majority' of Parliament under Article 368 AND ratification by at least half the State legislatures?", ["An amendment changing the representation of States in Parliament", "An amendment to Fundamental Rights", "Creation of a new State", "Changing the quorum in Parliament"], "Federal provisions (e.g., representation of States, election of President, Seventh Schedule) need ratification; creation of a new State is by simple majority under Articles 2–4.");
b.st(3, "Consider the following about Parliamentary privileges:", [
  "No member is liable to court proceedings for anything said in Parliament.",
  "Members are free from arrest in civil cases during the session and 40 days before and after.",
  "Members are immune from arrest in criminal cases during the session.",
], [1, 2], "Privilege from arrest does not extend to criminal cases.");

b.t("Judiciary");
b.st(3, "Consider the following about High Courts:", [
  "The writ jurisdiction under Article 226 is wider than that of the Supreme Court under Article 32.",
  "Under Article 227, a High Court has superintendence over courts and tribunals within its territory.",
  "Judges of High Courts retire at the age of 65.",
], [1, 2], "High Court judges retire at 62.");
b.q(3, "A tribunal's decision is challenged. After L. Chandra Kumar (1997), which is the correct route?", ["Before a Division Bench of the High Court, as judicial review by High Courts is part of the basic structure", "Directly and only before the Supreme Court", "No challenge is possible", "Before the President"], "Tribunals' decisions are subject to High Court scrutiny under Articles 226/227.");
b.ar(3, "Public interest litigation relaxed the rule of locus standi.", "Courts allowed public-spirited persons to approach them on behalf of those unable to do so.", "a", "R explains A.");
b.hm(3, "Which of the following are part of the 'basic structure' as recognised by the Supreme Court?", [
  "Judicial review",
  "Secularism",
  "Federalism",
  "Right to property",
], 3, "Right to property is not part of the basic structure.", "How many of the above?");

b.t("Union Finance");
b.mt(3, "Match the Article with its financial provision:", [["Article 266", "Consolidated Funds and Public Accounts"], ["Article 267", "Contingency Fund"], ["Article 275", "Statutory grants-in-aid to States"], ["Article 282", "Discretionary grants by the Union or a State for any public purpose"]], "Key Articles in Part XII.", "Article", "Provision");
b.st(3, "Consider the following about borrowing by States:", [
  "A State may borrow within India on the security of its Consolidated Fund.",
  "A State indebted to the Centre needs the Centre's consent to borrow.",
  "States can borrow directly from abroad without any restriction.",
], [1, 2], "Article 293; States cannot borrow abroad directly.");
b.q(3, "Which of the following is NOT shared with States from the divisible pool of central taxes?", ["Cesses and surcharges levied by the Union", "Corporation tax", "Personal income tax", "Central GST"], "Cesses and surcharges are excluded from the divisible pool.");
b.ar(3, "The CAG is called the guardian of the public purse.", "The CAG audits receipts and expenditure of the Union and the States to ensure money is spent as authorised.", "a", "R explains A.");

b.t("Constitutional & Statutory Bodies");
b.st(3, "Consider the following about the UPSC:", [
  "Its members hold office for six years or until 65 years of age.",
  "It is consulted on disciplinary matters affecting civil servants.",
  "Its advice is binding on the Government.",
], [1, 2], "UPSC's advice is advisory; the Government must explain non-acceptance to Parliament.");
b.st(3, "Consider the following about the National Commission for Backward Classes:", [
  "It received constitutional status through the 102nd Amendment.",
  "The 105th Amendment restored the power of States to identify socially and educationally backward classes.",
  "It is chaired by the Union Minister of Social Justice.",
], [1, 2], "Its chairperson is appointed by the President; ministers do not chair it.");
b.q(3, "Which of the following pairs of a body and the authority appointing its head is correct?", ["Central Vigilance Commissioner — President, on recommendation of a committee headed by the Prime Minister", "Chief Information Commissioner — Chief Justice of India", "Lokpal Chairperson — Lok Sabha Speaker alone", "NHRC Chairperson — Prime Minister alone"], "CVC, CIC, Lokpal and NHRC heads are appointed by the President on recommendations of high-level committees.");
b.hm(3, "Which of the following bodies are chaired by the Prime Minister?", [
  "NITI Aayog",
  "National Development Council (historically)",
  "Inter-State Council",
  "GST Council",
], 3, "The GST Council is chaired by the Union Finance Minister.", "How many of the above?");

b.t("Centre–State Relations");
b.st(3, "Consider the following about the Inter-State Council:", [
  "It is provided under Article 263.",
  "It was set up in 1990 on the recommendation of the Sarkaria Commission.",
  "Its recommendations are binding on States.",
], [1, 2], "It is advisory.");
b.q(3, "A State refuses to comply with a Union direction under Article 256. Which consequence is provided by the Constitution?", ["The President may hold that the constitutional machinery has failed (Article 365), enabling Article 356", "The Supreme Court automatically dissolves the State Assembly", "The Union can stop all tax devolution", "The State loses its seats in the Rajya Sabha"], "Article 365 links non-compliance with directions to Article 356.");
b.st(3, "Consider the following about inter-State water disputes:", [
  "Article 262 allows Parliament to exclude the Supreme Court's jurisdiction over such disputes.",
  "Tribunals are set up under the Inter-State River Water Disputes Act, 1956.",
  "Water is a subject in the Union List only.",
], [1, 2], "Water is in the State List (Entry 17), subject to Entry 56 of the Union List on inter-State rivers.");

b.t("Local Government");
b.st(3, "Consider the following about urban local bodies under the 74th Amendment:", [
  "Ward Committees are required in municipalities with a population of three lakh or more.",
  "The Twelfth Schedule lists 18 functions.",
  "Metropolitan Planning Committees are required in metropolitan areas.",
], [1, 2, 3], "All three are correct.");
b.ar(3, "The 73rd Amendment requires a State Finance Commission every five years.", "Panchayats depend on devolution of funds from the State, which needs periodic review.", "a", "R explains A.");

b.t("Special Provisions");
b.st(3, "Consider the following about the Fifth and Sixth Schedules:", [
  "The Sixth Schedule applies to tribal areas in Assam, Meghalaya, Tripura and Mizoram.",
  "Autonomous District Councils exist under the Sixth Schedule.",
  "Tribes Advisory Councils are a feature of the Fifth Schedule.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following States has special provisions under Article 371A?", ["Nagaland", "Sikkim", "Mizoram", "Manipur"], "371A: Nagaland; 371F: Sikkim; 371G: Mizoram; 371C: Manipur.");

b.t("Elections & Representation");
b.st(3, "Consider the following about the anti-defection law:", [
  "A nominated member who joins a party within six months of taking the seat is not disqualified.",
  "An independent member joining a party after election is disqualified.",
  "A split of one-third of a legislature party is protected from disqualification.",
], [1, 2], "Protection for a one-third split was removed by the 91st Amendment; only mergers backed by two-thirds are protected.");
b.q(3, "Which electoral reform is directly associated with PUCL v. Union of India (2013)?", ["Introduction of the NOTA option", "Disqualification on conviction", "Electoral bonds", "VVPAT in all constituencies"], "The Court directed the NOTA option on EVMs.");
b.st(3, "Consider the following about the Delimitation Commission:", [
  "Its orders have the force of law and cannot be called in question in any court.",
  "Lok Sabha seat allocation among States is frozen on the basis of the 1971 census until the first census after 2026.",
  "It is a permanent constitutional body.",
], [1, 2], "Delimitation Commissions are set up under Acts of Parliament as needed.");

b.t("Making of the Constitution");
b.st(3, "Consider the following about the Constituent Assembly:", [
  "Its members were indirectly elected by the members of the provincial legislative assemblies.",
  "Dr. B. R. Ambedkar was the President of the Constituent Assembly.",
  "It also functioned as the first Parliament of free India.",
], [1, 3], "Dr. Rajendra Prasad was its President; Ambedkar chaired the Drafting Committee.");
b.q(3, "Which feature was borrowed from the Irish Constitution?", ["Directive Principles of State Policy and method of election of the President", "Fundamental Rights", "Parliamentary privileges", "Procedure established by law"], "The Irish Constitution also inspired nomination of members to the Rajya Sabha.");
b.ar(3, "The Preamble is a part of the Constitution.", "In Kesavananda Bharati, the Supreme Court held that the Preamble can be used to interpret ambiguous provisions.", "b", "Both are true; R is about the Preamble's interpretive use, while A follows from the Court's holding that it is part of the Constitution.");

b.t("Fundamental Rights & Duties");
b.st(3, "Consider the following about reservations:", [
  "Article 16(4A) permits reservation in promotions for SCs and STs.",
  "The 50% ceiling on reservations was laid down in Indra Sawhney (1992), subject to exceptional circumstances.",
  "EWS reservation under the 103rd Amendment was upheld in Janhit Abhiyan (2022).",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following is protected by Article 20?", ["Protection against double jeopardy, ex post facto criminal laws and self-incrimination", "Right to a speedy trial", "Right to legal aid", "Right against preventive detention"], "Article 22 deals with arrest and preventive detention.");
b.st(3, "Consider the following about Article 25:", [
  "It is subject to public order, morality and health.",
  "It permits the State to regulate secular activities associated with religious practice.",
  "It is available only to citizens.",
], [1, 2], "Freedom of religion is available to all persons.");
b.ar(3, "Article 15(3) allows special provisions for women and children.", "Equality under Article 14 permits reasonable classification on an intelligible differentia with a rational nexus to the object.", "b", "Both are true. R explains the general doctrine of classification under Article 14, but A rests on the specific enabling clause in Article 15(3).");

b.t("Polity – Miscellaneous");
b.st(3, "Consider the following about official languages:", [
  "Hindi in Devanagari script is the official language of the Union under Article 343.",
  "English continues to be used for official purposes under the Official Languages Act, 1963.",
  "The Eighth Schedule now has 22 languages.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following best describes India's 'secularism' as interpreted by courts?", ["Equal respect and treatment of all religions by the State, with the State free to regulate secular aspects", "Complete separation with no State engagement with religion", "State patronage of a majority religion", "Prohibition of religious education everywhere"], "S. R. Bommai treated secularism as part of the basic structure.");
b.hm(3, "Which of the following are features of the Indian parliamentary system?", [
  "Collective responsibility of the Council of Ministers",
  "A nominal head of State",
  "Fixed tenure of the executive independent of the legislature",
  "Membership of ministers in the legislature",
], 3, "A fixed executive tenure is a presidential feature.", "How many of the above?");
b.st(3, "Consider the following about the Comptroller and Auditor General:", [
  "The CAG's salary is charged on the Consolidated Fund of India.",
  "The CAG is not eligible for further office under the Government after ceasing to hold office.",
  "The CAG submits reports on State accounts to the Governor.",
], [1, 2, 3], "Articles 148 and 151.");
b.q(3, "Which of the following is an example of 'delegated legislation'?", ["Rules framed by the Central Government under the Code on Social Security", "A Bill passed by Parliament", "An ordinance by the President", "A Supreme Court judgment"], "Rules made by the executive under powers conferred by a statute are delegated legislation.");
b.st(3, "Consider the following about the Union Territories:", [
  "Delhi has a Legislative Assembly under Article 239AA.",
  "Ladakh is a Union Territory without a legislature.",
  "Chandigarh has a Legislative Assembly.",
], [1, 2], "Chandigarh has no legislature.");
b.q(3, "A State government wishes to create a new district. Which authority has the power?", ["The State Government, by executive action under State law", "Parliament by a constitutional amendment", "The President under Article 3", "The Election Commission"], "Districts are created by States; Article 3 concerns new States.");
b.ar(3, "Parliament can alter the boundaries of a State by a simple majority.", "Article 4 provides that such laws are not amendments of the Constitution for the purposes of Article 368.", "a", "R explains A.");
b.st(3, "Consider the following about the President's rule (Article 356):", [
  "It must be approved by both Houses of Parliament within two months.",
  "Once approved it continues for six months, and can be extended up to three years with conditions after the first year.",
  "The State Legislative Assembly is always dissolved when it is imposed.",
], [1, 2], "The Assembly may be kept in suspended animation.");

b.t("Judiciary");
b.q(3, "A litigant wants to appeal against a High Court judgment in a civil matter that raises a substantial question of law of general importance. The appropriate route is:", ["Appeal to the Supreme Court on a certificate under Article 133 or by special leave under Article 136", "Writ under Article 32", "Reference to the President under Article 143", "Appeal to the Law Commission"], "Articles 132–136 govern appeals.");
b.st(3, "Consider the following about Lok Adalats:", [
  "They work under the Legal Services Authorities Act, 1987.",
  "Their award is deemed a decree of a civil court.",
  "An appeal lies against a Lok Adalat award to the District Court.",
], [1, 2], "No appeal lies against a Lok Adalat award.");

b.t("Constitutional Amendments");
b.st(3, "Consider the following about the 42nd Amendment (1976):", [
  "It added Fundamental Duties.",
  "It made the advice of the Council of Ministers binding on the President.",
  "It extended the term of the Lok Sabha to six years, later restored to five by the 44th Amendment.",
], [1, 2, 3], "All three are correct.");
b.st(3, "Consider the following about the 44th Amendment (1978):", [
  "It replaced 'internal disturbance' with 'armed rebellion' in Article 352.",
  "It allowed the President to return the advice of the Council of Ministers once for reconsideration.",
  "It made the right to property a Fundamental Right.",
], [1, 2], "It removed property from the Fundamental Rights.");

export default b.items;
