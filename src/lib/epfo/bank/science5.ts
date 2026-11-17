import { Bank } from "./dsl";

/** Science & computers: everyday science, health, plants, more computing — harder mix. */
const b = new Bank("science5");

b.t("Everyday Science");
b.q(2, "Why do we see a mirage in deserts on hot days?", ["Total internal reflection of light due to hot, less dense air near the ground", "Reflection from sand particles", "Water vapour in the air", "Diffraction by dust"], "Layers of air with different refractive indices bend light.");
b.q(2, "Stars twinkle because of:", ["Atmospheric refraction of starlight", "Rotation of stars", "Reflection by the Moon", "Their own flickering"], "Planets, being closer and appearing as discs, twinkle less.");
b.q(2, "A person standing in a lift that accelerates upward feels:", ["Heavier than usual", "Lighter than usual", "Weightless", "No change at all"], "Apparent weight = m(g + a) when accelerating upward.");
b.q(2, "Why are electric transmission wires allowed to sag?", ["To allow for contraction in winter", "To reduce cost", "To increase current", "For birds to sit"], "Metals contract in cold weather.");
b.q(2, "Which property of a pressure cooker gasket, combined with a weighted valve, helps it work?", ["It makes the vessel airtight so pressure builds up", "It conducts heat", "It reduces boiling point", "It absorbs steam"], "Raised pressure increases the boiling point of water.");
b.q(2, "Cooking takes longer at high altitudes because:", ["Water boils at a lower temperature due to lower air pressure", "Oxygen is less", "Gravity is weaker", "Fuel burns faster"], "Food cooks at a lower temperature.");
b.q(2, "Soap removes oily dirt because soap molecules:", ["Have a water-loving head and an oil-loving tail that form micelles", "Dissolve dirt chemically into gas", "Are acids", "Kill all germs"], "Micelles trap oil and are washed away.");
b.q(2, "A fire extinguisher using CO₂ puts out fire mainly by:", ["Cutting off the supply of oxygen", "Lowering the boiling point", "Adding fuel", "Producing hydrogen"], "Water should not be used on electrical or oil fires.");
b.q(2, "The 'expiry date' on medicines matters because after it:", ["The drug's potency and safety are not assured", "It always becomes poisonous", "It turns into another drug", "It becomes illegal to own"], "Stability is guaranteed only up to the expiry date.");
b.q(2, "Why does a spoon in hot tea become hot?", ["Conduction of heat through the metal", "Convection", "Radiation only", "Evaporation"], "Metals are good conductors.");
b.q(2, "LED bulbs are more energy-efficient than incandescent bulbs because they:", ["Convert more electricity into light rather than heat", "Use higher voltage", "Contain a tungsten filament", "Use mercury vapour"], "BEE star labels indicate energy efficiency.");
b.q(3, "An object appears black when it:", ["Absorbs all wavelengths of visible light", "Reflects all wavelengths", "Emits black light", "Transmits light"], "A white object reflects all wavelengths.");
b.q(2, "A solar water heater's panels are usually painted black because black surfaces:", ["Absorb more heat radiation", "Reflect heat", "Are cheaper", "Prevent rusting"], "Good absorbers are also good emitters.");

