import { Bank, nearYears } from "./dsl";

/** Polity: Articles, Amendments and Schedules (table-driven, each fact asked once). */
const b = new Bank("polity1");

type A = [string, string, 1 | 2 | 3];
const ARTICLES: A[] = [
  ["12", "Definition of 'the State' for the purposes of Part III", 2],
  ["13", "Laws inconsistent with or in derogation of Fundamental Rights", 2],
  ["14", "Equality before law and equal protection of the laws", 1],
  ["15", "Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth", 1],
  ["16", "Equality of opportunity in matters of public employment", 1],
  ["17", "Abolition of untouchability", 1],
  ["18", "Abolition of titles", 2],
  ["19", "Protection of certain rights regarding freedom of speech, assembly, association, movement, residence and profession", 1],
  ["20", "Protection in respect of conviction for offences (double jeopardy, self-incrimination)", 2],
  ["21", "Protection of life and personal liberty", 1],
  ["22", "Protection against arrest and detention in certain cases", 2],
  ["25", "Freedom of conscience and free profession, practice and propagation of religion", 1],
  ["26", "Freedom to manage religious affairs", 2],
  ["29", "Protection of interests of minorities (language, script, culture)", 2],
  ["30", "Right of minorities to establish and administer educational institutions", 2],
  ["32", "Remedies for enforcement of Fundamental Rights (writs by the Supreme Court)", 1],
  ["39A", "Equal justice and free legal aid", 2],
  ["40", "Organisation of village panchayats", 1],
  ["44", "Uniform civil code for the citizens", 1],
  ["45", "Early childhood care and education for children below six years", 2],
  ["46", "Promotion of educational and economic interests of SCs, STs and weaker sections", 2],
  ["47", "Raising the level of nutrition and public health; prohibition of intoxicating drinks", 2],
  ["48A", "Protection and improvement of environment and safeguarding of forests and wildlife", 2],
  ["49", "Protection of monuments and places of national importance", 3],
  ["50", "Separation of judiciary from executive", 2],
  ["51", "Promotion of international peace and security", 2],
  ["51A", "Fundamental Duties", 1],
  ["52", "The President of India", 1],
  ["54", "Election of the President", 2],
  ["61", "Procedure for impeachment of the President", 1],
  ["63", "The Vice-President of India", 2],
  ["72", "Power of the President to grant pardons, reprieves and remissions", 1],
  ["74", "Council of Ministers to aid and advise the President", 2],
  ["76", "Attorney-General for India", 1],
  ["79", "Constitution of Parliament", 3],
  ["80", "Composition of the Council of States (Rajya Sabha)", 2],
  ["81", "Composition of the House of the People (Lok Sabha)", 2],
  ["85", "Sessions of Parliament, prorogation and dissolution", 3],
  ["93", "Speaker and Deputy Speaker of the House of the People", 2],
  ["108", "Joint sitting of both Houses in certain cases", 1],
  ["110", "Definition of 'Money Bills'", 1],
  ["112", "Annual Financial Statement (Budget)", 1],
  ["114", "Appropriation Bills", 3],
  ["123", "Power of the President to promulgate Ordinances during recess of Parliament", 1],
  ["124", "Establishment and constitution of the Supreme Court", 2],
  ["129", "Supreme Court to be a court of record", 3],
  ["131", "Original jurisdiction of the Supreme Court", 3],
  ["136", "Special leave to appeal by the Supreme Court", 2],
  ["143", "Power of the President to consult the Supreme Court (advisory jurisdiction)", 2],
  ["153", "Governors of States", 3],
  ["163", "Council of Ministers to aid and advise the Governor", 3],
  ["165", "Advocate-General for the State", 2],
  ["169", "Abolition or creation of Legislative Councils in States", 2],
  ["213", "Power of the Governor to promulgate Ordinances", 2],
  ["214", "High Courts for States", 3],
  ["226", "Power of High Courts to issue certain writs", 1],
  ["239AA", "Special provisions with respect to Delhi", 3],
  ["243K", "State Election Commission for elections to Panchayats", 3],
  ["249", "Power of Parliament to legislate on a State List matter in the national interest", 3],
  ["252", "Power of Parliament to legislate for two or more States by consent", 3],
  ["262", "Adjudication of disputes relating to waters of inter-State rivers", 2],
  ["263", "Provisions with respect to an Inter-State Council", 2],
  ["265", "Taxes not to be imposed save by authority of law", 3],
  ["279A", "Goods and Services Tax Council", 1],
  ["280", "Finance Commission", 1],
  ["300A", "Persons not to be deprived of property save by authority of law", 2],
  ["301", "Freedom of trade, commerce and intercourse", 2],
  ["312", "All-India Services", 2],
  ["315", "Public Service Commissions for the Union and the States", 2],
  ["323A", "Administrative Tribunals", 3],
  ["324", "Superintendence, direction and control of elections vested in an Election Commission", 1],
  ["326", "Elections on the basis of adult suffrage", 2],
  ["338", "National Commission for Scheduled Castes", 2],
  ["338B", "National Commission for Backward Classes", 3],
  ["343", "Official language of the Union", 2],
  ["350A", "Facilities for instruction in mother tongue at primary stage", 3],
  ["352", "Proclamation of Emergency (national emergency)", 1],
  ["356", "Failure of constitutional machinery in States (President's Rule)", 1],
  ["360", "Financial emergency", 1],
  ["368", "Power of Parliament to amend the Constitution", 1],
];
const subjects = ARTICLES.map((a) => a[1]);
const artLabels = ARTICLES.map((a) => `Article ${a[0]}`);
ARTICLES.forEach(([no, subj, d], i) => {
  if (i % 2 === 0) {
    b.t("Constitution – Articles").pool(d, `Article ${no} of the Constitution of India deals with:`, subj, subjects, `Article ${no}: ${subj}.`);
  } else {
    b.t("Constitution – Articles").pool(d, `Which Article of the Constitution of India provides for: "${subj}"?`, `Article ${no}`, artLabels, `This subject is dealt with in Article ${no}.`);
  }
});

