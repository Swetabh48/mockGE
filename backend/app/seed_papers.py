"""Hard SSC-CGL style seed paper builders for FastAPI (mirrors src/lib/exam/questionBank.ts)."""

from __future__ import annotations

import math
from typing import Any


def _shuffle(correct: str, wrongs: list[str], salt: int) -> tuple[dict[str, str], str]:
    opts = [correct, *wrongs]
    # deterministic shuffle matching TS style
    for i in range(len(opts) - 1, 0, -1):
        j = (abs(salt) + i * 7) % (i + 1)
        opts[i], opts[j] = opts[j], opts[i]
    # uniquify distractors if needed
    seen: set[str] = set()
    for i, v in enumerate(opts):
        k = 0
        while v in seen:
            k += 1
            v = f"{opts[i]}·{k}"
        opts[i] = v
        seen.add(v)
    if correct not in opts:
        opts[0] = correct
    letters = ["A", "B", "C", "D"]
    mapping = {letters[i]: opts[i] for i in range(4)}
    correct_opt = letters[opts.index(correct)]
    return mapping, correct_opt


def _q(
    q_index: int,
    section: str,
    subject: str,
    topic: str,
    stem: str,
    answer: str,
    wrongs: list[str],
    explanation: str,
    marks: float,
    negative: float,
    source: str = "seed",
    difficulty: str = "hard",
) -> dict[str, Any]:
    uniq = [w if w != answer else f"{w}*" for w in wrongs[:3]]
    while len(uniq) < 3:
        uniq.append(f"X{len(uniq)}")
    mapping, correct = _shuffle(answer, uniq, q_index * 31 + len(stem) + (97 if source == "pyq_style" else 0))
    return {
        "qIndex": q_index,
        "sectionKey": section,
        "subject": subject,
        "topic": topic,
        "difficulty": difficulty,
        "stemEn": stem,
        "stemHi": None,
        "optionA": mapping["A"],
        "optionB": mapping["B"],
        "optionC": mapping["C"],
        "optionD": mapping["D"],
        "correctOption": correct,
        "explanation": explanation,
        "marks": marks,
        "negativeMarks": negative,
        "source": source,
    }


def _round2(n: float) -> float:
    return round(n + 1e-12, 2)


def _gcd(a: int, b: int) -> int:
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a or 1


def _lcm(a: int, b: int) -> int:
    return abs(a * b) // _gcd(a, b)


def _source(paper_no: int) -> str:
    return "pyq_style" if paper_no == 2 else "seed"


# ---------- curated banks ----------

