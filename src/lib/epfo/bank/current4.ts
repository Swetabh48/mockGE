import { Bank } from "./dsl";

/** Current events: defence exercises, important days, appointments, sports and science (tables + items). */
const b = new Bank("current4");

type X = [string, string, 1 | 2 | 3];
const EXERCISES: X[] = [
  ["Yudh Abhyas", "United States", 2],
  ["Mitra Shakti", "Sri Lanka", 2],
  ["Nomadic Elephant", "Mongolia", 3],
  ["Garuda Shakti", "Indonesia", 3],
  ["Shakti", "France", 2],
  ["Dharma Guardian", "Japan", 2],
  ["AUSINDEX", "Australia", 2],
  ["Ekuverin", "Maldives", 3],
  ["Surya Kiran", "Nepal", 2],
  ["Sampriti", "Bangladesh", 3],
  ["Indra", "Russia", 2],
  ["Ajeya Warrior", "United Kingdom", 3],
  ["Lamitiye", "Seychelles", 3],
  ["Harimau Shakti", "Malaysia", 3],
  ["Khanjar", "Kyrgyzstan", 3],
  ["Dustlik", "Uzbekistan", 3],
  ["Al Najah", "Oman", 3],
  ["SIMBEX", "Singapore", 2],
];
const countries = EXERCISES.map((e) => e[1]);
EXERCISES.forEach(([ex, c, d]) => {
  b.t("Defence Exercises").pool(d, `The military exercise '${ex}' is conducted between India and:`, c, countries, `'${ex}' is a bilateral exercise between India and ${c}.`);
});

type D = [string, string, 1 | 2 | 3];
const DAYS: D[] = [
  ["National Youth Day (birth anniversary of Swami Vivekananda)", "12 January", 1],
  ["Army Day", "15 January", 2],
  ["National Voters' Day", "25 January", 2],
  ["National Girl Child Day", "24 January", 2],
  ["National Science Day (discovery of the Raman effect)", "28 February", 1],
  ["International Women's Day", "8 March", 1],
  ["World Water Day", "22 March", 2],
  ["World Health Day", "7 April", 1],
  ["National Civil Services Day", "21 April", 3],
  ["World Book and Copyright Day", "23 April", 2],
  ["World Press Freedom Day", "3 May", 2],
  ["National Technology Day (Pokhran-II tests, 1998)", "11 May", 2],
  ["World No Tobacco Day", "31 May", 2],
  ["National Statistics Day (birth anniversary of P. C. Mahalanobis)", "29 June", 3],
  ["National Doctors' Day (Dr. B. C. Roy)", "1 July", 2],
  ["World Population Day", "11 July", 2],
  ["National Handloom Day", "7 August", 3],
  ["National Sports Day (Major Dhyan Chand)", "29 August", 1],
  ["Teachers' Day (Dr. S. Radhakrishnan)", "5 September", 1],
  ["International Literacy Day", "8 September", 2],
  ["Hindi Diwas", "14 September", 2],
  ["Engineers' Day (M. Visvesvaraya)", "15 September", 2],
  ["World Tourism Day", "27 September", 3],
  ["Indian Air Force Day", "8 October", 2],
  ["Rashtriya Ekta Diwas (Sardar Patel's birth anniversary)", "31 October", 1],
  ["Children's Day (Jawaharlal Nehru)", "14 November", 1],
  ["World AIDS Day", "1 December", 2],
  ["Indian Navy Day", "4 December", 2],
  ["Human Rights Day", "10 December", 1],
  ["National Mathematics Day (Srinivasa Ramanujan)", "22 December", 2],
  ["Kisan Diwas (Chaudhary Charan Singh)", "23 December", 3],
  ["Good Governance Day (Atal Bihari Vajpayee)", "25 December", 2],
];
const dates = DAYS.map((x) => x[1]);
DAYS.forEach(([day, date, dd], i) => {
  b.t("Important Days");
  if (i % 2 === 0) b.pool(dd, `${day} is observed on:`, date, dates, `${day}: ${date}.`);
  else b.pool(dd, `Which day is observed on ${date}?`, day, DAYS.map((x) => x[0]), `${date} is ${day}.`);
});

b.t("Appointments & Personalities");
b.q(1, "Who is the Union Minister of Labour and Employment (and hence Chairman of the CBT, EPF) in the government formed in June 2024?", ["Mansukh Mandaviya", "Bhupender Yadav", "Santosh Gangwar", "Narendra Singh Tomar"], "Shobha Karandlaje is the Minister of State for Labour and Employment.");
b.q(2, "Who became the Chief of the Army Staff in June 2024?", ["General Upendra Dwivedi", "General Manoj Pande", "General Anil Chauhan", "General M. M. Naravane"], "Admiral Dinesh K. Tripathi became Navy chief (April 2024) and Air Chief Marshal A. P. Singh became IAF chief (September 2024).");
b.q(2, "T. V. Somanathan took over in August 2024 as:", ["Cabinet Secretary", "RBI Governor", "Chief Economic Adviser", "Comptroller and Auditor General"], "The Cabinet Secretary is the head of the civil services.");
b.q(2, "Vikram Misri was appointed in 2024 as India's:", ["Foreign Secretary", "National Security Adviser", "Home Secretary", "Ambassador to the US"], "He succeeded Vinay Mohan Kwatra.");
b.q(2, "Jay Shah took charge as Chairman of which body in December 2024?", ["International Cricket Council", "BCCI", "Asian Cricket Council", "Indian Olympic Association"], "He is the youngest ICC chairman.");
b.q(2, "Who is the Leader of the Opposition in the 18th Lok Sabha?", ["Rahul Gandhi", "Mallikarjun Kharge", "Akhilesh Yadav", "Shashi Tharoor"], "Mallikarjun Kharge is LoP in the Rajya Sabha.");

