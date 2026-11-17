import { Bank } from "./dsl";

/** Economy: poverty & development, agriculture, industry, capital markets, international bodies. */
const b = new Bank("economy3");

b.t("Poverty & Development");
b.q(2, "India's National Multidimensional Poverty Index is prepared by:", ["NITI Aayog", "NSO", "RBI", "UNDP alone"], "NITI Aayog's 2024 discussion paper estimated that about 24.8 crore people escaped multidimensional poverty between 2013–14 and 2022–23.");
b.q(2, "The global Multidimensional Poverty Index is published by UNDP and:", ["Oxford Poverty and Human Development Initiative (OPHI)", "World Bank", "IMF", "WTO"], "It uses health, education and standard of living dimensions.");
b.q(1, "The Human Development Index is published by:", ["UNDP", "World Bank", "IMF", "WEF"], "HDI combines life expectancy, education (mean and expected years of schooling) and GNI per capita.");
b.q(2, "Which of the following is NOT a dimension of the Human Development Index?", ["Gender parity in parliament", "Long and healthy life", "Knowledge", "Decent standard of living"], "Gender is captured in separate indices like GII and GDI.");
b.q(2, "The Gini coefficient measures:", ["Income or consumption inequality", "Poverty headcount", "Inflation", "Unemployment"], "It ranges from 0 (perfect equality) to 1 (perfect inequality); the Lorenz curve illustrates it.");
b.q(2, "The 'poverty line' in India has traditionally been defined in terms of:", ["Monthly per capita consumption expenditure", "Land ownership", "Educational attainment", "Number of earning members"], "The Tendulkar and Rangarajan methods estimated consumption thresholds.");
b.q(2, "The Sustainable Development Goals, numbering 17, are to be achieved by:", ["2030", "2025", "2035", "2050"], "They were adopted by the UN in 2015, succeeding the MDGs.");
b.q(2, "SDG 8 relates to:", ["Decent work and economic growth", "Zero hunger", "Climate action", "Quality education"], "SDG 1 is no poverty, SDG 2 zero hunger, SDG 4 quality education, SDG 13 climate action.");
b.q(2, "NITI Aayog's 'SDG India Index' ranks:", ["States and Union Territories on progress towards the SDGs", "Countries on GDP", "Cities on cleanliness", "Companies on CSR"], "Kerala and Uttarakhand have topped recent editions.");
b.q(2, "'Inclusive growth' as an explicit objective was emphasised in the:", ["Eleventh Five-Year Plan", "First Five-Year Plan", "Fourth Five-Year Plan", "Annual Plans of 1966–69"], "The Eleventh Plan (2007–12) was titled 'Towards Faster and More Inclusive Growth'.");

b.t("Agriculture");
b.q(1, "Minimum Support Prices for crops are announced by the Government on the recommendation of the:", ["Commission for Agricultural Costs and Prices", "Food Corporation of India", "NABARD", "NITI Aayog"], "CACP recommends MSPs for 22 mandated crops plus FRP for sugarcane.");
b.q(1, "PM-KISAN provides eligible farmer families an income support of:", ["₹6,000 per year in three instalments", "₹10,000 per year", "₹2,000 per month", "₹12,000 per year"], "Launched in February 2019, the transfer is made through DBT.");
b.q(2, "The 'Green Revolution' in India in the 1960s is most associated with:", ["High-yielding varieties of wheat and rice, irrigation and fertilisers", "Organic farming", "Dairy development", "Fisheries"], "M. S. Swaminathan and Norman Borlaug are key figures.");
b.q(2, "'Operation Flood', which made India the largest milk producer, was led by:", ["Verghese Kurien", "M. S. Swaminathan", "C. Subramaniam", "Tribhuvandas Patel only"], "It was implemented by the National Dairy Development Board from 1970.");
b.q(2, "The Pradhan Mantri Fasal Bima Yojana (2016) caps farmers' premium for kharif crops at:", ["2% of the sum insured", "5%", "1.5%", "10%"], "It is 1.5% for rabi and 5% for commercial/horticultural crops.");
b.q(2, "e-NAM, launched in 2016, is a:", ["Pan-India electronic trading portal networking agricultural markets", "Crop insurance scheme", "Fertiliser subsidy scheme", "Soil testing programme"], "It is implemented by the Small Farmers' Agribusiness Consortium.");
b.q(2, "Soil Health Cards provide farmers with:", ["Crop-wise recommendations of nutrients and fertilisers based on soil tests", "Free seeds", "Crop loans", "Insurance"], "The scheme was launched in 2015.");
b.q(2, "Kisan Credit Cards (introduced in 1998) primarily provide:", ["Timely short-term credit for cultivation and allied needs", "Pension to farmers", "Free electricity", "Land titles"], "KCC was later extended to animal husbandry and fisheries.");
b.q(2, "The Food Corporation of India was set up in 1965 under the:", ["Food Corporations Act, 1964", "Essential Commodities Act, 1955", "NFSA, 2013", "APMC Act"], "It procures, stores and distributes foodgrains for the PDS.");
b.q(3, "'Buffer stock' of foodgrains is maintained by the government mainly to:", ["Ensure food security and stabilise prices", "Increase exports only", "Reduce fiscal deficit", "Help private traders"], "The FCI holds operational and strategic reserves.");
b.q(2, "India is the world's largest producer of:", ["Milk", "Wheat", "Rice", "Sugar"], "India also leads in pulses production; China leads in wheat and rice production.");

