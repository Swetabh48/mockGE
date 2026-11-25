import { Bank } from "../bank/dsl";

/** 2025-pattern Economy: policy mechanics and statement analysis rather than recall. */
const b = new Bank("economy25");

b.t("Money & Banking");
b.st(3, "Consider the following about the monetary policy framework in India:", [
  "The inflation target is set by the Government in consultation with the RBI.",
  "The Monetary Policy Committee has three members from the RBI and three external members.",
  "The RBI Governor has a casting vote in case of a tie.",
  "The target is wholesale price inflation of 4%.",
], [1, 2, 3], "The target is CPI (combined) inflation of 4% with a ±2% band.");
b.q(3, "The RBI wants to absorb surplus liquidity without offering collateral to banks. Which instrument is designed for this?", ["Standing Deposit Facility", "Marginal Standing Facility", "Cash Reserve Ratio cut", "Purchase of government securities"], "SDF (2022) absorbs liquidity without collateral and acts as the floor of the LAF corridor.");
b.hm(3, "Which of the following actions would increase liquidity in the banking system?", [
  "A cut in the Cash Reserve Ratio",
  "Purchase of government securities by the RBI",
  "An increase in the repo rate",
  "Sale of foreign currency by the RBI in the spot market",
], 2, "CRR cut and OMO purchases inject liquidity; a repo hike tightens; selling dollars absorbs rupee liquidity.", "How many of the above increase liquidity?");
b.ar(3, "Monetary transmission is weaker when banks' deposit rates are largely fixed for long terms.", "Changes in the policy rate take longer to pass through to lending rates when funding costs adjust slowly.", "a", "This is why external benchmark lending was introduced in 2019.");
b.st(3, "With reference to the Pradhan Mantri MUDRA Yojana, consider the following:", [
  "It provides collateral-free loans to non-corporate, non-farm micro enterprises.",
  "The 'Tarun Plus' category extends loans up to ₹20 lakh for those who have repaid Tarun loans.",
  "MUDRA loans are disbursed directly by the Ministry of Finance.",
], [1, 2], "Loans are given by banks, NBFCs and MFIs; MUDRA refinances them.");

b.t("Fiscal Policy");
b.q(3, "If the fiscal deficit is 4.4% of GDP and interest payments are 3.6% of GDP, the primary deficit is:", ["0.8% of GDP", "8.0% of GDP", "3.6% of GDP", "1.2% of GDP"], "Primary deficit = fiscal deficit − interest payments.");
b.st(3, "Consider the following about the Union Budget 2025–26:", [
  "It targeted a fiscal deficit of 4.4% of GDP.",
  "Under the new tax regime, income up to ₹12 lakh (excluding special-rate income) effectively bears no tax.",
  "It raised the MSME investment and turnover limits for classification.",
], [1, 2, 3], "All three are features of the 2025–26 Budget.");
b.ar(3, "A rising share of interest payments in revenue expenditure reduces fiscal space.", "Interest is a committed expenditure that cannot be cut to fund new priorities.", "a", "R explains A.");
b.st(3, "Consider the following about GST rationalisation effective 22 September 2025:", [
  "Most goods and services now fall under two main slabs of 5% and 18%.",
  "A higher rate of 40% applies to specified sin and luxury goods.",
  "Petroleum crude was brought under GST at 18%.",
], [1, 2], "Petroleum crude and specified petroleum products remain outside GST.");
b.q(3, "A government's revenue receipts are ₹34 lakh crore, non-debt capital receipts ₹0.8 lakh crore, revenue expenditure ₹39 lakh crore and capital expenditure ₹11 lakh crore. The revenue deficit and fiscal deficit are respectively:", ["₹5 lakh crore and ₹15.2 lakh crore", "₹5 lakh crore and ₹16 lakh crore", "₹16 lakh crore and ₹5 lakh crore", "₹4.2 lakh crore and ₹15.2 lakh crore"], "RD = 39 − 34 = 5; FD = (39 + 11) − (34 + 0.8) = 15.2.");

b.t("External Sector");
b.hm(3, "Which of the following are recorded in the current account of India's balance of payments?", [
  "Remittances from Indians working abroad",
  "Earnings of Indian IT firms from software exports",
  "Investment by a foreign company to set up a factory in India",
  "Interest paid on India's external debt",
], 3, "FDI is a financial/capital account item.", "How many of the above?");
b.ar(3, "A depreciating rupee can widen India's merchandise trade deficit in the short run.", "India's imports, such as crude oil, are relatively price-inelastic, so their rupee cost rises immediately.", "a", "This is the J-curve effect.");
b.st(3, "Consider the following about India's trade agreements:", [
  "The India–EFTA TEPA includes a commitment to promote investment of US$ 100 billion in India over 15 years.",
  "The India–UK CETA was signed in 2025 and includes a Double Contribution Convention on social security.",
  "India is a member of the Regional Comprehensive Economic Partnership (RCEP).",
], [1, 2], "India opted out of RCEP in 2019.");