REASONING_BANK: list[dict] = [
    {"topic": "Coding-Decoding", "stem": "In a certain code, PLANET is written as QMBOFU and EARTH as FBSUI. How is MOON written?", "answer": "NPPO", "wrongs": ["NPON", "NNOP", "OPPN"], "explanation": "Each letter +1."},
    {"topic": "Coding-Decoding", "stem": "If ‘234’ means ‘you are good’, ‘136’ means ‘we are bad’, ‘458’ means ‘good and bad’, digit for ‘good’?", "answer": "4", "wrongs": ["2", "3", "8"], "explanation": "Common digit for good in first and third codes is 4."},
    {"topic": "Coding-Decoding", "stem": "If letter positions sum: NOTE = 14+15+20+5. Code for NOTE?", "answer": "54", "wrongs": ["58", "49", "62"], "explanation": "Positional sum = 54."},
    {"topic": "Input-Output", "stem": "Input: 54 17 92 33 61. Step I: odds ascending then evens ascending. Step I?", "answer": "17 33 54 61 92", "wrongs": ["17 33 61 54 92", "54 17 33 61 92", "17 54 33 61 92"], "explanation": "Odds then evens sorted."},
    {"topic": "Input-Output", "stem": "Input ‘sky blue dark night cold’. Alphabetical Step1?", "answer": "blue cold dark night sky", "wrongs": ["sky night dark cold blue", "blue dark cold night sky", "cold blue dark night sky"], "explanation": "Dictionary order."},
    {"topic": "Circular Seating", "stem": "Six friends A–F face centre. A between D and B; F between E and C; E immediate left of D. Opposite A?", "answer": "C", "wrongs": ["E", "F", "B"], "explanation": "Arrangement places C opposite A."},
    {"topic": "Linear Seating", "stem": "P,Q,R,S,T face north. Q second right of P; S at extreme; R between Q and T. Middle?", "answer": "Q", "wrongs": ["R", "P", "T"], "explanation": "Order yields Q in middle."},
    {"topic": "Blood Relation", "stem": "A is B’s brother. C is A’s mother. D is C’s father. E is B’s son. D related to E?", "answer": "Great-grandfather", "wrongs": ["Grandfather", "Father", "Uncle"], "explanation": "D is great-grandfather of E."},
    {"topic": "Blood Relation", "stem": "Rohan: “She is daughter of my grandfather’s only son.” Girl is Rohan’s?", "answer": "Sister", "wrongs": ["Cousin", "Mother", "Aunt"], "explanation": "Father’s daughter = sister."},
    {"topic": "Syllogism", "stem": "All books are pens. Some pens are erasers. Conclusions: I Some books are erasers II Some erasers are pens.", "answer": "Only II", "wrongs": ["Only I", "Both I and II", "Neither"], "explanation": "Only II definite."},
    {"topic": "Syllogism", "stem": "Some cats are dogs. All dogs are rats. I All cats being rats is possible II Some rats are cats.", "answer": "Both I and II follow", "wrongs": ["Only I", "Only II", "Neither"], "explanation": "Both follow."},
    {"topic": "Floor Puzzle", "stem": "8 floors. P on 4. Two floors between P and Q. R immediately above Q. S on odd floor above R. Who on floor 7?", "answer": "S", "wrongs": ["Q", "R", "P"], "explanation": "Valid arrangement places S on 7."},
    {"topic": "Scheduling", "stem": "Finance on Wednesday. HR two days before Finance. Marketing immediately after HR. Marketing day?", "answer": "Tuesday", "wrongs": ["Monday", "Thursday", "Friday"], "explanation": "HR Mon, Marketing Tue."},
    {"topic": "Direction Sense", "stem": "10 m south, left 20 m, left 10 m, right 5 m. Distance/direction from start?", "answer": "25 m East", "wrongs": ["25 m West", "15 m East", "20 m North"], "explanation": "Net 25 m east."},
    {"topic": "Direction Sense", "stem": "12 km N, right 5 km, right 12 km, left 3 km. Distance from start?", "answer": "8 km", "wrongs": ["5 km", "3 km", "15 km"], "explanation": "Net 8 km east."},
    {"topic": "Odd One Out", "stem": "Odd one: 121, 144, 169, 196, 225, 256, 288", "answer": "288", "wrongs": ["256", "225", "196"], "explanation": "288 not a perfect square."},
    {"topic": "Odd One Out", "stem": "Odd: ACE, BDF, CEG, DGH, EGI", "answer": "DGH", "wrongs": ["ACE", "BDF", "EGI"], "explanation": "Should be DFI."},
    {"topic": "Statement-Assumption", "stem": "“Buy pure honey of company X.” I Artificial honey available II No other company supplies pure honey.", "answer": "Only I", "wrongs": ["Only II", "Both", "Neither"], "explanation": "Only I implicit."},
    {"topic": "Statement-Assumption", "stem": "“Avail this opportunity.” I Opportunity exists II One should not let opportunities go.", "answer": "Both I and II", "wrongs": ["Only I", "Only II", "Neither"], "explanation": "Both implicit."},
    {"topic": "Number Series", "stem": "Wrong term: 3, 5, 12, 39, 154, 772, 4634", "answer": "772", "wrongs": ["154", "39", "4634"], "explanation": "154×5+5=775 not 772."},
    {"topic": "Number Series", "stem": "Next: 7, 8, 18, 57, 228, ?", "answer": "1165", "wrongs": ["1160", "1125", "1200"], "explanation": "228×5+5=1165."},
    {"topic": "Letter Series", "stem": "Next: AZ, CX, FU, ?", "answer": "JQ", "wrongs": ["IR", "KP", "IT"], "explanation": "+2,+3,+4 and −2,−3,−4."},
    {"topic": "Analogy", "stem": "EDITOR : ROTIDE :: DOCTOR : ?", "answer": "ROTCOD", "wrongs": ["DOCROT", "TODROC", "CODTOR"], "explanation": "Reverse the word."},
    {"topic": "Analogy", "stem": "9 : 80 :: 100 : ?", "answer": "9999", "wrongs": ["901", "1000", "990"], "explanation": "n²−1."},
    {"topic": "Ranking", "stem": "Class of 45. A 12th from top, B 17th from bottom. Between A and B?", "answer": "16", "wrongs": ["15", "17", "18"], "explanation": "B from top=29; between=16."},
    {"topic": "Calendar", "stem": "15 Aug 2024 Thursday. Day on 15 Aug 2025?", "answer": "Friday", "wrongs": ["Thursday", "Saturday", "Wednesday"], "explanation": "+1 weekday."},
    {"topic": "Clock", "stem": "Hands together between 3 and 4?", "answer": "16 4/11 min past 3", "wrongs": ["15 min past 3", "16 min past 3", "17 1/11 min past 3"], "explanation": "M=30H/5.5=16 4/11."},
    {"topic": "Inequality", "stem": "P ≥ Q = R > S ≤ T. Which true?", "answer": "P > S", "wrongs": ["Q < S", "T < R", "P = T"], "explanation": "P>S definite."},
    {"topic": "Symbol Operation", "stem": "P=+, Q=×, R=÷, S=−. 18 Q 3 P 6 S 4 R 2 = ?", "answer": "58", "wrongs": ["52", "60", "48"], "explanation": "18×3+6−4÷2=58."},
    {"topic": "Puzzle", "stem": "A taller than B shorter than C. D shorter than B. E taller than C. Tallest?", "answer": "E", "wrongs": ["C", "A", "B"], "explanation": "E>C>A>B>D."},
    {"topic": "Course of Action", "stem": "Many failed maths. I Ban maths II Review teaching. Which?", "answer": "Only II", "wrongs": ["Only I", "Both", "Neither"], "explanation": "Only II sensible."},
    {"topic": "Cause-Effect", "stem": "I Heavy rains flooded city. II Flights cancelled. Relation?", "answer": "I is cause, II is effect", "wrongs": ["II cause of I", "Independent", "Both effects of independent causes only"], "explanation": "Floods cause cancellations."},
    {"topic": "Alphabet", "stem": "Meaningful word from 2nd,4th,6th,8th of COMPUTER?", "answer": "PORT", "wrongs": ["None", "Two words", "COME"], "explanation": "O,P,T,R → PORT."},
    {"topic": "Series Mixed", "stem": "2, 3, 8, 27, 112, ?", "answer": "565", "wrongs": ["560", "455", "480"], "explanation": "112×5+5=565."},
    {"topic": "Syllogism", "stem": "All keys locks. All locks screws. Some screws nails. I All keys screws II Some nails locks.", "answer": "Only I", "wrongs": ["Only II", "Both", "Neither"], "explanation": "Only I follows."},
    {"topic": "Blood Relation", "stem": "P brother of Q. R sister of Q. T daughter of Q. Uncle of T?", "answer": "P", "wrongs": ["R", "S", "Q"], "explanation": "P is uncle of T."},
    {"topic": "Direction", "stem": "A 40 m SW of B. C 40 m SE of B. C direction of A?", "answer": "East", "wrongs": ["West", "North", "South"], "explanation": "C is east of A."},
    {"topic": "Puzzle Lite", "stem": "History below Maths; English above Maths; Science between English and Maths; Geography bottom. Top?", "answer": "English", "wrongs": ["Maths", "Science", "History"], "explanation": "English on top."},
    {"topic": "Data Sufficiency", "stem": "Code for ‘sky’? I ‘sky is blue’→ka la pa II ‘blue sky clear’→pa na ka", "answer": "Either ka or pa (insufficient)", "wrongs": ["ka only", "pa only", "na"], "explanation": "Cannot uniquely decide."},
    {"topic": "Sitting", "stem": "A,B,C,D face north; E,F,G,H face them. A opp E; C opp G; B left of A. Faces B?", "answer": "F", "wrongs": ["H", "E", "G"], "explanation": "F faces B."},
    {"topic": "Venn", "stem": "Best diagram: Doctors, Males, Females?", "answer": "Males & Females disjoint, both overlap Doctors", "wrongs": ["Three concentric", "One circle", "All identical overlap"], "explanation": "Gender disjoint; doctors intersect both."},
    {"topic": "Ranking", "stem": "In a row of 40, Ravi 8th from left, Kavya 12th from right. Between them if Ravi left of Kavya?", "answer": "20", "wrongs": ["21", "19", "18"], "explanation": "Kavya from left=29; between=29-8-1=20."},
]

