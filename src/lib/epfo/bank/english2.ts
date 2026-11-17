import { Bank } from "./dsl";

/** English: idioms & phrases, one-word substitution, fill in the blanks. */
const b = new Bank("english2");

type Id = [string, string, string, string, string, 1 | 2 | 3];
const IDIOMS: Id[] = [
  ["A blessing in disguise", "Something good that seemed bad at first", "A hidden enemy", "A religious ceremony", "A costly mistake", 1],
  ["To burn the midnight oil", "To work or study late into the night", "To waste electricity", "To set fire to something", "To sleep early", 1],
  ["To hit the nail on the head", "To describe exactly what is causing a situation", "To hurt oneself", "To do carpentry", "To make a serious error", 1],
  ["To let the cat out of the bag", "To reveal a secret by mistake", "To free an animal", "To create chaos", "To escape punishment", 1],
  ["Once in a blue moon", "Very rarely", "Every month", "At night", "During a festival", 1],
  ["To beat about the bush", "To avoid coming to the point", "To search thoroughly", "To work in a garden", "To punish someone", 1],
  ["A piece of cake", "Something very easy", "A small reward", "A celebration", "A minor injury", 1],
  ["To cost an arm and a leg", "To be very expensive", "To cause an injury", "To be cheap", "To be risky", 1],
  ["To bite the bullet", "To face a difficult situation bravely", "To be shot", "To eat quickly", "To refuse firmly", 2],
  ["To cry over spilt milk", "To regret something that cannot be undone", "To waste food", "To be very sad at a loss of money", "To complain about poor service", 2],
  ["To turn a blind eye", "To deliberately ignore something", "To become blind", "To look carefully", "To wink", 2],
  ["To be in hot water", "To be in trouble", "To take a bath", "To be very angry", "To feel feverish", 2],
  ["To bury the hatchet", "To make peace", "To hide weapons", "To start a fight", "To dig a grave", 2],
  ["To call a spade a spade", "To speak plainly and frankly", "To garden", "To insult someone", "To exaggerate", 2],
  ["To spill the beans", "To reveal secret information", "To cook carelessly", "To waste money", "To spread rumours deliberately", 2],
  ["To throw in the towel", "To admit defeat", "To clean up", "To start a contest", "To offer help", 2],
  ["The ball is in your court", "It is your turn to take action or decide", "You have won the game", "You are being blamed", "You must leave now", 2],
  ["To keep one's fingers crossed", "To hope for a good outcome", "To lie", "To be nervous", "To pray loudly", 1],
  ["To add fuel to the fire", "To make a bad situation worse", "To help someone cook", "To reduce tension", "To start a business", 2],
  ["To be on cloud nine", "To be extremely happy", "To be confused", "To be in the sky", "To be daydreaming", 1],
  ["To pull someone's leg", "To tease or joke with someone", "To trip someone", "To help someone walk", "To criticise someone harshly", 1],
  ["Under the weather", "Feeling unwell", "Outdoors in rain", "Very busy", "Depressed about failure", 2],
  ["To break the ice", "To start a conversation in an awkward situation", "To destroy something cold", "To end a friendship", "To win a contest", 1],
  ["To steal someone's thunder", "To take credit or attention meant for someone else", "To rob someone", "To make a loud noise", "To scare someone", 3],
  ["To go back to the drawing board", "To start planning again after a failure", "To become an artist", "To return to school", "To abandon a plan permanently", 2],
  ["To get cold feet", "To become nervous and hesitate before an event", "To fall ill", "To feel cold", "To run away from a fight", 2],
  ["To have a chip on one's shoulder", "To hold a grudge or feel resentful", "To be injured", "To be proud of an achievement", "To carry a heavy load", 3],
  ["A wild goose chase", "A futile search", "A hunting trip", "An exciting adventure", "A sports race", 2],
  ["To be at sixes and sevens", "To be in confusion or disorder", "To be very rich", "To be in the right place", "To be late", 3],
  ["To take with a pinch of salt", "To regard with scepticism", "To accept wholeheartedly", "To season food", "To be very careful with money", 3],
  ["To read between the lines", "To understand the hidden meaning", "To read carefully", "To skip pages", "To read aloud", 2],
  ["To face the music", "To accept the consequences of one's actions", "To enjoy a concert", "To become a musician", "To avoid punishment", 2],
  ["To kill two birds with one stone", "To achieve two aims with a single action", "To hunt skilfully", "To be cruel", "To waste effort", 1],
  ["A red-letter day", "A memorable or important day", "A day of danger", "A holiday for postmen", "A day of mourning", 2],
  ["To smell a rat", "To suspect something is wrong", "To find a rat", "To be dirty", "To be hungry", 2],
  ["To show the white feather", "To show cowardice", "To surrender peacefully", "To show purity", "To show victory", 3],
  ["To be a wet blanket", "To be a person who spoils others' fun", "To be very sick", "To be extremely careful", "To be poor", 3],
  ["To leave no stone unturned", "To try every possible means", "To dig a field", "To be careless", "To destroy completely", 1],
  ["To put the cart before the horse", "To do things in the wrong order", "To travel slowly", "To overload", "To plan carefully", 2],
  ["To see eye to eye", "To agree fully", "To stare", "To argue", "To have good eyesight", 1],
  ["To be in the same boat", "To be in the same difficult situation", "To travel together", "To be friends", "To be rivals", 1],
  ["To fly off the handle", "To lose one's temper suddenly", "To travel by air", "To escape", "To break a tool", 2],
  ["To nip in the bud", "To stop something at an early stage", "To grow flowers", "To pinch someone", "To delay something", 2],
  ["To hang by a thread", "To be in a very precarious situation", "To be well supported", "To sew quickly", "To be executed", 2],
  ["To have an axe to grind", "To have a selfish or private motive", "To be a woodcutter", "To be angry", "To sharpen tools", 3],
  ["To sit on the fence", "To avoid taking sides", "To relax outdoors", "To guard property", "To be lazy", 2],
  ["A white elephant", "A possession that costs more to maintain than it is worth", "A rare animal", "A precious gift", "A peaceful person", 2],
  ["To blow one's own trumpet", "To boast about oneself", "To play music", "To complain loudly", "To announce news", 1],
  ["To be up in arms", "To be very angry and protesting", "To be armed for war", "To raise one's hands", "To be ready to help", 3],
  ["To take the bull by the horns", "To deal with a problem directly and courageously", "To be reckless", "To work on a farm", "To argue stubbornly", 2],
  ["To keep one's head above water", "To manage to survive, especially financially", "To swim well", "To be proud", "To avoid floods", 2],
  ["To cut corners", "To do something poorly to save time or money", "To take a shortcut while driving", "To trim edges neatly", "To reduce prices", 2],
  ["To rest on one's laurels", "To be satisfied with past success and stop trying", "To take a holiday", "To sleep on a bed of leaves", "To win again", 3],
  ["To get the sack", "To be dismissed from a job", "To receive a gift", "To be promoted", "To go shopping", 1],
  ["To be in the doldrums", "To be in a state of inactivity or low spirits", "To be at sea", "To be busy", "To be excited", 3],
  ["To eat humble pie", "To admit a mistake and apologise", "To eat simple food", "To be poor", "To refuse food", 3],
  ["To turn over a new leaf", "To change one's behaviour for the better", "To read a new book", "To start gardening", "To become rich", 1],
  ["To be in the limelight", "To be the centre of public attention", "To be in danger", "To be on stage lighting duty", "To be hidden", 2],
  ["Too many cooks spoil the broth", "Too many people managing a task can ruin it", "Cooking needs many helpers", "Food tastes better with more spices", "Large kitchens are wasteful", 2],
  ["To get into hot soup", "To get into trouble", "To fall ill", "To eat spicy food", "To become angry", 2],
];
IDIOMS.forEach(([idm, mean, x1, x2, x3, d], i) => {
  const stem = i % 2 === 0 ? `Choose the option that best expresses the meaning of the idiom: '${idm}'` : `What does the phrase '${idm}' mean?`;
  b.t("Idioms & Phrases").q(d, stem, [mean, x1, x2, x3], `'${idm}' means: ${mean.toLowerCase()}.`);
});

