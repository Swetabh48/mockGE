import { Bank } from "./dsl";

/** More accounting: bills, consignment, GST, statements, A–R, matching. */
const b = new Bank("accounting3");

b.t("Special Transactions");
b.q(2, "A bill of exchange is drawn by:", ["The creditor (drawer) on the debtor (drawee)", "The debtor on the creditor", "The bank on the customer", "The payee on the drawer"], "The drawer orders the drawee to pay; the drawee accepts it.");
b.q(2, "Days of grace allowed on a time bill of exchange in India are:", ["Three days", "Seven days", "No days", "Thirty days"], "Under the Negotiable Instruments Act, three days of grace are added to compute the due date (not for bills payable on demand).");
b.q(2, "When a bill receivable is discounted with the bank, the discount charged is debited to:", ["Discount A/c", "Bills Receivable A/c", "Drawee's A/c", "Bank A/c"], "Bank A/c Dr. (net), Discount A/c Dr. To Bills Receivable A/c.");
b.q(3, "Noting charges paid on dishonour of a bill are ultimately borne by:", ["The drawee (acceptor), being debited to his account", "The drawer always", "The bank", "The notary"], "Noting charges are debited to the party liable — the acceptor.");
b.q(2, "In consignment accounting, the person who sends goods is the:", ["Consignor", "Consignee", "Del credere agent", "Principal debtor"], "The consignee is the agent who sells on behalf of the consignor for commission.");
b.q(3, "'Del credere commission' is paid to a consignee for:", ["Bearing the risk of bad debts on credit sales", "Selling above the invoice price", "Storage of goods", "Transport of goods"], "With del credere, bad debts are borne by the consignee.");
b.q(2, "In a 'joint venture', the parties are called:", ["Co-venturers", "Partners for life", "Consignors", "Shareholders"], "A joint venture is a temporary partnership for a specific purpose.");
b.q(2, "A 'proforma invoice' is sent by the consignor to the consignee mainly to:", ["Give information about the goods and their price; it is not a sale", "Record a credit sale", "Demand payment immediately", "Claim insurance"], "Consignment is not a sale; ownership remains with the consignor.");
b.q(3, "Under GST, input tax credit paid on purchases is recorded in the books as:", ["An asset (Input CGST/SGST/IGST A/c), set off against output tax liability", "An expense in P&L", "Part of sales revenue", "A capital receipt"], "Output tax collected is a liability; ITC is an asset adjusted against it.");
b.q(2, "On an intra-State supply, GST is levied as:", ["CGST plus SGST/UTGST", "IGST only", "Customs duty", "Cess only"], "Inter-State supplies attract IGST.");
b.q(2, "On an inter-State supply of goods, the tax levied is:", ["IGST", "CGST + SGST", "SGST only", "VAT"], "IGST is collected by the Centre and apportioned.");
b.q(3, "Hire purchase differs from instalment sale mainly in that under hire purchase:", ["Ownership passes only on payment of the last instalment", "Ownership passes immediately", "No interest is charged", "The buyer cannot use the goods"], "The hirer is a bailee until all instalments are paid.");
b.q(2, "A royalty agreement providing a 'minimum rent' gives rise to 'short workings' when:", ["Actual royalty is less than the minimum rent", "Actual royalty exceeds the minimum rent", "No production occurs at all in the year only", "Royalty is paid in advance"], "Short workings may be recouped from future excess royalties within a stated period.");