GA_BANK: list[dict] = [
    {"topic": "Polity", "stem": "Article dealing with amendment procedure?", "answer": "Article 368", "wrongs": ["Article 352", "Article 356", "Article 360"], "explanation": "Art. 368."},
    {"topic": "Polity", "stem": "Ninth Schedule added by which Amendment?", "answer": "1st Amendment", "wrongs": ["42nd Amendment", "44th Amendment", "7th Amendment"], "explanation": "First Amendment 1951."},
    {"topic": "Polity", "stem": "Schedule listing oaths and affirmations?", "answer": "Third Schedule", "wrongs": ["Second Schedule", "Fourth Schedule", "Fifth Schedule"], "explanation": "Third Schedule."},
    {"topic": "Polity", "stem": "Article 280 relates to?", "answer": "Finance Commission", "wrongs": ["Election Commission", "UPSC", "CAG"], "explanation": "Finance Commission."},
    {"topic": "Polity", "stem": "Fundamental Duties added by?", "answer": "42nd Amendment", "wrongs": ["44th Amendment", "52nd Amendment", "61st Amendment"], "explanation": "42nd Amendment 1976."},
    {"topic": "Polity", "stem": "Article for life and personal liberty?", "answer": "Article 21", "wrongs": ["Article 19", "Article 14", "Article 32"], "explanation": "Article 21."},
    {"topic": "History", "stem": "Lahore Congress 1929 famous for?", "answer": "Purna Swaraj resolution", "wrongs": ["Non-Cooperation launch", "Quit India", "Lucknow Pact"], "explanation": "Purna Swaraj."},
    {"topic": "History", "stem": "Rowlatt Act year?", "answer": "1919", "wrongs": ["1917", "1920", "1915"], "explanation": "1919."},
    {"topic": "History", "stem": "Forward Bloc founded by?", "answer": "Subhas Chandra Bose", "wrongs": ["Jawaharlal Nehru", "Sardar Patel", "C.R. Das"], "explanation": "Bose, 1939."},
    {"topic": "History", "stem": "Vernacular Press Act under?", "answer": "Lord Lytton", "wrongs": ["Lord Curzon", "Lord Ripon", "Lord Dalhousie"], "explanation": "Lytton 1878."},
    {"topic": "History", "stem": "Ilbert Bill associated with?", "answer": "Lord Ripon", "wrongs": ["Lord Lytton", "Lord Mayo", "Lord Canning"], "explanation": "Ripon."},
    {"topic": "Geography", "stem": "‘Sorrow of Bihar’ river?", "answer": "Kosi", "wrongs": ["Gandak", "Son", "Ghaghara"], "explanation": "Kosi."},
    {"topic": "Geography", "stem": "Black cotton soil mainly in?", "answer": "Deccan Plateau", "wrongs": ["Indo-Gangetic plain", "Thar Desert", "Eastern Ghats only"], "explanation": "Regur of Deccan."},
    {"topic": "Geography", "stem": "Pass connecting Srinagar with Leh?", "answer": "Zoji La", "wrongs": ["Nathu La", "Rohtang", "Shipki La"], "explanation": "Zoji La."},
    {"topic": "Geography", "stem": "Tropic of Cancer does NOT pass through?", "answer": "Odisha", "wrongs": ["Jharkhand", "West Bengal", "Tripura"], "explanation": "Not Odisha."},
    {"topic": "Geography", "stem": "Mineral mined at Jaduguda?", "answer": "Uranium", "wrongs": ["Copper", "Mica", "Coal"], "explanation": "Uranium."},
    {"topic": "Geography", "stem": "Western Disturbances originate over?", "answer": "Mediterranean Sea", "wrongs": ["Bay of Bengal", "Arabian Sea", "Caspian only"], "explanation": "Mediterranean/West Asia."},
    {"topic": "Economy", "stem": "RBI MPC members?", "answer": "6", "wrongs": ["5", "7", "4"], "explanation": "Six members."},
    {"topic": "Economy", "stem": "Repo rate is rate at which?", "answer": "RBI lends to commercial banks against securities", "wrongs": ["Banks lend to RBI", "RBI borrows from IMF", "Banks lend to public"], "explanation": "RBI lending rate."},
    {"topic": "Economy", "stem": "GST implemented from?", "answer": "1 July 2017", "wrongs": ["1 April 2017", "1 July 2016", "1 January 2018"], "explanation": "1 July 2017."},
    {"topic": "Economy", "stem": "Economic Survey prepared by?", "answer": "Department of Economic Affairs, Ministry of Finance", "wrongs": ["NITI Aayog alone", "RBI", "CSO only"], "explanation": "Finance Ministry DEA."},
    {"topic": "Economy", "stem": "MGNREGA guaranteed days?", "answer": "100 days", "wrongs": ["150 days", "200 days", "50 days"], "explanation": "100 days."},
    {"topic": "Science", "stem": "SI unit of luminous intensity?", "answer": "Candela", "wrongs": ["Lumen", "Lux", "Watt"], "explanation": "Candela."},
    {"topic": "Science", "stem": "Major component of biogas?", "answer": "Methane", "wrongs": ["Ethane", "Propane", "Butane"], "explanation": "Methane."},
    {"topic": "Science", "stem": "pH of neutral solution at 25°C?", "answer": "7", "wrongs": ["0", "14", "1"], "explanation": "pH 7."},
    {"topic": "Science", "stem": "Night blindness due to deficiency of?", "answer": "Vitamin A", "wrongs": ["Vitamin C", "Vitamin D", "Vitamin K"], "explanation": "Vitamin A."},
    {"topic": "Science", "stem": "Newton’s third law?", "answer": "Action and reaction", "wrongs": ["Inertia", "F=ma only", "Gravitation only"], "explanation": "Action-reaction."},
    {"topic": "Science", "stem": "Formula of washing soda?", "answer": "Na₂CO₃·10H₂O", "wrongs": ["NaHCO₃", "NaOH", "CaOCl₂"], "explanation": "Sodium carbonate decahydrate."},
    {"topic": "Awards", "stem": "First Indian Nobel in Literature?", "answer": "Rabindranath Tagore", "wrongs": ["C.V. Raman", "Amartya Sen", "Mother Teresa"], "explanation": "Tagore 1913."},
    {"topic": "Awards", "stem": "Bharat Ratna instituted in?", "answer": "1954", "wrongs": ["1950", "1947", "1960"], "explanation": "1954."},
    {"topic": "Books", "stem": "Discovery of India author?", "answer": "Jawaharlal Nehru", "wrongs": ["Mahatma Gandhi", "S. Radhakrishnan", "B.R. Ambedkar"], "explanation": "Nehru."},
    {"topic": "Books", "stem": "Annihilation of Caste author?", "answer": "B.R. Ambedkar", "wrongs": ["Periyar", "Jyotirao Phule", "Gandhi"], "explanation": "Ambedkar."},
    {"topic": "National Parks", "stem": "Kaziranga famous for?", "answer": "One-horned rhinoceros", "wrongs": ["Asiatic lion", "Snow leopard", "Hangul"], "explanation": "One-horned rhino."},
    {"topic": "National Parks", "stem": "Jim Corbett NP is in?", "answer": "Uttarakhand", "wrongs": ["Himachal Pradesh", "Rajasthan", "Madhya Pradesh"], "explanation": "Uttarakhand."},
    {"topic": "National Parks", "stem": "Gir NP natural habitat of?", "answer": "Asiatic lion", "wrongs": ["Bengal tiger", "Indian leopard only", "Cheetah"], "explanation": "Asiatic lion."},
    {"topic": "Polity", "stem": "Max gap between Parliament sessions?", "answer": "Six months", "wrongs": ["Three months", "Four months", "One year"], "explanation": "Article 85."},
    {"topic": "Polity", "stem": "Who administers oath to President?", "answer": "Chief Justice of India", "wrongs": ["Vice-President", "Speaker", "Prime Minister"], "explanation": "CJI."},
    {"topic": "History", "stem": "Doctrine of Lapse associated with?", "answer": "Lord Dalhousie", "wrongs": ["Lord Wellesley", "Lord Curzon", "Lord Cornwallis"], "explanation": "Dalhousie."},
    {"topic": "History", "stem": "Partition of Bengal annulled in?", "answer": "1911", "wrongs": ["1905", "1919", "1909"], "explanation": "1911."},
    {"topic": "Geography", "stem": "Highest peak in peninsular India?", "answer": "Anamudi", "wrongs": ["Doddabetta", "Mahendragiri", "Guru Shikhar"], "explanation": "Anamudi."},
    {"topic": "Geography", "stem": "Chilika Lake in?", "answer": "Odisha", "wrongs": ["West Bengal", "Andhra Pradesh", "Tamil Nadu"], "explanation": "Odisha."},
    {"topic": "Economy", "stem": "Capital receipt example?", "answer": "Recovery of loans", "wrongs": ["Interest payments", "Subsidies", "Salaries"], "explanation": "Loan recovery is capital receipt."},
    {"topic": "Science", "stem": "Universal donor blood group?", "answer": "O negative", "wrongs": ["AB positive", "A positive", "B negative"], "explanation": "O−."},
    {"topic": "Science", "stem": "Powerhouse of the cell?", "answer": "Mitochondria", "wrongs": ["Ribosome", "Nucleus", "Golgi apparatus"], "explanation": "Mitochondria."},
    {"topic": "Institutions", "stem": "ICJ headquarters?", "answer": "The Hague", "wrongs": ["Geneva", "New York", "Vienna"], "explanation": "The Hague."},
    {"topic": "Culture", "stem": "Sattriya classical dance of?", "answer": "Assam", "wrongs": ["Odisha", "Manipur", "West Bengal"], "explanation": "Assam."},
    {"topic": "Polity", "stem": "Concurrent List is in which Schedule?", "answer": "Seventh Schedule", "wrongs": ["Sixth Schedule", "Eighth Schedule", "Ninth Schedule"], "explanation": "Seventh Schedule."},
    {"topic": "Economy", "stem": "FRBM Act primarily about?", "answer": "Fiscal discipline / deficit targets", "wrongs": ["Foreign trade only", "Banking licenses", "SEBI takeovers"], "explanation": "Fiscal responsibility."},
    {"topic": "History", "stem": "Chauri Chaura led withdrawal of?", "answer": "Non-Cooperation Movement", "wrongs": ["Civil Disobedience", "Quit India", "Khilafat only"], "explanation": "NCM withdrawn 1922."},
    {"topic": "Geography", "stem": "Duncan Passage lies between?", "answer": "South Andaman and Little Andaman", "wrongs": ["India and Sri Lanka", "Lakshadweep islands", "Nicobar and Sumatra"], "explanation": "South & Little Andaman."},
]

