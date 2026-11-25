import { Bank } from "../bank/dsl";

/** 2025-pattern General Science — statement, application and reasoning items. */
const b = new Bank("science25");

b.t("Physics in Daily Life");
b.st(3, "Consider the following about how a GPS receiver finds its position:", [
  "It measures the travel time of signals from several satellites and converts them into distances.",
  "Signals from at least four satellites are needed to fix latitude, longitude, altitude and the receiver's clock error.",
  "The receiver sends its own signal to the satellites, which then compute its position.",
], [1, 2], "GPS is one-way: satellites broadcast and the receiver computes its position by trilateration.");
b.ar(3, "Clocks on GPS satellites must be corrected for relativistic effects.", "Weaker gravity at orbital height makes satellite clocks run faster, while their orbital speed makes them run slower.", "a", "The net effect is about 38 microseconds a day; without correction, position errors would grow by kilometres daily.");
b.st(3, "Consider the following about optical fibres:", [
  "Light is guided by total internal reflection.",
  "The core has a higher refractive index than the cladding.",
  "Signals in optical fibres are affected by electromagnetic interference as much as in copper wires.",
], [1, 2], "Optical fibres are largely immune to electromagnetic interference.");
b.st(3, "Consider the following about scattering of light:", [
  "The sky appears blue because shorter wavelengths are scattered more by air molecules.",
  "The Sun looks reddish at sunrise and sunset because its light passes through a thicker layer of air.",
  "Astronauts in orbit see a blue sky in daytime.",
], [1, 2], "Above the atmosphere there is almost nothing to scatter light, so the sky looks black.");
b.q(3, "A traffic police radar gun measures the speed of a moving car. It works on:", ["The change in frequency of waves reflected from a moving object", "The change in the speed of light near a moving object", "Total internal reflection of radio waves", "Interference of sound waves from the engine"], "This is the Doppler effect, also used in echocardiography and weather radar.");
b.ar(3, "Food cooks faster in a pressure cooker.", "Raising the pressure above the liquid raises the boiling point of water.", "a", "Water boils at around 120 °C inside, so heat transfer is faster.");
b.ar(3, "Hilly areas take longer to cook rice in an open pot.", "Atmospheric pressure is lower at high altitude, so water boils below 100 °C.", "a", "A lower boiling temperature means slower cooking.");
b.st(3, "Consider the following about a microwave oven:", [
  "It heats food mainly by making water molecules in it rotate rapidly.",
  "Metal containers reflect microwaves and can cause sparking.",
  "Microwaves make the food radioactive.",
], [1, 2], "Microwaves are non-ionising radiation; they cannot make food radioactive.");
b.st(3, "Consider the following about transformers:", [
  "They work on the principle of mutual induction.",
  "They can step up or step down alternating voltage.",
  "They work equally well on steady direct current.",
], [1, 2], "A steady DC produces no changing flux, so no voltage is induced in the secondary.");
b.ar(3, "Electricity is transmitted over long distances at very high voltage.", "For the same power, a higher voltage means a lower current and lower I²R losses in the lines.", "a", "Transformers make this possible for AC.");
b.st(3, "Consider the following about superconductors:", [
  "Their electrical resistance becomes zero below a critical temperature.",
  "They expel magnetic fields from their interior (the Meissner effect).",
  "Superconducting magnets are used in MRI scanners.",
], [1, 2, 3], "All three are correct.");
b.q(3, "A person stands in a closed car during a thunderstorm and the car is struck by lightning. Why is the person usually safe?", ["Charge stays on the outer metal body, which acts as a Faraday cage", "Rubber tyres insulate the car from the ground", "The glass windows absorb the charge", "The car's battery neutralises the charge"], "The common belief about tyres is wrong; the metal shell carries the current around the occupants.");
b.st(3, "Consider the following about sound:", [
  "Sound cannot travel through a vacuum.",
  "Sound travels faster in steel than in air.",
  "Ultrasound has frequencies below 20 Hz.",
], [1, 2], "Ultrasound is above 20 kHz; below 20 Hz is infrasound.");
b.st(3, "Consider the following about rainbows:", [
  "They are formed by dispersion, refraction and internal reflection of sunlight in raindrops.",
  "A rainbow is seen when the Sun is behind the observer.",
  "In the primary rainbow, violet appears on the outer edge.",
], [1, 2], "Red is on the outer edge of the primary bow.");

