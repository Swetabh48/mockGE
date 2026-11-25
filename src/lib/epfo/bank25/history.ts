import { Bank } from "../bank/dsl";

/** 2025-pattern History & Culture: chronology, statements, matching and culture. */
const b = new Bank("history25");

b.t("Revolts & Resistance");
b.q(3, "Arrange the following uprisings in chronological order: 1. Santhal Hul 2. Rampa rebellion led by Alluri Sitarama Raju 3. Deccan Riots 4. Paika rebellion", ["4, 1, 3, 2", "1, 4, 3, 2", "4, 3, 1, 2", "1, 3, 4, 2"], "Paika (1817), Santhal Hul (1855–56), Deccan Riots (1875), Rampa (1922–24).");
b.q(3, "Arrange in chronological order: 1. Kol uprising 2. Munda Ulgulan 3. Indigo revolt 4. Revolt of 1857", ["1, 4, 3, 2", "1, 3, 4, 2", "4, 1, 3, 2", "3, 1, 4, 2"], "Kol (1831–32), Revolt of 1857, Indigo revolt (1859–60), Munda Ulgulan (1899–1900).");
b.st(3, "Consider the following about the Santhal rebellion (1855–56):", [
  "It was led by Sidhu and Kanhu Murmu.",
  "It was directed against zamindars, moneylenders and the colonial administration.",
  "It led to the creation of a separate administrative unit, the Santhal Parganas.",
], [1, 2, 3], "All three are correct.");
b.st(3, "Consider the following about the Deccan Riots of 1875:", [
  "They were directed mainly against moneylenders.",
  "Peasants seized and destroyed debt bonds and deeds.",
  "They led to the Deccan Agriculturists' Relief Act, 1879.",
], [1, 2, 3], "All three are correct.");
b.mt(3, "Match the movement with its region:", [["Pabna agrarian leagues", "East Bengal"], ["Kuka movement", "Punjab"], ["Moplah uprising (1921)", "Malabar"], ["Eka movement", "Awadh"]], "Peasant and religious-reform movements across regions.", "Movement", "Region");
b.ar(3, "Tribal revolts in the 19th century were often directed at outsiders ('dikus').", "Colonial land and forest laws enabled moneylenders, traders and contractors to dispossess tribal communities.", "a", "R explains A.");
b.st(3, "Consider the following about the Revolt of 1857:", [
  "Bahadur Shah Zafar was proclaimed emperor by the rebels at Delhi.",
  "Lord Canning was the Governor-General at the time.",
  "Madras and Bombay presidencies were the main centres of the revolt.",
], [1, 2], "The main centres were in north and central India (Delhi, Kanpur, Lucknow, Jhansi, Bihar).");

b.t("Early Nationalism");
b.st(3, "Consider the following about the moderate phase of the Congress (1885–1905):", [
  "Moderates demanded expansion of legislative councils and Indianisation of services.",
  "They developed an economic critique of colonialism, including the drain theory.",
  "They launched mass civil disobedience against the salt tax.",
], [1, 2], "Civil disobedience came under Gandhi in 1930.");
b.q(3, "Arrange in chronological order: 1. Surat split 2. Partition of Bengal 3. Morley–Minto reforms 4. Annulment of Partition of Bengal", ["2, 1, 3, 4", "1, 2, 3, 4", "2, 3, 1, 4", "3, 2, 1, 4"], "1905, 1907, 1909, 1911.");
b.st(3, "Consider the following about the Home Rule Movement:", [
  "Tilak's Home Rule League was founded in April 1916 and Annie Besant's in September 1916.",
  "The two leagues worked in demarcated areas to avoid overlap.",
  "The Home Rule Leagues demanded complete independence (Purna Swaraj).",
], [1, 2], "They demanded self-government within the British Empire.");
b.ar(3, "The Lucknow Pact (1916) marked a rare phase of Congress–League cooperation.", "The Congress accepted separate electorates for Muslims in the pact.", "b", "Both are true; R is a term of the pact rather than the reason for cooperation (which arose from the post-war political context and reunification of moderates and extremists).");
b.q(3, "Which of the following was NOT a feature of the Swadeshi Movement (1905–11)?", ["Mass non-payment of land revenue throughout India", "Boycott of foreign goods", "National education institutions", "Use of traditional festivals for mobilisation"], "Non-payment of revenue was not part of the Swadeshi programme.");