ENG_BANK: list[dict] = [
    {"topic": "Error Spotting", "stem": "Error: The committee / have decided / to postpone / the meeting.", "answer": "have decided", "wrongs": ["The committee", "to postpone", "No error"], "explanation": "has decided."},
    {"topic": "Error Spotting", "stem": "Error: Neither of the two boys / have submitted / their assignments / on time.", "answer": "have submitted", "wrongs": ["Neither of the two boys", "their assignments", "on time"], "explanation": "has submitted."},
    {"topic": "Error Spotting", "stem": "Error: She is / senior than / all her colleagues / in the office.", "answer": "senior than", "wrongs": ["She is", "all her colleagues", "No error"], "explanation": "senior to."},
    {"topic": "Error Spotting", "stem": "Error: He congratulated me / for my success / in the examination / No error.", "answer": "for my success", "wrongs": ["He congratulated me", "in the examination", "No error"], "explanation": "congratulated on."},
    {"topic": "Error Spotting", "stem": "Error: The news / are true / beyond doubt / No error.", "answer": "are true", "wrongs": ["The news", "beyond doubt", "No error"], "explanation": "is true."},
    {"topic": "Sentence Improvement", "stem": "Improve: He is enough tall to touch the ceiling.", "answer": "tall enough", "wrongs": ["enough taller", "taller enough", "No improvement"], "explanation": "tall enough."},
    {"topic": "Sentence Improvement", "stem": "Improve: Scarcely had he left than the phone rang.", "answer": "when the phone rang", "wrongs": ["then the phone rang", "as the phone rang", "No improvement"], "explanation": "scarcely…when."},
    {"topic": "Sentence Improvement", "stem": "Improve: The teacher asked the student that why he was late.", "answer": "why he was late", "wrongs": ["that why was he late", "why was he late", "No improvement"], "explanation": "Drop that; assertive order."},
    {"topic": "Idioms", "stem": "‘To throw in the towel’ means?", "answer": "To admit defeat", "wrongs": ["To start a fight", "To clean up", "To celebrate"], "explanation": "Admit defeat."},
    {"topic": "Idioms", "stem": "‘Burn the midnight oil’ means?", "answer": "Work late into the night", "wrongs": ["Waste fuel", "Sleep early", "Party at night"], "explanation": "Work late."},
    {"topic": "Idioms", "stem": "‘A storm in a teacup’ means?", "answer": "A big fuss over a trivial matter", "wrongs": ["A natural disaster", "A tea party", "Sudden success"], "explanation": "Fuss over little."},
    {"topic": "One Word", "stem": "A person who hates mankind?", "answer": "Misanthrope", "wrongs": ["Philanthropist", "Misogynist", "Optimist"], "explanation": "Misanthrope."},
    {"topic": "One Word", "stem": "Government by the wealthy?", "answer": "Plutocracy", "wrongs": ["Autocracy", "Theocracy", "Bureaucracy"], "explanation": "Plutocracy."},
    {"topic": "One Word", "stem": "One who is present everywhere?", "answer": "Omnipresent", "wrongs": ["Omniscient", "Omnipotent", "Invisible"], "explanation": "Omnipresent."},
    {"topic": "Cloze", "stem": "The manager insisted that the report _____ submitted by Monday.", "answer": "be", "wrongs": ["is", "was", "were"], "explanation": "Subjunctive be."},
    {"topic": "Cloze", "stem": "Hardly _____ the train arrived when it started raining.", "answer": "had", "wrongs": ["has", "did", "was"], "explanation": "Hardly had."},
    {"topic": "Cloze", "stem": "She is accustomed _____ working long hours.", "answer": "to", "wrongs": ["with", "for", "by"], "explanation": "accustomed to."},
    {"topic": "Voice", "stem": "Passive of: Who wrote this novel?", "answer": "By whom was this novel written?", "wrongs": ["Who was this novel written?", "By who was this novel written?", "This novel written by whom?"], "explanation": "By whom + was + V3."},
    {"topic": "Voice", "stem": "Active of: The work will have been finished by them.", "answer": "They will have finished the work.", "wrongs": ["They will finish the work.", "They have finished the work.", "They finished the work."], "explanation": "Future perfect active."},
    {"topic": "Narration", "stem": "He said, “I have been waiting since morning.”", "answer": "He said that he had been waiting since morning.", "wrongs": ["He said that he has been waiting since morning.", "He said that I had been waiting since morning.", "He told that he was waiting since morning."], "explanation": "Past perfect continuous."},
    {"topic": "Narration", "stem": "She said to me, “Do you know the way?”", "answer": "She asked me if I knew the way.", "wrongs": ["She asked me do I know the way.", "She told me if I knew the way.", "She asked me that I knew the way."], "explanation": "if + past."},
    {"topic": "Para Jumble", "stem": "(P) but also builds character (Q) Education not only (R) informs the mind (S) of a person. Order?", "answer": "QRPS", "wrongs": ["QPRS", "PQRS", "RQPS"], "explanation": "QRPS."},
    {"topic": "Synonyms", "stem": "Synonym of EPHEMERAL?", "answer": "Transient", "wrongs": ["Eternal", "Immense", "Rigid"], "explanation": "Transient."},
    {"topic": "Synonyms", "stem": "Synonym of OBFUSCATE?", "answer": "Confuse", "wrongs": ["Clarify", "Illuminate", "Simplify"], "explanation": "Confuse."},
    {"topic": "Synonyms", "stem": "Synonym of PROLIFIC?", "answer": "Productive", "wrongs": ["Barren", "Scarce", "Lazy"], "explanation": "Productive."},
    {"topic": "Antonyms", "stem": "Antonym of BENEVOLENT?", "answer": "Malevolent", "wrongs": ["Kind", "Generous", "Amiable"], "explanation": "Malevolent."},
    {"topic": "Antonyms", "stem": "Antonym of EXONERATE?", "answer": "Incriminate", "wrongs": ["Absolve", "Acquit", "Pardon"], "explanation": "Incriminate."},
    {"topic": "Antonyms", "stem": "Antonym of PAUCITY?", "answer": "Abundance", "wrongs": ["Scarcity", "Dearth", "Lack"], "explanation": "Abundance."},
    {"topic": "Spelling", "stem": "Correct spelling?", "answer": "Miscellaneous", "wrongs": ["Miscelaneous", "Miscellanous", "Misellaneous"], "explanation": "Miscellaneous."},
    {"topic": "Spelling", "stem": "Correct spelling?", "answer": "Embarrassment", "wrongs": ["Embarrasment", "Embarassment", "Embaresment"], "explanation": "Embarrassment."},
    {"topic": "Fillers", "stem": "No sooner did the bell ring _____ the students rushed out.", "answer": "than", "wrongs": ["when", "then", "as"], "explanation": "No sooner…than."},
    {"topic": "Phrase Replacement", "stem": "He is good in English →", "answer": "good at English", "wrongs": ["good on English", "good with English only", "No improvement"], "explanation": "good at."},
    {"topic": "Idioms", "stem": "‘Take with a grain of salt’ means?", "answer": "View with scepticism", "wrongs": ["Eat salted food", "Accept blindly", "Ignore completely"], "explanation": "Scepticism."},
    {"topic": "One Word", "stem": "Speech without preparation?", "answer": "Extempore", "wrongs": ["Debate", "Rhetoric", "Soliloquy"], "explanation": "Extempore."},
    {"topic": "Error Spotting", "stem": "Error: One of my friend / has gone / to Canada / No error.", "answer": "One of my friend", "wrongs": ["has gone", "to Canada", "No error"], "explanation": "friends."},
    {"topic": "Voice", "stem": "Passive: People say that he is a spy.", "answer": "He is said to be a spy.", "wrongs": ["He is said that he is a spy.", "It is said him to be a spy.", "He says to be a spy."], "explanation": "He is said to be…"},
    {"topic": "Cloze", "stem": "The project was completed _____ schedule.", "answer": "ahead of", "wrongs": ["ahead on", "before of", "prior than"], "explanation": "ahead of."},
    {"topic": "Synonyms", "stem": "Synonym of CENSURE?", "answer": "Criticize", "wrongs": ["Praise", "Approve", "Commend"], "explanation": "Criticize."},
    {"topic": "Antonyms", "stem": "Antonym of SPURIOUS?", "answer": "Genuine", "wrongs": ["Fake", "Counterfeit", "False"], "explanation": "Genuine."},
    {"topic": "Narration", "stem": "Ram said, “Alas! I am undone.”", "answer": "Ram exclaimed with sorrow that he was undone.", "wrongs": ["Ram said that alas he is undone.", "Ram told that he was undone.", "Ram exclaimed that I was undone."], "explanation": "Exclaimed with sorrow."},
    {"topic": "Sentence Improvement", "stem": "Unless you do not work hard, you will fail.", "answer": "Unless you work hard", "wrongs": ["If you do not work hard not", "Unless you will work hard", "No improvement"], "explanation": "Drop do not after unless."},
    {"topic": "Error Spotting", "stem": "Error: The teacher / as well as the students / were present / No error.", "answer": "were present", "wrongs": ["The teacher", "as well as the students", "No error"], "explanation": "was present."},
    {"topic": "Para Jumble", "stem": "S1 Pollution serious. P Industries dump waste. Q Vehicles emit smoke. R Strict laws needed. S Citizens cooperate. Order PQRS?", "answer": "PQRS", "wrongs": ["QPSR", "PRQS", "SPQR"], "explanation": "Causes then remedies."},
    {"topic": "Fillers", "stem": "He is _____ honest man than his brother.", "answer": "a more", "wrongs": ["more an", "an more", "the more"], "explanation": "a more honest."},
    {"topic": "Idioms", "stem": "‘Hit the nail on the head’ means?", "answer": "Be exactly right", "wrongs": ["Hurt someone", "Fail badly", "Work hard"], "explanation": "Exactly correct."},
]

