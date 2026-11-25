import { Bank } from "../bank/dsl";

/** 2025-pattern Computers, IT and emerging technology — application and reasoning items. */
const b = new Bank("science25b");

b.t("Computer Hardware & Memory");
b.st(3, "Consider the following about solid-state drives (SSDs):", [
  "They store data in NAND flash memory and have no moving parts.",
  "They usually give much faster random access than hard disk drives.",
  "Each SSD cell can be rewritten an unlimited number of times.",
], [1, 2], "Flash cells wear out after a finite number of program/erase cycles; controllers spread writes to extend life.");
b.st(3, "Consider the following about computer memory:", [
  "RAM is volatile and loses its contents when power is switched off.",
  "Cache memory sits between the CPU and main memory to reduce access time.",
  "Virtual memory uses part of the storage drive as an extension of RAM.",
], [1, 2, 3], "All three are correct.");
b.q(3, "Arrange the following in decreasing order of access speed: (1) CPU registers (2) Main memory (RAM) (3) Cache (4) Hard disk drive", ["1, 3, 2, 4", "3, 1, 2, 4", "1, 2, 3, 4", "2, 1, 3, 4"], "Registers are fastest, then cache, then RAM, then disk.");
b.ar(3, "GPUs are widely used to train artificial intelligence models.", "A GPU has thousands of simpler cores that perform many calculations in parallel, suited to matrix operations.", "a", "Neural-network training is dominated by large matrix multiplications.");
b.st(3, "Consider the following about the CPU:", [
  "The control unit directs the operation of the processor.",
  "The arithmetic logic unit carries out arithmetic and logical operations.",
  "The clock speed alone fully determines a processor's performance.",
], [1, 2], "Performance also depends on cores, cache, architecture and instructions per cycle.");
b.st(3, "Consider the following about storage units:", [
  "One kibibyte (KiB) equals 1,024 bytes.",
  "One byte has 8 bits.",
  "A nibble has 8 bits.",
], [1, 2], "A nibble has 4 bits.");
b.q(3, "What is the binary equivalent of the decimal number 45?", ["101101", "110101", "101011", "100111"], "45 = 32 + 8 + 4 + 1 → 101101.");
b.q(3, "The hexadecimal number 2F equals which decimal number?", ["47", "35", "45", "63"], "2 × 16 + 15 = 47.");
b.q(3, "A 4-bit register stores numbers in two's complement form. What is the range of values it can hold?", ["−8 to +7", "−7 to +7", "0 to 15", "−8 to +8"], "n bits in two's complement hold −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1.");
b.st(3, "Consider the following about logic gates:", [
  "NAND and NOR are called universal gates.",
  "An XOR gate gives output 1 when its two inputs differ.",
  "An AND gate gives output 1 if any one input is 1.",
], [1, 2], "AND gives 1 only when all inputs are 1; that description fits OR.");
b.q(3, "A circuit outputs 0 only when both inputs are 1, and 1 otherwise. Which gate is it?", ["NAND", "NOR", "XOR", "AND"], "That is the NAND truth table.");