type Am = [number, number, string, 1 | 2 | 3];
const AMENDMENTS: Am[] = [
  [1, 1951, "added the Ninth Schedule to protect land reform laws from judicial review", 2],
  [7, 1956, "reorganised States on a linguistic basis and abolished Part A, B, C, D classification", 2],
  [24, 1971, "affirmed Parliament's power to amend any part of the Constitution, including Fundamental Rights", 3],
  [36, 1975, "made Sikkim a full-fledged State of the Indian Union", 2],
  [42, 1976, "added 'socialist', 'secular' and 'integrity' to the Preamble and inserted Fundamental Duties", 1],
  [44, 1978, "removed the right to property from the list of Fundamental Rights", 1],
  [52, 1985, "added the Tenth Schedule containing anti-defection provisions", 1],
  [61, 1989, "reduced the voting age from 21 to 18 years", 1],
  [69, 1991, "gave Delhi special status as the National Capital Territory with a legislative assembly", 2],
  [71, 1992, "included Konkani, Manipuri and Nepali in the Eighth Schedule", 3],
  [73, 1992, "gave constitutional status to Panchayati Raj institutions", 1],
  [74, 1992, "gave constitutional status to urban local bodies (municipalities)", 1],
  [91, 2003, "limited the size of the Council of Ministers to 15% of the strength of the Lok Sabha/Assembly", 2],
  [92, 2003, "added Bodo, Dogri, Maithili and Santhali to the Eighth Schedule", 2],
  [99, 2014, "sought to establish the National Judicial Appointments Commission (later struck down)", 2],
  [100, 2015, "gave effect to the India–Bangladesh Land Boundary Agreement (exchange of enclaves)", 2],
  [101, 2016, "introduced the Goods and Services Tax", 1],
  [102, 2018, "gave constitutional status to the National Commission for Backward Classes", 2],
  [103, 2019, "provided up to 10% reservation for economically weaker sections", 1],
  [104, 2020, "extended SC/ST reservation in legislatures and ended nomination of Anglo-Indian members", 3],
  [105, 2021, "restored the power of States to prepare their own lists of socially and educationally backward classes", 3],
  [106, 2023, "reserved one-third of seats for women in the Lok Sabha and State Assemblies", 1],
  [21, 1967, "added Sindhi to the Eighth Schedule", 3],
  [12, 1962, "incorporated Goa, Daman and Diu into the Indian Union", 3],
  [31, 1973, "raised the maximum strength of the Lok Sabha from 525 to 545", 3],
];
const amTexts = AMENDMENTS.map((a) => a[2]);
const ordinal = (n: number) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
AMENDMENTS.forEach(([no, yr, what, d], i) => {
  b.t("Constitutional Amendments");
  if (i % 3 === 0) {
    b.pool(d, `The Constitution (${ordinal(no)} Amendment) Act, ${yr}:`, what[0]!.toUpperCase() + what.slice(1), amTexts.map((t) => t[0]!.toUpperCase() + t.slice(1)), `The ${ordinal(no)} Amendment (${yr}) ${what}.`);
  } else if (i % 3 === 1) {
    const opts = AMENDMENTS.filter((x) => x[0] !== no).map((x) => `${ordinal(x[0])} Amendment`);
    b.pool(d, `Which constitutional amendment ${what}?`, `${ordinal(no)} Amendment`, opts, `It was the ${ordinal(no)} Amendment Act of ${yr}.`);
  } else {
    const stem = `The constitutional amendment that ${what} was enacted in the year:`;
    b.q(d, stem, [String(yr), ...(nearYears(yr, stem) as [string, string, string])], `This was the ${ordinal(no)} Amendment Act, ${yr}.`);
  }
});

type S = [string, string, 1 | 2 | 3];
const SCHEDULES: S[] = [
  ["First", "Names of States and Union Territories and their territories", 2],
  ["Second", "Emoluments and allowances of the President, Governors, Judges, CAG and others", 2],
  ["Third", "Forms of oaths and affirmations", 2],
  ["Fourth", "Allocation of seats in the Rajya Sabha", 2],
  ["Fifth", "Administration and control of Scheduled Areas and Scheduled Tribes", 2],
  ["Sixth", "Administration of tribal areas in Assam, Meghalaya, Tripura and Mizoram", 2],
  ["Seventh", "Union, State and Concurrent Lists", 1],
  ["Eighth", "Languages recognised by the Constitution", 1],
  ["Ninth", "Acts and regulations (mainly land reforms) protected from challenge", 2],
  ["Tenth", "Disqualification on ground of defection", 1],
  ["Eleventh", "Powers, authority and responsibilities of Panchayats (29 subjects)", 2],
  ["Twelfth", "Powers, authority and responsibilities of Municipalities (18 subjects)", 2],
];
const schedSubj = SCHEDULES.map((s) => s[1]);
SCHEDULES.forEach(([no, subj, d], i) => {
  b.t("Constitution – Schedules");
  if (i % 2 === 0) b.pool(d, `The ${no} Schedule of the Constitution contains:`, subj, schedSubj, `${no} Schedule: ${subj}.`);
  else b.pool(d, `"${subj}" is the subject matter of which Schedule of the Constitution?`, `${no} Schedule`, SCHEDULES.map((s) => `${s[0]} Schedule`), `It is the ${no} Schedule.`);
});

export default b.items;