b.t("Poverty & Development");
b.st(3, "Consider the following about multidimensional poverty measurement:", [
  "NITI Aayog's index uses health, education and standard of living dimensions.",
  "It reported a sharp decline in multidimensional poverty between 2013–14 and 2022–23.",
  "It measures poverty solely on the basis of household income.",
], [1, 2], "MPI is non-income based.");
b.q(3, "If income inequality in a country falls, which change is expected?", ["The Lorenz curve moves closer to the line of equality and the Gini coefficient falls", "The Gini coefficient rises", "The Lorenz curve moves away from the line of equality", "HDI necessarily rises"], "A lower Gini indicates more equal distribution.");

b.t("Industry & Business");
b.q(3, "Under the revised MSME criteria (Budget 2025–26), an enterprise with plant and machinery investment of ₹20 crore and turnover of ₹120 crore is classified as:", ["Medium", "Small", "Micro", "Large"], "Small requires investment ≤ ₹25 crore AND turnover ≤ ₹100 crore; turnover exceeds ₹100 crore, so it is medium (≤ ₹125 crore investment, ≤ ₹500 crore turnover).");
b.st(3, "With reference to 'Zero Defect, Zero Effect' (ZED), consider the following:", [
  "It is an initiative of the Ministry of MSME.",
  "It certifies MSMEs on quality and minimal environmental impact.",
  "It is a scheme for zero-interest loans to exporters.",
], [1, 2], "ZED is a certification scheme, not a loan scheme.");

b.t("Money & Inflation");
b.st(3, "Consider the following statements about inflation:", [
  "Core inflation excludes food and fuel.",
  "Cost-push inflation can arise from a supply shock such as a rise in crude oil prices.",
  "Unanticipated inflation benefits lenders at fixed nominal rates.",
], [1, 2], "Unanticipated inflation benefits borrowers, as the real value of debt falls.");

b.t("Economic Concepts");
b.q(3, "If the marginal propensity to save is 0.25, an increase in government investment of ₹10,000 crore can raise national income by up to:", ["₹40,000 crore", "₹2,500 crore", "₹13,333 crore", "₹25,000 crore"], "Multiplier = 1/MPS = 4; 10,000 × 4 = ₹40,000 crore.");
b.ar(3, "Large fiscal deficits can crowd out private investment.", "Government borrowing raises demand for loanable funds and pushes up interest rates.", "a", "R explains A.");
b.st(3, "Consider the following about national income aggregates:", [
  "GDP at market prices = GVA at basic prices + product taxes − product subsidies.",
  "NNP = GNP − depreciation.",
  "GNP is always larger than GDP for India.",
], [1, 2], "India's net factor income from abroad is usually negative, so GNP is generally smaller than GDP.");

b.t("Agriculture");
b.st(3, "Consider the following about Minimum Support Prices:", [
  "They are announced on the recommendation of the Commission for Agricultural Costs and Prices.",
  "Sugarcane has a Fair and Remunerative Price instead of an MSP.",
  "MSP is legally guaranteed for all crops in all markets.",
], [1, 2], "There is no statutory guarantee of MSP purchase for all crops.");

b.t("Economic Institutions");
b.mt(3, "Match the institution with its primary role:", [["NABARD", "Refinance and development of rural credit"], ["SIDBI", "Finance and development of MSMEs"], ["IRDAI", "Regulation of insurance"], ["PFRDA", "Regulation of NPS and APY"]], "Sectoral regulators and development banks.", "Institution", "Role");
b.st(3, "Consider the following about NITI Aayog:", [
  "It replaced the Planning Commission in 2015.",
  "It is a statutory body created by an Act of Parliament.",
  "It brings out the SDG India Index ranking States and UTs.",
], [1, 3], "It was set up by a Cabinet resolution; it is neither constitutional nor statutory.");

b.t("Statements & Reasoning");
b.st(3, "Consider the following about the Economic Survey 2024–25:", [
  "It is prepared by the Economic Division of the Department of Economic Affairs.",
  "It is presented in Parliament before the Union Budget.",
  "It is prepared by the Comptroller and Auditor General.",
], [1, 2], "The Survey is prepared under the Chief Economic Adviser.");
b.q(3, "A bank has deposits of ₹1,000 crore. CRR is 3% and SLR 18%. The maximum funds available for lending (ignoring other requirements) are:", ["₹790 crore", "₹970 crore", "₹820 crore", "₹1,000 crore"], "1,000 − 30 − 180 = ₹790 crore.");

export default b.items;
