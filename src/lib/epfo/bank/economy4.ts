import { Bank } from "./dsl";

/** Economy: infrastructure, digital economy, statements, assertion-reason and applied concepts. */
const b = new Bank("economy4");

b.t("Infrastructure & Digital Economy");
b.q(2, "PM Gati Shakti National Master Plan, launched in October 2021, is aimed at:", ["Integrated planning of multimodal infrastructure using a GIS-based digital platform", "Speeding up railway trains only", "Rural employment", "Defence production"], "It brings 16 ministries onto one platform for coordinated project planning.");
b.q(2, "The Bharatmala Pariyojana relates to:", ["Highway development", "Port-led development", "Inland waterways", "Rural electrification"], "Sagarmala relates to ports; UDAN to regional air connectivity.");
b.q(2, "The Sagarmala programme focuses on:", ["Port-led development and coastal infrastructure", "Highways", "Smart cities", "Railways electrification"], "It aims to reduce logistics costs through modernisation of ports.");
b.q(2, "India's target for non-fossil-fuel based electricity capacity by 2030 is:", ["500 GW", "175 GW", "1,000 GW", "250 GW"], "India announced the 500 GW target at COP26 (Glasgow) as part of 'Panchamrit'.");
b.q(2, "India has committed to achieve net-zero emissions by:", ["2070", "2050", "2047", "2060"], "Announced at COP26 in 2021.");
b.q(2, "The digital rupee (e₹), India's Central Bank Digital Currency, was piloted by the RBI from:", ["November–December 2022", "January 2020", "April 2024", "August 2016"], "The wholesale pilot began in November 2022 and retail in December 2022.");
b.q(2, "The Open Network for Digital Commerce (ONDC) aims to:", ["Democratise e-commerce through open, interoperable protocols", "Create a government e-commerce company", "Ban foreign e-commerce", "Tax digital transactions"], "It allows buyers and sellers on different platforms to transact.");
b.q(2, "The 'Account Aggregator' framework regulated by the RBI enables:", ["Consent-based sharing of financial data across institutions", "Merger of bank accounts", "Opening of accounts without KYC", "Cross-border payments"], "Account aggregators are NBFCs that act as consent managers.");
b.q(2, "'India Stack' refers to:", ["A set of open digital public goods such as Aadhaar, UPI and DigiLocker", "A stock market index", "A type of server", "A tax portal"], "It underpins India's digital public infrastructure.");
b.q(2, "The 'National Infrastructure Pipeline' (2019) was launched to:", ["Project infrastructure investment across sectors over 2020–25", "Build pipelines for oil only", "Map water pipelines", "Lay fibre optic cables only"], "It envisaged investment of about ₹111 lakh crore.");
b.q(2, "The 'National Monetisation Pipeline' (2021) refers to:", ["Leasing brownfield public infrastructure assets to raise resources", "Printing new currency", "Selling gold reserves", "Disinvestment of banks"], "Ownership stays with the government; assets are monetised for a fixed period.");
b.q(2, "The PM Surya Ghar Muft Bijli Yojana (2024) provides:", ["Subsidy for rooftop solar to provide up to 300 units of free electricity monthly to households", "Free LPG cylinders", "Free solar pumps to farmers", "Electric vehicles at subsidised rates"], "It targets one crore households.");
b.q(2, "The National Green Hydrogen Mission (2023) targets production capacity of:", ["At least 5 million tonnes per annum by 2030", "50 million tonnes by 2025", "1 million tonnes by 2047", "10 tonnes by 2030"], "It aims to make India a hub for green hydrogen.");