b.t("Accounting Concepts");
b.ar(2, "Inventory is valued at the lower of cost and net realisable value.", "The convention of conservatism requires that losses be anticipated but not gains.", "a", "The rule applies prudence: unrealised gains are ignored, foreseeable losses provided for.");
b.ar(2, "Land is generally not depreciated.", "Land has an indefinite useful life.", "a", "R explains A.");
b.ar(3, "A trial balance that agrees proves that the books are free from all errors.", "Errors of principle and compensating errors do not affect the agreement of a trial balance.", "d", "A is false (agreement does not prove absence of errors). R is true and actually shows why A is false.");
b.ar(3, "Drawings by the proprietor are deducted from capital.", "Drawings are an expense charged to the profit and loss account.", "c", "A is true. R is false: drawings are not a business expense; they reduce capital directly.");
b.ar(2, "Outstanding salary is shown as a current liability.", "Under the accrual concept, expenses incurred but unpaid at year-end must be recognised.", "a", "Accrual explains why outstanding salary appears as a liability.");
b.st(2, "Consider the following statements:", ["Depreciation is a non-cash expense.", "Depreciation provides funds for replacing assets in all cases."], [1], "Depreciation does not by itself create a replacement fund unless profits are retained or a sinking fund is set up.");
b.st(3, "Consider the following statements about errors:", ["Errors of principle affect the trial balance.", "Posting an amount to the wrong side of an account affects the trial balance.", "Omitting to post one side of an entry affects the trial balance."], [2, 3], "Errors of principle do not affect the trial balance; one-sided errors do.");
b.st(2, "Consider the following statements about the cash book:", ["It records both cash receipts and payments.", "A cash book can never show a credit balance in the cash column."], [1, 2], "Cash in hand cannot be negative; the bank column may show a credit balance (overdraft).");
b.hm(3, "Consider the following items:", ["Purchase of a delivery van", "Payment of electricity bill", "Brokerage paid on purchase of land", "Wages paid to workers for construction of a building"], 3, "Items 1, 3 and 4 are capital expenditure; electricity bill is revenue.", "How many of the above are capital expenditure?");
b.hm(2, "Consider the following accounts:", ["Machinery A/c", "Goodwill A/c", "Commission Received A/c", "Prepaid Rent A/c"], 2, "Machinery and Goodwill are real accounts (tangible and intangible). Commission received is nominal; prepaid rent is representative personal.", "How many of the above are real accounts?");
b.mt(3, "Match the subsidiary book with the transaction recorded in it:", [["Purchases book", "Credit purchase of goods"], ["Sales returns book", "Goods returned by customers"], ["Bills payable book", "Acceptances given to creditors"], ["Journal proper", "Credit purchase of furniture"]], "Each subsidiary book records one class of transactions; residual entries go to the journal proper.", "Book", "Transaction");
b.mt(2, "Match the item with its place in final accounts:", [["Carriage inwards", "Trading account"], ["Carriage outwards", "Profit and loss account"], ["Goodwill", "Balance sheet (assets)"], ["Drawings", "Deducted from capital"]], "Direct expenses go to trading, indirect to P&L; assets to the balance sheet; drawings reduce capital.", "Item", "Treatment");

b.t("Final Accounts");
b.q(2, "Office salaries are debited to the:", ["Profit and loss account", "Trading account", "Balance sheet", "Capital account"], "They are indirect (administrative) expenses.");
b.q(2, "Manufacturing wages are shown in the:", ["Trading (or manufacturing) account", "Profit and loss account", "Balance sheet", "Appropriation account"], "Wages directly related to production are direct expenses.");
b.q(2, "Abnormal loss of goods by theft is credited to the:", ["Trading account (and debited to P&L account, net of insurance claim)", "Balance sheet", "Capital account only", "Purchases book"], "It is removed from trading results and shown as a loss in P&L.");
b.q(3, "Goods worth ₹10,000 were received on 31 March and included in closing stock, but the invoice was not recorded in purchases. The effect on gross profit is:", ["Overstated by ₹10,000", "Understated by ₹10,000", "No effect", "Overstated by ₹20,000"], "Closing stock includes the goods but purchases are understated; COGS falls by ₹10,000, overstating profit.");
b.q(3, "If closing stock is overvalued by ₹5,000 this year, next year's profit will be:", ["Understated by ₹5,000", "Overstated by ₹5,000", "Unaffected", "Overstated by ₹10,000"], "This year's closing stock is next year's opening stock; higher opening stock raises next year's COGS.");
b.q(2, "A 'marshalling' of the balance sheet refers to:", ["The order in which assets and liabilities are arranged (liquidity or permanence)", "Auditing the balance sheet", "Valuation of assets", "Consolidation of accounts"], "Companies follow Schedule III order; sole traders may use liquidity or permanence order.");
b.q(2, "Goodwill is classified as:", ["An intangible asset", "A current asset", "A fictitious asset", "A liability"], "Goodwill is an intangible asset; fictitious assets (like preliminary expenses written off over years earlier) have no realisable value.");