b.t("Health & Nutrition");
b.q(1, "Which nutrient is the main source of energy for the body?", ["Carbohydrates", "Vitamins", "Minerals", "Water"], "Fats give more energy per gram (about 9 kcal vs 4 kcal).");
b.q(2, "Proteins are made up of:", ["Amino acids", "Fatty acids", "Glucose units", "Nucleotides"], "Nucleotides form nucleic acids; glucose units form starch.");
b.q(2, "Which mineral is essential for the formation of haemoglobin?", ["Iron", "Calcium", "Sodium", "Iodine"], "Iron deficiency causes anaemia.");
b.q(2, "Body Mass Index (BMI) is calculated as:", ["Weight (kg) ÷ height² (m²)", "Height ÷ weight", "Weight × height", "Waist ÷ hip"], "A BMI of 18.5–24.9 is generally considered normal.");
b.q(2, "Which disease is caused by the deficiency of iodine in the diet and was tackled through iodised salt?", ["Goitre", "Scurvy", "Rickets", "Pellagra"], "The National Iodine Deficiency Disorders Control Programme promotes iodised salt.");
b.q(2, "Type 1 diabetes is mainly due to:", ["Lack of insulin production by the pancreas", "Excess insulin", "Lack of vitamin C", "Bacterial infection"], "Type 2 diabetes involves insulin resistance.");
b.q(2, "Which organ is primarily affected by hepatitis?", ["Liver", "Kidney", "Lungs", "Heart"], "Hepatitis B and C can cause chronic liver disease.");
b.q(2, "'Antimicrobial resistance' arises mainly due to:", ["Overuse and misuse of antibiotics", "Too much vitamin intake", "Excess exercise", "Use of vaccines"], "Completing prescribed courses and avoiding self-medication help.");
b.q(2, "Which of the following is a non-communicable disease?", ["Hypertension", "Tuberculosis", "Measles", "Malaria"], "NCDs are not transmitted between people.");
b.q(3, "The 'BCG' vaccine is given to protect against:", ["Tuberculosis", "Polio", "Tetanus", "Hepatitis B"], "It is given at birth in India.");

b.t("Plant Science & Agriculture");
b.q(2, "Plants absorb water mainly through:", ["Root hairs", "Leaves", "Flowers", "Bark"], "Water moves up through xylem; food moves through phloem.");
b.q(2, "Loss of water as vapour from the aerial parts of plants is called:", ["Transpiration", "Respiration", "Photosynthesis", "Guttation only"], "It occurs mostly through stomata.");
b.q(2, "Leguminous plants enrich soil with nitrogen because their root nodules contain:", ["Rhizobium bacteria", "Fungi", "Algae", "Viruses"], "Rhizobium fixes atmospheric nitrogen.");
b.q(2, "Which of the following is a biofertiliser?", ["Azotobacter", "Urea", "DAP", "Potash"], "Azotobacter, Rhizobium and blue-green algae fix nitrogen.");
b.q(2, "The 'Golden rice' is genetically modified to be rich in:", ["Vitamin A precursor (beta-carotene)", "Iron", "Protein", "Vitamin C"], "It addresses vitamin A deficiency.");
b.q(2, "Bt cotton is genetically modified to resist:", ["Bollworm pests", "Drought", "Floods", "Fungal diseases"], "A gene from Bacillus thuringiensis produces an insecticidal protein.");
b.q(3, "Which plant hormone promotes fruit ripening?", ["Ethylene", "Auxin", "Gibberellin", "Cytokinin"], "Auxins promote cell elongation; gibberellins promote stem growth.");
b.q(2, "Hydroponics is the technique of growing plants:", ["Without soil, in nutrient-rich water solutions", "Only in deserts", "Under the sea", "Using only sunlight"], "It is used in controlled-environment agriculture.");