b.t("Energy & Technology");
b.st(3, "Consider the following about hydrogen fuel cells:", [
  "They convert chemical energy directly into electricity.",
  "When run on hydrogen, the main by-product is water.",
  "They need to be recharged from the grid like a battery.",
], [1, 2], "Fuel cells run as long as fuel is supplied; they are refuelled, not recharged.");
b.st(3, "Consider the following about the colours of hydrogen:", [
  "Green hydrogen is produced by electrolysis of water using renewable electricity.",
  "Grey hydrogen is produced from natural gas without capturing the carbon dioxide.",
  "Blue hydrogen is produced by electrolysis using nuclear power.",
], [1, 2], "Blue hydrogen is from fossil fuels with carbon capture; hydrogen from nuclear power is often called pink.");
b.st(3, "Consider the following about India's nuclear power programme:", [
  "Pressurised heavy water reactors use natural uranium as fuel.",
  "The second stage uses fast breeder reactors.",
  "The third stage aims to use thorium, of which India has large reserves.",
], [1, 2, 3], "This is Homi Bhabha's three-stage plan.");
b.ar(3, "Heavy water is used as a moderator in PHWRs.", "Heavy water slows down neutrons while absorbing very few of them.", "a", "Low absorption allows natural (unenriched) uranium to sustain a chain reaction.");
b.st(3, "Consider the following about nuclear fusion:", [
  "It joins light nuclei such as hydrogen isotopes.",
  "It powers the Sun and other stars.",
  "Commercial fusion power plants are already in operation in several countries.",
], [1, 2], "Fusion remains experimental, e.g., ITER in France, of which India is a member.");
b.st(3, "Consider the following about lithium-ion and sodium-ion batteries:", [
  "Sodium is far more abundant and cheaper than lithium.",
  "Sodium-ion cells generally have lower energy density than lithium-ion cells.",
  "Sodium-ion cells cannot be recharged.",
], [1, 2], "Both are rechargeable chemistries.");
b.st(3, "Consider the following about solar photovoltaic cells:", [
  "They convert sunlight directly into electricity.",
  "Crystalline silicon is the most widely used material.",
  "Their output increases as panel temperature rises.",
], [1, 2], "Higher cell temperature lowers efficiency.");
b.q(3, "A household replaces ten 60 W bulbs with ten 9 W LED lamps, each used 5 hours a day. About how many units (kWh) are saved in 30 days?", ["76.5 kWh", "90 kWh", "7.65 kWh", "153 kWh"], "Saving = 10 × (60 − 9) W × 5 h × 30 = 76,500 Wh = 76.5 kWh.");

