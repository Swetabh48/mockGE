import { Bank } from "./dsl";

/** Developmental issues: environment, health, education, governance, culture and national milestones. */
const b = new Bank("current3");

b.t("Environment & Climate");
b.q(1, "The Paris Agreement (2015) aims to limit global warming to well below:", ["2 °C above pre-industrial levels, pursuing efforts to limit it to 1.5 °C", "3 °C by 2050", "1 °C by 2030", "4 °C by 2100"], "Countries submit Nationally Determined Contributions every five years.");
b.q(2, "'Mission LiFE', launched by India, stands for:", ["Lifestyle for Environment", "Life Insurance for Everyone", "Learning in Future Economy", "Livelihood Fund for Employment"], "It promotes mindful consumption and individual climate action.");
b.q(2, "The Kunming–Montreal Global Biodiversity Framework (2022) includes the '30 by 30' target, which means:", ["Conserving at least 30% of land and oceans by 2030", "Reducing emissions by 30% by 2030", "Planting 30 billion trees", "Cutting plastic use by 30%"], "It was adopted at COP15 of the Convention on Biological Diversity.");
b.q(2, "The 'Green Credit Programme' notified in 2023 aims to:", ["Incentivise voluntary environmental actions such as tree plantation through tradable credits", "Give cheap loans for cars", "Tax polluting industries", "Ban single-use plastics"], "It is administered by the Indian Council of Forestry Research and Education.");
b.q(2, "India's 'Carbon Credit Trading Scheme' was notified in 2023 under the:", ["Energy Conservation Act, 2001", "Environment Protection Act, 1986", "Air Act, 1981", "Forest Conservation Act, 1980"], "The Bureau of Energy Efficiency administers the compliance mechanism.");
b.q(2, "Single-use plastic items with low utility were banned in India from:", ["1 July 2022", "2 October 2019", "1 January 2021", "5 June 2023"], "The ban was notified under the Plastic Waste Management Amendment Rules, 2021.");
b.q(2, "'Project Cheetah' involved translocation of cheetahs from Namibia and South Africa to:", ["Kuno National Park, Madhya Pradesh", "Gir National Park", "Jim Corbett National Park", "Kaziranga National Park"], "The first eight cheetahs arrived in September 2022.");
b.q(2, "The 'Nagar Van Yojana' aims to develop:", ["Urban forests in cities", "Rural roads", "Village ponds", "Coastal mangroves only"], "It was launched in 2020.");
b.q(2, "The 'International Big Cat Alliance', launched by India in 2023, covers how many big cat species?", ["Seven", "Three", "Five", "Nine"], "Tiger, lion, leopard, snow leopard, cheetah, jaguar and puma.");
b.q(2, "'Ek Ped Maa Ke Naam' campaign launched on World Environment Day 2024 promotes:", ["Planting trees as a tribute to one's mother", "Saving water", "Cleaning rivers", "Using public transport"], "It is a mass tree-planting campaign.");
b.q(2, "World Environment Day is observed on:", ["5 June", "22 April", "16 September", "21 March"], "Earth Day is 22 April; Ozone Day is 16 September; International Day of Forests is 21 March.");
b.q(3, "The Wildlife (Protection) Amendment Act, 2022 notably:", ["Implemented CITES provisions and rationalised schedules", "Abolished all national parks", "Allowed hunting of tigers", "Transferred forests to States"], "It reduced six schedules to four.");

b.t("Health & Nutrition");
b.q(1, "India's 'TB Mukt Bharat' target aimed at eliminating tuberculosis by:", ["2025, ahead of the SDG target of 2030", "2035", "2047", "2020"], "The Ni-kshay Poshan Yojana gives nutritional support to TB patients.");
b.q(2, "'Mission Indradhanush' (2014) is related to:", ["Full immunisation of children and pregnant women", "Rainbow-coloured buildings", "Solar energy", "Skill development"], "Intensified Mission Indradhanush has run several rounds.");
b.q(2, "'POSHAN Abhiyaan', launched in 2018, primarily aims to reduce:", ["Stunting, under-nutrition, anaemia and low birth weight", "Obesity among adults", "Road accidents", "Tobacco use"], "It is implemented by the Ministry of Women and Child Development.");
b.q(2, "The 'U-WIN' portal is meant for:", ["Digitally registering and tracking routine immunisation", "Online university admissions", "Unemployment benefit claims", "Women's helpline"], "It is modelled on the CoWIN platform.");
b.q(2, "India was declared free of which disease by the WHO in 2014?", ["Polio", "Smallpox", "Malaria", "Leprosy"], "Smallpox was eradicated globally in 1980.");
b.q(2, "In 2024, the WHO certified India as having eliminated which disease as a public health problem?", ["Trachoma", "Tuberculosis", "Measles", "Dengue"], "India became the third country in the WHO South-East Asia region to do so.");
b.q(2, "'Jan Aushadhi Kendras' sell:", ["Quality generic medicines at affordable prices", "Ayurvedic medicines only", "Imported branded medicines", "Medical equipment only"], "They are run under the Pradhan Mantri Bhartiya Janaushadhi Pariyojana.");

