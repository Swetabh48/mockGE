import { Bank } from "./dsl";

/** Current events: international organisations and reports (table-driven). */
const b = new Bank("current1");

type O = [string, string, 1 | 2 | 3];
const ORGS: O[] = [
  ["UNESCO", "Paris", 1],
  ["World Health Organization", "Geneva", 1],
  ["Food and Agriculture Organization", "Rome", 2],
  ["International Fund for Agricultural Development", "Rome", 3],
  ["UNICEF", "New York", 2],
  ["UN Environment Programme", "Nairobi", 2],
  ["International Atomic Energy Agency", "Vienna", 2],
  ["OPEC", "Vienna", 2],
  ["International Court of Justice", "The Hague", 1],
  ["Organisation for the Prohibition of Chemical Weapons", "The Hague", 3],
  ["INTERPOL", "Lyon", 2],
  ["World Intellectual Property Organization", "Geneva", 2],
  ["Universal Postal Union", "Bern", 3],
  ["International Maritime Organization", "London", 3],
  ["International Civil Aviation Organization", "Montreal", 3],
  ["International Olympic Committee", "Lausanne", 2],
  ["SAARC Secretariat", "Kathmandu", 1],
  ["ASEAN Secretariat", "Jakarta", 2],
  ["BIMSTEC Secretariat", "Dhaka", 2],
  ["International Solar Alliance", "Gurugram", 2],
  ["NATO", "Brussels", 2],
  ["African Union", "Addis Ababa", 3],
  ["OECD", "Paris", 3],
  ["Asian Infrastructure Investment Bank", "Beijing", 2],
  ["Green Climate Fund", "Songdo (South Korea)", 3],
  ["International Energy Agency", "Paris", 3],
  ["World Meteorological Organization", "Geneva", 2],
  ["Commonwealth Secretariat", "London", 2],
];
const cities = [...new Set(ORGS.map((o) => o[1]))];
const reverseUsed = new Set<string>();
ORGS.forEach(([org, city, d], i) => {
  b.t("International Organisations");
  const reverse = i % 2 === 1 && !reverseUsed.has(city);
  if (reverse) reverseUsed.add(city);
  if (!reverse) b.pool(d, `The headquarters of the ${org} is located in:`, city, cities, `${org}: headquartered in ${city}.`);
  else {
    const others = ORGS.filter((o) => o[1] !== city).map((o) => o[0]);
    b.pool(d, `Which of the following organisations is headquartered in ${city}?`, org, others, `${org} is based in ${city}.`);
  }
});

type R = [string, string, 1 | 2 | 3];
const REPORTS: R[] = [
  ["World Happiness Report", "UN Sustainable Development Solutions Network (with Gallup and Oxford Wellbeing Research Centre)", 2],
  ["Global Gender Gap Report", "World Economic Forum", 1],
  ["Global Hunger Index", "Concern Worldwide and Welthungerhilfe", 2],
  ["World Press Freedom Index", "Reporters Without Borders", 1],
  ["Global Innovation Index", "World Intellectual Property Organization", 2],
  ["Corruption Perceptions Index", "Transparency International", 1],
  ["Global Peace Index", "Institute for Economics and Peace", 2],
  ["Henley Passport Index", "Henley & Partners", 2],
  ["World Investment Report", "UNCTAD", 2],
  ["Emissions Gap Report", "UN Environment Programme", 2],
  ["World Energy Outlook", "International Energy Agency", 2],
  ["Living Planet Report", "World Wide Fund for Nature (WWF)", 2],
  ["Democracy Index", "Economist Intelligence Unit", 2],
  ["World Development Report", "World Bank", 2],
  ["State of World Population Report", "UN Population Fund (UNFPA)", 2],
  ["Global Slavery Index", "Walk Free Foundation", 3],
  ["Global Cybersecurity Index", "International Telecommunication Union", 3],
  ["India State of Forest Report", "Forest Survey of India", 1],
  ["Swachh Survekshan", "Ministry of Housing and Urban Affairs", 1],
  ["Good Governance Index", "Department of Administrative Reforms and Public Grievances", 3],
  ["Global Tuberculosis Report", "World Health Organization", 2],
  ["State of Food Security and Nutrition in the World", "FAO with IFAD, UNICEF, WFP and WHO", 3],
];
const publishers = REPORTS.map((r) => r[1]);
REPORTS.forEach(([rep, pub, d]) => {
  b.t("Reports & Indices").pool(d, `The '${rep}' is published by:`, pub, publishers, `'${rep}' is brought out by ${pub}.`);
});

export default b.items;