b.t("Census & Demography");
b.q(2, "India's next Census, which will include caste enumeration, has its reference date fixed as:", ["1 March 2027 (1 October 2026 for snow-bound areas)", "1 March 2026", "1 January 2025", "1 April 2028"], "It will be India's first digital census; houselisting begins in 2026.");
b.q(2, "According to UN estimates, India became the world's most populous country in:", ["2023", "2020", "2025", "2019"], "UNFPA's State of World Population report projected India overtaking China in 2023.");
b.q(2, "The 'total fertility rate' (TFR) in India, according to NFHS-5 (2019–21), is:", ["2.0", "2.7", "3.1", "1.5"], "It fell below the replacement level of 2.1.");
b.q(2, "As per Census 2011, the state with the highest sex ratio is:", ["Kerala", "Haryana", "Tamil Nadu", "Bihar"], "Kerala had 1,084 females per 1,000 males; Haryana had the lowest among States.");
b.q(2, "As per Census 2011, India's literacy rate was approximately:", ["74%", "65%", "82%", "59%"], "Kerala had the highest literacy rate and Bihar the lowest.");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements about the Monetary Policy Committee:", ["It decides the policy repo rate.", "The Finance Minister chairs its meetings."], [1], "The RBI Governor chairs the MPC; the government nominates three external members.");
b.st(2, "Consider the following statements:", ["An increase in CRR reduces the lending capacity of banks.", "A reduction in repo rate generally makes loans cheaper."], [1, 2], "Both are correct.");
b.st(3, "Consider the following about GST:", ["GST subsumed central excise duty and service tax.", "Petroleum crude is currently outside GST.", "Alcohol for human consumption is under GST."], [1, 2], "Alcohol for human consumption is constitutionally outside GST; five petroleum products are outside until the Council decides.");
b.st(2, "Consider the following statements:", ["Fiscal deficit includes interest payments.", "Primary deficit is always larger than fiscal deficit."], [1], "Primary deficit = fiscal deficit − interest payments, so it is smaller when interest is positive.");
b.st(3, "Consider the following statements about India's foreign exchange reserves:", ["They include foreign currency assets, gold, SDRs and the reserve tranche position with the IMF.", "They are managed by the Ministry of Finance."], [1], "The RBI manages forex reserves under the RBI Act.");
b.st(2, "Consider the following statements about Regional Rural Banks:", ["They are sponsored by commercial banks.", "They focus on credit to small farmers, artisans and rural poor."], [1, 2], "Both statements are correct.");
b.st(3, "Consider the following statements about the Fifteenth Finance Commission:", ["It used 'demographic performance' as a criterion for horizontal devolution.", "It recommended 41% of the divisible pool for States.", "It was chaired by Y. V. Reddy."], [1, 2], "It was chaired by N. K. Singh; Y. V. Reddy chaired the 14th FC.");
b.hm(3, "Consider the following:", ["Rise in repo rate", "Sale of government securities by RBI", "Reduction in CRR", "Increase in SLR"], 3, "Raising repo, OMO sales and raising SLR reduce liquidity; reducing CRR increases it.", "How many of the above tend to reduce liquidity in the banking system?");
b.hm(2, "Consider the following taxes:", ["Personal income tax", "Corporation tax", "GST", "Customs duty"], 2, "Income tax and corporation tax are direct; GST and customs are indirect.", "How many of the above are direct taxes?");
b.hm(3, "Consider the following items:", ["Remittances", "Interest on external debt", "FDI", "Software exports"], 3, "Remittances (transfers), interest (primary income) and software exports (services) are current account items; FDI is a capital/financial account item.", "How many of the above are recorded in the current account of the Balance of Payments?");
b.ar(2, "A fall in the repo rate tends to stimulate investment.", "A lower repo rate reduces the cost of borrowing for banks, which lowers lending rates.", "a", "R explains A through the transmission mechanism.");
b.ar(2, "Inflation hurts people with fixed incomes.", "Inflation reduces the purchasing power of money.", "a", "Fixed incomes buy less as prices rise.");
b.ar(3, "Indirect taxes are generally regressive.", "Indirect taxes are levied at the same rate on everyone regardless of income.", "a", "Because the rate is the same, lower-income people pay a higher share of their income.");
b.ar(3, "India has full capital account convertibility.", "FEMA permits free conversion for current account transactions.", "d", "A is false — India has only current account convertibility (with liberalised capital flows). R is true.");
b.ar(2, "Devaluation of a currency can improve the trade balance.", "Devaluation makes exports cheaper and imports dearer.", "a", "Subject to elasticity conditions (Marshall–Lerner), R explains A.");
b.ar(3, "Disguised unemployment is common in Indian agriculture.", "The marginal productivity of some workers in family farms is near zero.", "a", "R explains the concept.");