b.t("Space & Earth Science");
b.st(3, "Consider the following about satellite orbits:", [
  "A geostationary satellite orbits about 35,786 km above the equator with a period equal to one sidereal day.",
  "Sun-synchronous polar orbits are preferred for remote-sensing satellites.",
  "A geostationary satellite can be placed above New Delhi.",
], [1, 2], "Geostationary orbits must lie in the equatorial plane.");
b.ar(3, "Aditya-L1 is placed in a halo orbit around the Sun–Earth L1 point.", "From L1 the Sun can be observed continuously without being hidden by the Earth.", "a", "L1 lies about 1.5 million km from the Earth towards the Sun.");
b.st(3, "Consider the following about seismic waves:", [
  "P-waves can travel through solids, liquids and gases.",
  "S-waves cannot travel through liquids.",
  "The S-wave shadow zone indicates that the outer core is liquid.",
], [1, 2, 3], "This reasoning is the main evidence for a liquid outer core.");
b.st(3, "Consider the following about tropical cyclones:", [
  "They do not form within about 5° of the equator.",
  "In the Northern Hemisphere they rotate anticlockwise.",
  "They gain strength as they move over land.",
], [1, 2], "Near the equator the Coriolis force is too weak; over land they lose their moisture supply and weaken.");
b.st(3, "Consider the following about El Niño and the Indian monsoon:", [
  "El Niño involves unusual warming of the central and eastern equatorial Pacific.",
  "El Niño years are often associated with weaker Indian monsoon rainfall.",
  "A positive Indian Ocean Dipole can offset some of El Niño's effect on the monsoon.",
], [1, 2, 3], "1997 was an El Niño year with near-normal rainfall, helped by a positive IOD.");
b.st(3, "Consider the following about permafrost:", [
  "It is ground that stays frozen for at least two consecutive years.",
  "Its thaw can release carbon dioxide and methane stored in frozen organic matter.",
  "Permafrost is found only in polar regions and not in high mountains.",
], [1, 2], "Mountain permafrost occurs in the Himalayas, Tibetan Plateau and Alps.");
b.ar(3, "Permafrost thaw can speed up global warming.", "Greenhouse gases released by thawing permafrost trap more heat, which causes further thaw.", "a", "This is a positive feedback loop.");
b.st(3, "Consider the following about the seasons on Earth:", [
  "They are caused by the tilt of the Earth's axis.",
  "The Earth is closest to the Sun in early January.",
  "Summer in the Northern Hemisphere happens because the Earth is then nearest to the Sun.",
], [1, 2], "The Earth is nearest the Sun during the northern winter, showing that distance is not the cause.");
b.st(3, "Consider the following about tides:", [
  "Spring tides occur at new moon and full moon.",
  "Neap tides occur when the Sun and Moon are at right angles relative to the Earth.",
  "The Sun's tidal effect is stronger than the Moon's.",
], [1, 2], "The Moon's tidal effect is about twice the Sun's because it is much nearer.");
b.q(3, "Astronomers detect many exoplanets because the star's brightness dips slightly at regular intervals. This is called:", ["The transit method", "The radial-velocity method", "Gravitational lensing", "Direct imaging"], "A planet crossing the stellar disc blocks a small fraction of its light.");

b.t("Chemistry in Daily Life");
b.st(3, "Consider the following about photochemical smog:", [
  "It forms when nitrogen oxides and volatile organic compounds react in sunlight.",
  "Ground-level ozone and peroxyacetyl nitrate (PAN) are among its main components.",
  "It is most common on cold, foggy winter mornings with little sunlight.",
], [1, 2], "Cold, foggy conditions with smoke and SO₂ give classical (London) smog; photochemical smog needs strong sunlight.");
b.ar(3, "Photochemical smog is described as oxidising.", "It has high concentrations of oxidants such as ozone and nitrogen dioxide.", "a", "Classical smog, rich in SO₂, is reducing.");
b.st(3, "Consider the following about carbolic acid:", [
  "Chemically it is phenol.",
  "Joseph Lister used it as an antiseptic in surgery.",
  "It is a strong mineral acid like sulphuric acid.",
], [1, 2], "Phenol is a weak organic acid.");
b.st(3, "Consider the following about hardness of water:", [
  "Temporary hardness is due to bicarbonates of calcium and magnesium and can be removed by boiling.",
  "Permanent hardness is due to chlorides and sulphates of calcium and magnesium.",
  "Hard water forms lather easily with soap.",
], [1, 2], "Hard water forms scum with soap and lathers poorly.");
b.st(3, "Consider the following about acid rain:", [
  "Rain with pH below about 5.6 is generally called acid rain.",
  "It is caused mainly by oxides of sulphur and nitrogen.",
  "Normal rain is perfectly neutral with pH 7.",
], [1, 2], "Normal rain is slightly acidic (about 5.6) because dissolved CO₂ forms carbonic acid.");
b.mt(3, "Match the household substance with its chemical:", [["Baking soda", "Sodium hydrogen carbonate"], ["Washing soda", "Sodium carbonate decahydrate"], ["Bleaching powder", "Calcium oxychloride"], ["Plaster of Paris", "Calcium sulphate hemihydrate"]], "Each is used commonly at home or in construction.", "Substance", "Chemical");
b.ar(3, "Baking powder makes cakes soft and spongy.", "On heating, the sodium hydrogen carbonate in it releases carbon dioxide.", "a", "The gas bubbles make the batter rise.");
b.st(3, "Consider the following about the corrosion of iron:", [
  "Rusting needs both oxygen and water.",
  "Galvanising coats iron with zinc, which corrodes in preference to iron.",
  "Rust is mainly anhydrous iron(II) oxide.",
], [1, 2], "Rust is mainly hydrated iron(III) oxide.");
b.mt(3, "Match the alloy with its main constituents:", [["Brass", "Copper and zinc"], ["Bronze", "Copper and tin"], ["Stainless steel", "Iron, chromium and nickel"], ["Solder", "Tin and lead"]], "Common alloys and their components.", "Alloy", "Constituents");
b.st(3, "Consider the following about domestic fuels:", [
  "LPG is mainly a mixture of propane and butane.",
  "A strong-smelling compound such as ethyl mercaptan is added to LPG to help detect leaks.",
  "CNG is mainly propane.",
], [1, 2], "CNG is mainly methane.");
b.st(3, "Consider the following about ethanol blending in India:", [
  "India achieved about 20% ethanol blending in petrol in 2025.",
  "Ethanol is produced from sugarcane juice, molasses and grains.",
  "Ethanol has a higher energy content per litre than petrol.",
], [1, 2], "Ethanol has lower energy per litre, which slightly reduces mileage.");
b.st(3, "Consider the following about allotropes of carbon:", [
  "Graphite conducts electricity, while diamond does not.",
  "Graphene is a single layer of carbon atoms arranged in a hexagonal lattice.",
  "Fullerenes are made of carbon and hydrogen.",
], [1, 2], "Fullerenes are made of carbon only.");
b.st(3, "Consider the following about groundwater contaminants in India:", [
  "Fluoride above about 1.5 mg/L can cause dental and skeletal fluorosis.",
  "Arsenic contamination is a major concern in parts of the Ganga–Brahmaputra plains.",
  "Nitrate contamination mainly comes from volcanic activity.",
], [1, 2], "Nitrate contamination comes mainly from fertilisers and sewage.");
b.ar(3, "Methane is a major target for short-term climate action.", "Methane traps far more heat per tonne than CO₂ but stays in the atmosphere for only about a decade.", "a", "Cutting it gives fast results.");