COMPUTER_BANK: list[dict] = [
    {"topic": "Basics", "stem": "NOT system software?", "answer": "MS Excel", "wrongs": ["Operating system", "Device driver", "Compiler"], "explanation": "Application software."},
    {"topic": "Memory", "stem": "Cache memory is?", "answer": "Faster than RAM and closer to CPU", "wrongs": ["Slower than secondary storage", "Same as ROM", "Only used in printers"], "explanation": "Fast cache near CPU."},
    {"topic": "Number System", "stem": "Binary of 25?", "answer": "11001", "wrongs": ["10101", "11101", "10011"], "explanation": "16+8+1."},
    {"topic": "Networking", "stem": "OSI layer for routing?", "answer": "Network layer", "wrongs": ["Data link", "Transport", "Session"], "explanation": "Layer 3."},
    {"topic": "Networking", "stem": "IPv4 bits?", "answer": "32", "wrongs": ["64", "128", "16"], "explanation": "32-bit."},
    {"topic": "OS", "stem": "Thrashing means?", "answer": "Excessive paging reducing CPU efficiency", "wrongs": ["Disk formatting", "Virus attack", "Cache hit"], "explanation": "Too much swapping."},
    {"topic": "DBMS", "stem": "Primary key?", "answer": "Uniquely identifies each record and cannot be NULL", "wrongs": ["Can have duplicates", "Is always foreign", "Stores images only"], "explanation": "Unique + NOT NULL."},
    {"topic": "MS Office", "stem": "Excel largest value function?", "answer": "MAX", "wrongs": ["LARGEST", "TOP", "HIGH"], "explanation": "MAX."},
    {"topic": "MS Office", "stem": "New slide shortcut in PowerPoint?", "answer": "Ctrl + M", "wrongs": ["Ctrl + N", "Ctrl + S", "Ctrl + D"], "explanation": "Ctrl+M."},
    {"topic": "Security", "stem": "Phishing aims to?", "answer": "Steal sensitive information via deceptive messages", "wrongs": ["Speed up CPU", "Defragment disk", "Compile code"], "explanation": "Credential theft."},
    {"topic": "Internet", "stem": "DNS translates?", "answer": "Domain names to IP addresses", "wrongs": ["IP to MAC only", "Files to folders", "HTML to XML"], "explanation": "Name→IP."},
    {"topic": "Hardware", "stem": "Optical storage?", "answer": "DVD", "wrongs": ["RAM", "SSD (NAND flash)", "Pendrive (USB flash)"], "explanation": "Optical."},
    {"topic": "Programming", "stem": "HTML is primarily a?", "answer": "Markup language", "wrongs": ["Programming language like C", "Database", "Operating system"], "explanation": "Markup."},
    {"topic": "Shortcuts", "stem": "Ctrl+Shift+Esc opens?", "answer": "Task Manager (Windows)", "wrongs": ["File Explorer", "Control Panel", "Notepad"], "explanation": "Task Manager."},
    {"topic": "Memory", "stem": "1 nibble equals?", "answer": "4 bits", "wrongs": ["8 bits", "2 bits", "16 bits"], "explanation": "4 bits."},
    {"topic": "Networking", "stem": "HTTPS default port?", "answer": "443", "wrongs": ["80", "21", "25"], "explanation": "443."},
    {"topic": "OS", "stem": "Virtual memory is?", "answer": "A memory management technique using disk as extension of RAM", "wrongs": ["Only ROM chip", "Cache inside CPU only", "USB memory stick exclusively"], "explanation": "Paging to disk."},
    {"topic": "Basics", "stem": "Brain of the computer?", "answer": "CPU", "wrongs": ["Monitor", "Keyboard", "Printer"], "explanation": "CPU."},
    {"topic": "MS Office", "stem": "Mail Merge feature of?", "answer": "MS Word", "wrongs": ["MS Paint", "Notepad only", "Command Prompt"], "explanation": "Word."},
    {"topic": "Security", "stem": "Firewall used to?", "answer": "Control network traffic based on security rules", "wrongs": ["Cool the CPU", "Increase RAM", "Edit videos"], "explanation": "Filter traffic."},
    {"topic": "Internet", "stem": "FTP stands for?", "answer": "File Transfer Protocol", "wrongs": ["Fast Transfer Process", "File Transmit Program", "Folder Transfer Protocol"], "explanation": "File Transfer Protocol."},
    {"topic": "Number System", "stem": "Hex FF in decimal?", "answer": "255", "wrongs": ["256", "240", "127"], "explanation": "255."},
    {"topic": "DBMS", "stem": "SQL remove table?", "answer": "DROP TABLE", "wrongs": ["DELETE TABLE", "REMOVE TABLE", "ERASE TABLE"], "explanation": "DROP TABLE."},
    {"topic": "Hardware", "stem": "Typically non-impact printer?", "answer": "Laser printer", "wrongs": ["Dot matrix", "Daisy wheel", "Line printer (impact type)"], "explanation": "Laser non-impact."},
    {"topic": "Networking", "stem": "LAN covers?", "answer": "A small geographic area like office/campus", "wrongs": ["Entire continents only", "Only wireless satellites", "Interplanetary links"], "explanation": "Local area."},
]


