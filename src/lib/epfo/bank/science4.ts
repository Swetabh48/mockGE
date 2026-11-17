import { Bank } from "./dsl";

/** Science & computers: earth & space, ecology, emerging tech, more computer applications, reasoning items. */
const b = new Bank("science4");

b.t("Earth & Space");
b.q(1, "The planet closest to the Sun is:", ["Mercury", "Venus", "Mars", "Earth"], "Venus is the hottest planet due to its thick CO₂ atmosphere.");
b.q(1, "The largest planet in the Solar System is:", ["Jupiter", "Saturn", "Neptune", "Earth"], "Saturn is known for its prominent rings.");
b.q(2, "Which planet is known as the 'Red Planet'?", ["Mars", "Venus", "Jupiter", "Mercury"], "Iron oxide on its surface gives the red colour.");
b.q(2, "A 'light year' is a unit of:", ["Distance", "Time", "Speed", "Brightness"], "It is the distance light travels in one year (~9.46 × 10¹² km).");
b.q(2, "A solar eclipse occurs when:", ["The Moon comes between the Sun and the Earth", "The Earth comes between the Sun and the Moon", "The Sun comes between the Earth and the Moon", "Mars blocks the Sun"], "A lunar eclipse occurs when the Earth is between the Sun and the Moon (on a full moon).");
b.q(2, "Tides in the oceans are caused mainly by:", ["The gravitational pull of the Moon (and Sun)", "Winds", "Earth's magnetic field", "Earthquakes"], "Spring tides occur at full and new moon.");
b.q(2, "The layer of the atmosphere closest to the Earth, where weather occurs, is the:", ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], "The ozone layer lies in the stratosphere.");
b.q(2, "Which layer of the atmosphere reflects radio waves back to Earth?", ["Ionosphere", "Troposphere", "Stratosphere", "Exosphere"], "It is part of the thermosphere.");
b.q(2, "The point on the Earth's surface directly above the origin of an earthquake is the:", ["Epicentre", "Focus (hypocentre)", "Fault line", "Crater"], "The Richter and moment magnitude scales measure earthquake magnitude.");
b.q(2, "India's first satellite, launched in 1975 by the Soviet Union, was:", ["Aryabhata", "Bhaskara", "Rohini", "INSAT-1A"], "It was named after the ancient astronomer.");
b.q(2, "India's first Mars mission, Mangalyaan, entered Mars orbit in:", ["September 2014", "November 2013", "July 2019", "August 2023"], "India became the first nation to reach Mars orbit on its maiden attempt.");
b.q(2, "ISRO's headquarters is located in:", ["Bengaluru", "Sriharikota", "Thiruvananthapuram", "Ahmedabad"], "Launches take place from the Satish Dhawan Space Centre, Sriharikota.");
b.q(2, "NavIC is India's:", ["Regional satellite navigation system", "Weather radar", "Space station", "Communication satellite for TV"], "It provides positioning services over India and surrounding regions.");
b.q(2, "A geostationary satellite orbits the Earth at an altitude of about:", ["36,000 km", "400 km", "3,600 km", "3,60,000 km"], "Its period equals one day, so it appears stationary over a point on the equator.");