b.t("Gandhian Era");
b.st(3, "Consider the following about the Gandhi–Irwin Pact (March 1931):", [
  "The Congress agreed to suspend the Civil Disobedience Movement.",
  "Political prisoners not convicted of violence were to be released.",
  "The government agreed to commute the death sentences of Bhagat Singh and his associates.",
], [1, 2], "The pact did not secure commutation; they were executed on 23 March 1931.");
b.st(3, "Consider the following about the INA trials (1945–46):", [
  "They were held at the Red Fort.",
  "Bhulabhai Desai was among the defence counsel.",
  "The trials aroused widespread public sympathy across communities.",
], [1, 2, 3], "All three are correct; the accused included Shah Nawaz Khan, P. K. Sahgal and G. S. Dhillon.");
b.q(3, "Arrange in chronological order: 1. Rowlatt Satyagraha 2. Champaran Satyagraha 3. Kheda Satyagraha 4. Non-Cooperation Movement", ["2, 3, 1, 4", "3, 2, 1, 4", "2, 1, 3, 4", "1, 2, 3, 4"], "Champaran (1917), Kheda (1918), Rowlatt (1919), Non-Cooperation (1920).");
b.hm(3, "Which of the following were part of the Non-Cooperation programme (1920)?", [
  "Surrender of titles and honours",
  "Boycott of government schools and law courts",
  "Boycott of elections to councils",
  "Breaking the salt law",
], 3, "Breaking the salt law was part of Civil Disobedience (1930).", "How many of the above?");
b.st(3, "Consider the following about the Civil Disobedience Movement:", [
  "It began with the Dandi March in March 1930.",
  "Khudai Khidmatgars took part in the North-West Frontier Province.",
  "The Congress attended the First Round Table Conference.",
], [1, 2], "The Congress boycotted the First RTC and attended only the Second.");
b.ar(3, "The Quit India Movement saw the rise of parallel governments in several areas.", "With the top Congress leadership arrested on 9 August 1942, the movement became leaderless and decentralised.", "a", "Decentralisation allowed local leaders to set up parallel governments (Ballia, Tamluk, Satara).");
b.mt(3, "Match the Quit India parallel government with its area:", [["Prati Sarkar", "Satara"], ["Jatiya Sarkar", "Tamluk (Midnapore)"], ["Chittu Pandey's government", "Ballia"], ["Underground Congress Radio", "Bombay"]], "Each is associated with the 1942 movement.", "Initiative", "Place");
b.q(3, "Which of the following statements about the Poona Pact (1932) is correct?", ["It increased reserved seats for depressed classes within joint electorates, replacing separate electorates under the Communal Award", "It granted separate electorates to depressed classes", "It ended the Civil Disobedience Movement", "It was signed between Gandhi and Jinnah"], "It was signed by Gandhi and Ambedkar after Gandhi's fast in Yerawada jail.");

b.t("Revolutionary Movements");
b.st(3, "Consider the following about the HSRA:", [
  "It was formed in 1928 at Feroz Shah Kotla, Delhi.",
  "Its members threw bombs in the Central Legislative Assembly in 1929 to protest against repressive bills.",
  "It was founded by Rash Behari Bose in Tokyo.",
], [1, 2], "Rash Behari Bose was associated with the Indian Independence League in East Asia.");
b.q(3, "Arrange in chronological order: 1. Kakori train action 2. Chittagong armoury raid 3. Alipore bomb case 4. Assembly bomb case", ["3, 1, 4, 2", "1, 3, 4, 2", "3, 4, 1, 2", "1, 3, 2, 4"], "Alipore (1908), Kakori (1925), Assembly bomb (1929), Chittagong (1930).");