def _pick(bank: list[dict], count: int, offset: int) -> list[dict]:
    return [bank[(offset + i) % len(bank)] for i in range(count)]


def _from_bank(
    bank: list[dict],
    count: int,
    start: int,
    section: str,
    subject: str,
    marks: float,
    neg: float,
    offset: int,
    source: str,
    easy_first: int = 0,
) -> list[dict]:
    items = _pick(bank, count, offset)
    out = []
    for i, it in enumerate(items):
        diff = "easy" if i < easy_first else "hard"
        if i < 2 and easy_first == 0 and section in {"english", "ga"}:
            diff = "medium" if i < 2 else "hard"
        out.append(
            _q(
                start + i,
                section,
                subject,
                it["topic"],
                it["stem"],
                it["answer"],
                it["wrongs"],
                it["explanation"],
                marks,
                neg,
                source,
                diff if diff != "medium" else "hard",
            )
        )
    return out


def _quant(count: int, start: int, marks: float, neg: float, section: str, subject: str, paper_no: int, source: str) -> list[dict]:
    out = []
    for i in range(count):
        n = start + i
        seed = n + paper_no * 17
        v = (seed + i) % 14
        difficulty = "hard"

        if i < 2 and paper_no % 2 == 1:
            difficulty = "easy"
            if i == 0:
                x = 80 + seed % 40
                p = 15 + seed % 10
                ans = _round2(x * p / 100)
                stem = f"What is {p}% of {x}?"
                topic, expl = "Percentage", f"{p}% of {x} = {ans}."
                answer, wrongs = str(ans), [str(ans + 2), str(ans - 3), str(_round2(ans * 1.1))]
            else:
                a, b, c = 12 + seed % 8, 18 + seed % 6, 24 + seed % 5
                avg = _round2((a + b + c) / 3)
                stem = f"Average of {a}, {b} and {c} is:"
                topic, expl = "Average", f"Sum/3 = {avg}."
                answer, wrongs = str(avg), [str(avg + 1), str(avg - 1), str(a + b)]
        elif v == 0:
            P = 8000 + (seed % 7) * 500
            r = 8 + seed % 5
            t = 2 + seed % 2
            amt = _round2(P * ((1 + r / 100) ** t))
            ci = _round2(amt - P)
            stem = f"CI on Rs. {P} at {r}% p.a. for {t} years (annual)?"
            topic, expl = "Compound Interest", f"A={amt}; CI={ci}."
            answer, wrongs = f"Rs. {ci}", [f"Rs. {_round2(ci + 80)}", f"Rs. {_round2(P * r * t / 100)}", f"Rs. {_round2(ci - 50)}"]
        elif v == 1:
            mrp = 2000 + (seed % 6) * 250
            d1, d2 = 10 + seed % 6, 8 + seed % 5
            net = _round2(mrp * (1 - d1 / 100) * (1 - d2 / 100))
            stem = f"MP Rs.{mrp}, successive discounts {d1}% and {d2}%. SP?"
            topic, expl = "Successive Discounts", f"SP={net}."
            answer, wrongs = f"Rs. {net}", [f"Rs. {_round2(mrp * (1 - (d1 + d2) / 100))}", f"Rs. {_round2(mrp * (1 - d1 / 100))}", f"Rs. {_round2(net + 40)}"]
        elif v == 2:
            b, s = 12 + seed % 5, 2 + seed % 3
            dist = 36 + (seed % 4) * 12
            total = _round2(dist / (b - s) + dist / (b + s))
            stem = f"Boat {b} km/h still, stream {s} km/h. Time for {dist} km up and back?"
            topic, expl = "Boats and Streams", f"t={total} h."
            answer, wrongs = f"{total} h", [f"{_round2(2 * dist / b)} h", f"{_round2(dist / (b - s))} h", f"{_round2(total + 1)} h"]
        elif v == 3:
            a, b, c = 12 + seed % 6, 15 + seed % 5, 20 + seed % 4
            rate = 1 / a + 1 / b - 1 / c
            days = _round2(1 / rate)
            stem = f"A fills in {a}h, B in {b}h, C empties in {c}h. All open, time to fill?"
            topic, expl = "Pipes and Cisterns", f"Net rate → {days} h."
            answer, wrongs = f"{days} h", [f"{_round2(days + 1)} h", f"{a} h", f"{_round2(1 / (1 / a + 1 / b))} h"]
        elif v == 4:
            a, b = 10 + seed % 5, 15 + seed % 6
            together = 4 + seed % 3
            work = together * (1 / a + 1 / b)
            more = _round2((1 - work) * a) if work < 1 else 0
            total_days = _round2(together + more)
            stem = f"A:{a}d B:{b}d. Together {together}d then A alone. Total days?"
            topic, expl = "Time and Work", f"Total={total_days}."
            answer, wrongs = f"{total_days} days", [f"{_round2(a * b / (a + b))} days", f"{together + a} days", f"{_round2(total_days + 1)} days"]
        elif v == 5:
            c1, c2, mean = 20 + seed % 10, 40 + seed % 10, 28 + seed % 8
            r1, r2 = c2 - mean, mean - c1
            g = _gcd(r1, r2)
            ratio = f"{r1 // g}:{r2 // g}"
            stem = f"Mix tea at Rs.{c1}/kg with Rs.{c2}/kg for mean Rs.{mean}/kg. Ratio?"
            topic, expl = "Allegation", f"Ratio={ratio}."
            answer, wrongs = ratio, [f"{r2 // g}:{r1 // g}", f"{c1}:{c2}", "1:1"]
        elif v == 6:
            a_inv, b_inv = 12000 + (seed % 5) * 1000, 9000 + (seed % 4) * 1000
            a_m, b_m = 8, 10 + seed % 3
            profit = 11700 + (seed % 6) * 300
            a_share = (a_inv * a_m) / (a_inv * a_m + b_inv * b_m)
            a_amt = round(profit * a_share)
            stem = f"A Rs.{a_inv} for {a_m}m, B Rs.{b_inv} for {b_m}m. Profit Rs.{profit}. A’s share?"
            topic, expl = "Partnership", f"A gets Rs.{a_amt}."
            answer, wrongs = f"Rs. {a_amt}", [f"Rs. {round(profit * (1 - a_share))}", f"Rs. {round(profit / 2)}", f"Rs. {a_amt + 300}"]
        elif v == 7:
            p, q = 5 + seed % 6, 6 + seed % 5
            s, prod = p + q, p * q
            val = s * s - 2 * prod
            stem = f"Roots of x²−{s}x+{prod}=0. α²+β²=?"
            topic, expl = "Quadratic / Algebra", f"(α+β)²−2αβ={val}."
            answer, wrongs = str(val), [str(s * s), str(prod), str(val + 2)]
        elif v == 8:
            r, d = 7 + seed % 5, 3 + seed % 3
            length = _round2(2 * math.sqrt(r * r - d * d))
            stem = f"Chord {d} cm from centre, radius {r} cm. Length?"
            topic, expl = "Geometry (Circles)", f"2√(r²−d²)={length}."
            answer, wrongs = f"{length} cm", [f"{2 * r} cm", f"{_round2(length / 2)} cm", f"{r + d} cm"]
        elif v == 9:
            h = 50 + (seed % 5) * 10
            if seed % 2 == 0:
                dist = _round2(h * math.sqrt(3))
                stem = f"Angle of elevation 30°, tower {h} m. Distance from foot?"
                topic, expl = "Trigonometry (Heights)", f"d=h√3={dist}."
                answer, wrongs = f"{dist} m", [f"{h} m", f"{_round2(h / math.sqrt(3))} m", f"{2 * h} m"]
            else:
                stem = f"Elevation 45°, tower {h} m. Distance?"
                topic, expl = "Trigonometry (Heights)", f"d=h={h}."
                answer, wrongs = f"{h} m", [f"{2 * h} m", f"{_round2(h / math.sqrt(3))} m", f"{_round2(h * math.sqrt(3))} m"]
        elif v == 10:
            base = 2400 + (seed % 8) * 100
            pA, pB = 25 + seed % 10, 15 + seed % 8
            a, b = round(base * pA / 100), round(base * pB / 100)
            diff = abs(a - b)
            stem = f"Of {base}, {pA}% prefer A and {pB}% B. A exceeds B by?"
            topic, expl = "DI / Percentage", f"Difference={diff}."
            answer, wrongs = str(diff), [str(a), str(b), str(diff + 20)]
        elif v == 11:
            x, y, z = 12 + (seed % 5) * 2, 18 + (seed % 4) * 3, 24 + (seed % 3) * 4
            L = _lcm(_lcm(x, y), z)
            abs_m = 8 * 60 + L
            hh, mm = (abs_m // 60) % 12 or 12, abs_m % 60
            nice = f"{hh}:{mm:02d} am"
            stem = f"Bells every {x}, {y}, {z} min. Together at 8:00 am; next together?"
            topic, expl = "Number System (LCM/HCF)", f"LCM={L} min → {nice}."
            answer, wrongs = nice, [f"8:{(mm + 10) % 60:02d} am", f"{hh}:{(mm + 15) % 60:02d} am", "9:00 am"]
        elif v == 12:
            cp = 400 + (seed % 6) * 50
            g1, loss2 = 20 + seed % 5, 10 + seed % 4
            sp = _round2(cp * (1 + g1 / 100) * (1 - loss2 / 100))
            overall = _round2(((sp - cp) / cp) * 100)
            stem = f"CP Rs.{cp}, sold at {g1}% profit then SP reduced by {loss2}%. Overall % on CP?"
            topic, expl = "Profit and Loss", f"Overall={overall}%."
            answer, wrongs = f"{overall}%", [f"{g1 - loss2}%", f"{g1}%", f"{-loss2}%"]
        else:
            h = 10 + seed % 6
            vol = _round2((22 / 7) * 7 * 7 * h)
            stem = f"Cylinder r=7 cm, h={h} cm. Volume (π=22/7)?"
            topic, expl = "Mensuration", f"V={vol}."
            answer, wrongs = f"{vol} cm³", [f"{_round2(2 * 22 * 7 * h)} cm³", f"{7 * 7 * h} cm³", f"{vol + 154} cm³"]

        out.append(_q(n, section, subject, topic, stem, answer, wrongs, expl, marks, neg, source, difficulty))
    return out


def _reasoning(count: int, start: int, marks: float, neg: float, paper_no: int, source: str) -> list[dict]:
    return _from_bank(REASONING_BANK, count, start, "reasoning", "Reasoning", marks, neg, (paper_no - 1) * 11, source, easy_first=2 if paper_no % 2 == 1 else 0)


def _ga(count: int, start: int, marks: float, neg: float, paper_no: int, source: str) -> list[dict]:
    return _from_bank(GA_BANK, count, start, "ga", "General Awareness", marks, neg, (paper_no - 1) * 13 + 3, source)


def _eng(count: int, start: int, marks: float, neg: float, paper_no: int, source: str) -> list[dict]:
    return _from_bank(ENG_BANK, count, start, "english", "English", marks, neg, (paper_no - 1) * 9 + 1, source)


def _computer(count: int, start: int, marks: float, neg: float, paper_no: int, source: str) -> list[dict]:
    return _from_bank(COMPUTER_BANK, count, start, "computer", "Computer", marks, neg, (paper_no - 1) * 5, source)


def build_tier1(paper_no: int = 1) -> list[dict]:
    source = _source(paper_no)
    q: list[dict] = []
    q += _reasoning(25, 1, 2, 0.5, paper_no, source)
    q += _ga(25, 26, 2, 0.5, paper_no, source)
    q += _quant(25, 51, 2, 0.5, "quant", "Quantitative Aptitude", paper_no, source)
    q += _eng(25, 76, 2, 0.5, paper_no, source)
    for item in q:
        if item["difficulty"] != "easy":
            item["difficulty"] = "hard"
        item["source"] = source
    return q


def build_tier2(paper_no: int = 1) -> list[dict]:
    source = _source(paper_no)
    q: list[dict] = []
    q += _quant(30, 1, 3, 1, "maths", "Mathematical Abilities", paper_no, source)
    q += _reasoning(30, 31, 3, 1, paper_no + 1, source)
    q += _eng(45, 61, 3, 1, paper_no + 2, source)
    q += _ga(25, 106, 3, 1, paper_no + 3, source)
    q += _computer(20, 131, 3, 1, paper_no, source)
    for item in q:
        if item["difficulty"] != "easy":
            item["difficulty"] = "hard"
        item["source"] = source
    return q


def build_section_practice(section: str, set_no: int) -> list[dict]:
    """25 hard questions for reasoning|ga|quant|english."""
    source = "pyq_style" if set_no == 2 else "seed"
    marks, neg = 2.0, 0.5
    key = section if section in {"reasoning", "ga", "quant", "english"} else "reasoning"
    n = set_no + 10
    if key == "reasoning":
        return _reasoning(25, 1, marks, neg, n, source)
    if key == "ga":
        return _ga(25, 1, marks, neg, n, source)
    if key == "quant":
        return _quant(25, 1, marks, neg, "quant", "Quantitative Aptitude", n, source)
    return _eng(25, 1, marks, neg, n, source)


DEST_PASSAGES = [
    "The Staff Selection Commission conducts the Combined Graduate Level Examination for recruitment to various Group B and Group C posts in ministries and departments of the Government of India. Candidates must carefully read every instruction before beginning the examination. Time management is essential because each section of the paper is designed to test accuracy as well as speed. Regular practice of previous year questions improves familiarity with the pattern. Quantitative aptitude requires clear concepts of arithmetic, algebra, geometry and trigonometry. Reasoning tests analytical ability through analogies, series, coding and puzzles. General awareness covers history, geography, polity, economy and current events. English comprehension evaluates vocabulary, grammar and reading skills. Candidates should avoid guesswork where negative marking applies. Maintaining calm during the test helps in better decision making. Consistent revision of weak topics yields measurable improvement over successive mock tests. Typing practice for the data entry speed test should be undertaken daily so that the required number of key depressions can be completed with high accuracy within the allotted fifteen minutes. Accuracy matters as much as speed because errors reduce the effective score of the skill test. Candidates are advised to sit upright, keep the fingers on the home row and type the passage exactly as displayed on the screen without adding or omitting words. After finishing the written sections of Paper One, there is a short break for re registration before Session Two begins. During the break, remain in the examination centre and follow the instructions of the invigilator. The DEST passage is designed to measure data entry ability required for several posts under the Commission. Practice with similar passages on a standard keyboard builds confidence and reduces anxiety on the day of the examination.",
    "India is a union of states with a parliamentary system of government. The Constitution came into force on the twenty sixth of January nineteen fifty. Fundamental rights guarantee civil liberties while directive principles guide the state in policy making. The Parliament consists of the President and the two Houses. The Supreme Court is the apex judicial body. Public administration depends on an efficient civil service selected through competitive examinations. Economic planning aims at inclusive growth, employment generation and poverty reduction. Science and technology play a vital role in agriculture, industry and communication. Environmental protection is a shared responsibility of citizens and institutions. Education expands opportunity and strengthens democratic values. Discipline, integrity and hard work remain the foundation of public service. Aspirants preparing for competitive examinations must cultivate reading habits, numerical ability and clear expression in English and Hindi. Mock examinations under timed conditions train the mind for the actual examination hall. Candidates should analyse every mock result carefully, note the topics where mistakes occur and revise those topics before the next practice session. Sleep, nutrition and a fixed study timetable support sustained preparation over several months. On the day of the examination, reach the venue early with the required documents and follow all centre rules. Avoid discussion of answers after the paper and wait for the official process of result declaration. Continuous and honest effort is the most reliable path to success in the Combined Graduate Level Examination conducted by the Staff Selection Commission. Keep practising until accuracy and speed both meet the standard expected in the actual skill test.",
]
