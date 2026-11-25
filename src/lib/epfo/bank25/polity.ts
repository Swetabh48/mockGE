import { Bank } from "../bank/dsl";

/** 2025-pattern Polity & Governance: statement, match and reasoning items. */
const b = new Bank("polity25");

b.t("Fundamental Rights & Duties");
b.st(3, "Consider the following about Fundamental Rights:", [
  "Rights under Articles 15, 16 and 19 are available only to citizens.",
  "Article 21 protects both citizens and non-citizens.",
  "All Fundamental Rights can be suspended during a national emergency.",
], [1, 2], "Articles 20 and 21 cannot be suspended even during an emergency (44th Amendment).");
b.st(3, "With reference to Article 32, consider the following:", [
  "It is itself a Fundamental Right.",
  "The Supreme Court can issue writs only for enforcement of Fundamental Rights under it.",
  "Parliament can empower any other court to issue writs within its jurisdiction.",
], [1, 2, 3], "Article 32(3) allows Parliament to empower other courts.");
b.q(3, "A detained person's relatives file a petition alleging illegal detention by a private security agency. Which writ is appropriate and why?", ["Habeas corpus, as it lies against both public authorities and private persons", "Mandamus, as it compels a public duty", "Certiorari, as it quashes orders of tribunals", "Quo warranto, as it questions authority to hold office"], "Habeas corpus is the only writ issuable against private persons as well.");
b.mt(3, "Match the writ with the situation in which it is ordinarily used:", [["Mandamus", "Compelling an official to perform a statutory duty"], ["Prohibition", "Stopping a lower court from exceeding jurisdiction in a pending case"], ["Certiorari", "Quashing an order already passed by a lower court or tribunal"], ["Quo warranto", "Inquiring into the legality of a claim to a public office"]], "Prohibition is preventive; certiorari is both preventive and curative.", "Writ", "Use");
b.hm(3, "Which of the following have been recognised by the Supreme Court as part of Article 21?", [
  "Right to privacy",
  "Right to livelihood",
  "Right to a speedy trial",
  "Right to strike",
], 3, "There is no fundamental right to strike.", "How many of the above?");
b.ar(3, "The right to property is no longer a Fundamental Right.", "The 44th Amendment deleted Article 31 and placed the right to property in Article 300A.", "a", "R explains A.");
b.st(3, "Consider the following about the Right to Information Act, 2005:", [
  "The Chief Information Commissioner is appointed by the President on the recommendation of a committee headed by the Prime Minister.",
  "Information relating to the life or liberty of a person is to be provided within 48 hours.",
  "The 2019 amendment allowed the Central Government to prescribe the term and salary of Information Commissioners.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Under the RTI Act, which of the following is an appellate authority for a first appeal within a public authority?", ["An officer senior in rank to the Public Information Officer", "The Supreme Court", "The Lokpal", "The CAG"], "The first appeal lies to a senior officer; the second appeal to the Information Commission.");
b.st(3, "Consider the following Fundamental Duties under Article 51A:", [
  "To value and preserve the rich heritage of our composite culture.",
  "To safeguard public property and abjure violence.",
  "To vote in every election.",
], [1, 2], "Voting is not listed as a Fundamental Duty.");

b.t("Directive Principles");
b.st(3, "Consider the following about Directive Principles of State Policy:", [
  "They are fundamental in the governance of the country.",
  "Courts cannot enforce them directly.",
  "A law implementing Articles 39(b) or 39(c) is protected under Article 31C from challenge under Articles 14 and 19.",
], [1, 2, 3], "Article 31C protects such laws (the broader 42nd Amendment extension was struck down in Minerva Mills).");
b.mt(3, "Match the Directive Principle with its subject:", [["Article 40", "Organisation of village panchayats"], ["Article 44", "Uniform civil code"], ["Article 48A", "Protection of environment, forests and wildlife"], ["Article 50", "Separation of judiciary from executive"]], "Standard DPSP mapping.", "Article", "Subject");
b.ar(3, "The Uniform Civil Code is a Directive Principle rather than an enforceable right.", "Article 37 makes Directive Principles non-justiciable.", "a", "Article 44 is in Part IV; Article 37 explains why it is not enforceable.");
b.st(3, "Consider the following about the Uniform Civil Code:", [
  "Article 44 directs the State to endeavour to secure a UCC throughout the territory of India.",
  "Uttarakhand implemented a UCC law in 2025.",
  "Goa has had a common civil code since before its integration with India.",
], [1, 2, 3], "All three are correct.");

b.t("Parliament");
b.st(3, "With reference to Money Bills, consider the following:", [
  "A Money Bill can be introduced only in the Lok Sabha on the recommendation of the President.",
  "The Rajya Sabha can reject a Money Bill.",
  "The Speaker's certificate that a Bill is a Money Bill is endorsed on it when sent to the Rajya Sabha.",
], [1, 3], "The Rajya Sabha can only recommend amendments within 14 days.");
b.q(3, "A Bill (not a Money Bill) passed by the Lok Sabha is pending with the Rajya Sabha for more than six months without action. The President may:", ["Summon a joint sitting of both Houses", "Assent to it directly", "Refer it to the Supreme Court automatically", "Dissolve the Rajya Sabha"], "Article 108 permits a joint sitting when more than six months lapse.");
b.hm(3, "In which of the following can a joint sitting of Parliament NOT be held?", [
  "A Money Bill",
  "A Constitution Amendment Bill",
  "An ordinary Bill rejected by the other House",
  "A Financial Bill under Article 117(1)",
], 2, "Joint sittings are barred for Money Bills and Constitution Amendment Bills.", "How many of the above?");
b.st(3, "Consider the following about the Speaker of the Lok Sabha:", [
  "The Speaker decides questions of disqualification under the Tenth Schedule, subject to judicial review.",
  "The Speaker presides over joint sittings.",
  "The Speaker can be removed by a resolution passed by a majority of all the then members of the House.",
], [1, 2, 3], "All three are correct (Kihoto Hollohan; Article 118; Article 94).");
b.mt(3, "Match the parliamentary device with its purpose:", [["Zero Hour", "Raising urgent matters without prior notice"], ["Calling attention motion", "Drawing a minister's attention to a matter of urgent public importance"], ["Cut motion", "Seeking reduction in a demand for grant"], ["Adjournment motion", "Discussing a definite matter of urgent public importance by setting aside normal business"]], "Adjournment motions need the support of 50 members in the Lok Sabha.", "Device", "Purpose");
b.q(3, "The Public Accounts Committee examines the Appropriation Accounts. Which statement about it is correct?", ["It has 15 Lok Sabha and 7 Rajya Sabha members and by convention is chaired by an Opposition member", "It has only Lok Sabha members", "It examines the Budget estimates before they are voted", "It is chaired by the Finance Minister"], "The Estimates Committee has only Lok Sabha members and examines estimates.");
b.ar(3, "The Rajya Sabha has special powers to authorise Parliament to legislate on a State List matter.", "Under Article 249, it can pass a resolution by two-thirds of members present and voting declaring such legislation necessary in the national interest.", "a", "R explains A.");
b.st(3, "Consider the following about the Union Budget process:", [
  "The Annual Financial Statement is laid under Article 112.",
  "Expenditure charged on the Consolidated Fund is not submitted to the vote of Parliament, though it can be discussed.",
  "A Vote on Account is passed under Article 116.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following is a 'charged' expenditure on the Consolidated Fund of India?", ["Salaries and allowances of the Comptroller and Auditor General", "Salary of the Prime Minister", "Expenditure on defence procurement", "Grants to States under centrally sponsored schemes"], "Charged items include emoluments of the President, Speaker, judges, CAG and debt charges.");

b.t("Union Executive");
b.st(3, "Consider the following about the President's pardoning power under Article 72:", [
  "It extends to sentences by court martial.",
  "It extends to death sentences.",
  "It is exercised on the advice of the Council of Ministers.",
], [1, 2, 3], "All three are correct; the Governor's power under Article 161 does not cover court martial or death sentence pardons.");
b.q(3, "The President returns a Bill (not a Money Bill) to Parliament for reconsideration, and Parliament passes it again without amendment. The President:", ["Must give assent", "May again return it", "May refer it to the Supreme Court and withhold assent", "May dissolve the Lok Sabha"], "Article 111: assent cannot be withheld when the Bill is re-passed.");
b.st(3, "Consider the following about ordinances:", [
  "The President can promulgate an ordinance only when both Houses are not in session or one is not in session.",
  "An ordinance can amend the Constitution.",
  "An ordinance lapses six weeks after the reassembly of Parliament unless approved.",
], [1, 3], "An ordinance cannot amend the Constitution.");
b.q(3, "If both the President and the Vice-President are unavailable, who discharges the functions of the President?", ["The Chief Justice of India (or in absence, the senior-most Supreme Court judge)", "The Speaker of the Lok Sabha", "The Prime Minister", "The Attorney-General"], "Under the President (Discharge of Functions) Act, 1969.");

b.t("Judiciary");
b.st(3, "Consider the following safeguards for the independence of the judiciary:", [
  "Salaries of Supreme Court judges are charged on the Consolidated Fund of India.",
  "Their conduct cannot be discussed in Parliament except on a motion for removal.",
  "Retired Supreme Court judges cannot plead before any court in India.",
], [1, 2, 3], "Articles 112(3), 121 and 124(7).");
b.q(3, "Which judgment restored the collegium system by striking down the National Judicial Appointments Commission?", ["Supreme Court Advocates-on-Record Association v. Union of India (2015)", "S. P. Gupta (1981)", "Kesavananda Bharati (1973)", "Minerva Mills (1980)"], "The Fourth Judges Case struck down the 99th Amendment.");
b.ar(3, "The Supreme Court can review its own judgments.", "Article 137 empowers the Supreme Court to review its judgments or orders.", "a", "R explains A.");
b.st(3, "Consider the following about the jurisdiction of the Supreme Court:", [
  "Disputes between the Centre and States fall under its original jurisdiction under Article 131.",
  "Under Article 143, the President may seek its advisory opinion.",
  "Its advisory opinion is binding on the President.",
], [1, 2], "Advisory opinions are not binding.");
b.q(3, "In 2025 a Presidential Reference under Article 143 was made after a Supreme Court ruling on timelines for:", ["Governors and the President acting on Bills passed by State legislatures", "Delimitation of constituencies", "Appointment of Chief Election Commissioner", "Imposition of President's Rule"], "The reference followed State of Tamil Nadu v. Governor of Tamil Nadu (April 2025).");

b.t("State Government");
b.st(3, "Consider the following about the Governor:", [
  "The Governor may reserve a Bill for the consideration of the President.",
  "The Governor can promulgate ordinances when the State legislature is not in session.",
  "The Governor can be removed by impeachment by the State Legislature.",
], [1, 2], "The Governor holds office during the pleasure of the President; there is no impeachment procedure for Governors.");
b.q(3, "Which of the following States has a Legislative Council?", ["Karnataka", "Kerala", "Tamil Nadu", "West Bengal"], "States with councils: Andhra Pradesh, Bihar, Karnataka, Maharashtra, Telangana, Uttar Pradesh.");

b.t("Federalism & Lists");
b.mt(3, "Match the subject with the List in the Seventh Schedule:", [["Banking", "Union List"], ["Police", "State List"], ["Forests", "Concurrent List"], ["Public health and sanitation", "State List"]], "Forests moved from the State to the Concurrent List by the 42nd Amendment.", "Subject", "List");
b.st(3, "Consider the following about the distribution of legislative powers:", [
  "Residuary powers rest with Parliament.",
  "In case of conflict on a Concurrent List subject, Union law ordinarily prevails.",
  "A State law on a Concurrent subject reserved for and assented by the President can prevail in that State.",
], [1, 2, 3], "Article 254(2) permits the State law to prevail in the State.");
b.hm(3, "Which of the following subjects were transferred from the State List to the Concurrent List by the 42nd Amendment?", [
  "Education",
  "Forests",
  "Protection of wild animals and birds",
  "Agriculture",
], 3, "Education, forests, wildlife protection, weights and measures and administration of justice were moved; agriculture remains a State subject.", "How many of the above?");
b.q(3, "Parliament wants to legislate on a State subject for two States that have requested it by resolutions. The relevant Article is:", ["Article 252", "Article 249", "Article 250", "Article 253"], "Article 252: legislation by consent of two or more States, which other States may adopt.");

b.t("Constitutional & Statutory Bodies");
b.st(3, "Consider the following about the Election Commission:", [
  "The CEC can be removed only in the manner of a Supreme Court judge.",
  "The 2023 Act provides for a selection committee of the Prime Minister, the Leader of Opposition and a Cabinet Minister.",
  "The Election Commission conducts elections to panchayats.",
], [1, 2], "State Election Commissions conduct local body elections.");
b.mt(3, "Match the body with its constitutional basis:", [["Finance Commission", "Article 280"], ["Union Public Service Commission", "Article 315"], ["GST Council", "Article 279A"], ["National Commission for Backward Classes", "Article 338B"]], "Key constitutional bodies.", "Body", "Article");
b.hm(3, "Which of the following are statutory (not constitutional) bodies?", [
  "National Human Rights Commission",
  "Central Vigilance Commission",
  "Central Information Commission",
  "Comptroller and Auditor General",
], 3, "The CAG is constitutional (Article 148).", "How many of the above are statutory?");
b.st(3, "Consider the following about the Finance Commission:", [
  "It is constituted every five years or earlier.",
  "It recommends distribution of the net proceeds of taxes between the Union and the States.",
  "Its recommendations are binding on the Government.",
], [1, 2], "Recommendations are advisory, though generally accepted.");
b.q(3, "The 16th Finance Commission, chaired by Arvind Panagariya, covers the award period:", ["2026–27 to 2030–31", "2021–22 to 2025–26", "2025–26 to 2029–30", "2027–28 to 2031–32"], "The 15th FC covered 2021–26.");
b.st(3, "Consider the following about the Lokpal:", [
  "It was established under the Lokpal and Lokayuktas Act, 2013.",
  "The Prime Minister is within its jurisdiction, subject to safeguards.",
  "It is a constitutional body.",
], [1, 2], "Lokpal is statutory.");

b.t("Emergency & Federalism");
b.st(3, "Consider the following about national emergency under Article 352:", [
  "It can be proclaimed on grounds of war, external aggression or armed rebellion.",
  "The proclamation must be approved by both Houses by a special majority within one month.",
  "During its operation, Article 19 is automatically suspended for all grounds of emergency.",
], [1, 2], "Article 19 is suspended automatically only when the emergency is on grounds of war or external aggression.");
b.ar(3, "President's Rule can be challenged before the courts.", "In S. R. Bommai (1994), the Supreme Court held that the proclamation under Article 356 is subject to judicial review.", "a", "R explains A.");

b.t("Local Government");
b.st(3, "Consider the following about Panchayati Raj under the 73rd Amendment:", [
  "Elections are held every five years and within six months of dissolution.",
  "Not less than one-third of seats are reserved for women.",
  "The Eleventh Schedule lists 29 subjects.",
], [1, 2, 3], "All three are correct.");
b.st(3, "With reference to the PESA Act, 1996, consider the following:", [
  "It extends Part IX to Fifth Schedule areas with modifications.",
  "It gives Gram Sabhas powers over minor forest produce.",
  "It applies to Sixth Schedule areas of the North-East.",
], [1, 2], "Sixth Schedule areas have Autonomous District Councils.");

b.t("Elections & Representation");
b.st(3, "Consider the following about the Constitution (129th Amendment) Bill, 2024:", [
  "It relates to simultaneous elections to the Lok Sabha and State Assemblies.",
  "It was referred to a Joint Parliamentary Committee.",
  "It also mandates simultaneous elections to municipalities and panchayats.",
], [1, 2], "Local bodies were left to a separate process recommended by the Kovind committee.");
b.q(3, "A sitting MLA is convicted and sentenced to three years' imprisonment. When does disqualification take effect?", ["From the date of conviction, as held in Lily Thomas (2013)", "After all appeals are exhausted", "After three months", "Only at the next election"], "Lily Thomas struck down Section 8(4) of the RPA, 1951.");

b.t("Constitutional Amendments");
b.mt(3, "Match the amendment with its effect:", [["101st Amendment", "Goods and Services Tax"], ["103rd Amendment", "10% EWS reservation"], ["106th Amendment", "One-third reservation for women in legislatures"], ["73rd Amendment", "Constitutional status to panchayats"]], "Recent and frequently asked amendments.", "Amendment", "Effect");
b.st(3, "Consider the following about the 106th Amendment (Nari Shakti Vandan Adhiniyam, 2023):", [
  "It reserves one-third of seats for women in the Lok Sabha and State Assemblies.",
  "Reservation takes effect after delimitation based on the first census after its commencement.",
  "It reserves one-third of seats in the Rajya Sabha for women.",
], [1, 2], "The Rajya Sabha and Legislative Councils are not covered.");
b.q(3, "Arrange the following constitutional amendments in chronological order: 1. Anti-defection law 2. Reduction of voting age to 18 3. Panchayati Raj 4. GST", ["1, 2, 3, 4", "2, 1, 3, 4", "1, 3, 2, 4", "3, 1, 2, 4"], "52nd (1985), 61st (1989), 73rd (1992), 101st (2016).");
b.ar(3, "Parliament cannot amend the basic structure of the Constitution.", "In Kesavananda Bharati (1973), the Supreme Court held that the amending power under Article 368 does not extend to destroying the basic structure.", "a", "R explains A.");

b.t("Polity – Miscellaneous");
b.st(3, "Consider the following about citizenship:", [
  "India does not permit dual citizenship.",
  "OCI cardholders cannot vote in elections.",
  "Citizenship is a subject of the Union List.",
], [1, 2, 3], "Entry 17 of the Union List covers citizenship.");
b.q(3, "Which of the following provisions is borrowed from the Government of India Act, 1935?", ["The scheme of the federal structure with Union, State and Concurrent lists of legislative subjects", "Fundamental Rights", "Directive Principles", "Fundamental Duties"], "A large part of the administrative and federal framework came from the 1935 Act.");
b.hm(3, "Which of the following are features of Indian federalism that tilt it towards a strong Centre?", [
  "Single citizenship",
  "All-India Services",
  "Appointment of Governors by the Centre",
  "Bicameral legislature in every State",
], 3, "Most States are unicameral; the first three are unitary features.", "How many of the above?");
b.st(3, "Consider the following about the Waqf (Amendment) Act, 2025:", [
  "It renamed the principal Act as the Unified Waqf Management, Empowerment, Efficiency and Development Act.",
  "Its provisions were challenged before the Supreme Court.",
  "It abolished all Waqf Boards.",
], [1, 2], "Waqf Boards continue with changes in composition and procedures.");

export default b.items;