b.t("Applied Economics");
b.q(2, "If nominal GDP grows at 10% and the GDP deflator rises by 4%, real GDP growth is approximately:", ["6%", "14%", "4%", "2.5%"], "Real growth ≈ nominal growth − inflation (deflator).");
b.q(2, "If the CRR is 4% and SLR 18%, how much of a fresh deposit of ₹100 can a bank lend at most (ignoring other requirements)?", ["₹78", "₹96", "₹82", "₹100"], "Reserves = 4 + 18 = ₹22; lendable = ₹78.");
b.q(3, "A government's revenue receipts are ₹30 lakh crore, non-debt capital receipts ₹1 lakh crore and total expenditure ₹47 lakh crore. Its fiscal deficit is:", ["₹16 lakh crore", "₹17 lakh crore", "₹47 lakh crore", "₹31 lakh crore"], "FD = 47 − (30 + 1) = ₹16 lakh crore.");
b.q(2, "If the price of a good rises by 10% and quantity demanded falls by 20%, the price elasticity of demand is:", ["2 (elastic)", "0.5 (inelastic)", "1 (unitary)", "20"], "Elasticity = % change in quantity ÷ % change in price = 20/10 = 2.");
b.q(3, "If MPC is 0.8, the investment multiplier is:", ["5", "1.25", "8", "0.2"], "Multiplier = 1/(1 − 0.8) = 5.");
b.q(2, "If India's exports of goods are $440 billion and imports $680 billion, the merchandise trade deficit is:", ["$240 billion", "$1,120 billion", "$680 billion", "$440 billion"], "Deficit = imports − exports.");

b.t("Money & Banking");
b.q(2, "A 'scheduled bank' is one that is:", ["Included in the Second Schedule of the RBI Act, 1934", "Owned by the government", "Listed on a stock exchange", "Located in a metro city"], "Scheduled banks can borrow from the RBI and must maintain CRR.");
b.q(2, "The 'Basel norms' relate to:", ["Capital adequacy and risk management of banks", "Environmental standards", "Labour standards", "Trade tariffs"], "Basel III strengthened capital and liquidity requirements.");
b.q(2, "The 'SARFAESI Act, 2002' empowers banks to:", ["Enforce security interest and recover dues without court intervention", "Fix interest rates", "Issue currency", "Merge with other banks"], "Asset reconstruction companies operate under it.");
b.q(2, "The Pradhan Mantri MUDRA Yojana provides loans to non-corporate small businesses under categories Shishu, Kishore, Tarun and (since 2024) Tarun Plus. The upper limit under Tarun Plus is:", ["₹20 lakh", "₹10 lakh", "₹50 lakh", "₹5 lakh"], "Shishu up to ₹50,000; Kishore up to ₹5 lakh; Tarun up to ₹10 lakh; Tarun Plus up to ₹20 lakh.");
b.q(2, "Stand-Up India (2016) facilitates bank loans between ₹10 lakh and ₹1 crore to:", ["SC/ST and women entrepreneurs for greenfield enterprises", "Large corporations", "Foreign investors", "Farmers only"], "Each bank branch is expected to give at least one such loan to an SC/ST and one to a woman borrower.");
b.q(2, "The 'Bad bank' set up in India to acquire stressed assets from banks is the:", ["National Asset Reconstruction Company Ltd (NARCL)", "SIDBI", "Exim Bank", "NABARD"], "It works with the India Debt Resolution Company.");
b.q(2, "'Financial inclusion' primarily means:", ["Access to affordable financial services for all sections, especially the poor", "Merger of banks", "Listing on stock exchanges", "Foreign investment in banks"], "PMJDY is a major financial inclusion programme.");
b.q(3, "'Repo rate' and 'bank rate' differ in that the bank rate:", ["Is a long-term rate charged without a repurchase agreement (used as penal rate benchmark)", "Is always lower than repo", "Applies only to foreign banks", "Is set by the Finance Ministry"], "Bank rate is aligned with the MSF rate.");
b.q(2, "The Marginal Standing Facility (MSF) allows banks to borrow overnight from the RBI by dipping into:", ["Their SLR securities up to a limit", "Their CRR balance", "Customer deposits", "Gold reserves"], "MSF is the ceiling of the LAF corridor.");