b.t("Biology & Health");
b.st(3, "Consider the following about vaccines:", [
  "mRNA vaccines instruct cells to make a viral protein that triggers an immune response.",
  "mRNA vaccines change the DNA of the person vaccinated.",
  "The measles vaccine is a live attenuated vaccine.",
], [1, 3], "mRNA does not enter the nucleus or alter DNA.");
b.mt(3, "Match the vaccine with its type:", [["Oral polio vaccine", "Live attenuated"], ["Injectable polio vaccine (IPV)", "Inactivated"], ["Tetanus vaccine", "Toxoid"], ["Hepatitis B vaccine", "Recombinant subunit"]], "Vaccine types differ in what they present to the immune system.", "Vaccine", "Type");
b.ar(3, "Antibiotics are not useful against the common cold.", "The common cold is caused by viruses, which antibiotics do not kill.", "a", "Misuse of antibiotics also drives antimicrobial resistance.");
b.st(3, "Consider the following about blood groups:", [
  "A person with group O negative is often called a universal donor of red cells.",
  "A person with group AB positive can usually receive red cells from any ABO and Rh group.",
  "Rh incompatibility can affect a baby when the mother is Rh positive and the foetus is Rh negative.",
], [1, 2], "The risk arises when the mother is Rh negative and the foetus is Rh positive.");
b.st(3, "Consider the following about vitamins:", [
  "Vitamins A, D, E and K are fat-soluble.",
  "The skin makes vitamin D when exposed to sunlight.",
  "Vitamin B12 is plentiful in most plant foods.",
], [1, 2], "B12 is found mainly in animal products, so strict vegetarians are at risk of deficiency.");
b.st(3, "Consider the following about diabetes:", [
  "Insulin is made by the beta cells of the islets of Langerhans in the pancreas.",
  "Type 1 diabetes results from the destruction of insulin-producing cells.",
  "Type 2 diabetes is always treated with insulin injections from the start.",
], [1, 2], "Type 2 is usually managed first with lifestyle changes and oral drugs.");
b.st(3, "Consider the following about genome-edited rice varieties released in India in 2025:", [
  "They were developed using CRISPR-Cas based genome editing.",
  "They include varieties aimed at higher yield and tolerance to salinity.",
  "They contain genes inserted from bacteria, like Bt cotton.",
], [1, 2], "SDN-1 and SDN-2 editing changes the plant's own genes without inserting foreign DNA, unlike transgenic Bt cotton.");
b.st(3, "Consider the following about GM crops in India:", [
  "Bt cotton is the only GM crop approved for commercial cultivation.",
  "GM mustard DMH-11 was approved for environmental release in 2022.",
  "Bt brinjal is widely grown commercially in India.",
], [1, 2], "Bt brinjal is under a moratorium in India since 2010 (it is grown in Bangladesh).");
b.st(3, "Consider the following about C4 plants:", [
  "Maize and sugarcane are C4 plants.",
  "They are more efficient than C3 plants in hot and bright conditions.",
  "They have no photorespiration at all and need no carbon dioxide.",
], [1, 2], "C4 plants still need CO₂; they concentrate it around RuBisCO, which greatly reduces photorespiration.");
b.st(3, "Consider the following about biological nitrogen fixation:", [
  "Rhizobium fixes nitrogen in root nodules of legumes.",
  "Azotobacter is a free-living nitrogen-fixing bacterium.",
  "Blue-green algae are used as biofertiliser in paddy fields.",
], [1, 2, 3], "All three are correct.");
b.mt(3, "Match the disease with its vector:", [["Malaria", "Female Anopheles mosquito"], ["Dengue", "Aedes aegypti mosquito"], ["Kala-azar", "Sandfly"], ["Plague", "Rat flea"]], "Vector control is central to preventing these diseases.", "Disease", "Vector");
b.st(3, "Consider the following about digestion:", [
  "Salivary amylase begins the digestion of starch in the mouth.",
  "Pepsin acts on proteins in the stomach.",
  "Bile contains enzymes that digest fat.",
], [1, 2], "Bile has no enzymes; it emulsifies fats so that lipase can act.");
b.ar(3, "HIV weakens the immune system over time.", "HIV infects and destroys CD4 helper T cells, which coordinate immune responses.", "a", "Falling CD4 counts lead to AIDS.");
b.st(3, "Consider the following about the Genome India project:", [
  "It aimed to sequence genomes of about 10,000 Indians from diverse populations.",
  "Its data were made available through the Indian Biological Data Centre.",
  "It sequenced only people from urban areas.",
], [1, 2], "Samples came from many tribal and non-tribal groups across the country.");