const OWS: Id[] = [
  ["A person who is present everywhere", "Omnipresent", "Omnipotent", "Omniscient", "Omnivorous", 1],
  ["A person who knows everything", "Omniscient", "Omnipresent", "Omnipotent", "Oracle", 1],
  ["Government by the people", "Democracy", "Autocracy", "Monarchy", "Oligarchy", 1],
  ["Rule by a few powerful people", "Oligarchy", "Democracy", "Anarchy", "Theocracy", 2],
  ["A person who cannot be corrected", "Incorrigible", "Invincible", "Infallible", "Incredible", 2],
  ["That which cannot be read", "Illegible", "Ineligible", "Inaudible", "Invisible", 1],
  ["A person who looks at the bright side of things", "Optimist", "Pessimist", "Realist", "Fatalist", 1],
  ["A speech made without preparation", "Extempore", "Rehearsed", "Monologue", "Soliloquy", 2],
  ["One who does not believe in the existence of God", "Atheist", "Theist", "Agnostic", "Pantheist", 1],
  ["A person who walks in sleep", "Somnambulist", "Insomniac", "Hypnotist", "Narcissist", 2],
  ["The study of ancient societies through material remains", "Archaeology", "Anthropology", "Etymology", "Entomology", 2],
  ["The study of insects", "Entomology", "Etymology", "Ornithology", "Ecology", 2],
  ["Killing of one's own father", "Patricide", "Matricide", "Fratricide", "Regicide", 2],
  ["A place where bees are kept", "Apiary", "Aviary", "Aquarium", "Granary", 2],
  ["A place where birds are kept", "Aviary", "Apiary", "Hangar", "Kennel", 1],
  ["One who is unable to pay debts", "Insolvent", "Solvent", "Guarantor", "Creditor", 2],
  ["A person who lends money at high interest", "Usurer", "Banker", "Debtor", "Auditor", 3],
  ["Fear of heights", "Acrophobia", "Claustrophobia", "Hydrophobia", "Xenophobia", 2],
  ["Fear of confined spaces", "Claustrophobia", "Agoraphobia", "Acrophobia", "Nyctophobia", 2],
  ["A person who hates mankind", "Misanthrope", "Philanthropist", "Misogynist", "Altruist", 3],
  ["A person who loves mankind and promotes their welfare", "Philanthropist", "Misanthrope", "Egoist", "Cynic", 1],
  ["Something that is no longer in use", "Obsolete", "Antique", "Ancient", "Novel", 1],
  ["A remedy for all diseases or problems", "Panacea", "Placebo", "Antidote", "Elixir of youth", 2],
  ["A list of items to be discussed at a meeting", "Agenda", "Minutes", "Memorandum", "Itinerary", 1],
  ["A written record of what is discussed at a meeting", "Minutes", "Agenda", "Manifesto", "Bulletin", 2],
  ["A detailed plan of a journey", "Itinerary", "Agenda", "Inventory", "Diary", 2],
  ["Payment made to a retired employee every month", "Pension", "Gratuity", "Bonus", "Stipend", 1],
  ["A sum paid to an employee on leaving after long service", "Gratuity", "Pension", "Royalty", "Commission", 2],
  ["Money paid regularly to a student or trainee", "Stipend", "Salary", "Wage", "Pension", 2],
  ["A person who is new to a profession", "Novice", "Veteran", "Expert", "Connoisseur", 1],
  ["A person with refined taste in art, food or drink", "Connoisseur", "Novice", "Amateur", "Critic", 3],
  ["Done willingly and without payment", "Voluntary", "Compulsory", "Mandatory", "Obligatory", 1],
  ["A word that is opposite in meaning", "Antonym", "Synonym", "Homonym", "Acronym", 1],
  ["A government ruled by religious leaders", "Theocracy", "Plutocracy", "Bureaucracy", "Meritocracy", 2],
  ["Government by the wealthy", "Plutocracy", "Theocracy", "Democracy", "Aristocracy", 3],
  ["The practice of employing relatives in positions of power", "Nepotism", "Communalism", "Patriotism", "Altruism", 3],
];
OWS.forEach(([def, w, x1, x2, x3, d]) => {
  b.t("One-word Substitution").q(d, `Choose the one word that can be substituted for: '${def}'`, [w, x1, x2, x3], `'${w}' means ${def.toLowerCase()}.`);
});