b.t("Software & Systems");
b.st(3, "Consider the following about language translators:", [
  "A compiler translates the whole program before it is run.",
  "An interpreter translates and executes a program line by line.",
  "An assembler translates high-level language into machine code.",
], [1, 2], "An assembler translates assembly language.");
b.st(3, "Consider the following about operating systems:", [
  "They manage memory, processes, files and devices.",
  "Android is based on the Linux kernel.",
  "An operating system is an example of application software.",
], [1, 2], "The OS is system software.");
b.ar(3, "Deadlock can occur when processes hold some resources and wait for others.", "In a deadlock each process waits for a resource held by another in a circular chain.", "a", "Mutual exclusion, hold-and-wait, no pre-emption and circular wait are the four conditions.");
b.st(3, "Consider the following about databases:", [
  "A primary key must be unique and cannot be null.",
  "A foreign key links a table to the primary key of another table.",
  "SELECT is a Data Definition Language (DDL) command.",
], [1, 2], "SELECT is a query (DML/DQL) command; CREATE, ALTER and DROP are DDL.");
b.mt(3, "Match the SQL command with its category:", [["CREATE", "Data Definition Language"], ["INSERT", "Data Manipulation Language"], ["GRANT", "Data Control Language"], ["COMMIT", "Transaction Control Language"]], "SQL commands are grouped by what they act on.", "Command", "Category");
b.st(3, "Consider the following about open-source software:", [
  "Its source code is available for anyone to study and modify, subject to its licence.",
  "Open-source software must always be free of cost.",
  "Linux and LibreOffice are examples of open-source software.",
], [1, 3], "'Free' in open source refers to freedom; some open-source software is sold with support.");

b.t("Spreadsheets & Office Tools");
b.q(3, "In a spreadsheet, cell B2 contains the formula =A2*$C$1. It is copied to B5. What will the formula in B5 be?", ["=A5*$C$1", "=A5*$C$4", "=A2*$C$1", "=B5*$C$1"], "A2 is relative and shifts down three rows; $C$1 is absolute and does not change.");
b.q(3, "Cells A1 to A5 contain 4, 8, blank, 6 and 'NA' (text). What does =AVERAGE(A1:A5) return?", ["6", "3.6", "4.5", "An error"], "AVERAGE ignores blank and text cells: (4 + 8 + 6) / 3 = 6.");
b.q(3, "Cells A1 to A4 contain 10, 20, 30 and 40. What does =COUNTIF(A1:A4, \">20\") return?", ["2", "3", "70", "1"], "Only 30 and 40 are greater than 20.");
b.q(3, "If cell A1 contains 75, what does =IF(A1>=60, \"Pass\", \"Fail\") return?", ["Pass", "Fail", "TRUE", "75"], "The condition is true, so the second argument is returned.");
b.st(3, "Consider the following about spreadsheet functions:", [
  "VLOOKUP searches for a value in the first column of a range and returns a value from another column of the same row.",
  "In a cell reference such as $A1, the column stays fixed when the formula is copied.",
  "=SUM(A1:A3) adds only cells A1 and A3.",
], [1, 2], "A1:A3 is a range covering A1, A2 and A3.");
b.mt(3, "Match the keyboard shortcut with its common action in office software:", [["Ctrl + Z", "Undo"], ["Ctrl + Y", "Redo"], ["Ctrl + P", "Print"], ["Ctrl + F", "Find"]], "Standard shortcuts in most office applications.", "Shortcut", "Action");

b.t("Networks & Internet");
b.st(3, "Consider the following about IP addressing:", [
  "An IPv4 address is 32 bits long.",
  "An IPv6 address is 128 bits long.",
  "IPv6 was introduced because the IPv4 address space was running out.",
], [1, 2, 3], "IPv6 allows about 3.4 × 10³⁸ addresses.");
b.ar(3, "Typing a website's name in a browser leads to the correct server.", "The Domain Name System translates domain names into IP addresses.", "a", "DNS is the 'phone book' of the internet.");
b.st(3, "Consider the following about HTTPS:", [
  "It encrypts data between the browser and the website using TLS.",
  "It guarantees that the website itself is honest and safe to use.",
  "Its default port is 443.",
], [1, 3], "HTTPS secures the connection, not the intentions of the site owner; phishing sites can use HTTPS too.");
b.mt(3, "Match the network device with its main function:", [["Router", "Forwards packets between different networks"], ["Switch", "Connects devices within a local network using MAC addresses"], ["Modem", "Converts digital signals for transmission over a line and back"], ["Firewall", "Filters traffic according to security rules"]], "Each device works at a different layer of networking.", "Device", "Function");
b.st(3, "Consider the following about 5G mobile networks:", [
  "Millimetre-wave bands offer very high speeds but a short range.",
  "Network slicing lets operators run several virtual networks on the same physical infrastructure.",
  "5G cannot work in sub-6 GHz frequency bands.",
], [1, 2], "Much of 5G, including in India, uses mid-band (e.g., 3.3–3.6 GHz) spectrum.");
b.st(3, "Consider the following about the Internet of Things (IoT):", [
  "It connects everyday devices with sensors to the internet.",
  "Edge computing processes some data close to the device instead of in a distant cloud.",
  "IoT devices cannot be targets of cyber-attacks.",
], [1, 2], "Weakly secured IoT devices are often hijacked into botnets.");
b.mt(3, "Match the cloud service model with an example:", [["Infrastructure as a Service", "Renting virtual machines and storage"], ["Platform as a Service", "A managed environment to build and deploy applications"], ["Software as a Service", "Web-based e-mail used through a browser"], ["Function as a Service", "Code that runs only when triggered by an event"]], "Each model hands a different share of the stack to the provider.", "Model", "Example");

