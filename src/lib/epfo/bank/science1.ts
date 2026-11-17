import { Bank } from "./dsl";

/** General science: table-driven facts (vitamins, diseases, units, instruments, compounds, discoveries). */
const b = new Bank("science1");

type V = [string, string, 1 | 2 | 3];
const VITAMINS: V[] = [
  ["Vitamin A", "Night blindness", 1],
  ["Vitamin B1 (thiamine)", "Beriberi", 2],
  ["Vitamin B3 (niacin)", "Pellagra", 2],
  ["Vitamin B12 (cobalamin)", "Pernicious anaemia", 2],
  ["Vitamin C", "Scurvy", 1],
  ["Vitamin D", "Rickets", 1],
  ["Vitamin K", "Impaired blood clotting (haemorrhage)", 2],
  ["Iodine", "Goitre", 1],
  ["Iron", "Anaemia", 1],
];
VITAMINS.forEach(([v, dis, d], i) => {
  b.t("Nutrition");
  if (i % 2 === 0) b.pool(d, `Deficiency of ${v} causes:`, dis, VITAMINS.map((x) => x[1]), `${v} deficiency → ${dis}.`);
  else b.pool(d, `${dis} is caused by the deficiency of:`, v, VITAMINS.map((x) => x[0]), `${dis} results from lack of ${v}.`);
});

type Dz = [string, string, 1 | 2 | 3];
const DISEASES: Dz[] = [
  ["Tuberculosis", "Mycobacterium tuberculosis (bacterium)", 1],
  ["Malaria", "Plasmodium (protozoan)", 1],
  ["Dengue", "Dengue virus (a flavivirus spread by Aedes mosquitoes)", 1],
  ["Typhoid", "Salmonella Typhi (bacterium)", 2],
  ["Cholera", "Vibrio cholerae (bacterium)", 2],
  ["Ringworm", "Dermatophyte fungi such as Trichophyton", 2],
  ["Kala-azar", "Leishmania donovani (protozoan, spread by sandflies)", 2],
  ["Leprosy", "Mycobacterium leprae (bacterium)", 2],
  ["Polio", "Poliovirus", 1],
  ["Diphtheria", "Corynebacterium diphtheriae (bacterium)", 3],
  ["Amoebic dysentery", "Entamoeba histolytica (protozoan)", 3],
  ["Filariasis", "Wuchereria bancrofti (nematode worm, spread by Culex mosquitoes)", 3],
  ["AIDS", "Human Immunodeficiency Virus (HIV)", 1],
  ["Chikungunya", "Chikungunya virus (an alphavirus spread by Aedes mosquitoes)", 3],
];
DISEASES.forEach(([dz, cause, d]) => {
  b.t("Human Diseases").pool(d, `The causative agent of ${dz.toLowerCase() === "aids" ? "AIDS" : dz.toLowerCase()} is:`, cause, DISEASES.map((x) => x[1]), `${dz}: ${cause}.`);
});

type U = [string, string, 1 | 2 | 3];
const UNITS: U[] = [
  ["Force", "Newton", 1],
  ["Energy", "Joule", 1],
  ["Power", "Watt", 1],
  ["Pressure", "Pascal", 1],
  ["Frequency", "Hertz", 1],
  ["Electric current", "Ampere", 1],
  ["Electric resistance", "Ohm", 1],
  ["Electric charge", "Coulomb", 2],
  ["Potential difference", "Volt", 1],
  ["Luminous intensity", "Candela", 2],
  ["Amount of substance", "Mole", 2],
  ["Magnetic flux", "Weber", 3],
  ["Capacitance", "Farad", 2],
  ["Inductance", "Henry", 3],
  ["Absorbed radiation dose", "Gray", 3],
  ["Thermodynamic temperature", "Kelvin", 1],
  ["Magnetic flux density", "Tesla", 3],
  ["Radioactivity", "Becquerel", 3],
];
UNITS.forEach(([q, u, d], i) => {
  b.t("Units & Measurement");
  if (i % 2 === 0) b.pool(d, `The SI unit of ${q.toLowerCase()} is the:`, u, UNITS.map((x) => x[1]), `${q} is measured in ${u}s.`);
  else b.pool(d, `The '${u}' is the SI unit of:`, q, UNITS.map((x) => x[0]), `${u} measures ${q.toLowerCase()}.`);
});