b.t("Education & Society");
b.q(1, "The National Education Policy 2020 replaced the 10+2 structure with:", ["5+3+3+4", "6+4+2", "4+4+4", "8+4"], "It covers ages 3–18 in foundational, preparatory, middle and secondary stages.");
b.q(2, "NEP 2020 recommends instruction preferably in the mother tongue/local language at least up to:", ["Class 5 (preferably Class 8)", "Class 1", "Class 10", "Class 12"], "It encourages multilingualism.");
b.q(2, "The 'PM SHRI' scheme aims to:", ["Upgrade selected schools as model schools showcasing NEP 2020", "Provide scholarships abroad", "Build hostels for college students", "Train police officers"], "It covers over 14,500 schools.");
b.q(2, "The Anusandhan National Research Foundation was established under an Act of:", ["2023", "2019", "2015", "2010"], "It funds research across disciplines.");
b.q(2, "The 'Beti Bachao Beti Padhao' scheme was launched in 2015 at:", ["Panipat, Haryana", "Varanasi, U.P.", "Jaipur, Rajasthan", "Patna, Bihar"], "It addresses the declining child sex ratio.");
b.q(2, "The 'Lakhpati Didi' initiative aims to:", ["Enable women in self-help groups to earn at least ₹1 lakh a year", "Give women ₹1 lakh as a gift", "Provide loans of ₹1 lakh to women entrepreneurs only in cities", "Train women in IT only"], "The target was raised to three crore Lakhpati Didis.");
b.q(2, "The 'Namo Drone Didi' scheme (2023) provides drones to:", ["Women self-help groups for agricultural services", "Police forces", "Defence forces", "Delivery companies"], "Drones are used for spraying fertilisers and pesticides.");
b.q(2, "PM JANMAN (2023) is a mission for the development of:", ["Particularly Vulnerable Tribal Groups (PVTGs)", "Urban poor", "Artisans", "Migrant workers"], "It provides housing, roads, water and other services in PVTG habitations.");
b.q(2, "The Digital Personal Data Protection Act was enacted in:", ["2023", "2019", "2021", "2025"], "It establishes the Data Protection Board of India; its rules were notified in 2025.");
b.q(2, "The 'SVAMITVA' scheme provides:", ["Property cards to rural households based on drone surveys of village habitations", "Pensions to farmers", "Free electricity", "Bank loans to students"], "It was launched on National Panchayati Raj Day, 2020.");
b.q(2, "The 'Mission Karmayogi' programme (2020) relates to:", ["Capacity building of civil servants", "Rural employment", "Yoga promotion", "Sports training"], "The iGOT Karmayogi platform delivers online training.");
b.q(2, "International Day of Yoga, proposed by India and adopted by the UN, is observed on:", ["21 June", "21 March", "1 May", "2 October"], "It has been observed since 2015.");
b.q(2, "The year 2023 was declared by the UN, on India's proposal, as the International Year of:", ["Millets", "Pulses", "Rice", "Soil"], "Millets are promoted as 'Shree Anna'.");

