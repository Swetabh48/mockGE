import { Bank } from "./dsl";

/** Current events 2023–2025: space, defence, summits, awards, sports, appointments. */
const b = new Bank("current2");

b.t("Science & Space (Current)");
b.q(1, "Chandrayaan-3's lander Vikram touched down near the lunar south pole on:", ["23 August 2023", "14 July 2023", "2 September 2023", "22 July 2019"], "India became the first country to land near the lunar south pole; 23 August is now National Space Day.");
b.q(2, "The landing point of Chandrayaan-3's Vikram lander was named:", ["Shiv Shakti point", "Tiranga point", "Jawahar point", "Vikram Sarabhai point"], "The Chandrayaan-2 crash site was named Tiranga point.");
b.q(2, "Aditya-L1, India's first solar observatory mission, was placed in a halo orbit around the Lagrange point L1 in:", ["January 2024", "September 2023", "August 2024", "March 2025"], "It was launched on 2 September 2023 by PSLV-C57.");
b.q(2, "ISRO's SpaDeX mission successfully demonstrated in January 2025:", ["In-space docking of two satellites", "A crewed spaceflight", "A Mars landing", "A reusable rocket landing"], "India became the fourth country to achieve space docking.");
b.q(2, "In June–July 2025, Group Captain Shubhanshu Shukla became:", ["The first Indian astronaut to visit the International Space Station (Axiom-4 mission)", "The first Indian to walk on the Moon", "The first Indian in space", "Commander of Gaganyaan-1"], "Rakesh Sharma (1984) was the first Indian in space.");
b.q(2, "NISAR, launched in July 2025 aboard GSLV-F16, is a joint Earth-observation satellite of ISRO and:", ["NASA", "ESA", "JAXA", "Roscosmos"], "It uses dual-band (L- and S-band) synthetic aperture radar.");
b.q(2, "V. Narayanan took charge as the Chairman of ISRO in January 2025, succeeding:", ["S. Somanath", "K. Sivan", "A. S. Kiran Kumar", "G. Madhavan Nair"], "He is a propulsion specialist from LPSC.");
b.q(2, "'Gaganyaan' is India's programme for:", ["Human spaceflight", "Lunar sample return", "Mars orbiter", "Venus exploration"], "Uncrewed test flights precede crewed missions.");
b.q(2, "India's proposed space station is named:", ["Bharatiya Antariksh Station", "Vikram Station", "Aryabhata Station", "Kalpana Station"], "The first module is targeted for 2028 and full station by 2035.");
b.q(3, "Under the Deep Ocean Mission, India's crewed submersible being developed for depths of 6,000 m is called:", ["Matsya-6000 (Samudrayaan)", "Varuna", "Sagar Nidhi", "Jalashwa"], "It will carry three people to explore deep-sea resources.");
b.q(2, "The 'National Quantum Mission' approved in 2023 aims to:", ["Develop quantum computing, communication, sensing and materials", "Build nuclear power plants", "Map India's coastline", "Develop supersonic aircraft"], "It runs from 2023–24 to 2030–31.");
b.q(2, "The 'IndiaAI Mission', approved in March 2024, includes:", ["Building AI compute capacity with thousands of GPUs and developing indigenous foundation models", "Banning AI applications", "Only training teachers", "Creating an AI-based tax system"], "The outlay is about ₹10,372 crore.");
b.q(2, "'Mission Mausam', approved in 2024, is aimed at:", ["Making India 'weather-ready and climate-smart' through advanced weather science", "Promoting tourism", "Monsoon-based crop insurance", "Desert afforestation"], "It is implemented by the Ministry of Earth Sciences.");
b.q(3, "The 'BioE3' policy approved in 2024 stands for:", ["Biotechnology for Economy, Environment and Employment", "Bio-Energy, Efficiency and Exports", "Biological Education, Ethics and Equity", "Bio-fuels for Electricity, Engines and Electronics"], "It promotes high-performance biomanufacturing.");

