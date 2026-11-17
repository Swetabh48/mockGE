import { Bank } from "./dsl";

/** Polity: additional concepts, cases and statement questions. */
const b = new Bank("polity4");

b.t("Making of the Constitution");
b.q(2, "The Government of India Act, 1935 provided for all of the following EXCEPT:", ["Universal adult franchise", "An All-India Federation", "Provincial autonomy", "A Federal Court"], "The 1935 Act had a limited franchise; adult suffrage came only with the Constitution.");
b.q(2, "Dyarchy at the provincial level was introduced by the:", ["Government of India Act, 1919", "Indian Councils Act, 1909", "Government of India Act, 1935", "Indian Independence Act, 1947"], "The Montagu–Chelmsford reforms divided provincial subjects into transferred and reserved.");
b.q(2, "Separate electorates for Muslims were introduced by the:", ["Indian Councils Act, 1909 (Morley–Minto Reforms)", "Government of India Act, 1919", "Charter Act, 1833", "Regulating Act, 1773"], "Lord Minto has been called the 'father of communal electorate'.");
b.q(3, "The Charter Act of 1833 is significant because it:", ["Made the Governor-General of Bengal the Governor-General of India", "Ended the East India Company's rule", "Introduced provincial autonomy", "Created the Federal Court"], "Lord William Bentinck became the first Governor-General of India.");
b.q(2, "Who presided over the Constituent Assembly as its permanent President?", ["Dr. Rajendra Prasad", "Dr. Sachchidananda Sinha", "Dr. B. R. Ambedkar", "Jawaharlal Nehru"], "Dr. Sachchidananda Sinha was the temporary (provisional) chairman.");
b.q(3, "The 'Objectives Resolution' and the Preamble were adopted with which date chosen for the Constitution's commencement in honour of the 1930 'Purna Swaraj' declaration?", ["26 January", "15 August", "2 October", "26 November"], "26 January 1930 was celebrated as Purna Swaraj Day; hence the Constitution commenced on 26 January 1950.");

b.t("Fundamental Rights & Duties");
b.q(2, "Which committee recommended the inclusion of Fundamental Duties in the Constitution?", ["Swaran Singh Committee (1976)", "Verma Committee (1999)", "Sarkaria Commission", "Kothari Commission"], "Its recommendations were implemented through the 42nd Amendment.");
b.q(2, "Which of the following is a Fundamental Duty under Article 51A?", ["To develop the scientific temper, humanism and the spirit of inquiry and reform", "To vote in elections", "To pay taxes", "To join the armed forces"], "Voting and paying taxes are not listed as Fundamental Duties.");
b.q(2, "Freedom of the press in India is implied in:", ["Article 19(1)(a) — freedom of speech and expression", "Article 21", "Article 25", "Article 32"], "There is no separate article on press freedom; it flows from Article 19(1)(a).");
b.q(3, "Section 66A of the IT Act, 2000 was struck down as violative of Article 19(1)(a) in:", ["Shreya Singhal v. Union of India (2015)", "Romesh Thappar (1950)", "Anuradha Bhasin (2020)", "Sakal Papers (1962)"], "The Court held the provision vague and overbroad.");
b.q(2, "The Right to Information Act was enacted in:", ["2005", "2002", "2009", "2013"], "The RTI Act is rooted in Article 19(1)(a); the Central Information Commission hears appeals.");
b.q(3, "Article 21 has been interpreted to include all of the following EXCEPT:", ["Right to strike", "Right to livelihood", "Right to a clean environment", "Right to privacy"], "The Supreme Court has repeatedly held there is no fundamental right to strike.");
b.q(2, "Untouchability is an offence punishable under the:", ["Protection of Civil Rights Act, 1955", "Indian Penal Code alone", "SC/ST Prevention of Atrocities Act, 1950", "Representation of the People Act"], "Originally the Untouchability (Offences) Act, 1955, renamed in 1976.");
b.q(2, "Which Article allows the State to make special provisions for women and children?", ["Article 15(3)", "Article 16(4)", "Article 17", "Article 14"], "Article 15(3) is the basis for many protective laws.");
b.st(3, "Consider the following statements:", ["The Right to Education under Article 21A covers children aged 6 to 14 years.", "Article 45 now deals with early childhood care and education for children below six.", "The Right of Children to Free and Compulsory Education Act was enacted in 2009."], [1, 2, 3], "All three statements are correct.");

