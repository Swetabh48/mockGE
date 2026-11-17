import { Bank, nearYears } from "./dsl";

/** Indian Freedom Struggle — table-driven facts (each fact asked once). */
const b = new Bank("history1");

type Sess = [number, string, string, string, 1 | 2 | 3];
const SESSIONS: Sess[] = [
  [1885, "Bombay", "W. C. Bonnerjee", "the first session, attended by 72 delegates", 1],
  [1886, "Calcutta", "Dadabhai Naoroji", "the second session of the Congress", 2],
  [1887, "Madras", "Badruddin Tyabji", "the first session presided over by a Muslim", 2],
  [1888, "Allahabad", "George Yule", "the first session presided over by an Englishman", 2],
  [1889, "Bombay", "William Wedderburn", "a session presided over by a retired British civil servant", 3],
  [1896, "Calcutta", "Rahimtulla M. Sayani", "the session at which 'Vande Mataram' was first sung (by Tagore)", 3],
  [1905, "Benares", "Gopal Krishna Gokhale", "the session that supported the Swadeshi and boycott in Bengal", 2],
  [1906, "Calcutta", "Dadabhai Naoroji", "the session that adopted 'Swaraj' as the goal", 2],
  [1907, "Surat", "Rash Behari Ghosh", "the session where the Congress split into Moderates and Extremists", 1],
  [1911, "Calcutta", "Bishan Narayan Dar", "the session where 'Jana Gana Mana' was first sung", 2],
  [1916, "Lucknow", "Ambica Charan Mazumdar", "the session that reunited Moderates and Extremists and saw the Congress–League pact", 2],
  [1917, "Calcutta", "Annie Besant", "the first session presided over by a woman", 1],
  [1919, "Amritsar", "Motilal Nehru", "the session held after the Jallianwala Bagh massacre", 2],
  [1920, "Nagpur", "C. Vijayaraghavachariar", "the regular session that ratified the Non-Cooperation programme and reorganised Congress committees on linguistic lines", 3],
  [1922, "Gaya", "C. R. Das", "the session after which the Swaraj Party was formed", 2],
  [1924, "Belgaum", "Mahatma Gandhi", "the only session presided over by Gandhi", 1],
  [1925, "Kanpur", "Sarojini Naidu", "the first session presided over by an Indian woman", 1],
  [1927, "Madras", "M. A. Ansari", "the session that resolved to boycott the Simon Commission", 3],
  [1928, "Calcutta", "Motilal Nehru", "the session that considered the Nehru Report", 3],
  [1929, "Lahore", "Jawaharlal Nehru", "the session that adopted 'Purna Swaraj' as the goal", 1],
  [1931, "Karachi", "Vallabhbhai Patel", "the session that adopted resolutions on Fundamental Rights and National Economic Programme", 1],
  [1936, "Lucknow", "Jawaharlal Nehru", "a session at which Nehru advocated socialism as the goal", 3],
  [1937, "Faizpur", "Jawaharlal Nehru", "the first session held in a village", 2],
  [1938, "Haripura", "Subhas Chandra Bose", "the session at which the National Planning Committee idea was taken up", 2],
  [1939, "Tripuri", "Subhas Chandra Bose", "the session where Bose was re-elected defeating Pattabhi Sitaramayya", 2],
  [1940, "Ramgarh", "Maulana Abul Kalam Azad", "the session after which no regular session met until 1946, Azad remaining president through the Quit India years", 3],
  [1946, "Meerut", "J. B. Kripalani", "the last session before independence", 3],
];
const presidents = SESSIONS.map((s) => s[2]);
const places = [...new Set(SESSIONS.map((s) => s[1]))];
SESSIONS.forEach(([yr, place, pres, note, d], i) => {
  b.t("INC Sessions");
  if (i % 2 === 0) {
    b.pool(d, `Who presided over the ${yr} session of the Indian National Congress held at ${place}?`, pres, presidents, `${pres} presided over the ${yr} ${place} session — ${note}.`);
  } else {
    b.pool(d, `The ${yr} session of the Indian National Congress, presided over by ${pres}, was held at:`, place, places, `It was held at ${place}; it was ${note}.`);
  }
});