b.t("Towards Independence");
b.st(3, "Consider the following about the Cabinet Mission Plan (1946):", [
  "It proposed a Union of India dealing with defence, foreign affairs and communications.",
  "It provided for grouping of provinces into three sections.",
  "It accepted the demand for a separate sovereign Pakistan.",
], [1, 2], "It rejected a separate Pakistan.");
b.q(3, "Arrange in chronological order: 1. Cripps Mission 2. Wavell Plan 3. Mountbatten Plan 4. Cabinet Mission", ["1, 2, 4, 3", "2, 1, 4, 3", "1, 4, 2, 3", "4, 1, 2, 3"], "1942, 1945, 1946, June 1947.");
b.ar(3, "The RIN mutiny of 1946 alarmed the British government.", "It showed that the armed forces could no longer be relied upon to maintain colonial rule.", "a", "R explains A.");

b.t("Social Reform & Awakening");
b.mt(3, "Match the reformer with the work or cause:", [["Ishwar Chandra Vidyasagar", "Widow remarriage"], ["Jyotirao Phule", "Gulamgiri and Satyashodhak Samaj"], ["Pandita Ramabai", "Sharada Sadan for widows"], ["Sree Narayana Guru", "One caste, one religion, one God for humanity"]], "Leaders of 19th–early 20th century reform.", "Reformer", "Cause");
b.st(3, "Consider the following about the Brahmo Samaj:", [
  "It was founded by Raja Ram Mohan Roy in 1828.",
  "It opposed idolatry and sati.",
  "It was founded in Bombay.",
], [1, 2], "It was founded in Calcutta.");