b.t("Union Executive");
b.q(2, "The President's power to grant pardon extends to:", ["All cases where the sentence is by a court martial and death sentences", "Only civil cases", "Only cases under State laws", "Only juvenile offenders"], "Article 72; the Governor under Article 161 cannot pardon death sentences or court-martial sentences.");
b.q(2, "Which of the following is NOT a discretionary power of the President?", ["Appointing Supreme Court judges by personal choice without the collegium process", "Returning a bill (other than a money bill) for reconsideration", "Choosing the PM when no party has a clear majority", "Dismissing a ministry that has lost confidence and refuses to resign"], "Judicial appointments follow the collegium process; the others involve situational discretion.");
b.q(2, "Who administers the oath of office to the President of India?", ["The Chief Justice of India", "The Vice-President", "The Speaker of the Lok Sabha", "The Prime Minister"], "In the absence of the CJI, the senior-most Supreme Court judge administers it.");
b.q(3, "If the offices of both the President and Vice-President fall vacant, who acts as President?", ["The Chief Justice of India", "The Speaker of the Lok Sabha", "The Prime Minister", "The Attorney-General"], "This happened in 1969 when Chief Justice M. Hidayatullah acted as President.");
b.q(2, "The Cabinet Secretariat functions under the direct charge of the:", ["Prime Minister", "President", "Home Minister", "Lok Sabha Speaker"], "The Cabinet Secretary is the senior-most civil servant.");

b.t("Parliament");
b.q(2, "The first Lok Sabha was constituted in:", ["1952", "1950", "1947", "1957"], "The first general elections were held between October 1951 and February 1952.");
b.q(2, "The 18th Lok Sabha was constituted after the general elections held in:", ["2024", "2019", "2023", "2025"], "Om Birla was re-elected Speaker in June 2024.");
b.q(2, "Which of the following can be introduced in either House of Parliament?", ["A Constitution Amendment Bill", "A Money Bill", "An Appropriation Bill", "A Finance Bill containing only Article 110 matters"], "Amendment bills may originate in either House (Article 368).");
b.q(3, "The 'Question Hour' in Parliament: a starred question differs from an unstarred question in that it:", ["Requires an oral answer and allows supplementary questions", "Gets only a written answer", "Is asked by ministers", "Is asked without notice"], "Short-notice questions are asked at less than 10 days' notice.");
b.q(2, "Department-related Standing Committees in Parliament were set up in:", ["1993", "1950", "1975", "2004"], "There are 24 such committees examining demands for grants and bills.");
b.q(3, "Which motion is moved to draw the attention of a minister to a matter of urgent public importance?", ["Calling attention motion", "Censure motion", "No-confidence motion", "Privilege motion"], "It is an Indian innovation in parliamentary procedure since 1954.");
b.q(2, "A no-confidence motion can be moved only in:", ["The Lok Sabha, with the support of at least 50 members", "The Rajya Sabha", "Either House", "A joint sitting"], "It need not state reasons.");
b.q(3, "The 'Consolidated Fund of India' is charged with expenditure that is NOT subject to vote. Which of these is a 'charged' expenditure?", ["Salaries and allowances of judges of the Supreme Court", "Salaries of Union ministers", "Expenditure on defence", "Subsidies on fertiliser"], "Charged items include emoluments of the President, CAG, Supreme Court judges and debt charges (Article 112(3)).");

b.t("Judiciary");
b.q(2, "The Supreme Court of India was inaugurated on:", ["28 January 1950", "26 January 1950", "15 August 1947", "26 November 1949"], "It succeeded the Federal Court of India.");
b.q(2, "The sanctioned strength of the Supreme Court (including the CJI) after the 2019 amendment is:", ["34", "31", "30", "26"], "The Supreme Court (Number of Judges) Amendment Act, 2019 raised it from 31 to 34.");
b.q(2, "Which High Court has jurisdiction over the largest number of States/UTs?", ["Guwahati High Court", "Bombay High Court", "Calcutta High Court", "Madras High Court"], "It covers Assam, Nagaland, Mizoram and Arunachal Pradesh.");
b.q(3, "Judicial review in India flows from all of the following Articles EXCEPT:", ["Article 123", "Article 13", "Article 32", "Article 226"], "Judicial review flows from Articles 13, 32, 226 and others and is part of the basic structure; Article 123 is the President's ordinance power.");
b.q(2, "Gram Nyayalayas were established under an Act of Parliament passed in:", ["2008", "1987", "1993", "2015"], "They provide access to justice at the grassroots.");
b.q(3, "Who among the following was the first woman judge of the Supreme Court of India?", ["Justice M. Fathima Beevi", "Justice Leila Seth", "Justice Ruma Pal", "Justice Sujata Manohar"], "She was appointed in 1989. Leila Seth was the first woman Chief Justice of a High Court.");

