import { Bank } from "./dsl";

/** Freedom struggle — Viceroys and events, regional movements, more personalities and reasoning. */
const b = new Bank("history4");

type V = [string, string, 1 | 2 | 3];
const VICEROYS: V[] = [
  ["the Ilbert Bill controversy (1883)", "Lord Ripon", 2],
  ["the foundation of the Indian National Congress (1885)", "Lord Dufferin", 2],
  ["the Partition of Bengal (1905)", "Lord Curzon", 1],
  ["the Morley–Minto Reforms (1909)", "Lord Minto II", 2],
  ["the Delhi Durbar of 1911 and the transfer of the capital to Delhi", "Lord Hardinge II", 2],
  ["the Rowlatt Act and the Jallianwala Bagh massacre (1919)", "Lord Chelmsford", 1],
  ["the Chauri Chaura incident (1922) and Moplah rebellion", "Lord Reading", 2],
  ["the appointment of the Simon Commission (1927)", "Lord Irwin", 2],
  ["the Communal Award and the Poona Pact (1932)", "Lord Willingdon", 2],
  ["the Cripps Mission and Quit India Movement (1942)", "Lord Linlithgow", 1],
  ["the Shimla Conference (1945) and the Cabinet Mission (1946)", "Lord Wavell", 2],
  ["the Partition and transfer of power (1947)", "Lord Mountbatten", 1],
  ["the Vernacular Press Act and the Delhi Durbar of 1877", "Lord Lytton", 2],
  ["the first official census (1872, non-synchronous) and creation of an agriculture department", "Lord Mayo", 3],
];
const vNames = VICEROYS.map((v) => v[1]);
VICEROYS.forEach(([ev, who, d]) => {
  b.t("Viceroys & Events").pool(d, `Who was the Viceroy of India at the time of ${ev}?`, who, vNames, `${who} was Viceroy during ${ev}.`);
});

b.t("Regional Movements");
b.q(2, "The 'Guruvayur Satyagraha' (1931–32) was led by:", ["K. Kelappan", "T. K. Madhavan", "Ayyankali", "Mannathu Padmanabhan"], "It demanded entry of all castes into the Guruvayur temple.");
b.q(2, "The 'Akali movement' (Gurdwara Reform Movement) of the 1920s aimed to:", ["Free Sikh gurdwaras from corrupt mahants", "Establish a separate Sikh state", "Oppose the Rowlatt Act only", "Promote English education"], "It led to the Sikh Gurdwaras Act, 1925 and the SGPC.");
b.q(2, "The 'Bijolia movement' in Rajasthan was a:", ["Peasant movement against excessive taxes by the jagirdar", "Tribal revolt in Bastar", "Workers' strike", "Temple entry movement"], "It was led by Vijay Singh Pathik among others.");
b.q(2, "The 'Ahom revolt' (1828) took place in:", ["Assam", "Bengal", "Odisha", "Manipur"], "Ahom nobles resisted British annexation after the First Anglo-Burmese War.");
b.q(2, "The Paika rebellion of 1817 against the East India Company took place in:", ["Odisha", "Bihar", "Assam", "Kerala"], "It was led by Bakshi Jagabandhu.");
b.q(2, "Velu Thampi Dalawa led a revolt against the British in:", ["Travancore", "Mysore", "Hyderabad", "Coorg"], "His Kundara Proclamation (1809) called on people to rise against the British.");
b.q(3, "The 'Kol uprising' (1831–32) occurred in:", ["Chotanagpur", "Malabar", "Khandesh", "Assam"], "The Kols protested against transfer of land to outsiders.");
b.q(2, "The 'Bhil uprisings' against British rule took place mainly in:", ["Khandesh (western India)", "Bengal", "Punjab", "Assam"], "Bhils revolted repeatedly in 1817–19 and later.");
b.q(2, "Kittur Chennamma, who resisted the British in 1824, was the queen of:", ["Kittur (Karnataka)", "Jhansi", "Awadh", "Travancore"], "Her revolt preceded 1857 by over three decades.");
b.q(2, "Who led the 1930 Salt Satyagraha in Kerala at Payyannur?", ["K. Kelappan", "C. Rajagopalachari", "T. Prakasam", "Sardar Patel"], "Kelappan is known as 'Kerala Gandhi'.");
b.q(3, "The 'Forest Satyagraha' in the 1930s was prominent in which region?", ["Central Provinces, Maharashtra and Karnataka", "Punjab", "Bengal", "Kashmir"], "Forest laws were defied during Civil Disobedience.");
b.q(2, "Who among the following was associated with the 'Self-Respect Marriage' and the Justice Party?", ["E. V. Ramasamy (Periyar)", "C. N. Annadurai only", "K. Kamaraj", "C. Rajagopalachari"], "Periyar later formed the Dravidar Kazhagam (1944).");
b.q(2, "The 'Justice Party' (South Indian Liberal Federation) was formed in 1916 to represent:", ["Non-Brahmin interests in the Madras Presidency", "Muslim interests in Bengal", "Industrial workers in Bombay", "Sikh peasants in Punjab"], "It formed governments in Madras under dyarchy.");