b.t("Ancient & Medieval Culture");
b.st(3, "Consider the following about Bhimbetka:", [
  "It is a group of rock shelters in Madhya Pradesh with prehistoric paintings.",
  "It is a UNESCO World Heritage Site.",
  "Its paintings depict hunting, dancing and animals.",
], [1, 2, 3], "All three are correct; it was inscribed in 2003.");
b.st(3, "Consider the following about Mahayana Buddhism:", [
  "It emphasises the ideal of the Bodhisattva.",
  "It permitted image worship of the Buddha.",
  "Its canonical texts were written only in Pali.",
], [1, 2], "Mahayana texts were largely in Sanskrit; the Theravada canon is in Pali.");
b.q(3, "The Fourth Buddhist Council, associated with the rise of Mahayana, was held under:", ["Kanishka in Kashmir", "Ashoka at Pataliputra", "Ajatashatru at Rajagriha", "Harsha at Kannauj"], "The Third Council was under Ashoka; the First under Ajatashatru.");
b.mt(3, "Match the classical dance with its State of origin:", [["Sattriya", "Assam"], ["Mohiniyattam", "Kerala"], ["Kuchipudi", "Andhra Pradesh"], ["Odissi", "Odisha"]], "Sangeet Natak Akademi recognises eight classical dances.", "Dance", "State");
b.hm(3, "Which of the following are recognised as classical dances by the Sangeet Natak Akademi?", [
  "Kathakali",
  "Manipuri",
  "Sattriya",
  "Garba",
], 3, "Garba is a folk dance.", "How many of the above?");
b.st(3, "Consider the following about temple architecture:", [
  "The Nagara style is characterised by a curvilinear shikhara.",
  "The Dravida style has a pyramidal vimana and large gopurams.",
  "The Vesara style combines features of Nagara and Dravida.",
], [1, 2, 3], "All three are correct.");
b.mt(3, "Match the cave site with its dominant religious association:", [["Ajanta", "Buddhist"], ["Ellora", "Buddhist, Hindu and Jain"], ["Elephanta", "Hindu (Shaiva)"], ["Udayagiri–Khandagiri", "Jain"]], "Rock-cut architecture in India.", "Site", "Association");
b.st(3, "Consider the following about the Harappan civilisation:", [
  "Its cities show planned streets and drainage.",
  "Dholavira is known for its water management system.",
  "Its script has been fully deciphered.",
], [1, 2], "The Indus script remains undeciphered.");
b.ar(3, "The Bhakti movement used regional languages extensively.", "Bhakti saints sought to reach ordinary people beyond the elite who knew Sanskrit.", "a", "R explains A.");
b.st(3, "Consider the following about the Gupta period:", [
  "It is associated with Aryabhata and Kalidasa.",
  "Nalanda emerged as a major centre of learning during this period.",
  "The Gupta rulers issued gold coins known as dinaras.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Which pair is correctly matched?", ["Sufi order — Chishti — Khwaja Moinuddin (Ajmer)", "Sufi order — Suhrawardi — Nizamuddin Auliya (Delhi)", "Sufi order — Naqshbandi — Baba Farid", "Sufi order — Qadiri — Bakhtiyar Kaki"], "Nizamuddin Auliya and Baba Farid were Chishti saints.");

b.t("Personalities & Slogans");
b.mt(3, "Match the leader with the organisation founded:", [["Subhas Chandra Bose", "Forward Bloc"], ["B. R. Ambedkar", "Independent Labour Party"], ["Jayaprakash Narayan", "Congress Socialist Party (co-founder)"], ["Khan Abdul Ghaffar Khan", "Khudai Khidmatgar"]], "Political organisations of the national movement.", "Leader", "Organisation");
b.st(3, "Consider the following about Dadabhai Naoroji:", [
  "He wrote 'Poverty and Un-British Rule in India'.",
  "He was elected to the British House of Commons.",
  "He presided over the first session of the Indian National Congress.",
], [1, 2], "W. C. Bonnerjee presided over the first session (1885).");
b.q(3, "Which leader is correctly matched with a newspaper he edited or founded?", ["Bal Gangadhar Tilak — Kesari", "Mahatma Gandhi — Al-Hilal", "Maulana Azad — Young India", "Annie Besant — Bengalee"], "Al-Hilal was Azad's; Young India Gandhi's; New India Besant's.");

b.t("Statements & Reasoning");
b.st(3, "Consider the following about the Government of India Act, 1919:", [
  "It introduced dyarchy in the provinces.",
  "It made the central legislature bicameral.",
  "It provided for direct elections on universal adult franchise.",
], [1, 2], "Franchise was limited by property and education.");
b.st(3, "Consider the following about the Simon Commission:", [
  "It was appointed in 1927.",
  "It had no Indian member.",
  "Its report recommended dominion status immediately.",
], [1, 2], "It recommended provincial autonomy among other things, not immediate dominion status.");
b.hm(3, "Which of the following happened during Lord Curzon's tenure as Viceroy?", [
  "Partition of Bengal",
  "Ancient Monuments Preservation Act",
  "Indian Universities Act",
  "Morley–Minto reforms",
], 3, "Morley–Minto reforms came in 1909 under Lord Minto.", "How many of the above?");
b.q(3, "Arrange in chronological order: 1. Lahore Session (Purna Swaraj) 2. Nehru Report 3. Simon Commission's arrival 4. First Round Table Conference", ["3, 2, 1, 4", "2, 3, 1, 4", "3, 1, 2, 4", "1, 3, 2, 4"], "Simon Commission (Feb 1928), Nehru Report (Aug 1928), Lahore (Dec 1929), First RTC (Nov 1930).");
b.ar(3, "The Montagu Declaration of 1917 marked a shift in British policy.", "It announced the gradual development of self-governing institutions with a view to responsible government in India.", "a", "R explains A.");

export default b.items;