b.t("Agriculture");
b.q(2, "Which of the following crops is a kharif crop?", ["Paddy", "Wheat", "Mustard", "Gram"], "Kharif crops are sown with the monsoon (June–July); wheat, mustard and gram are rabi.");
b.q(2, "'Zaid' crops are grown:", ["Between rabi and kharif seasons in summer", "In winter", "Only in hills", "Only with rainfall"], "Examples are watermelon, cucumber and fodder crops.");
b.q(2, "The 'Agricultural Produce Market Committee' (APMC) system regulates:", ["Sale of farm produce in notified markets", "Fertiliser prices", "Crop insurance", "Land records"], "Model APMC Act (2017) and e-NAM aim to reform it.");
b.q(2, "The 'Fair and Remunerative Price' is announced for:", ["Sugarcane", "Wheat", "Cotton", "Rice"], "It replaced the Statutory Minimum Price in 2009.");
b.q(3, "'Formation and Promotion of 10,000 Farmer Producer Organisations' scheme (2020) aims to:", ["Help small farmers aggregate for better bargaining, inputs and market access", "Give free tractors", "Nationalise farms", "Ban contract farming"], "FPOs are registered as companies or cooperatives.");

b.t("Economic Concepts");
b.q(2, "'Black money' refers to:", ["Income not disclosed to tax authorities", "Counterfeit currency only", "Foreign currency", "Money in old notes"], "Demonetisation (2016) of ₹500 and ₹1,000 notes was aimed partly at black money.");
b.q(2, "Demonetisation of ₹500 and ₹1,000 notes was announced on:", ["8 November 2016", "1 July 2017", "31 March 2016", "15 August 2016"], "The RBI later withdrew ₹2,000 notes from circulation in May 2023 (they remain legal tender).");
b.q(2, "'Gross Fixed Capital Formation' is a measure of:", ["Investment in fixed assets like machinery and buildings", "Government consumption", "Household savings in gold", "Net exports"], "GFCF as a share of GDP indicates the investment rate.");
b.q(2, "'Purchasing Power Parity' is used to:", ["Compare living standards across countries by adjusting for price differences", "Set exchange rates officially", "Measure inflation", "Calculate GST"], "On PPP basis India is the third largest economy.");
b.q(2, "'Twin balance sheet problem' refers to stress in the balance sheets of:", ["Banks and corporates", "Centre and States", "RBI and Government", "Households and firms"], "The Economic Survey 2016–17 discussed it.");
b.q(2, "In 2025, India was reported (IMF estimates) to have overtaken which economy to become the fourth largest in nominal GDP terms?", ["Japan", "Germany", "United Kingdom", "France"], "According to IMF projections, India's GDP surpassed Japan's in 2025.");
b.q(3, "'K-shaped recovery' describes a situation in which:", ["Different sectors or groups recover at sharply different rates after a downturn", "The economy recovers quickly and fully", "A double-dip recession occurs", "Prices fall sharply"], "It was discussed widely after the COVID-19 shock.");
b.q(2, "'Gig economy' expansion and 'formalisation' of the workforce are often tracked in India using:", ["EPFO payroll data and e-Shram registrations", "WPI", "Bank rate", "Forex reserves"], "Payroll data proxies formal jobs; e-Shram covers unorganised workers.");
b.q(2, "The 'Economic Survey' of India is prepared by:", ["The Economic Division of the Department of Economic Affairs under the Chief Economic Adviser", "RBI", "NITI Aayog", "CAG"], "It is presented a day before the Budget.");
b.q(2, "Who is the Chief Economic Adviser who presented the Economic Surveys of 2023–24 and 2024–25?", ["V. Anantha Nageswaran", "Krishnamurthy Subramanian", "Arvind Subramanian", "Raghuram Rajan"], "He took charge in January 2022.");

export default b.items;