b.t("Gandhian Era");
b.q(2, "Gandhi's 'Constructive Programme' included all of the following EXCEPT:", ["Industrialisation through heavy industry", "Promotion of khadi", "Removal of untouchability", "Hindu–Muslim unity"], "It emphasised village industries, basic education and prohibition.");
b.q(2, "Gandhi's autobiography 'The Story of My Experiments with Truth' was originally written in:", ["Gujarati", "English", "Hindi", "Marathi"], "It was serialised in Navajivan and translated by Mahadev Desai.");
b.q(3, "Which newspaper/journal was published by Gandhi in South Africa?", ["Indian Opinion", "Young India", "Harijan", "Navajivan"], "Indian Opinion was started in 1903.");
b.q(2, "Gandhi called off the Civil Disobedience Movement and signed a pact with Lord Irwin in:", ["March 1931", "March 1930", "August 1932", "January 1934"], "Political prisoners not convicted of violence were released; Congress agreed to attend the Second RTC.");
b.q(2, "The 'Wardha Scheme of Basic Education' (1937) proposed by Gandhi emphasised:", ["Education through a craft in the mother tongue", "English-medium higher education", "Military training", "Religious education only"], "The Zakir Hussain Committee worked out the details.");
b.q(2, "Who among the following accompanied Gandhi in the Champaran Satyagraha?", ["Rajendra Prasad", "Jawaharlal Nehru", "Subhas Chandra Bose", "C. R. Das"], "Others included Mazharul Haq, J. B. Kripalani and Narhari Parikh.");
b.q(3, "The 'Kheda Satyagraha' of 1918 was about:", ["Remission of land revenue after crop failure", "Indigo cultivation", "Mill workers' wages", "Salt tax"], "Vallabhbhai Patel emerged as a leader in this struggle.");
b.q(2, "In the Ahmedabad mill strike of 1918, Gandhi used which method for the first time in India?", ["Hunger strike", "Boycott", "Salt satyagraha", "No-tax campaign"], "The workers won a 35% wage increase.");

