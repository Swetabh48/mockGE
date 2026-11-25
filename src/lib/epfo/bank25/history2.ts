import { Bank } from "../bank/dsl";

/** 2025-pattern History & Culture (set 2). */
const b = new Bank("history25b");

b.t("Ancient & Medieval Culture");
b.st(3, "Consider the following about Ashoka's inscriptions:", [
  "Most are in Prakrit written in the Brahmi script.",
  "Some in the north-west are in Kharosthi script.",
  "The Kalinga war is described in Major Rock Edict XIII.",
], [1, 2, 3], "Greek and Aramaic inscriptions are also found in Afghanistan.");
b.mt(3, "Match the school of painting with its region:", [["Kishangarh", "Rajasthan"], ["Basohli", "Pahari (Jammu)"], ["Madhubani", "Bihar (Mithila)"], ["Pattachitra", "Odisha"]], "Bani Thani is a famous Kishangarh painting.", "School", "Region");
b.st(3, "Consider the following about Hindustani and Carnatic music:", [
  "Both are based on the concepts of raga and tala.",
  "Purandara Dasa is regarded as the father of Carnatic music.",
  "Thyagaraja, Muthuswami Dikshitar and Syama Sastri are called the 'Trinity' of Hindustani music.",
], [1, 2], "They are the Trinity of Carnatic music.");
b.st(3, "Consider the following about the Vijayanagara Empire:", [
  "It was founded by Harihara and Bukka in the 14th century.",
  "Krishnadevaraya wrote 'Amuktamalyada' in Telugu.",
  "Its capital Hampi is a UNESCO World Heritage Site.",
], [1, 2, 3], "All three are correct.");
b.ar(3, "The Mughal mansabdari system linked rank to military obligations.", "Each mansabdar was required to maintain a specified number of horsemen (sawar) according to his rank.", "a", "R explains A.");
b.q(3, "Which of the following pairs of monument and ruler is correctly matched?", ["Buland Darwaza — Akbar", "Qutb Minar (completed) — Babur", "Red Fort, Delhi — Akbar", "Taj Mahal — Jahangir"], "Qutb Minar was begun by Qutbuddin Aibak and completed by Iltutmish; the Red Fort and Taj Mahal were built by Shah Jahan.");
b.st(3, "Consider the following about the Sangam literature:", [
  "It is in Tamil.",
  "Tolkappiyam is a work on grammar.",
  "Silappadikaram and Manimekalai are among the epics associated with the post-Sangam period.",
], [1, 2, 3], "All three are correct.");
b.mt(3, "Match the text with its author:", [["Arthashastra", "Kautilya"], ["Indica", "Megasthenes"], ["Rajatarangini", "Kalhana"], ["Harshacharita", "Banabhatta"]], "Important sources of ancient Indian history.", "Text", "Author");
b.hm(3, "Which of the following are UNESCO World Heritage Sites in India?", [
  "Rani-ki-Vav, Patan",
  "Hoysala temples (Belur, Halebidu, Somanathapura)",
  "Santiniketan",
  "Gateway of India",
], 3, "The Gateway of India is not a World Heritage Site.", "How many of the above are World Heritage Sites?");
b.st(3, "Consider the following about the Jain tradition:", [
  "Mahavira was the 24th Tirthankara.",
  "The Svetambara and Digambara sects differ, among other things, on the practice of wearing clothes by monks.",
  "Jainism rejects the doctrine of karma.",
], [1, 2], "Karma is central to Jain philosophy.");
b.q(3, "Arrange the following dynasties in chronological order of their rise: 1. Mauryas 2. Guptas 3. Kushanas 4. Palas", ["1, 3, 2, 4", "1, 2, 3, 4", "3, 1, 2, 4", "1, 3, 4, 2"], "Mauryas (4th c. BCE), Kushanas (1st–3rd c. CE), Guptas (4th–6th c. CE), Palas (8th c. CE).");
b.st(3, "Consider the following about intangible cultural heritage of India inscribed by UNESCO:", [
  "Kumbh Mela is inscribed.",
  "Durga Puja in Kolkata is inscribed.",
  "Garba of Gujarat is inscribed.",
], [1, 2, 3], "Kumbh Mela (2017), Durga Puja (2021), Garba (2023).");
b.ar(3, "Gandhara art shows strong Greco-Roman influence.", "Gandhara lay on trade routes connecting India with the Hellenistic world.", "a", "R explains A.");
b.mt(3, "Match the festival or tradition with its State:", [["Hornbill Festival", "Nagaland"], ["Bihu", "Assam"], ["Onam", "Kerala"], ["Lohri", "Punjab"]], "Regional festivals.", "Festival", "State");