b.t("Computer Applications");
b.q(2, "Which of the following is an example of an application software?", ["MS Word", "Windows 11", "BIOS", "Device driver"], "Operating systems, drivers and firmware are system software.");
b.q(2, "In a computer, the 'motherboard' is:", ["The main circuit board connecting the CPU, memory and other components", "The monitor", "The keyboard", "The power cable"], "It houses slots and connectors for all major components.");
b.q(2, "Which of the following file extensions indicates a compressed archive?", [".zip", ".docx", ".jpg", ".exe"], ".jpg is an image format and .exe an executable.");
b.q(2, "'Phishing' emails can often be identified by:", ["Urgent requests to click links or share passwords from unfamiliar or spoofed senders", "Messages from known colleagues about meetings", "Newsletters you subscribed to", "Calendar invites from HR on official domains"], "Always verify the sender's domain and never share credentials.");
b.q(2, "Which keyboard shortcut is used to select all content in most applications?", ["Ctrl + A", "Ctrl + S", "Ctrl + E", "Ctrl + L"], "Ctrl + E and Ctrl + L align text in MS Word.");
b.q(2, "In MS Word, the feature that automatically corrects common spelling mistakes as you type is:", ["AutoCorrect", "Mail Merge", "Track Changes", "Macros"], "Mail Merge creates personalised letters from a data source.");
b.q(2, "'Mail Merge' in MS Word is used to:", ["Create personalised letters or labels for many recipients from a data list", "Send email directly from Word only", "Merge two documents permanently", "Encrypt documents"], "It combines a main document with a data source such as an Excel sheet.");
b.q(2, "In MS Excel, a chart type best suited to show parts of a whole is:", ["Pie chart", "Line chart", "Scatter chart", "Histogram"], "Line charts show trends over time.");
b.q(3, "The Excel formula =IF(B2>=40,\"Pass\",\"Fail\") returns 'Pass' when B2 contains:", ["40", "39", "35", "0"], "The condition B2 ≥ 40 is true for 40.");
b.q(2, "'Track Changes' in MS Word is useful for:", ["Recording edits so reviewers can accept or reject them", "Tracking the location of the file", "Counting words", "Changing fonts"], "It supports collaborative editing.");
b.q(2, "A 'URL' such as https://www.epfindia.gov.in has 'epfindia.gov.in' as its:", ["Domain name", "Protocol", "Path", "Port"], "'https' is the protocol.");
b.q(2, "'Spam' refers to:", ["Unsolicited bulk messages", "Encrypted mail", "Official circulars", "Deleted emails"], "Spam filters reduce it.");
b.q(2, "'Captcha' tests are used on websites to:", ["Distinguish human users from automated bots", "Increase page speed", "Store passwords", "Translate text"], "They prevent automated abuse.");
b.q(3, "Which of the following is the correct sequence of the 'Instruction cycle' in a CPU?", ["Fetch → Decode → Execute", "Decode → Fetch → Execute", "Execute → Fetch → Decode", "Fetch → Execute → Decode"], "The control unit fetches an instruction, decodes it and the ALU executes it.");
b.q(2, "'Virtual memory' allows a computer to:", ["Use part of the storage drive as an extension of RAM", "Increase the screen size", "Use the internet as RAM", "Avoid using RAM"], "It is slower than physical RAM.");
b.q(2, "'Encryption' converts data into:", ["A coded form that only authorised parties can read", "A compressed file only", "Plain text", "An image"], "Decryption reverses the process with a key.");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements:", ["Xylem carries water from roots to leaves.", "Phloem carries food prepared in leaves to other parts."], [1, 2], "Both are correct.");
b.st(3, "Consider the following statements about vitamins:", ["Vitamins A, D, E and K are fat-soluble.", "Vitamin C is stored in large amounts in the body.", "Vitamin B12 is found mainly in animal foods."], [1, 3], "Water-soluble vitamins like C are not stored in large amounts and need regular intake.");
b.ar(2, "Diabetics are advised to limit sugar intake.", "Their bodies cannot regulate blood glucose effectively due to lack of or resistance to insulin.", "a", "R explains A.");
b.ar(3, "Ice skating is possible because a thin layer of water forms under the blade.", "Pressure and friction lower the melting point / generate heat to melt the surface ice.", "a", "Pressure melting and frictional heating create a lubricating layer.");
b.hm(2, "Consider the following devices:", ["Router", "Switch", "Modem", "Printer"], 3, "Router, switch and modem are networking devices; a printer is an output peripheral.", "How many of the above are networking devices?");

b.q(1, "Which gas do plants release during photosynthesis?", ["Oxygen", "Carbon dioxide", "Nitrogen", "Methane"], "Plants take in CO₂ and release O₂ in the presence of sunlight.");
b.q(2, "Which part of the human eye controls the amount of light entering it?", ["Iris (adjusting the pupil)", "Retina", "Cornea", "Optic nerve"], "The retina contains rods and cones that sense light.");
b.q(2, "The device used to convert AC into DC is a:", ["Rectifier", "Transformer", "Inverter", "Generator"], "An inverter converts DC into AC.");
b.q(2, "Which of these is a renewable source of energy?", ["Wind", "Coal", "Natural gas", "Petroleum"], "Solar, wind, hydro and biomass are renewable.");

export default b.items;