b.t("National Milestones");
b.q(1, "The new Parliament building in New Delhi was inaugurated on:", ["28 May 2023", "15 August 2022", "26 January 2023", "19 September 2023"], "Parliament moved to the new building during the special session in September 2023.");
b.q(2, "The 'Sengol' installed in the new Parliament building is:", ["A historic sceptre associated with the transfer of power in 1947", "A bronze statue of Gandhi", "A copy of the Constitution", "A bell"], "It was placed near the Speaker's chair.");
b.q(2, "The consecration (Pran Pratishtha) of the Ram Lalla idol at the Ayodhya temple took place on:", ["22 January 2024", "5 August 2020", "26 January 2024", "9 November 2019"], "The Supreme Court's Ayodhya verdict was delivered on 9 November 2019.");
b.q(2, "The Chenab Rail Bridge, inaugurated in June 2025, is notable as:", ["The world's highest railway arch bridge", "India's longest sea bridge", "The world's longest suspension bridge", "India's first vertical lift bridge"], "It is part of the Udhampur–Srinagar–Baramulla Rail Link.");
b.q(2, "India's longest sea bridge, Atal Setu (Mumbai Trans Harbour Link), was opened in:", ["January 2024", "August 2022", "October 2023", "March 2025"], "It connects Sewri in Mumbai with Nhava Sheva.");
b.q(2, "The new Pamban Bridge, opened in April 2025, is notable as India's first:", ["Vertical-lift railway sea bridge", "Cable-stayed rail bridge", "Underwater tunnel", "Double-decker bridge"], "It connects Rameswaram (Pamban Island) to the mainland.");
b.q(2, "The Maha Kumbh Mela of 2025 was held at:", ["Prayagraj", "Haridwar", "Ujjain", "Nashik"], "It took place from January to February 2025.");
b.q(2, "Which site was inscribed as India's 43rd UNESCO World Heritage Site in 2024?", ["Moidams — mound-burial system of the Ahom dynasty, Charaideo", "Santiniketan", "Hoysala temples", "Dholavira"], "Santiniketan and the Hoysala temples were inscribed in 2023; Dholavira in 2021.");
b.q(2, "In 2025, which serial property was inscribed on the UNESCO World Heritage List?", ["Maratha Military Landscapes of India", "Sun Temple, Modasa", "Majuli Island", "Mughal Gardens of Delhi"], "It comprises twelve forts in Maharashtra and Tamil Nadu.");
b.q(2, "'Garba' of Gujarat was inscribed on UNESCO's Representative List of the Intangible Cultural Heritage of Humanity in:", ["2023", "2017", "2021", "2019"], "Kolkata's Durga Puja was inscribed in 2021 and Kumbh Mela in 2017.");
b.q(2, "'Rajpath' in New Delhi was renamed in 2022 as:", ["Kartavya Path", "Rashtra Path", "Janpath", "Seva Path"], "The canopy at India Gate now has a statue of Netaji Subhas Chandra Bose.");
b.q(2, "The 'Statue of Unity', the world's tallest statue, depicts:", ["Sardar Vallabhbhai Patel", "B. R. Ambedkar", "Shivaji", "Mahatma Gandhi"], "It stands at Kevadia (Ekta Nagar), Gujarat, at 182 m.");
b.q(2, "Which Indian city was declared India's first 'World Heritage City' by UNESCO in 2017?", ["Ahmedabad", "Jaipur", "Varanasi", "Hyderabad"], "Jaipur was inscribed in 2019.");
b.q(2, "'Har Ghar Tiranga' campaign is associated with:", ["Celebrating Independence Day by hoisting the national flag at homes", "Painting houses", "Free electricity", "Rural housing"], "It began in 2022 as part of Azadi Ka Amrit Mahotsav.");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements about Chandrayaan-3:", ["It carried a lander and a rover.", "It carried an orbiter with scientific instruments for long-term lunar study."], [1], "Chandrayaan-3 had a propulsion module (carrying a SHAPE payload), a lander (Vikram) and a rover (Pragyan); it did not carry a new orbiter like Chandrayaan-2.");
b.st(2, "Consider the following statements:", ["The International Solar Alliance was launched by India and France.", "Its headquarters is in India."], [1, 2], "The ISA was launched at COP21 in Paris (2015); its secretariat is at Gurugram.");
b.st(3, "Consider the following statements about India's G20 presidency:", ["The African Union was admitted as a permanent member.", "The Global Biofuels Alliance was launched.", "The summit failed to issue a leaders' declaration."], [1, 2], "The New Delhi Leaders' Declaration was adopted by consensus.");
b.hm(3, "Consider the following pairs of mission and objective:", ["Aditya-L1 — study of the Sun", "NISAR — Earth observation", "SpaDeX — docking demonstration", "Gaganyaan — Mars orbiter"], 3, "Gaganyaan is the human spaceflight programme; Mangalyaan was the Mars orbiter.");
b.ar(2, "India's per capita carbon emissions are far lower than the global average.", "India has committed to net-zero emissions by 2070.", "b", "Both statements are true, but R does not explain A.");
b.ar(2, "Millets are called 'climate-resilient' crops.", "They need less water and can grow in poor soils and high temperatures.", "a", "R explains A.");

b.t("Governance (Current)");
b.q(2, "The 'e-Courts' Mission Mode Project is aimed at:", ["ICT-enabled modernisation of courts", "Online shopping regulation", "Election management", "Digitising land records"], "Phase III was approved in 2023.");
b.q(2, "The 'CPGRAMS' portal is used for:", ["Lodging public grievances with government departments", "Paying taxes", "Booking railway tickets", "Applying for passports"], "It is run by the Department of Administrative Reforms and Public Grievances.");
b.q(2, "The 'Aspirational Districts Programme' (2018) aims at:", ["Rapid transformation of the most under-developed districts through convergence, collaboration and competition", "Building smart cities", "Tourism promotion", "Industrial corridors"], "It was extended to blocks through the Aspirational Blocks Programme (2023).");
b.q(2, "'DigiLocker' provides:", ["A cloud platform for issuing and storing authentic digital documents", "A bank locker", "A cybersecurity firewall", "A payment wallet"], "Documents in DigiLocker are legally valid under IT rules.");
b.q(2, "The 'Mera Yuva Bharat' (MY Bharat) platform, launched in 2023, is meant for:", ["Engaging youth in volunteering and development activities", "Online gaming", "Youth loans", "Army recruitment"], "It was launched on National Unity Day (31 October).");
b.q(2, "'Viksit Bharat @2047' refers to the vision of making India:", ["A developed nation by the 100th year of independence", "A $5 trillion economy by 2025", "Free of poverty by 2030", "A space superpower by 2030"], "2047 marks 100 years of independence.");

export default b.items;