b.t("Fill in the Blanks");
b.q(1, "The committee has not yet ____ a decision on the proposal.", ["arrived at", "arrived on", "arrived in", "arrived to"], "We 'arrive at' a decision or conclusion.");
b.q(1, "She is fond ____ reading biographies.", ["of", "for", "with", "about"], "'Fond of' is the correct collocation.");
b.q(1, "The employees were asked to comply ____ the new safety rules.", ["with", "to", "by", "for"], "'Comply with' is the correct preposition.");
b.q(2, "Neither the manager nor the clerks ____ present at the meeting.", ["were", "was", "is", "has been"], "With 'neither…nor', the verb agrees with the nearer subject ('clerks' — plural).");
b.q(2, "If I ____ the notice earlier, I would have applied on time.", ["had seen", "saw", "have seen", "would see"], "Third conditional: if + past perfect, would have + past participle.");
b.q(2, "The new policy will ____ effect from the first of next month.", ["come into", "come in", "come at", "come on"], "'Come into effect' means to begin to apply.");
b.q(2, "He has been working in this office ____ 2015.", ["since", "for", "from", "by"], "'Since' is used with a point in time; 'for' with a period.");
b.q(2, "The inspector's report was ____ that no further action was needed.", ["so conclusive", "such conclusive", "too conclusive", "very conclusive"], "'So + adjective + that' expresses result.");
b.q(1, "Each of the workers ____ given a safety helmet.", ["was", "were", "are", "have been"], "'Each' takes a singular verb.");
b.q(2, "The union demanded that the management ____ the decision immediately.", ["withdraw", "withdraws", "withdrew", "will withdraw"], "The subjunctive form (base verb) is used after 'demand that'.");
b.q(2, "Hardly had he reached the station ____ the train left.", ["when", "than", "then", "that"], "'Hardly…when' and 'No sooner…than' are fixed pairs.");
b.q(2, "No sooner did the bell ring ____ the students rushed out.", ["than", "when", "then", "as"], "'No sooner…than' is the correct correlative.");
b.q(3, "The auditor insisted ____ seeing the original vouchers.", ["on", "for", "at", "to"], "'Insist on' + gerund.");
b.q(2, "The two departments have agreed to ____ their resources for the project.", ["pool", "pull", "poll", "pole"], "'Pool' means to combine.");
b.q(2, "The claim was rejected as it was not ____ by documents.", ["supported", "supporting", "support", "supports"], "Passive voice needs the past participle.");
b.q(3, "The minister's remarks were ____ to the issue under discussion; they did not address it at all.", ["irrelevant", "relevant", "pertinent", "germane"], "The second clause indicates the remarks were not related.");
b.q(2, "She prefers tea ____ coffee.", ["to", "than", "over than", "from"], "'Prefer A to B' is correct usage.");
b.q(3, "The new rules are ____ to reduce delays in claim settlement.", ["intended", "intending", "intend", "intention"], "'Are intended to' (passive) is correct.");
b.q(2, "He is one of those officers who ____ always punctual.", ["are", "is", "was", "has been"], "The relative pronoun 'who' refers to 'those officers' (plural).");
b.q(2, "The audit was conducted ____ the supervision of the regional office.", ["under", "below", "beneath", "over"], "'Under the supervision of' is the idiomatic phrase.");
b.q(3, "Had the employer deposited the dues on time, the workers ____ penalised.", ["would not have been", "will not be", "would not be", "had not been"], "Inverted third conditional.");
b.q(2, "The more you practise, ____ you become.", ["the more confident", "more confident", "the most confident", "most confident"], "The comparative correlative 'the more…the more'.");
b.q(2, "Neither of the two candidates ____ eligible for the post.", ["is", "are", "were", "have been"], "'Neither' as a pronoun takes a singular verb.");

b.q(2, "The officer was accused ____ negligence in handling the files.", ["of", "for", "with", "about"], "'Accused of' is the correct collocation.");
b.q(1, "The training session will begin ____ 10 a.m. sharp.", ["at", "on", "in", "by"], "'At' is used with clock times.");
b.q(3, "Scarcely had the inspection ended ____ the workers resumed production.", ["when", "than", "then", "that"], "'Scarcely…when' is the correct pair.");

export default b.items;
