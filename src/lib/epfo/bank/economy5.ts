import { Bank } from "./dsl";

/** Economy: basics and schemes (mostly easier items). */
const b = new Bank("economy5");

b.t("Economic Concepts");
b.q(1, "The primary sector of an economy includes:", ["Agriculture, forestry, fishing and mining", "Manufacturing", "Banking and insurance", "Transport"], "Secondary = manufacturing/construction; tertiary = services.");
b.q(1, "Which of the following is an example of the tertiary sector?", ["Banking", "Fishing", "Steel production", "Mining"], "Services such as banking, trade and transport are tertiary activities.");
b.q(1, "'Inflation' means:", ["A sustained rise in the general price level", "A rise in the price of one commodity", "A fall in output", "A rise in employment"], "It reduces the purchasing power of money.");
b.q(1, "A 'mixed economy' is one in which:", ["Both public and private sectors coexist", "Only the government owns enterprises", "Only private firms exist", "Barter is used"], "India adopted a mixed economy after independence.");
b.q(1, "The 'fiscal policy' of a government deals with:", ["Taxation and public expenditure", "Money supply and interest rates", "Foreign exchange rates only", "Industrial licensing"], "Monetary policy is the RBI's domain.");
b.q(1, "Which body presents the monetary policy statement in India?", ["Reserve Bank of India", "Ministry of Finance", "NITI Aayog", "SEBI"], "The MPC meets at least four times a year.");
b.q(1, "'Budget deficit' broadly means:", ["Government expenditure exceeds government receipts", "Exports exceed imports", "Savings exceed investment", "Banks have excess reserves"], "Various measures — revenue, fiscal, primary — are used.");
b.q(1, "The currency of India is issued by the RBI under the:", ["RBI Act, 1934", "Banking Regulation Act, 1949", "Coinage Act, 2011 for notes", "FEMA, 1999"], "Coins are minted by the Government under the Coinage Act, 2011.");
b.q(1, "The 'per capita income' of a country is a measure of its:", ["Average income per person", "Total income", "Income of the richest", "Government revenue"], "It does not reveal distribution.");
b.q(1, "Which of the following is a 'public good'?", ["National defence", "Packaged food", "A private car", "A cinema ticket"], "Public goods are non-rival and non-excludable.");