b.t("Ecology & Environment");
b.q(1, "In a food chain, green plants are called:", ["Producers", "Primary consumers", "Decomposers", "Carnivores"], "They make food through photosynthesis.");
b.q(2, "Bacteria and fungi that break down dead organisms are called:", ["Decomposers", "Producers", "Herbivores", "Parasites"], "They recycle nutrients in the ecosystem.");
b.q(2, "'Biomagnification' refers to:", ["Increasing concentration of toxic substances at higher trophic levels", "Increase in biodiversity", "Growth of plants", "Use of magnifying glasses in biology"], "DDT and mercury biomagnify in food chains.");
b.q(2, "Excess nutrients in water bodies leading to algal blooms is called:", ["Eutrophication", "Biomagnification", "Desertification", "Acidification"], "It depletes dissolved oxygen and harms aquatic life.");
b.q(2, "Acid rain is mainly caused by emissions of:", ["Sulphur dioxide and nitrogen oxides", "Carbon monoxide", "Methane", "Ozone"], "It damages buildings (e.g., the Taj Mahal's 'marble cancer') and ecosystems.");
b.q(2, "The 'Montreal Protocol' is an international treaty to protect the:", ["Ozone layer", "Wetlands", "Migratory species", "Endangered species trade"], "The Ramsar Convention is for wetlands; CITES for trade in endangered species.");
b.q(2, "'Biodiversity hotspots' in India include:", ["The Himalaya, Western Ghats & Sri Lanka, Indo-Burma and Sundaland (Nicobar)", "Thar desert and Deccan plateau", "Indo-Gangetic plains", "Only the Andaman Islands"], "India has parts of four of the world's 36 hotspots.");
b.q(2, "'PM2.5' refers to:", ["Particulate matter with diameter of 2.5 micrometres or less", "Pollution measured at 2:50 p.m.", "Pressure of 2.5 atmospheres", "A type of pesticide"], "Fine particles penetrate deep into lungs.");

b.t("Emerging Technology");
b.q(2, "'Blockchain' technology is best described as:", ["A decentralised, tamper-resistant distributed ledger", "A type of computer virus", "A hardware chip", "A programming language"], "Cryptocurrencies such as Bitcoin use blockchain.");
b.q(2, "'Machine learning' is a branch of:", ["Artificial intelligence that enables systems to learn from data", "Mechanical engineering", "Hardware design", "Networking"], "Deep learning uses multi-layer neural networks.");
b.q(2, "A 'large language model' (LLM) is:", ["An AI model trained on vast text data to understand and generate language", "A dictionary", "A translation hardware", "A spell-checker only"], "Generative AI chatbots are built on LLMs.");
b.q(2, "5G mobile technology offers, compared with 4G:", ["Higher speeds and much lower latency", "Lower speeds but longer range", "Only voice calls", "No data services"], "5G services were launched in India in October 2022.");
b.q(2, "'Quantum computing' uses:", ["Qubits that can exist in superposition of states", "Only binary bits 0 and 1", "Vacuum tubes", "Punch cards"], "It can solve certain problems much faster than classical computers.");
b.q(2, "'Internet of Things' refers to:", ["Everyday devices connected to the internet to collect and exchange data", "A social media platform", "A search engine", "An email protocol"], "Smart meters and wearables are examples.");
b.q(2, "'Augmented reality' differs from 'virtual reality' in that AR:", ["Overlays digital information on the real world", "Creates a completely artificial environment", "Needs no device", "Is used only in cinemas"], "VR immerses users in a fully virtual environment.");
b.q(3, "A 'semiconductor' is a material whose electrical conductivity:", ["Lies between that of conductors and insulators and can be controlled by doping", "Is higher than copper", "Is zero", "Is the same as glass"], "Silicon and germanium are semiconductors used in chips.");

