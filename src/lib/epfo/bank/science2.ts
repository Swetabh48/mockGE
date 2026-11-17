import { Bank } from "./dsl";

/** Computer applications: abbreviations (table) and core concepts. */
const b = new Bank("science2");

type Ab = [string, string, 1 | 2 | 3];
const ABBR: Ab[] = [
  ["CPU", "Central Processing Unit", 1],
  ["RAM", "Random Access Memory", 1],
  ["ROM", "Read Only Memory", 1],
  ["USB", "Universal Serial Bus", 1],
  ["URL", "Uniform Resource Locator", 1],
  ["HTTP", "HyperText Transfer Protocol", 1],
  ["HTML", "HyperText Markup Language", 1],
  ["IP (address)", "Internet Protocol", 1],
  ["LAN", "Local Area Network", 1],
  ["WAN", "Wide Area Network", 2],
  ["DNS", "Domain Name System", 2],
  ["SMTP", "Simple Mail Transfer Protocol", 2],
  ["FTP", "File Transfer Protocol", 2],
  ["PDF", "Portable Document Format", 1],
  ["GUI", "Graphical User Interface", 2],
  ["BIOS", "Basic Input/Output System", 2],
  ["ALU", "Arithmetic Logic Unit", 2],
  ["SSD", "Solid State Drive", 2],
  ["OCR", "Optical Character Recognition", 2],
  ["MICR", "Magnetic Ink Character Recognition", 2],
  ["VPN", "Virtual Private Network", 2],
  ["ISP", "Internet Service Provider", 2],
  ["IoT", "Internet of Things", 1],
  ["AI", "Artificial Intelligence", 1],
  ["SQL", "Structured Query Language", 2],
  ["CAPTCHA", "Completely Automated Public Turing test to tell Computers and Humans Apart", 3],
  ["MAC (address)", "Media Access Control", 3],
  ["DHCP", "Dynamic Host Configuration Protocol", 3],
  ["TCP", "Transmission Control Protocol", 2],
  ["OTP", "One-Time Password", 1],
  ["ASCII", "American Standard Code for Information Interchange", 2],
  ["GPU", "Graphics Processing Unit", 2],
  ["SaaS", "Software as a Service", 3],
  ["UPS", "Uninterruptible Power Supply", 1],
];
ABBR.forEach(([ab, full, d], i) => {
  b.t("Computer Abbreviations");
  if (i % 2 === 0) b.pool(d, `In computing, '${ab}' stands for:`, full, ABBR.map((x) => x[1]), `${ab} = ${full}.`);
  else b.pool(d, `Which abbreviation stands for '${full}'?`, ab, ABBR.map((x) => x[0]), `${full} is abbreviated as ${ab}.`);
});