b.t("Ecology & Environment");
b.ar(3, "Fish-eating birds often have higher DDT levels than the fish they eat.", "Persistent chemicals accumulate in fatty tissue and become more concentrated at each step of the food chain.", "a", "This is biomagnification.");
b.st(3, "Consider the following about eutrophication:", [
  "It is triggered by excess nitrates and phosphates entering water bodies.",
  "It can cause algal blooms that reduce dissolved oxygen.",
  "It increases fish populations in the long run.",
], [1, 2], "Low oxygen leads to fish kills.");
b.st(3, "Consider the following about ecological pyramids:", [
  "The pyramid of energy is always upright.",
  "The pyramid of numbers can be inverted, as in a tree ecosystem.",
  "The pyramid of biomass in the sea can be inverted.",
], [1, 2, 3], "Only energy must decrease at every step.");
b.hm(3, "Consider the following species in India:", ["Lantana camara", "Prosopis juliflora", "Water hyacinth", "Neem"], 3, "Neem is native to the Indian subcontinent.", "How many of the above are invasive alien species in India?");
b.st(3, "Consider the following about the ozone layer:", [
  "It absorbs most of the harmful ultraviolet radiation from the Sun.",
  "CFCs release chlorine that destroys ozone in the stratosphere.",
  "The Kigali Amendment to the Montreal Protocol phases down HFCs, which are mainly a concern for ozone depletion.",
], [1, 2], "HFCs do not deplete ozone; they are phased down because they are strong greenhouse gases.");

export default b.items;