b.t("Cyber Security");
b.mt(3, "Match the cyber-attack with its description:", [["Phishing", "Fake messages that trick users into giving credentials"], ["Ransomware", "Malware that encrypts files and demands payment"], ["DDoS attack", "Flooding a server with traffic from many sources"], ["SQL injection", "Malicious input that alters database queries"]], "Common attacks and how they work.", "Attack", "Description");
b.st(3, "Consider the following about malware:", [
  "A worm can spread across networks without attaching itself to a host file.",
  "A Trojan horse disguises itself as useful software.",
  "A virus spreads on its own without any host program.",
], [1, 2], "A virus attaches itself to a host file or program; self-spreading malware is a worm.");
b.st(3, "Consider the following about encryption:", [
  "Symmetric encryption uses the same key to encrypt and decrypt.",
  "In public-key encryption, data encrypted with a public key is decrypted with the matching private key.",
  "Hashing is a reversible form of encryption.",
], [1, 2], "A cryptographic hash is one-way; it cannot be decrypted.");
b.ar(3, "Two-factor authentication makes accounts harder to hijack.", "An attacker who steals the password still needs a second factor such as an OTP or a device.", "a", "R explains A.");
b.st(3, "Consider the following about cyber-security institutions in India:", [
  "CERT-In is the national agency for responding to cyber security incidents.",
  "CERT-In directions of 2022 require reporting of specified incidents within six hours.",
  "The Indian Cyber Crime Coordination Centre (I4C) works under the Ministry of Home Affairs.",
], [1, 2, 3], "The national cybercrime helpline is 1930.");
b.st(3, "Consider the following about the Information Technology Act, 2000:", [
  "Section 66A was struck down by the Supreme Court in Shreya Singhal v. Union of India (2015).",
  "Section 69A empowers the Government to block public access to online information.",
  "The Act does not recognise electronic signatures.",
], [1, 2], "The Act gives legal recognition to electronic records and electronic signatures.");
b.ar(3, "A 'digital arrest' call is a fraud.", "No law enforcement agency in India arrests people over video calls.", "a", "Fraudsters pose as officials to extort money.");
b.q(3, "An employee receives an e-mail that looks like it is from the bank, asking them to 'verify' their account by clicking a link. What is the safest response?", ["Do not click; contact the bank through its official website or number", "Click the link but enter only the user name", "Reply to the e-mail asking if it is genuine", "Forward it to colleagues to check"], "Verify through an independent official channel; replies go to the attacker.");