b.t("Defence & Security");
b.q(1, "Operation Sindoor (May 2025) was launched by India in response to the terrorist attack at:", ["Pahalgam", "Pulwama", "Uri", "Gurdaspur"], "The Pahalgam attack on 22 April 2025 killed 26 people; India struck terror infrastructure in Pakistan and PoK.");
b.q(2, "INS Vikrant, commissioned in September 2022, is:", ["India's first indigenously designed and built aircraft carrier", "A nuclear submarine", "A frigate", "A survey vessel"], "It was built by Cochin Shipyard Limited.");
b.q(2, "'Mission Divyastra' (March 2024) was the first flight test of:", ["Agni-5 with MIRV (Multiple Independently Targetable Re-entry Vehicle) technology", "BrahMos-NG", "Tejas Mk2", "Prithvi Air Defence"], "MIRV allows one missile to hit several targets.");
b.q(2, "The 'Agnipath' scheme (2022) relates to:", ["Short-term recruitment of soldiers (Agniveers) for four years", "Fire safety in factories", "Missile development", "Forest fire management"], "Up to 25% of Agniveers may be retained in regular service.");
b.q(2, "The current Chief of Defence Staff of India (appointed in 2022) is:", ["General Anil Chauhan", "General Bipin Rawat", "General Manoj Pande", "Admiral R. Hari Kumar"], "Gen. Bipin Rawat was the first CDS.");
b.q(2, "The 'Vibrant Villages Programme' (2023) aims at:", ["Comprehensive development of villages along the northern border", "Digitising village records", "Rural tourism in coastal areas", "Smart villages near metros"], "It covers border blocks in Arunachal Pradesh, Sikkim, Uttarakhand, Himachal Pradesh and Ladakh.");

b.t("Summits & International Relations");
b.q(1, "The G20 Leaders' Summit hosted by India in September 2023 was held at:", ["Bharat Mandapam, New Delhi", "Mahatma Mandir, Gandhinagar", "Hyderabad International Convention Centre", "Rashtrapati Bhavan"], "The theme was 'Vasudhaiva Kutumbakam — One Earth, One Family, One Future'.");
b.q(2, "Which grouping became a permanent member of the G20 during India's presidency in 2023?", ["African Union", "ASEAN", "European Union", "Arab League"], "The EU was already a member.");
b.q(2, "COP28 (2023), which operationalised the Loss and Damage Fund, was held in:", ["Dubai, UAE", "Sharm el-Sheikh, Egypt", "Baku, Azerbaijan", "Glasgow, UK"], "COP27 in Sharm el-Sheikh had agreed to create the fund.");
b.q(2, "COP29 (2024), held in Baku, adopted a 'New Collective Quantified Goal' on climate finance of at least:", ["US$ 300 billion per year by 2035 for developing countries", "US$ 100 billion per year by 2025", "US$ 1 trillion per year by 2030 from public funds", "US$ 50 billion per year"], "It also called for scaling up total finance to US$ 1.3 trillion a year from all sources.");
b.q(2, "COP30 under the UNFCCC was held in November 2025 in:", ["Belém, Brazil", "Bonn, Germany", "New Delhi, India", "Nairobi, Kenya"], "Belém is at the edge of the Amazon rainforest.");
b.q(2, "The 16th BRICS Summit in October 2024 was held at:", ["Kazan, Russia", "Johannesburg, South Africa", "Rio de Janeiro, Brazil", "New Delhi, India"], "It was the first summit after the 2024 expansion.");
b.q(2, "The 17th BRICS Summit (July 2025) was hosted by:", ["Brazil (Rio de Janeiro)", "Russia (Kazan)", "India (New Delhi)", "China (Xiamen)"], "India holds the BRICS chairship in 2026.");
b.q(2, "The SCO Heads of State Council summit in 2025 was held in:", ["Tianjin, China", "Astana, Kazakhstan", "Samarkand, Uzbekistan", "New Delhi, India"], "India hosted the SCO virtually in 2023.");
b.q(2, "The 'Voice of the Global South' summits were convened by:", ["India", "China", "Brazil", "South Africa"], "India hosted the first two in 2023 to bring developing countries' priorities to the G20.");
b.q(2, "India co-chaired the AI Action Summit held in February 2025 in:", ["Paris", "London", "Seoul", "Tokyo"], "India announced it would host the next summit (AI Impact Summit) in 2026.");
b.q(2, "The QUAD grouping comprises India, the USA, Japan and:", ["Australia", "UK", "France", "South Korea"], "It focuses on a free and open Indo-Pacific.");
b.q(2, "The 'India–Middle East–Europe Economic Corridor' (IMEC) was announced at:", ["The G20 Summit in New Delhi, 2023", "The BRICS Summit, 2023", "The UN General Assembly, 2022", "The SCO Summit, 2024"], "It envisages rail and shipping links connecting India to Europe through the Gulf.");
b.q(2, "Which country became NATO's 32nd member in March 2024?", ["Sweden", "Finland", "Ukraine", "Switzerland"], "Finland had joined in April 2023 as the 31st member.");