b.t("Industry & Business");
b.q(1, "The New Industrial Policy of 1991 is associated with:", ["Liberalisation, privatisation and globalisation", "Nationalisation of banks", "Licence-permit raj", "Five-Year Plans"], "Industrial licensing was abolished for most industries.");
b.q(2, "The Industrial Policy Resolution of 1956 is significant because it:", ["Classified industries into three schedules with a dominant role for the public sector", "Abolished licensing", "Privatised public sector units", "Introduced GST"], "It is called the 'economic constitution' of India.");
b.q(2, "Under the revised MSME classification announced in the Union Budget 2025–26, a 'micro' enterprise has investment up to ₹2.5 crore and turnover up to:", ["₹10 crore", "₹5 crore", "₹50 crore", "₹1 crore"], "Small: investment ≤ ₹25 crore and turnover ≤ ₹100 crore; medium: ≤ ₹125 crore and ≤ ₹500 crore.");
b.q(2, "'Make in India' was launched in:", ["September 2014", "January 2016", "July 2015", "May 2020"], "It aimed to make India a global manufacturing hub.");
b.q(2, "Production Linked Incentive (PLI) schemes provide:", ["Incentives on incremental sales of goods manufactured in India", "Tax holidays for exporters", "Free land to industries", "Interest-free loans"], "PLI schemes cover 14 sectors including electronics, pharma and auto.");
b.q(2, "'Maharatna' status for a central public sector enterprise is the highest status, conferring:", ["Greater financial and operational autonomy to the board", "Exemption from audit", "Exemption from taxes", "Monopoly rights"], "Navratna and Miniratna are other categories.");
b.q(2, "The 'Department of Investment and Public Asset Management' (DIPAM) deals with:", ["Disinvestment and management of government equity in CPSEs", "FDI promotion", "Tax collection", "Foreign aid"], "It is under the Ministry of Finance.");
b.q(2, "Startup India was launched in:", ["January 2016", "August 2014", "April 2020", "October 2018"], "16 January is now observed as National Startup Day.");
b.q(2, "The Insolvency and Bankruptcy Code requires corporate insolvency resolution to be completed ordinarily within:", ["330 days (including litigation)", "90 days", "One year without exceptions", "Three years"], "The original limit was 180 days extendable by 90; amended to 330 days including litigation.");
b.q(2, "The 'Ease of Doing Business' report, discontinued in 2021, was published by the:", ["World Bank", "IMF", "WEF", "OECD"], "It was replaced by the 'Business Ready' (B-READY) project.");