b.t("Sports");
b.q(2, "India won how many medals at the Hangzhou Asian Games (held in 2023)?", ["107", "70", "54", "125"], "It was India's best-ever tally, including 28 gold medals.");
b.q(2, "India's men's hockey team won the Asia Cup 2025 at Rajgir (Bihar), defeating:", ["South Korea", "Pakistan", "Japan", "Malaysia"], "The win secured direct qualification for the 2026 FIH World Cup.");
b.q(2, "Which team won its first IPL title in 2025?", ["Royal Challengers Bengaluru", "Punjab Kings", "Delhi Capitals", "Lucknow Super Giants"], "RCB defeated Punjab Kings in the final.");
b.q(2, "India won the Thomas Cup (badminton) for the first time in:", ["2022", "2018", "2024", "2010"], "India defeated Indonesia in the final in Bangkok.");
b.q(2, "Neeraj Chopra won India's first-ever gold at the World Athletics Championships in:", ["2023 (Budapest)", "2022 (Eugene)", "2025 (Tokyo)", "2019 (Doha)"], "He had won Olympic gold at Tokyo 2020.");
b.q(2, "The 2028 Summer Olympics, which will include cricket, will be held in:", ["Los Angeles", "Brisbane", "Paris", "Tokyo"], "Brisbane will host in 2032.");
b.q(2, "The FIFA World Cup 2026 is being jointly hosted by:", ["USA, Canada and Mexico", "Spain, Portugal and Morocco", "Saudi Arabia", "Qatar and UAE"], "It will be the first World Cup with 48 teams.");
b.q(2, "'Khelo India' is a scheme for:", ["Mass participation and promotion of sporting excellence", "Sports betting regulation", "Cricket only", "Building stadiums abroad"], "It includes Khelo India Youth Games and University Games.");
b.q(2, "The Major Dhyan Chand Khel Ratna is India's highest sporting honour. It was earlier named after:", ["Rajiv Gandhi", "Indira Gandhi", "Jawaharlal Nehru", "Milkha Singh"], "It was renamed in 2021.");

b.t("Science & Space (Current)");
b.q(2, "The 2024 Nobel Prize in Physics was awarded to John Hopfield and Geoffrey Hinton for:", ["Foundational discoveries enabling machine learning with artificial neural networks", "Discovery of the Higgs boson", "Gravitational wave detection", "Attosecond light pulses"], "Their work underlies modern AI.");
b.q(2, "The 2024 Nobel Prize in Chemistry was shared by David Baker, Demis Hassabis and John Jumper for work on:", ["Computational protein design and protein structure prediction", "Quantum dots", "Click chemistry", "Lithium batteries"], "AlphaFold predicted structures of nearly all known proteins.");
b.q(3, "The 2025 Nobel Prize in Physics was awarded for the discovery of:", ["Macroscopic quantum tunnelling and energy quantisation in an electric circuit", "Dark energy", "Neutrino oscillations", "Topological insulators"], "John Clarke, Michel Devoret and John Martinis were the laureates.");
b.q(2, "The 2024 Nobel Prize in Physiology or Medicine was awarded for the discovery of:", ["microRNA and its role in gene regulation", "mRNA vaccines", "Hepatitis C virus", "Temperature receptors"], "Victor Ambros and Gary Ruvkun were honoured.");
b.q(2, "The 'India Semiconductor Mission' was launched in:", ["December 2021", "January 2015", "July 2019", "March 2024"], "It supports fabs, display fabs and ATMP/OSAT units.");
b.q(2, "Which company is setting up India's first commercial semiconductor fab at Dholera, Gujarat, in partnership with Taiwan's PSMC?", ["Tata Electronics (with PSMC)", "Infosys", "Reliance Jio", "BHEL"], "The Dholera, Gujarat fab is a joint effort with Taiwan's Powerchip Semiconductor Manufacturing Corporation.");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements:", ["National Science Day marks C. V. Raman's discovery of the Raman effect.", "National Mathematics Day honours Srinivasa Ramanujan."], [1, 2], "Science Day is 28 February; Mathematics Day is 22 December.");
b.st(3, "Consider the following about the Paris 2024 Olympics:", ["India won no gold medal.", "India's hockey team won bronze.", "Vinesh Phogat won a silver medal in wrestling."], [1, 2], "Vinesh Phogat was disqualified before the final for being overweight; Aman Sehrawat won bronze in wrestling.");
b.hm(2, "Consider the following pairs of exercise and partner country:", ["Yudh Abhyas — USA", "Dharma Guardian — Japan", "Mitra Shakti — Sri Lanka"], 3, "All three are correctly matched.", "How many of the above pairs are correctly matched?");

export default b.items;