b.t("Awards & Honours");
b.q(2, "Who among the following was NOT conferred the Bharat Ratna in 2024?", ["Atal Bihari Vajpayee", "Karpoori Thakur", "P. V. Narasimha Rao", "M. S. Swaminathan"], "The 2024 awardees were Karpoori Thakur, L. K. Advani, P. V. Narasimha Rao, Chaudhary Charan Singh and M. S. Swaminathan. Vajpayee received it in 2015.");
b.q(2, "The Dadasaheb Phalke Award for 2023 (announced in 2025) was conferred on:", ["Mohanlal", "Mithun Chakraborty", "Waheeda Rehman", "Asha Parekh"], "Mithun Chakraborty received the award for 2022.");
b.q(2, "The 58th Jnanpith Award (for 2023) was jointly conferred on Gulzar and:", ["Jagadguru Rambhadracharya", "Damodar Mauzo", "Nilmani Phookan", "Vinod Kumar Shukla"], "Vinod Kumar Shukla received the 59th Jnanpith Award.");
b.q(2, "The 2025 International Booker Prize was won by 'Heart Lamp', a collection of short stories by:", ["Banu Mushtaq", "Geetanjali Shree", "Arundhati Roy", "Perumal Murugan"], "It was the first Kannada work to win; translated by Deepa Bhasthi. Geetanjali Shree won in 2022 for 'Tomb of Sand'.");
b.q(2, "The 2024 Nobel Peace Prize was awarded to:", ["Nihon Hidankyo", "Narges Mohammadi", "World Food Programme", "María Corina Machado"], "The Japanese organisation of atomic bomb survivors works for a world free of nuclear weapons. Machado won in 2025.");
b.q(2, "The 2025 Nobel Peace Prize was awarded to:", ["María Corina Machado", "Nihon Hidankyo", "Narges Mohammadi", "Ales Bialiatski"], "She was recognised for promoting democratic rights in Venezuela.");
b.q(2, "The 2024 Nobel Prize in Economic Sciences was awarded to Daron Acemoglu, Simon Johnson and James Robinson for studies on:", ["How institutions are formed and affect prosperity", "Behavioural finance", "Banking crises", "Labour market search frictions"], "Their work explains differences in prosperity between nations.");
b.q(2, "The 2025 Nobel Prize in Economic Sciences recognised work on innovation-driven economic growth. It was shared by Joel Mokyr, Philippe Aghion and:", ["Peter Howitt", "Paul Romer", "Robert Solow", "Daron Acemoglu"], "Mokyr was recognised for identifying prerequisites for sustained growth; Aghion and Howitt for the theory of creative destruction.");
b.q(2, "The 2024 Nobel Prize in Literature was awarded to:", ["Han Kang", "Jon Fosse", "Annie Ernaux", "László Krasznahorkai"], "The South Korean writer was cited for intense poetic prose. Krasznahorkai won in 2025.");
b.q(3, "The 2025 Nobel Prize in Chemistry was awarded for the development of:", ["Metal–organic frameworks", "CRISPR gene editing", "Quantum dots", "Lithium-ion batteries"], "Susumu Kitagawa, Richard Robson and Omar Yaghi were honoured.");
b.q(3, "The 2025 Nobel Prize in Physiology or Medicine was awarded for discoveries concerning:", ["Peripheral immune tolerance (regulatory T cells)", "mRNA vaccines", "microRNA", "Circadian rhythms"], "Mary Brunkow, Fred Ramsdell and Shimon Sakaguchi were honoured. The 2024 prize was for microRNA.");
b.q(2, "Which Indian film song won the Oscar for Best Original Song in 2023?", ["Naatu Naatu (RRR)", "Jai Ho (Slumdog Millionaire)", "Kesariya", "Chaiyya Chaiyya"], "'The Elephant Whisperers' won Best Documentary Short the same year.");