b.t("Emerging Technology");
b.st(3, "Consider the following about large language models (LLMs):", [
  "They are trained on large amounts of text to predict the next token in a sequence.",
  "Most modern LLMs are based on the transformer architecture.",
  "They always give factually correct answers because they look up a verified database.",
], [1, 2], "LLMs can produce confident but false statements ('hallucinations').");
b.mt(3, "Match the type of machine learning with an example:", [["Supervised learning", "Predicting loan default from labelled past records"], ["Unsupervised learning", "Grouping customers by buying patterns"], ["Reinforcement learning", "A program learning a game through rewards"], ["Transfer learning", "Adapting a pre-trained model to a new task"]], "Each approach learns from data differently.", "Type", "Example");
b.st(3, "Consider the following about generative AI and deepfakes:", [
  "Deepfakes are synthetic media that can imitate a real person's face or voice.",
  "Watermarking and labelling of AI-generated content are among the measures proposed to deal with them.",
  "Deepfakes can be produced only with voice, not video.",
], [1, 2], "Video, audio and images can all be synthesised.");
b.st(3, "Consider the following about blockchain:", [
  "It is a distributed ledger shared across many nodes.",
  "Altering a past block requires changing every later block, which makes records tamper-evident.",
  "Blockchain can be used only for cryptocurrencies.",
], [1, 2], "It is also used for supply chains, land records and certificates.");
b.st(3, "Consider the following about quantum computing:", [
  "A qubit can exist in a superposition of 0 and 1.",
  "Entanglement links qubits so that their states are correlated.",
  "Large quantum computers could break widely used public-key schemes such as RSA.",
], [1, 2, 3], "This is why post-quantum cryptography is being standardised.");
b.st(3, "Consider the following about India's digital public infrastructure:", [
  "UPI allows instant transfers between bank accounts using a virtual payment address.",
  "DigiLocker documents are legally valid like the originals under the IT rules.",
  "Aadhaar Enabled Payment System lets users transact using Aadhaar and biometric authentication.",
], [1, 2, 3], "All three are correct.");
b.ar(3, "Edge computing is useful for self-driving vehicles.", "Decisions must be taken within milliseconds, without waiting for a distant data centre.", "a", "Local processing cuts latency.");
b.st(3, "Consider the following about drones in India:", [
  "The Drone Rules, 2021 simplified the approval process for drones.",
  "India's airspace is divided into green, yellow and red zones for drone operation.",
  "Drones of all sizes need a remote pilot certificate.",
], [1, 2], "Nano drones and drones for non-commercial use up to a certain weight are exempt.");

b.t("Health Technology & Biotechnology");
b.st(3, "Consider the following about CRISPR-Cas9:", [
  "It uses a guide RNA to direct the Cas9 enzyme to a specific DNA sequence.",
  "It can be used to cut and edit genes.",
  "It was developed from a defence system found in bacteria.",
], [1, 2, 3], "Bacteria use CRISPR to recognise and cut viral DNA.");
b.st(3, "Consider the following about stem cells:", [
  "They can divide and develop into specialised cell types.",
  "Umbilical cord blood is a source of blood-forming stem cells.",
  "Adult bodies contain no stem cells.",
], [1, 2], "Adults have stem cells, e.g., in bone marrow.");
b.st(3, "Consider the following about antimicrobial resistance (AMR):", [
  "Misuse and overuse of antibiotics speed up the development of resistance.",
  "Resistant bacteria can spread between humans, animals and the environment.",
  "AMR is a problem only in hospitals.",
], [1, 2], "Community spread and farm use of antibiotics also matter; this is the 'One Health' view.");
b.ar(3, "MRI scans do not expose patients to ionising radiation.", "MRI uses strong magnetic fields and radio waves to image the body.", "a", "X-rays and CT scans use ionising radiation.");
b.mt(3, "Match the medical device or test with its principle:", [["MRI", "Nuclear magnetic resonance of hydrogen nuclei"], ["CT scan", "Multiple X-ray images combined by computer"], ["Ultrasonography", "Echoes of high-frequency sound waves"], ["Pulse oximeter", "Absorption of red and infrared light by haemoglobin"]], "Diagnostic tools based on physics.", "Device", "Principle");

export default b.items;