type Ev = [string, number, 1 | 2 | 3];
const EVENTS: Ev[] = [
  ["the outbreak of the Revolt at Meerut", 1857, 1],
  ["the founding of the Indian National Congress", 1885, 1],
  ["the Partition of Bengal by Lord Curzon came into effect", 1905, 1],
  ["the All-India Muslim League was founded at Dhaka", 1906, 1],
  ["the Partition of Bengal was annulled at the Delhi Durbar", 1911, 2],
  ["the Ghadar Party was founded at San Francisco", 1913, 2],
  ["the Home Rule Leagues of Tilak and Annie Besant were launched", 1916, 2],
  ["Gandhi led the Champaran Satyagraha", 1917, 1],
  ["the Kheda Satyagraha and the Ahmedabad mill strike took place", 1918, 2],
  ["the Jallianwala Bagh massacre took place", 1919, 1],
  ["the Non-Cooperation Movement was formally launched", 1920, 1],
  ["the Chauri Chaura incident led Gandhi to withdraw Non-Cooperation", 1922, 1],
  ["the Hindustan Republican Association was formed at Kanpur", 1924, 3],
  ["the Kakori train action took place", 1925, 2],
  ["the Simon Commission arrived in India", 1928, 1],
  ["the Bardoli Satyagraha led by Vallabhbhai Patel took place", 1928, 2],
  ["the Dandi March began the Civil Disobedience Movement", 1930, 1],
  ["the Chittagong armoury raid led by Surya Sen took place", 1930, 2],
  ["the Gandhi–Irwin Pact was signed", 1931, 1],
  ["Bhagat Singh, Rajguru and Sukhdev were executed", 1931, 1],
  ["the Poona Pact between Gandhi and Ambedkar was signed", 1932, 1],
  ["the Congress Socialist Party was formed", 1934, 3],
  ["elections to provincial legislatures under the 1935 Act were held", 1937, 2],
  ["the Congress ministries in the provinces resigned", 1939, 2],
  ["the August Offer was made by Viceroy Linlithgow", 1940, 2],
  ["the Cripps Mission visited India", 1942, 1],
  ["the Quit India Movement was launched", 1942, 1],
  ["Subhas Chandra Bose proclaimed the Provisional Government of Free India at Singapore", 1943, 2],
  ["the Shimla Conference convened by Lord Wavell failed", 1945, 2],
  ["the Royal Indian Navy mutiny broke out in Bombay", 1946, 2],
  ["the Cabinet Mission arrived in India", 1946, 1],
  ["the Indigo revolt (Neel Bidroh) broke out in Bengal", 1859, 3],
  ["the Vernacular Press Act was passed under Lord Lytton", 1878, 2],
  ["the Ilbert Bill controversy arose", 1883, 2],
  ["the Moplah (Mappila) rebellion broke out in Malabar", 1921, 2],
  ["the Vaikom Satyagraha against untouchability began", 1924, 3],
  ["the Swadeshi Movement was formally proclaimed at the Calcutta Town Hall meeting", 1905, 3],
  ["the Communal Award was announced by Ramsay MacDonald", 1932, 2],
];
const cap = (e: string) => e[0]!.toUpperCase() + e.slice(1);
const evStems = [
  (e: string) => `In which year did the following take place?
${cap(e)}.`,
  (e: string) => `Choose the correct year for this event: ${e}.`,
  (e: string) => `${cap(e)} — this happened in the year:`,
];
EVENTS.forEach(([e, y, d], i) => {
  const stem = evStems[i % 3]!(e);
  b.t("Chronology").q(d, stem, [String(y), ...(nearYears(y, stem) as [string, string, string])], `${cap(e)} in ${y}. Fix this date on your 1857–1947 timeline along with the events immediately before and after it.`);
});