b.t("Computer Fundamentals");
b.q(2, "First-generation computers used:", ["Vacuum tubes", "Transistors", "Integrated circuits", "Microprocessors"], "Second: transistors; third: ICs; fourth: microprocessors (VLSI).");
b.q(2, "'Charles Babbage' is known as the:", ["Father of the computer", "Inventor of the internet", "Founder of Microsoft", "Inventor of the transistor"], "He designed the Analytical Engine.");
b.q(2, "Which of the following is NOT an operating system?", ["Oracle", "Windows", "Linux", "Android"], "Oracle is a database management system (and a company).");
b.q(2, "A 'database management system' (DBMS) is used to:", ["Store, retrieve and manage data efficiently", "Edit photos", "Browse the web", "Play music"], "MySQL, Oracle and PostgreSQL are examples.");
b.q(2, "In a relational database, a column that uniquely identifies each row is the:", ["Primary key", "Foreign key", "Index only", "Attribute"], "A foreign key links to the primary key of another table.");
b.q(2, "'Spreadsheet' software is mainly used for:", ["Calculations, data analysis and charts in rows and columns", "Writing letters", "Making presentations", "Editing videos"], "MS Excel and Google Sheets are examples.");
b.q(2, "Which of the following is a programming language?", ["Python", "HTML viewer", "Windows", "Chrome"], "HTML is a markup language rather than a general-purpose programming language.");
b.q(2, "'Open-source software' is software whose:", ["Source code is freely available to use, modify and distribute", "Price is always high", "Code is secret", "Use is restricted to governments"], "Examples include Linux, LibreOffice and Firefox.");
b.q(2, "A 'pixel' is:", ["The smallest unit of a digital image", "A type of printer", "A unit of storage", "A virus"], "Screen resolution is expressed in pixels (e.g., 1920 × 1080).");
b.q(2, "Which storage device has no moving parts?", ["Solid State Drive", "Hard Disk Drive", "Floppy disk drive", "Optical CD drive"], "SSDs use flash memory and are faster than HDDs.");
b.q(2, "'Defragmentation' of a hard disk:", ["Rearranges fragmented files to improve access speed", "Deletes all files", "Removes viruses", "Increases RAM"], "It is unnecessary for SSDs.");
b.q(2, "A computer 'virus' is:", ["A malicious program that attaches to files and spreads", "A hardware defect", "A biological virus", "An operating system"], "Antivirus software detects and removes malware.");
b.q(3, "In computing, 'latency' refers to:", ["The delay before data transfer begins following an instruction", "The total storage capacity", "Screen brightness", "Battery life"], "Low latency is important for gaming and video calls.");
b.q(2, "'Bandwidth' in networking refers to:", ["The maximum data transfer rate of a connection", "The width of a cable", "The number of users", "The size of a website"], "It is measured in bits per second (bps, Mbps, Gbps).");
b.q(2, "Aadhaar authentication and UPI are examples of India's:", ["Digital public infrastructure", "Private social networks", "Foreign software", "Hardware standards"], "India Stack is a set of such digital public goods.");

b.t("Statements & Reasoning");
b.st(2, "Consider the following statements:", ["RAM is volatile memory.", "ROM retains data without power."], [1, 2], "Both are correct.");
b.st(2, "Consider the following statements:", ["Viruses can be treated with antibiotics.", "Vaccines can prevent some viral diseases."], [2], "Antibiotics act on bacteria, not viruses.");
b.st(3, "Consider the following statements about the ozone layer:", ["It is found mainly in the stratosphere.", "Chlorofluorocarbons deplete it.", "It absorbs most of the Sun's infrared radiation."], [1, 2], "Ozone absorbs ultraviolet radiation, not most infrared.");
b.st(2, "Consider the following statements:", ["Sound travels faster in solids than in air.", "Light needs a medium to travel."], [1], "Light can travel through vacuum.");
b.hm(3, "Consider the following pairs:", ["Insulin — Pancreas", "Thyroxine — Thyroid", "Adrenaline — Adrenal gland", "Growth hormone — Pituitary"], 4, "All four pairs are correctly matched.", "How many of the above pairs are correctly matched?");
b.hm(2, "Consider the following:", ["Keyboard", "Scanner", "Plotter", "Microphone"], 3, "Keyboard, scanner and microphone are input devices; a plotter is an output device.", "How many of the above are input devices?");
b.ar(2, "We see lightning before we hear thunder.", "Light travels much faster than sound.", "a", "R explains A.");
b.ar(2, "A balloon filled with helium rises in air.", "Helium is lighter (less dense) than air.", "a", "The buoyant force exceeds the weight.");
b.ar(3, "Pressure cookers cook food faster.", "Increased pressure raises the boiling point of water.", "a", "Higher boiling point means higher cooking temperature.");
b.ar(3, "Copper wires are used in household electrical wiring.", "Copper has very low electrical resistivity and is ductile.", "a", "R explains why copper is chosen.");
b.ar(2, "Cloud storage allows access to files from any device with internet.", "Cloud storage saves files only on the local hard disk.", "c", "R is false — cloud storage keeps files on remote servers.");

export default b.items;