type In = [string, string, 1 | 2 | 3];
const INSTRUMENTS: In[] = [
  ["Barometer", "Atmospheric pressure", 1],
  ["Hygrometer", "Relative humidity", 2],
  ["Seismograph", "Earthquake waves", 1],
  ["Ammeter", "Electric current", 1],
  ["Anemometer", "Wind speed", 2],
  ["Lactometer", "Purity (density) of milk", 2],
  ["Hydrometer", "Relative density of liquids", 2],
  ["Pyrometer", "Very high temperatures", 2],
  ["Sphygmomanometer", "Blood pressure", 2],
  ["Altimeter", "Altitude", 2],
  ["Odometer", "Distance travelled by a vehicle", 2],
  ["Tachometer", "Speed of rotation (RPM)", 3],
  ["Galvanometer", "Small electric currents", 3],
  ["Audiometer", "Hearing ability", 3],
];
INSTRUMENTS.forEach(([inst, what, d], i) => {
  b.t("Scientific Instruments");
  if (i % 2 === 0) b.pool(d, `A ${inst.toLowerCase()} is used to measure:`, what, INSTRUMENTS.map((x) => x[1]), `${inst}: ${what}.`);
  else b.pool(d, `Which instrument is used to measure ${what.toLowerCase()}?`, inst, INSTRUMENTS.map((x) => x[0]), `${inst} measures ${what.toLowerCase()}.`);
});

type Ch = [string, string, 1 | 2 | 3];
const CHEM: Ch[] = [
  ["Common salt", "NaCl (sodium chloride)", 1],
  ["Baking soda", "NaHCO₃ (sodium hydrogen carbonate)", 1],
  ["Washing soda", "Na₂CO₃·10H₂O (sodium carbonate decahydrate)", 2],
  ["Bleaching powder", "CaOCl₂ (calcium oxychloride)", 2],
  ["Plaster of Paris", "CaSO₄·½H₂O (calcium sulphate hemihydrate)", 2],
  ["Quicklime", "CaO (calcium oxide)", 2],
  ["Slaked lime", "Ca(OH)₂ (calcium hydroxide)", 2],
  ["Laughing gas", "N₂O (nitrous oxide)", 2],
  ["Dry ice", "Solid CO₂", 1],
  ["Marble / limestone", "CaCO₃ (calcium carbonate)", 2],
  ["Blue vitriol", "CuSO₄·5H₂O (copper sulphate)", 3],
  ["Caustic soda", "NaOH (sodium hydroxide)", 2],
  ["Gypsum", "CaSO₄·2H₂O (calcium sulphate dihydrate)", 3],
  ["Muriatic acid", "HCl (hydrochloric acid)", 3],
];
CHEM.forEach(([n, f, d], i) => {
  b.t("Everyday Chemistry");
  if (i % 2 === 0) b.pool(d, `The chemical name/formula of '${n.toLowerCase()}' is:`, f, CHEM.map((x) => x[1]), `${n} = ${f}.`);
  else b.pool(d, `${f} is commonly known as:`, n, CHEM.map((x) => x[0]), `${f} is ${n.toLowerCase()}.`);
});

type Dv = [string, string, 1 | 2 | 3];
const DISC: Dv[] = [
  ["Penicillin", "Alexander Fleming", 1],
  ["Theory of relativity", "Albert Einstein", 1],
  ["Laws of motion and universal gravitation", "Isaac Newton", 1],
  ["Electron", "J. J. Thomson", 2],
  ["Neutron", "James Chadwick", 2],
  ["Atomic nucleus (gold foil experiment)", "Ernest Rutherford", 2],
  ["Radioactivity", "Henri Becquerel", 2],
  ["Raman effect", "C. V. Raman", 1],
  ["Electromagnetic induction", "Michael Faraday", 2],
  ["Periodic table of elements", "Dmitri Mendeleev", 1],
  ["Vaccination against smallpox", "Edward Jenner", 2],
  ["Theory of evolution by natural selection", "Charles Darwin", 1],
  ["Laws of inheritance", "Gregor Mendel", 1],
  ["Double helix structure of DNA", "James Watson and Francis Crick", 2],
  ["Insulin (isolation)", "Frederick Banting and Charles Best", 3],
  ["Bose–Einstein statistics", "Satyendra Nath Bose", 2],
  ["Chandrasekhar limit", "Subrahmanyan Chandrasekhar", 3],
  ["Pasteurisation and rabies vaccine", "Louis Pasteur", 2],
  ["Telephone (patent)", "Alexander Graham Bell", 1],
  ["World Wide Web", "Tim Berners-Lee", 2],
];
DISC.forEach(([what, who, d]) => {
  b.t("Discoveries & Inventions").pool(d, `${what} is credited to:`, who, DISC.map((x) => x[1]), `${what}: ${who}.`);
});

export default b.items;