b.t("Constitutional & Statutory Bodies");
b.q(2, "The National Commission for Scheduled Tribes was created as a separate body by the:", ["89th Amendment, 2003", "65th Amendment, 1990", "73rd Amendment", "102nd Amendment"], "The 89th Amendment bifurcated the combined National Commission for SCs and STs.");
b.q(2, "The Solicitor General of India is a:", ["Statutory post (not a constitutional office)", "Constitutional post under Article 76", "Post created by the Supreme Court", "Elected post"], "Only the Attorney-General is mentioned in the Constitution.");
b.q(3, "The Central Information Commission was set up under the:", ["RTI Act, 2005", "Official Secrets Act, 1923", "Constitution (Article 315)", "Public Records Act, 1993"], "It hears second appeals and complaints under the RTI Act.");
b.q(2, "The 'Staff Selection Commission' and the 'UPSC' differ in that the SSC is:", ["A non-constitutional body (attached office of DoPT)", "A constitutional body", "A judicial body", "An NGO"], "UPSC is under Article 315; SSC was set up by a resolution in 1975.");

b.t("Polity – Miscellaneous");
b.q(1, "'Constitution Day' (Samvidhan Divas) is observed on:", ["26 November", "26 January", "15 August", "2 October"], "It marks the adoption of the Constitution in 1949.");
b.q(2, "The national song 'Vande Mataram' is taken from which work?", ["Anandamath by Bankim Chandra Chattopadhyay", "Gitanjali by Tagore", "Bharat Bharati by Maithili Sharan Gupt", "Gora by Tagore"], "2025 marked 150 years of the song (composed in 1875).");
b.q(2, "Which Article provides for the official language of a State?", ["Article 345", "Article 343", "Article 348", "Article 351"], "Article 351 directs the Union to promote the spread of Hindi.");
b.hm(2, "Consider the following features of the Indian Constitution:", ["Single citizenship", "Integrated judiciary", "All-India services", "Residuary powers with the Union"], 4, "All are unitary features of the Indian federal system.", "How many of the above are unitary (non-federal) features?");
b.st(2, "Consider the following statements about the Vice-President of India:", ["The Vice-President is elected by members of both Houses of Parliament.", "State legislators also vote in the election of the Vice-President."], [1], "Only MPs (elected and nominated) vote; State legislators do not.");
b.ar(2, "India is called a 'Republic'.", "The head of State in India is an elected President and not a hereditary monarch.", "a", "R explains A.");
b.ar(3, "The President is the nominal executive in India.", "Article 74 makes the advice of the Council of Ministers binding on the President.", "a", "The 42nd and 44th Amendments made the advice binding (subject to one reconsideration), which explains the nominal role.");
b.q(2, "Which of the following Union Territories has a Legislative Assembly?", ["Puducherry", "Ladakh", "Lakshadweep", "Chandigarh"], "Delhi, Puducherry and Jammu and Kashmir have legislatures.");
b.q(1, "The Union Territories of Dadra & Nagar Haveli and Daman & Diu were merged in:", ["January 2020", "August 2019", "April 2022", "March 2018"], "The merger reduced the number of Union Territories.");
b.q(2, "How many Union Territories does India have at present?", ["8", "7", "9", "6"], "Delhi, J&K, Ladakh, Chandigarh, Puducherry, Lakshadweep, Andaman & Nicobar, and Dadra & Nagar Haveli and Daman & Diu.");

b.q(2, "The Tenth Schedule (anti-defection law) does NOT apply when a member:", ["Is elected Speaker and resigns from the party", "Voluntarily gives up party membership", "Defies the party whip without permission", "Joins another party after election as an independent"], "A presiding officer leaving the party on election is protected under paragraph 5.");
b.q(1, "Who is known as the 'Father of the Indian Constitution'?", ["Dr. B. R. Ambedkar", "Mahatma Gandhi", "Jawaharlal Nehru", "Dr. Rajendra Prasad"], "As chairman of the Drafting Committee he piloted the draft through the Assembly.");
b.q(2, "The Constitution of India describes the official language of the Union as:", ["Hindi in Devanagari script, with international form of Indian numerals", "Hindi and English equally", "English only", "All Eighth Schedule languages"], "Article 343(1); English continues for official purposes under the Official Languages Act, 1963.");

export default b.items;