b.t("Government Schemes (Economy)");
b.q(1, "Pradhan Mantri Jan Dhan Yojana was launched in:", ["August 2014", "January 2016", "May 2015", "October 2014"], "It aimed at universal access to bank accounts.");
b.q(1, "The 'Swachh Bharat Mission' was launched on:", ["2 October 2014", "15 August 2014", "26 January 2015", "5 June 2016"], "It aimed at an open-defecation-free India by 2019.");
b.q(1, "Pradhan Mantri Awas Yojana aims to provide:", ["Housing for all", "Free electricity", "Health insurance", "Drinking water"], "PMAY has urban and rural (Gramin) components.");
b.q(1, "'Jal Jeevan Mission' (2019) aims to provide:", ["Functional household tap connections in rural areas", "Irrigation canals", "Rainwater harvesting in cities", "Bottled water"], "It is implemented by the Ministry of Jal Shakti.");
b.q(2, "'Digital India' programme was launched in:", ["2015", "2012", "2018", "2010"], "It aims to transform India into a digitally empowered society.");
b.q(2, "The 'PM Vishwakarma' scheme (2023) supports:", ["Traditional artisans and craftspeople with skilling, toolkits and collateral-free credit", "Large manufacturers", "IT startups", "Farmers only"], "It covers 18 traditional trades.");
b.q(2, "The 'PM SVANidhi' scheme (2020) provides:", ["Working capital loans to street vendors", "Pensions to farmers", "Scholarships", "Housing subsidies"], "Loans start at ₹10,000 with interest subsidy for timely repayment.");
b.q(2, "The 'Atal Innovation Mission' is set up under:", ["NITI Aayog", "Ministry of Finance", "RBI", "Ministry of Labour"], "It runs Atal Tinkering Labs in schools.");
b.q(2, "The 'Skill India Mission' was launched in:", ["July 2015", "January 2014", "June 2018", "March 2020"], "It includes Pradhan Mantri Kaushal Vikas Yojana.");
b.q(2, "'Ayushman Bharat Digital Mission' aims to create:", ["A digital health ecosystem with health IDs (ABHA)", "A digital currency", "Online tax filing", "Digital land records"], "ABHA numbers link health records digitally.");
b.q(2, "The 'UDAN' scheme aims to:", ["Make regional air travel affordable", "Develop highways", "Build ports", "Provide free train travel"], "Ude Desh ka Aam Nagrik was launched in 2016.");
b.q(2, "The 'One District One Product' (ODOP) initiative aims to:", ["Promote a distinctive product from each district for balanced regional development", "Limit production", "Ban imports", "Provide free goods"], "It began in Uttar Pradesh and was scaled nationally.");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements:", ["NITI Aayog is a constitutional body.", "The Prime Minister chairs NITI Aayog."], [2], "NITI Aayog was created by a Cabinet resolution; it is neither constitutional nor statutory.");
b.st(2, "Consider the following statements about the RBI:", ["It acts as banker to the Government.", "It is the lender of last resort for banks."], [1, 2], "Both are core RBI functions.");
b.st(2, "Consider the following statements about MGNREGA:", ["It is a demand-driven scheme.", "It applies only to urban areas."], [1], "It applies to rural areas.");
b.st(3, "Consider the following statements about the WTO:", ["Its highest decision-making body is the Ministerial Conference.", "India is a founding member.", "Its dispute settlement Appellate Body has been non-functional since December 2019."], [1, 2, 3], "All three are correct; the Appellate Body has lacked quorum since 2019.");
b.ar(2, "Banks must maintain a Statutory Liquidity Ratio.", "SLR ensures that banks hold liquid assets such as government securities to meet obligations.", "a", "R explains the purpose of SLR.");
b.ar(2, "Agriculture's share in India's GDP has declined over decades.", "Agriculture still employs the largest share of India's workforce.", "b", "Both are true, but R does not explain A (structural transformation does).");
b.hm(2, "Consider the following:", ["Commercial banks", "Regional Rural Banks", "Cooperative banks", "Payment banks"], 4, "All four are regulated by the RBI (cooperative banks jointly with RCS/NABARD supervision for rural cooperatives).", "How many of the above are regulated by the RBI?");

b.t("Applied Economics");
b.q(2, "A country's GDP is ₹300 lakh crore and population 150 crore. Its per capita income is:", ["₹2 lakh", "₹20,000", "₹2,000", "₹4.5 lakh"], "300 lakh crore ÷ 150 crore = ₹2 lakh.");
b.q(2, "If a bank's NPAs are ₹6,000 crore on total advances of ₹1,20,000 crore, the gross NPA ratio is:", ["5%", "6%", "2%", "20%"], "6,000 ÷ 1,20,000 × 100 = 5%.");
b.q(3, "If the CPI rises from 150 to 162 and a worker's wage rises from ₹20,000 to ₹22,000, the change in real wage is about:", ["+1.85%", "+10%", "−2%", "+8%"], "Real wage index = (22,000/162) ÷ (20,000/150) = 1.0185 → about +1.85%.");
b.q(2, "If a country's exports are $50 billion and imports $70 billion, and net invisibles are +$25 billion, the current account balance is:", ["+$5 billion (surplus)", "−$20 billion", "−$45 billion", "+$45 billion"], "Trade balance −20 + invisibles 25 = +5.");

b.t("Economic Institutions");
b.q(1, "The headquarters of the Reserve Bank of India is in:", ["Mumbai", "New Delhi", "Kolkata", "Chennai"], "It was in Calcutta until 1937.");
b.q(1, "SEBI is headquartered in:", ["Mumbai", "New Delhi", "Bengaluru", "Hyderabad"], "Its chairperson as of 2025 is Tuhin Kanta Pandey.");
b.q(2, "Tuhin Kanta Pandey became the Chairman of SEBI in March 2025, succeeding:", ["Madhabi Puri Buch", "Ajay Tyagi", "U. K. Sinha", "C. B. Bhave"], "Madhabi Puri Buch was the first woman SEBI chief.");
b.q(2, "The Competition Commission of India was established under the:", ["Competition Act, 2002", "MRTP Act, 1969", "Companies Act, 2013", "Consumer Protection Act, 2019"], "It replaced the MRTP Commission.");

export default b.items;