b.t("Accounting Standards");
b.q(2, "Ind AS 1 deals with:", ["Presentation of financial statements", "Inventories", "Leases", "Income taxes"], "Ind AS 1 sets out the overall requirements for presentation of financial statements.");
b.q(3, "Under Ind AS, a 'complete set of financial statements' includes all of the following EXCEPT:", ["Directors' report", "Balance sheet", "Statement of changes in equity", "Statement of cash flows"], "The directors' report is required under the Companies Act but is not part of financial statements.");
b.q(3, "Ind AS 109 deals with:", ["Financial instruments", "Revenue from contracts with customers", "Leases", "Share-based payment"], "Ind AS 109 covers classification, measurement and impairment (expected credit loss) of financial instruments.");
b.q(3, "Ind AS 36 deals with:", ["Impairment of assets", "Inventories", "Borrowing costs", "Related party disclosures"], "An asset is impaired when its carrying amount exceeds its recoverable amount.");
b.q(2, "Ind AS were notified for phased implementation by companies beginning from the financial year:", ["2016–17", "2001–02", "2011–12", "2020–21"], "Phase I (listed and large companies with net worth ≥ ₹500 crore) applied from 1 April 2016.");
b.q(2, "International Financial Reporting Standards (IFRS) are issued by the:", ["International Accounting Standards Board (IASB)", "IMF", "World Bank", "FASB"], "Ind AS are converged with IFRS; FASB issues US GAAP.");

b.t("Ratio Concepts");
b.q(2, "Quick ratio excludes which of the following from current assets?", ["Inventory and prepaid expenses", "Cash", "Trade receivables", "Marketable securities"], "Quick assets are those readily convertible to cash.");
b.q(2, "A high inventory turnover ratio generally indicates:", ["Efficient inventory management and fast-moving stock", "Over-stocking", "Low sales", "Poor liquidity"], "However, an extremely high ratio may indicate stock-outs.");
b.q(2, "Proprietary ratio is:", ["Shareholders' funds ÷ Total assets", "Debt ÷ Equity", "Current assets ÷ Current liabilities", "Net profit ÷ Sales"], "It shows the proportion of assets financed by owners.");
b.q(3, "Earnings per share (EPS) is computed as:", ["Profit available to equity shareholders ÷ Number of equity shares", "Net profit ÷ Total shares including preference", "Dividend ÷ Number of shares", "Market price ÷ Book value"], "Preference dividend is deducted from profit before dividing.");
b.q(3, "Price–Earnings (P/E) ratio equals:", ["Market price per share ÷ Earnings per share", "EPS ÷ Market price", "Dividend ÷ EPS", "Book value ÷ Market price"], "P/E reflects how much investors pay per rupee of earnings.");

b.t("Auditing");
b.q(2, "'Audit trail' (edit log) in accounting software, made mandatory for companies from 1 April 2023, means:", ["A record of every change made in the books of account, which cannot be disabled", "A list of auditors", "A trail of physical stock movement", "The auditor's working papers"], "Rule 3 of the Companies (Accounts) Rules requires accounting software with an audit trail feature.");
b.q(2, "Test checking in auditing refers to:", ["Examining a sample of transactions rather than all", "Checking every transaction", "Checking only cash", "Checking tax returns"], "Sampling is used when internal controls are reliable.");
b.q(3, "Under Section 143(12) of the Companies Act, 2013, an auditor who has reason to believe that a fraud involving ₹1 crore or more is being committed must report to:", ["The Central Government", "The shareholders only", "The police only", "SEBI only"], "Frauds below the threshold are reported to the audit committee/board.");

export default b.items;