b.t("Chronology");
b.q(3, "Arrange the following Governor-Generals/Viceroys in chronological order: 1. Lord Lytton 2. Lord Canning 3. Lord Ripon 4. Lord Curzon", ["2, 1, 3, 4", "1, 2, 3, 4", "2, 3, 1, 4", "3, 2, 1, 4"], "Canning (1856–62), Lytton (1876–80), Ripon (1880–84), Curzon (1899–1905).");
b.q(3, "Arrange in chronological order: 1. INA trials 2. RIN mutiny 3. Shimla Conference 4. Direct Action Day", ["3, 1, 2, 4", "1, 3, 2, 4", "3, 2, 1, 4", "2, 3, 1, 4"], "Shimla Conference (June 1945), INA trials (from Nov 1945), RIN mutiny (Feb 1946), Direct Action Day (Aug 1946).");
b.q(3, "Arrange in chronological order: 1. Vernacular Press Act 2. Ilbert Bill 3. Formation of Indian Association 4. Founding of INC", ["3, 1, 2, 4", "1, 3, 2, 4", "3, 2, 1, 4", "1, 2, 3, 4"], "Indian Association (1876), Vernacular Press Act (1878), Ilbert Bill (1883), INC (1885).");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements about the Home Rule Movement:", ["Tilak's League worked in Maharashtra (except Bombay city), Karnataka, Central Provinces and Berar.", "Annie Besant's League covered the rest of India."], [1, 2], "The two leagues divided areas to avoid friction.");
b.st(3, "Consider the following about the RIN mutiny of 1946:", ["It began in Bombay on HMIS Talwar.", "The Congress and League leadership fully supported the mutineers' continuing the revolt.", "Sardar Patel and Jinnah persuaded the ratings to surrender."], [1, 3], "The leadership did not encourage continuing the revolt; Patel and Jinnah advised surrender.");
b.st(2, "Consider the following statements about the Khilafat movement:", ["It aimed to protect the position of the Ottoman Sultan as Caliph.", "It was supported by Gandhi."], [1, 2], "Both are correct; it merged with Non-Cooperation.");
b.hm(2, "Consider the following pairs of person and organisation:", ["Raja Ram Mohan Roy — Brahmo Samaj", "Jyotirao Phule — Satyashodhak Samaj", "Swami Vivekananda — Arya Samaj"], 2, "Arya Samaj was founded by Dayanand Saraswati; Vivekananda founded the Ramakrishna Mission.", "How many of the above pairs are correctly matched?");
b.ar(2, "The Cripps proposals were rejected by the Congress.", "The proposals offered dominion status only after the war and allowed provinces to secede.", "a", "R gives the reasons for rejection.");
b.ar(3, "The 'August Offer' (1940) was rejected by the Congress.", "It promised a Constituent Assembly immediately with full powers.", "c", "A is true; R is false — it promised a constitution-making body only after the war and an expanded Executive Council.");
b.q(2, "The 'Hindustan Socialist Republican Army' carried out the assassination of J. P. Saunders in 1928 to avenge:", ["The death of Lala Lajpat Rai", "The Jallianwala Bagh massacre", "The execution of Ram Prasad Bismil", "The Kakori arrests"], "Saunders was mistaken for James Scott, who ordered the lathi charge.");
b.q(2, "The Lahore Conspiracy Case is associated with the trial of:", ["Bhagat Singh, Sukhdev and Rajguru", "Aurobindo Ghosh", "Surya Sen", "Ram Prasad Bismil"], "They were executed on 23 March 1931 — observed as Shaheed Diwas.");
b.q(2, "The Alipore Bomb Case (1908) is associated with:", ["Aurobindo Ghosh and Barindra Ghosh", "Bhagat Singh", "Chandrashekhar Azad", "Rash Behari Bose"], "Aurobindo was acquitted, defended by C. R. Das.");
b.q(2, "Khudiram Bose and Prafulla Chaki attempted to kill which magistrate in 1908?", ["Kingsford", "Rand", "Jackson", "Saunders"], "Khudiram Bose was executed at 18; Prafulla Chaki shot himself.");
b.q(2, "The Chapekar brothers assassinated W. C. Rand in 1897 because of:", ["Excesses during plague control operations in Pune", "The Partition of Bengal", "The Vernacular Press Act", "Salt taxes"], "It was one of the earliest political assassinations.");
b.q(3, "Who among the following founded the 'Indian Home Rule Society' in London (1905)?", ["Shyamji Krishna Varma", "Madan Lal Dhingra", "V. D. Savarkar", "Lala Har Dayal"], "He also published 'The Indian Sociologist'.");
b.q(2, "Madan Lal Dhingra assassinated which official in London in 1909?", ["Curzon Wyllie", "Michael O'Dwyer", "Lord Minto", "Kingsford"], "Dhingra was associated with India House.");
b.q(2, "Who was the first Indian to be elected to the British House of Commons?", ["Dadabhai Naoroji", "M. M. Bhownaggree", "Shapurji Saklatvala", "W. C. Bonnerjee"], "He was elected from Finsbury Central as a Liberal in 1892.");
b.q(2, "The 'Hunter Commission' of 1882 concerned:", ["Primary and secondary education", "The Jallianwala Bagh massacre", "Famine relief", "Police reforms"], "The 1919 Hunter Committee was a different body that inquired into the Punjab disturbances.");
b.q(2, "Which of the following famines led to the Famine Commission under Richard Strachey (1880)?", ["The Great Famine of 1876–78", "The Bengal Famine of 1943", "The Orissa Famine of 1866", "The Chalisa Famine of 1783"], "It recommended a Famine Code.");
b.q(2, "The Bengal Famine of 1943 occurred during the viceroyalty of:", ["Lord Linlithgow (and continued under Lord Wavell)", "Lord Curzon", "Lord Irwin", "Lord Mountbatten"], "Around three million people died.");
b.q(1, "Who designed the national flag adopted by the Constituent Assembly, based on a flag he had earlier designed?", ["Pingali Venkayya", "Rabindranath Tagore", "Bankim Chandra", "Madam Cama"], "The Assembly adopted the tricolour with the Ashoka Chakra on 22 July 1947.");

b.q(1, "Mahatma Gandhi was assassinated on:", ["30 January 1948", "2 October 1948", "15 August 1947", "26 January 1948"], "30 January is observed as Martyrs' Day (Shaheed Diwas).");
b.q(2, "Who gave Gandhi the title 'Mahatma'?", ["Rabindranath Tagore", "Subhas Chandra Bose", "Jawaharlal Nehru", "Gopal Krishna Gokhale"], "Bose was the first to call him 'Father of the Nation' in a 1944 radio address.");
b.q(2, "Who first addressed Gandhi as 'Father of the Nation' in a radio broadcast from Singapore (1944)?", ["Subhas Chandra Bose", "Rabindranath Tagore", "Sarojini Naidu", "Jawaharlal Nehru"], "Bose sought Gandhi's blessings for the INA's struggle.");
b.q(2, "The 'Mountbatten Plan' for the partition of India was announced on:", ["3 June 1947", "15 August 1947", "20 February 1947", "18 July 1947"], "It provided for partition and transfer of power; the date was later advanced to 15 August 1947.");

export default b.items;