type Org = [string, string, 1 | 2 | 3];
const ORGS: Org[] = [
  ["Brahmo Samaj (1828)", "Raja Ram Mohan Roy", 1],
  ["Arya Samaj (1875)", "Swami Dayanand Saraswati", 1],
  ["Prarthana Samaj (1867)", "Atmaram Pandurang", 2],
  ["Satyashodhak Samaj (1873)", "Jyotirao Phule", 1],
  ["Ramakrishna Mission (1897)", "Swami Vivekananda", 1],
  ["Servants of India Society (1905)", "Gopal Krishna Gokhale", 2],
  ["Indian Association (1876)", "Surendranath Banerjee", 2],
  ["Forward Bloc (1939)", "Subhas Chandra Bose", 1],
  ["Khudai Khidmatgar", "Khan Abdul Ghaffar Khan", 1],
  ["Abhinav Bharat Society", "V. D. Savarkar", 2],
  ["Indian Independence League (East Asia)", "Rash Behari Bose", 2],
  ["East India Association (London, 1866)", "Dadabhai Naoroji", 2],
  ["Self-Respect Movement", "E. V. Ramasamy (Periyar)", 2],
  ["Depressed Classes Mission (1906)", "V. R. Shinde", 3],
  ["Bahishkrit Hitakarini Sabha (1924)", "B. R. Ambedkar", 2],
  ["Sree Narayana Dharma Paripalana Yogam", "Sree Narayana Guru", 2],
  ["Muhammadan Anglo-Oriental College, Aligarh", "Sir Syed Ahmad Khan", 1],
  ["Young Bengal Movement", "Henry Louis Vivian Derozio", 2],
  ["India House, London", "Shyamji Krishna Varma", 3],
  ["Swadesh Bandhab Samiti, Barisal", "Ashwini Kumar Dutta", 3],
  ["Hindustan Republican Association (1924)", "Sachindra Nath Sanyal", 3],
  ["Theosophical Society headquarters at Adyar (1882)", "Helena Blavatsky and Henry Olcott", 3],
  ["Swaraj Party (1923)", "C. R. Das and Motilal Nehru", 1],
];
const founders = ORGS.map((o) => o[1]);
ORGS.forEach(([org, who, d], i) => {
  b.t("Organisations & Founders");
  if (i % 2 === 0) b.pool(d, `Who founded the ${org}?`, who, founders, `The ${org} was founded by ${who}.`);
  else b.pool(d, `${who} is associated with the founding of:`, org, ORGS.map((o) => o[0]), `${who} founded the ${org}.`);
});

type Bk = [string, string, 1 | 2 | 3];
const BOOKS: Bk[] = [
  ["Poverty and Un-British Rule in India", "Dadabhai Naoroji", 1],
  ["Hind Swaraj", "Mahatma Gandhi", 1],
  ["The Discovery of India", "Jawaharlal Nehru", 1],
  ["Gita Rahasya", "Bal Gangadhar Tilak", 2],
  ["India Wins Freedom", "Maulana Abul Kalam Azad", 2],
  ["Annihilation of Caste", "B. R. Ambedkar", 2],
  ["Gulamgiri", "Jyotirao Phule", 2],
  ["Satyarth Prakash", "Swami Dayanand Saraswati", 2],
  ["The Indian Struggle", "Subhas Chandra Bose", 2],
  ["Why I Am an Atheist", "Bhagat Singh", 2],
  ["Neel Darpan", "Dinabandhu Mitra", 3],
  ["The Indian War of Independence, 1857", "V. D. Savarkar", 3],
  ["The Economic History of India", "R. C. Dutt", 3],
  ["Unhappy India", "Lala Lajpat Rai", 3],
];
const authors = BOOKS.map((x) => x[1]);
BOOKS.forEach(([bk, who, d]) => {
  b.t("Books & Writings").pool(d, `The book '${bk}' was written by:`, who, authors, `'${bk}' was written by ${who}.`);
});

type Np = [string, string, 1 | 2 | 3];
const PAPERS: Np[] = [
  ["Kesari", "Bal Gangadhar Tilak", 1],
  ["Young India (as editor from 1919)", "Mahatma Gandhi", 1],
  ["Al-Hilal", "Maulana Abul Kalam Azad", 2],
  ["The Bengalee", "Surendranath Banerjee", 2],
  ["New India", "Annie Besant", 2],
  ["Comrade", "Maulana Mohammad Ali", 3],
  ["Mooknayak", "B. R. Ambedkar", 2],
  ["Sambad Kaumudi", "Raja Ram Mohan Roy", 2],
  ["Jugantar", "Barindra Kumar Ghosh and Bhupendranath Dutta", 3],
  ["Amrita Bazar Patrika", "Sisir Kumar Ghosh and Motilal Ghosh", 3],
];
const editors = PAPERS.map((p) => p[1]);
PAPERS.forEach(([np, who, d]) => {
  b.t("Press & Freedom Struggle").pool(d, `The newspaper/journal '${np}' is associated with:`, who, editors, `'${np}' was started/edited by ${who}.`);
});

export default b.items;