b.t("Capital Markets & Institutions");
b.q(1, "SEBI is the regulator of:", ["Securities markets in India", "Banks", "Insurance", "Pensions"], "It was set up in 1988 and given statutory powers in 1992.");
b.q(2, "SENSEX is the benchmark index of the:", ["Bombay Stock Exchange (30 stocks)", "National Stock Exchange (50 stocks)", "MCX", "NCDEX"], "NIFTY 50 is the NSE benchmark.");
b.q(2, "An IPO refers to:", ["The first sale of shares by a company to the public", "A bonus issue", "Buy-back of shares", "A rights issue"], "Subsequent public offers are called FPOs.");
b.q(2, "'Bull market' refers to a market in which prices are:", ["Rising or expected to rise", "Falling", "Stable", "Regulated"], "A bear market has falling prices.");
b.q(2, "The 'Gift City' in Gujarat hosts India's first:", ["International Financial Services Centre", "Stock exchange", "Special Economic Zone", "Smart city"], "IFSCA regulates financial services there.");
b.q(2, "NABARD's primary role is:", ["Refinancing and development of agriculture and rural sector credit", "Regulating stock markets", "Issuing currency", "Collecting taxes"], "It was set up in 1982 on the recommendation of the Shivaraman Committee.");
b.q(2, "SIDBI is the principal financial institution for:", ["Micro, small and medium enterprises", "Agriculture", "Housing", "Exports"], "Export-Import Bank of India finances foreign trade.");
b.q(2, "'Microfinance' in India is largely delivered through:", ["Self-help groups and MFIs", "Stock exchanges", "Insurance companies", "Pension funds"], "The SHG–Bank Linkage Programme started in 1992.");

b.t("International Economic Bodies");
b.mt(2, "Match the organisation with its headquarters:", [["International Monetary Fund", "Washington DC"], ["World Trade Organization", "Geneva"], ["Asian Development Bank", "Manila"], ["New Development Bank (BRICS)", "Shanghai"]], "The Asian Infrastructure Investment Bank is in Beijing; the World Bank is also in Washington DC.", "Organisation", "Headquarters");
b.q(2, "The IMF and World Bank were created at the conference held in 1944 at:", ["Bretton Woods", "Geneva", "San Francisco", "Paris"], "They are called the Bretton Woods institutions.");
b.q(2, "The International Development Association (IDA) of the World Bank Group provides:", ["Concessional loans and grants to the poorest countries", "Loans to private firms", "Insurance against political risk", "Dispute settlement"], "IFC lends to the private sector; MIGA provides guarantees; ICSID settles investment disputes.");
b.q(2, "The 'World Economic Outlook' is published by:", ["International Monetary Fund", "World Bank", "WTO", "OECD"], "The World Bank publishes 'Global Economic Prospects'.");
b.q(2, "'Global Competitiveness Report' was historically published by the:", ["World Economic Forum", "IMF", "UNCTAD", "World Bank"], "The WEF also publishes the Global Gender Gap Report.");
b.q(2, "BRICS expanded in 2024 to include which of these countries?", ["Egypt, Ethiopia, Iran and the UAE", "Argentina and Mexico", "Turkey and Indonesia only", "Pakistan and Bangladesh"], "Indonesia joined as a full member in January 2025.");
b.q(2, "India held the presidency of the G20 in:", ["2023 (New Delhi Summit, September 2023)", "2021", "2025", "2019"], "The African Union became a permanent member during India's presidency.");

b.t("Economic Concepts");
b.q(2, "'Opportunity cost' refers to:", ["The value of the next best alternative forgone", "The money cost of production", "Sunk cost", "Fixed cost"], "It is central to economic decision making.");
b.q(2, "When demand for a commodity is perfectly inelastic, the demand curve is:", ["Vertical", "Horizontal", "Downward sloping", "Upward sloping"], "Quantity demanded does not change with price.");
b.q(2, "Goods whose demand falls as consumer income rises are called:", ["Inferior goods", "Normal goods", "Luxury goods", "Giffen goods only"], "Giffen goods are a special type of inferior good with upward-sloping demand.");
b.q(2, "A market with a single seller and many buyers is called:", ["Monopoly", "Monopsony", "Oligopoly", "Perfect competition"], "Monopsony has a single buyer.");
b.q(2, "'Engel's law' states that as income rises:", ["The proportion of income spent on food falls", "Total spending on food falls", "Savings fall", "Spending on luxury goods falls"], "It helps measure welfare and poverty.");
b.q(3, "The 'multiplier' in Keynesian economics is equal to:", ["1 ÷ (1 − MPC)", "1 ÷ MPC", "MPC ÷ MPS", "1 − MPC"], "A higher marginal propensity to consume raises the multiplier.");
b.q(2, "'Fiscal drag' refers to:", ["Inflation or income growth pushing taxpayers into higher tax brackets, raising revenue without rate changes", "Delay in passing budgets", "Reduction in subsidies", "Excess government borrowing"], "It acts as an automatic stabiliser.");
b.q(2, "'Crowding out' refers to:", ["Reduction in private investment due to higher government borrowing raising interest rates", "Excess population in cities", "Over-subscription of IPOs", "Import surge"], "It is a concern when fiscal deficits are high.");

export default b.items;