b.t("Computer Fundamentals");
b.q(1, "Which of the following is volatile memory?", ["RAM", "ROM", "Hard disk", "Flash drive"], "RAM loses its contents when power is switched off.");
b.q(1, "The 'brain' of a computer is the:", ["CPU", "Monitor", "Keyboard", "Mouse"], "The CPU executes instructions; it contains the ALU, control unit and registers.");
b.q(1, "One byte consists of:", ["8 bits", "4 bits", "16 bits", "1,024 bits"], "A nibble is 4 bits.");
b.q(2, "1 kilobyte (in binary convention) is equal to:", ["1,024 bytes", "1,000 bytes", "512 bytes", "2,048 bytes"], "1 KB = 2¹⁰ bytes; 1 MB = 1,024 KB.");
b.q(2, "Which is the correct ascending order of memory units?", ["KB < MB < GB < TB < PB", "MB < KB < GB < TB", "GB < MB < TB < PB", "KB < GB < MB < TB"], "Each step is 1,024 times the previous.");
b.q(2, "Cache memory is placed between:", ["CPU and main memory", "Hard disk and printer", "RAM and keyboard", "Monitor and CPU"], "It stores frequently used data for faster access.");
b.q(2, "Which of the following has the fastest access time?", ["CPU registers", "Cache memory", "RAM", "Hard disk"], "Memory hierarchy: registers > cache > RAM > SSD/HDD.");
b.q(1, "Which of the following is an input device?", ["Scanner", "Monitor", "Printer", "Speaker"], "Output devices present results; scanners feed data in.");
b.q(1, "Which of the following is an output device?", ["Plotter", "Joystick", "Light pen", "Microphone"], "Plotters print large drawings.");
b.q(2, "An operating system is:", ["System software that manages hardware and provides services to application programs", "An application for word processing", "A type of virus", "A programming language"], "Examples: Windows, Linux, macOS, Android.");
b.q(2, "Linux is an example of:", ["Open-source operating system", "Proprietary database", "Web browser", "Antivirus"], "Its kernel was created by Linus Torvalds in 1991.");
b.q(2, "A 'compiler' translates:", ["An entire high-level program into machine code before execution", "One line at a time during execution", "Machine code into high-level code", "Speech into text"], "An interpreter translates and executes line by line.");
b.q(2, "The binary equivalent of decimal 13 is:", ["1101", "1011", "1110", "1001"], "13 = 8 + 4 + 1 = 1101₂.");
b.q(2, "The decimal value of binary 101010 is:", ["42", "40", "52", "21"], "32 + 8 + 2 = 42.");
b.q(3, "The hexadecimal number 'FF' equals which decimal number?", ["255", "256", "240", "15"], "F = 15; 15 × 16 + 15 = 255.");
b.q(3, "The octal number 17 is equal to decimal:", ["15", "17", "7", "23"], "1 × 8 + 7 = 15.");
b.q(2, "Which logic gate outputs 1 only when all its inputs are 1?", ["AND", "OR", "NOT", "XOR"], "NAND and NOR are universal gates.");
b.q(2, "Which gates are called 'universal gates'?", ["NAND and NOR", "AND and OR", "XOR and XNOR", "NOT and AND"], "Any logic circuit can be built using only NAND or only NOR gates.");
b.q(2, "'Booting' a computer means:", ["Loading the operating system into memory when the computer starts", "Shutting down", "Installing hardware", "Formatting the disk"], "Cold boot starts from power off; warm boot restarts.");
b.q(2, "A 'firewall' is used to:", ["Monitor and control network traffic based on security rules", "Cool the CPU", "Back up data", "Increase internet speed"], "It can be hardware or software.");

b.t("Internet & Networks");
b.q(1, "Which of the following is a web browser?", ["Mozilla Firefox", "Microsoft Excel", "Oracle", "Linux"], "Chrome, Edge, Safari and Firefox are browsers.");
b.q(2, "Which protocol is used to securely transmit web pages?", ["HTTPS", "FTP", "SMTP", "POP3"], "HTTPS uses TLS encryption (padlock icon).");
b.q(2, "The domain '.gov.in' is used by:", ["Government of India websites", "Commercial companies", "Educational institutions abroad", "Non-profits worldwide"], "'.ac.in' and '.edu.in' are for academic institutions in India.");
b.q(2, "Which network topology connects all devices to a central hub or switch?", ["Star", "Bus", "Ring", "Mesh"], "Failure of the central device stops the network.");
b.q(2, "A device that forwards data packets between different networks is a:", ["Router", "Hub", "Repeater", "Modem"], "A modem modulates/demodulates signals; a hub broadcasts to all ports.");
b.q(2, "IPv4 addresses are how many bits long?", ["32 bits", "64 bits", "128 bits", "16 bits"], "IPv6 uses 128-bit addresses.");
b.q(2, "'Bluetooth' is an example of a:", ["Personal Area Network (PAN) technology", "Wide Area Network", "Metropolitan Area Network", "Satellite network"], "It works over short ranges.");
b.q(2, "'Cloud computing' refers to:", ["Delivery of computing services such as storage and software over the internet", "Weather forecasting by computers", "Computing using clouds of data only", "A type of virus"], "Models include IaaS, PaaS and SaaS.");
b.q(2, "A 'search engine' is:", ["A program that searches the web for information based on keywords", "A hardware device", "A type of malware", "An email client"], "Google, Bing and DuckDuckGo are examples.");
b.q(2, "The 'CC' field in an email is used to:", ["Send a copy to additional recipients visible to all", "Hide recipients", "Attach files", "Mark as spam"], "BCC (blind carbon copy) hides recipients from each other.");