b.t("Sports");
b.q(1, "How many medals did India win at the Paris Olympics 2024?", ["Six (one silver, five bronze)", "Seven (one gold, two silver, four bronze)", "Four", "Ten"], "Neeraj Chopra won silver; Manu Bhaker won two bronzes.");
b.q(2, "Manu Bhaker became the first Indian after independence to win two medals at a single Olympics. Her second medal at Paris 2024 came in:", ["10 m air pistol mixed team with Sarabjot Singh", "25 m pistol", "Trap shooting", "50 m rifle three positions"], "Her first was the individual 10 m air pistol bronze.");
b.q(2, "At the Paris Paralympics 2024, India's total medal tally was:", ["29", "19", "15", "40"], "It included seven gold medals — India's best Paralympics performance.");
b.q(1, "India won the ICC Men's T20 World Cup in June 2024, defeating:", ["South Africa", "Australia", "England", "New Zealand"], "The final was played in Barbados.");
b.q(2, "India won the ICC Champions Trophy in March 2025 by defeating which team in the final?", ["New Zealand", "Australia", "Pakistan", "South Africa"], "The final was held in Dubai.");
b.q(2, "India won its first ICC Women's ODI World Cup in November 2025, defeating which team in the final at Navi Mumbai?", ["South Africa", "Australia", "England", "New Zealand"], "Harmanpreet Kaur captained the side.");
b.q(1, "D. Gukesh became the youngest undisputed World Chess Champion in December 2024 by defeating:", ["Ding Liren", "Magnus Carlsen", "Ian Nepomniachtchi", "Fabiano Caruana"], "He was 18 years old.");
b.q(2, "At the 45th Chess Olympiad in Budapest (2024), India won:", ["Gold in both the open and women's sections", "Silver in the open section only", "Bronze in the women's section", "No medal"], "It was India's first ever Olympiad gold in either section.");
b.q(2, "Divya Deshmukh won the FIDE Women's World Cup in July 2025, defeating in an all-Indian final:", ["Koneru Humpy", "Harika Dronavalli", "Vaishali Rameshbabu", "Tania Sachdev"], "She also earned the Grandmaster title with the win.");
b.q(2, "Neeraj Chopra crossed the 90-metre mark for the first time in his career in 2025 at the:", ["Doha Diamond League", "Paris Olympics", "World Championships, Budapest", "Asian Games"], "He threw 90.23 m in May 2025.");
b.q(2, "The 2036 Summer Olympics bid by India is being pursued with which city as the proposed host?", ["Ahmedabad", "New Delhi", "Mumbai", "Bengaluru"], "India submitted a letter of intent to the IOC in 2024.");

b.t("Appointments & Personalities");
b.q(2, "Who became President of the United States in January 2025?", ["Donald Trump", "Joe Biden", "Kamala Harris", "Barack Obama"], "He began his second, non-consecutive term on 20 January 2025.");
b.q(2, "Keir Starmer became the Prime Minister of the United Kingdom in July 2024, leading which party?", ["Labour Party", "Conservative Party", "Liberal Democrats", "Reform UK"], "He succeeded Rishi Sunak.");
b.q(2, "The new Pope elected in May 2025, the first from the United States, took the name:", ["Leo XIV", "Francis II", "John Paul III", "Benedict XVII"], "Cardinal Robert Prevost succeeded Pope Francis.");
b.q(2, "Mark Carney became the Prime Minister of Canada in 2025, succeeding:", ["Justin Trudeau", "Stephen Harper", "Pierre Poilievre", "Jagmeet Singh"], "He is a former Governor of the Bank of Canada and the Bank of England.");
b.q(2, "In 2025, Sanae Takaichi became the first woman to hold the office of:", ["Prime Minister of Japan", "UN Secretary-General", "President of South Korea", "President of the World Bank"], "She took office in October 2025.");
b.q(2, "Anura Kumara Dissanayake became President of which country in September 2024?", ["Sri Lanka", "Maldives", "Nepal", "Bangladesh"], "He leads the National People's Power coalition.");
b.q(2, "After mass youth-led protests in September 2025, who became the interim Prime Minister of Nepal (the first woman to hold the post)?", ["Sushila Karki", "Bidya Devi Bhandari", "Sheikh Hasina", "Pushpa Kamal Dahal"], "She was formerly Chief Justice of Nepal.");
b.q(2, "Ngozi Okonjo-Iweala, who began a second term in 2025, is the Director-General of the:", ["World Trade Organization", "World Health Organization", "IMF", "UNESCO"], "She is the first woman and first African to head the WTO.");
b.q(2, "Ajay Banga became the President of which institution in June 2023?", ["World Bank", "IMF", "Asian Development Bank", "New Development Bank"], "He is the first Indian-American to lead the World Bank.");
b.q(1, "The Secretary-General of the United Nations (term 2017–2026) is:", ["António Guterres", "Ban Ki-moon", "Kofi Annan", "Tedros Adhanom Ghebreyesus"], "He is a former Prime Minister of Portugal.");

export default b.items;