b.t("British Administration & Acts");
b.st(3, "Consider the following about the Charter Act of 1833:", [
  "It made the Governor-General of Bengal the Governor-General of India.",
  "It ended the East India Company's activities as a commercial body.",
  "It introduced open competition for civil services, which was implemented immediately.",
], [1, 2], "Open competition was proposed later (Charter Act 1853) and the first exam was held in 1855.");
b.st(3, "Consider the following land revenue systems:", [
  "Under the Permanent Settlement, revenue was fixed in perpetuity with zamindars.",
  "Under the Ryotwari system, revenue was settled directly with the cultivator.",
  "Under the Mahalwari system, the village community was jointly responsible.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Arrange the following Acts in chronological order: 1. Pitt's India Act 2. Regulating Act 3. Charter Act (abolishing Company's trade monopoly in India) 4. Government of India Act transferring rule to the Crown", ["2, 1, 3, 4", "1, 2, 3, 4", "2, 3, 1, 4", "3, 2, 1, 4"], "Regulating Act (1773), Pitt's India Act (1784), Charter Act (1813), GoI Act (1858).");
b.ar(3, "The Vernacular Press Act, 1878 was called the 'gagging Act'.", "It discriminated against Indian-language newspapers by empowering the government to confiscate presses for seditious content.", "a", "R explains A.");
b.st(3, "Consider the following about education policy under British rule:", [
  "Macaulay's Minute (1835) favoured English education.",
  "Wood's Despatch (1854) led to universities at Calcutta, Bombay and Madras.",
  "The Hunter Commission (1882) focused mainly on higher education.",
], [1, 2], "The Hunter Commission focused on primary and secondary education.");

b.t("Gandhian Era");
b.st(3, "Consider the following about the Khilafat movement:", [
  "It was led by the Ali brothers.",
  "It aimed to protect the status of the Ottoman Sultan as Caliph.",
  "It ended because Turkey itself abolished the Caliphate in 1924.",
], [1, 2, 3], "All three are correct.");
b.st(3, "Consider the following about the Swaraj Party:", [
  "It was formed by C. R. Das and Motilal Nehru.",
  "It advocated entry into legislative councils to obstruct them from within.",
  "Gandhi opposed its formation and expelled its leaders from the Congress.",
], [1, 2], "Gandhi accepted the Swarajists' programme in 1924; there was no expulsion.");
b.q(3, "Which of the following best explains why Gandhi chose salt as the issue for civil disobedience in 1930?", ["The salt tax affected all classes and communities, making it a unifying symbol", "Salt was the largest export of India", "Salt production was controlled by Indian princes", "The British had banned salt consumption"], "Salt was a necessity taxed by the state, affecting rich and poor alike.");
b.st(3, "Consider the following about the Bardoli Satyagraha (1928):", [
  "It was against an increase in land revenue.",
  "It was led by Vallabhbhai Patel.",
  "It ended with the government agreeing to an inquiry that reduced the enhancement.",
], [1, 2, 3], "The Maxwell–Broomfield inquiry reduced the enhancement.");
b.ar(3, "The Communal Award (1932) was opposed by Gandhi.", "It provided separate electorates for the depressed classes, which Gandhi saw as dividing Hindu society.", "a", "R explains A; the Poona Pact followed.");
b.hm(3, "Which of the following leaders attended the Second Round Table Conference (1931)?", [
  "Mahatma Gandhi",
  "B. R. Ambedkar",
  "Sarojini Naidu",
  "Jawaharlal Nehru",
], 3, "Nehru did not attend; Sarojini Naidu attended in her individual capacity.", "How many of the above attended?");

b.t("Women in the Freedom Struggle");
b.mt(3, "Match the woman freedom fighter with her association:", [["Aruna Asaf Ali", "Hoisting the flag at Gowalia Tank, 1942"], ["Captain Lakshmi Sahgal", "Rani of Jhansi Regiment, INA"], ["Matangini Hazra", "Tamluk, Quit India Movement"], ["Usha Mehta", "Congress Radio"]], "Women's roles in 1942 and the INA.", "Person", "Association");
b.st(3, "Consider the following:", [
  "Sarojini Naidu was the first Indian woman president of the Congress.",
  "Annie Besant founded the Home Rule League in Madras.",
  "Kasturba Gandhi presided over the Lahore session of 1929.",
], [1, 2], "Jawaharlal Nehru presided over the Lahore session.");

b.t("Towards Independence");
b.st(3, "Consider the following about the Indian Independence Act, 1947:", [
  "It provided for two independent dominions, India and Pakistan.",
  "The Constituent Assemblies were empowered to frame constitutions and also act as legislatures.",
  "It retained the British Crown's paramountcy over princely states.",
], [1, 2], "Paramountcy lapsed; princely states were free to accede.");
b.q(3, "Which of the following princely states posed special problems at the time of integration and required action beyond the Instrument of Accession process?", ["Hyderabad, Junagadh and Jammu & Kashmir", "Mysore, Travancore and Baroda", "Gwalior, Indore and Bhopal", "Patiala, Nabha and Jind"], "Hyderabad (Operation Polo, 1948), Junagadh (plebiscite, 1948) and J&K (accession after invasion, 1947).");
b.ar(3, "The Mountbatten Plan advanced the date of transfer of power to August 1947.", "Communal violence and administrative breakdown made a quick transfer seem necessary.", "a", "R explains A.");

b.t("Revolts & Resistance");
b.st(3, "Consider the following about the Indigo Revolt (1859–60):", [
  "It took place in Bengal against European planters.",
  "Dinabandhu Mitra's play 'Neel Darpan' depicted the planters' oppression.",
  "It was crushed without any government inquiry.",
], [1, 2], "The government appointed the Indigo Commission (1860).");
b.q(3, "Which of the following pairs is correctly matched?", ["Kuka movement — Baba Ram Singh", "Faraizi movement — Titu Mir", "Wahabi movement — Sir Syed Ahmad Khan", "Kol uprising — Birsa Munda"], "Faraizi — Haji Shariatullah; Wahabi — Syed Ahmad of Rae Bareli; Birsa — Munda Ulgulan.");

b.t("Social Reform & Awakening");
b.st(3, "Consider the following about the Self-Respect Movement:", [
  "It was founded by E. V. Ramasamy (Periyar).",
  "It promoted marriages without Brahmin priests.",
  "It supported the caste hierarchy.",
], [1, 2], "It opposed caste hierarchy.");
b.q(3, "Arrange the following reform organisations in order of founding: 1. Arya Samaj 2. Brahmo Samaj 3. Ramakrishna Mission 4. Prarthana Samaj", ["2, 4, 1, 3", "2, 1, 4, 3", "4, 2, 1, 3", "1, 2, 4, 3"], "Brahmo (1828), Prarthana (1867), Arya (1875), Ramakrishna Mission (1897).");

b.t("Personalities & Slogans");
b.st(3, "Consider the following about Subhas Chandra Bose:", [
  "He was elected Congress president at Haripura (1938) and Tripuri (1939).",
  "He resigned the presidency in 1939 after differences with Gandhian leaders.",
  "He founded the Indian National Army in 1942.",
], [1, 2], "The INA was first formed by Captain Mohan Singh (1942); Bose revived and led it from 1943.");
b.q(3, "Which of the following statements about B. R. Ambedkar is NOT correct?", ["He presided over the Karachi session of the Congress", "He founded the Bahishkrit Hitakarini Sabha", "He led the Mahad Satyagraha", "He attended all three Round Table Conferences"], "Vallabhbhai Patel presided over the Karachi session (1931).");

b.t("Statements & Reasoning");
b.q(3, "Arrange in chronological order: 1. August Offer 2. Individual Satyagraha 3. Lahore Resolution of the Muslim League 4. Cripps Mission", ["3, 1, 2, 4", "1, 3, 2, 4", "3, 2, 1, 4", "1, 2, 3, 4"], "Lahore Resolution (March 1940), August Offer (August 1940), Individual Satyagraha (October 1940), Cripps (March 1942).");
b.st(3, "Consider the following about the Karachi session (1931):", [
  "It endorsed the Gandhi–Irwin Pact.",
  "It adopted resolutions on Fundamental Rights and the National Economic Programme.",
  "It was presided over by Jawaharlal Nehru.",
], [1, 2], "Vallabhbhai Patel presided.");
b.hm(3, "Which of the following were outcomes of the Government of India Act, 1935?", [
  "Provincial autonomy",
  "Establishment of a Federal Court",
  "Establishment of the Reserve Bank of India by this Act",
  "Separation of Burma from India",
], 3, "The RBI was created by the RBI Act, 1934, not by the 1935 Act.", "How many of the above?");
b.ar(3, "The All-India Federation proposed by the 1935 Act never came into being.", "The required number of princely states did not join it.", "a", "R explains A.");
b.st(3, "Consider the following about the Indian National Congress sessions:", [
  "The 1907 Surat session saw the split between Moderates and Extremists.",
  "The 1916 Lucknow session reunited them.",
  "The 1929 Lahore session adopted Purna Swaraj as the goal.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following is the correct sequence of these events in 1919? 1. Rowlatt Act passed 2. Jallianwala Bagh massacre 3. Hunter Committee appointed", ["1, 2, 3", "2, 1, 3", "1, 3, 2", "3, 1, 2"], "Rowlatt Act (March), Jallianwala Bagh (13 April), Hunter Committee (October 1919).");

b.t("Ancient & Medieval Culture");
b.st(3, "Consider the following about the Chola period:", [
  "The Brihadeeswara temple at Thanjavur was built by Rajaraja I.",
  "Uttaramerur inscriptions describe village assemblies.",
  "The Cholas are known for bronze sculpture such as Nataraja.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which of the following schools of Indian philosophy is correctly matched with its founder?", ["Nyaya — Gautama", "Vaisheshika — Kapila", "Sankhya — Kanada", "Yoga — Jaimini"], "Vaisheshika — Kanada; Sankhya — Kapila; Yoga — Patanjali; Purva Mimamsa — Jaimini.");
b.st(3, "Consider the following about the Delhi Sultanate:", [
  "Alauddin Khalji introduced market control measures.",
  "Muhammad bin Tughlaq introduced token currency.",
  "Iltutmish introduced the silver tanka and copper jital.",
], [1, 2, 3], "All three are correct.");
b.ar(3, "Akbar's policy of Sulh-i-kul promoted religious tolerance.", "Akbar abolished the jizya tax on non-Muslims.", "b", "Both are true; abolition of jizya was one measure, but Sulh-i-kul is a broader principle of universal peace.");

export default b.items;