b.t("Cyber Security");
b.q(1, "'Phishing' is:", ["A fraudulent attempt to obtain sensitive information by pretending to be a trustworthy entity", "A method to speed up the internet", "A data backup technique", "A type of hardware"], "Never share OTPs or passwords via email or calls.");
b.q(2, "Malicious software that encrypts a victim's files and demands payment is called:", ["Ransomware", "Spyware", "Adware", "Firmware"], "Backups and patching help prevent damage.");
b.q(2, "A 'Trojan horse' is malware that:", ["Disguises itself as legitimate software", "Replicates itself without a host", "Only displays advertisements", "Is a hardware fault"], "A worm self-replicates across networks.");
b.q(2, "'Two-factor authentication' strengthens security by requiring:", ["Two different types of verification, e.g., password and OTP", "Two passwords of the same type", "Two usernames", "Two computers"], "Factors: something you know, have or are.");
b.q(2, "India's national agency for responding to cyber security incidents is:", ["CERT-In", "NIC", "C-DAC", "NASSCOM"], "It functions under the Ministry of Electronics and IT.");
b.q(2, "The Information Technology Act was enacted in:", ["2000", "1998", "2005", "2008"], "It was amended significantly in 2008.");
b.q(2, "The national helpline number for reporting cyber financial fraud in India is:", ["1930", "100", "112", "1098"], "Complaints can also be filed on cybercrime.gov.in.");
b.q(3, "'Digital arrest' scams typically involve:", ["Fraudsters posing as police or officials on video calls and extorting money", "Arrest of hackers by police", "Blocking of social media accounts by courts", "Freezing of bank accounts by RBI"], "No law enforcement agency arrests anyone over a video call.");

b.t("Office Applications");
b.q(1, "Ctrl + C is used to:", ["Copy the selected item", "Cut", "Paste", "Close"], "Ctrl + X cuts and Ctrl + V pastes.");
b.q(1, "Ctrl + Z is used to:", ["Undo the last action", "Redo", "Zoom", "Save"], "Ctrl + Y redoes.");
b.q(2, "In MS Word, Ctrl + B applies:", ["Bold formatting", "Bullets", "Border", "Break"], "Ctrl + I italicises; Ctrl + U underlines.");
b.q(2, "In MS Excel, a cell reference like $A$1 is an example of:", ["Absolute reference", "Relative reference", "Mixed reference", "Circular reference"], "It does not change when copied.");
b.q(2, "In MS Excel, the function to add a range of cells is:", ["=SUM()", "=ADD()", "=TOTAL()", "=PLUS()"], "=AVERAGE(), =MAX(), =MIN() and =COUNT() are other common functions.");
b.q(2, "In MS Excel, the intersection of a row and a column is called a:", ["Cell", "Range", "Sheet", "Workbook"], "A cell address combines column letter and row number, e.g., B4.");
b.q(2, "Which MS Excel function returns the number of cells that contain numbers?", ["COUNT", "COUNTA", "SUM", "LEN"], "COUNTA counts non-empty cells.");
b.q(2, "The default file extension of a Microsoft Word document (2007 onwards) is:", [".docx", ".xlsx", ".pptx", ".txt"], ".xlsx is Excel and .pptx PowerPoint.");
b.q(2, "In PowerPoint, which view shows thumbnails of all slides for rearranging?", ["Slide Sorter view", "Normal view", "Reading view", "Notes Page view"], "Slide Sorter helps reorder slides.");
b.q(3, "In MS Excel, which function looks up a value in the first column of a table and returns a value in the same row from another column?", ["VLOOKUP", "HLOOKUP", "INDEX", "MATCH"], "HLOOKUP searches the first row; XLOOKUP is a newer alternative.");
b.q(2, "F5 key in most web browsers is used to:", ["Refresh the page", "Open help", "Close the window", "Print"], "F1 usually opens help.");
b.q(2, "Ctrl + P in most applications opens the:", ["Print dialog", "Paste options", "Page setup", "Paragraph menu"], "Ctrl + S saves.");
b.q(2, "Which key combination switches between open applications in Windows?", ["Alt + Tab", "Ctrl + Tab", "Shift + Tab", "Ctrl + Esc"], "Ctrl + Tab switches between tabs within an application.");

export default b.items;
