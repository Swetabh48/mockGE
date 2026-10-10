/**
 * UPSC ESE/IES Civil Engineering prelims syllabus clusters.
 * Paper-I / Paper-II topic split follows common Made Easy / IES Master groupings
 * (pre-2017 dual CE papers; post-2017 single CE paper uses both clusters).
 */

export type IesSubjectKey =
  | "building_materials"
  | "solid_mechanics"
  | "structural_analysis"
  | "design_steel"
  | "design_concrete"
  | "construction_mgmt"
  | "geotech"
  | "fluid_mechanics"
  | "hydrology"
  | "irrigation"
  | "environmental"
  | "transportation"
  | "surveying"
  | "engineering_mechanics";

export type IesTopic = {
  id: string;
  title: string;
};

export type IesSubject = {
  key: IesSubjectKey;
  title: string;
  /** Which CE paper this subject is typically examined in (pre-2017 style). */
  paper: "ce_paper1" | "ce_paper2" | "both";
  topics: IesTopic[];
};

export const IES_SYLLABUS: IesSubject[] = [
  {
    key: "building_materials",
    title: "Building Materials",
    paper: "ce_paper1",
    topics: [
      { id: "cement-concrete", title: "Cement & Concrete" },
      { id: "bricks-timber", title: "Bricks, Timber & Stones" },
      { id: "steel-tests", title: "Steel & Material Tests" },
    ],
  },
  {
    key: "solid_mechanics",
    title: "Solid Mechanics",
    paper: "ce_paper1",
    topics: [
      { id: "stress-strain", title: "Stress–Strain & Elastic Constants" },
      { id: "bending-shear", title: "Bending & Shear" },
      { id: "torsion-columns", title: "Torsion & Columns" },
    ],
  },
  {
    key: "structural_analysis",
    title: "Structural Analysis",
    paper: "ce_paper1",
    topics: [
      { id: "statically-determinate", title: "Determinate Structures" },
      { id: "indeterminate", title: "Indeterminate Structures" },
      { id: "influence-lines", title: "Influence Lines & Arches" },
    ],
  },
  {
    key: "design_concrete",
    title: "Design of Concrete Structures",
    paper: "ce_paper1",
    topics: [
      { id: "rcc-beams", title: "RCC Beams & Slabs" },
      { id: "rcc-columns", title: "Columns & Footings" },
      { id: "prestress", title: "Prestressed Concrete" },
    ],
  },
  {
    key: "design_steel",
    title: "Design of Steel Structures",
    paper: "ce_paper1",
    topics: [
      { id: "connections", title: "Connections" },
      { id: "beams-columns-steel", title: "Beams & Columns" },
      { id: "plate-girders", title: "Plate Girders & Trusses" },
    ],
  },
  {
    key: "construction_mgmt",
    title: "Construction Practice & Management",
    paper: "ce_paper1",
    topics: [
      { id: "cpm-pert", title: "CPM / PERT" },
      { id: "estimating", title: "Estimating & Costing" },
      { id: "equipment", title: "Construction Equipment" },
    ],
  },
  {
    key: "engineering_mechanics",
    title: "Engineering Mechanics",
    paper: "ce_paper1",
    topics: [
      { id: "statics", title: "Statics & Equilibrium" },
      { id: "dynamics", title: "Dynamics & Energy" },
    ],
  },
  {
    key: "fluid_mechanics",
    title: "Fluid Mechanics & Hydraulic Machines",
    paper: "ce_paper2",
    topics: [
      { id: "fluid-statics", title: "Fluid Statics" },
      { id: "flow-pipes", title: "Pipe Flow & Momentum" },
      { id: "turbines-pumps", title: "Turbines & Pumps" },
    ],
  },
  {
    key: "hydrology",
    title: "Hydrology",
    paper: "ce_paper2",
    topics: [
      { id: "rainfall-runoff", title: "Rainfall–Runoff" },
      { id: "hydrographs", title: "Hydrographs & Floods" },
      { id: "groundwater", title: "Groundwater" },
    ],
  },
  {
    key: "irrigation",
    title: "Irrigation Engineering",
    paper: "ce_paper2",
    topics: [
      { id: "canals", title: "Canals & Diversion" },
      { id: "water-req", title: "Crop Water Requirement" },
      { id: "dams", title: "Dams & Spillways" },
    ],
  },
  {
    key: "environmental",
    title: "Environmental Engineering",
    paper: "ce_paper2",
    topics: [
      { id: "water-supply", title: "Water Supply" },
      { id: "wastewater", title: "Wastewater Treatment" },
      { id: "air-noise", title: "Air & Noise Pollution" },
    ],
  },
  {
    key: "geotech",
    title: "Geotechnical Engineering",
    paper: "ce_paper2",
    topics: [
      { id: "soil-properties", title: "Soil Properties & Classification" },
      { id: "permeability-seepage", title: "Permeability & Seepage" },
      { id: "bearing-capacity", title: "Bearing Capacity & Foundations" },
      { id: "compaction-consolidation", title: "Compaction & Consolidation" },
    ],
  },
  {
    key: "surveying",
    title: "Surveying & Geology",
    paper: "ce_paper2",
    topics: [
      { id: "levelling", title: "Levelling & Contours" },
      { id: "theodolite-tacheometry", title: "Theodolite & Tacheometry" },
      { id: "remote-sensing", title: "GIS / Remote Sensing" },
    ],
  },
  {
    key: "transportation",
    title: "Transportation Engineering",
    paper: "ce_paper2",
    topics: [
      { id: "highway-geom", title: "Highway Geometric Design" },
      { id: "pavement", title: "Pavement Design" },
      { id: "traffic", title: "Traffic Engineering" },
      { id: "railway-airport", title: "Railway & Airport" },
    ],
  },
];

export const IES_PAPER1_SUBJECTS = IES_SYLLABUS.filter(
  (s) => s.paper === "ce_paper1" || s.paper === "both",
);
export const IES_PAPER2_SUBJECTS = IES_SYLLABUS.filter(
  (s) => s.paper === "ce_paper2" || s.paper === "both",
);

export function iesSubjectsForPaper(paper: "ce_paper1" | "ce_paper2"): IesSubject[] {
  return paper === "ce_paper1" ? IES_PAPER1_SUBJECTS : IES_PAPER2_SUBJECTS;
}

export function iesSubjectLabel(key: string): string {
  return IES_SYLLABUS.find((s) => s.key === key)?.title ?? key;
}

export function classifyIesStem(stem: string): { subject: IesSubjectKey; topic: string } {
  const t = stem.toLowerCase();
  const rules: { test: RegExp; subject: IesSubjectKey; topic: string }[] = [
    { test: /cement|concrete|aggregate|slump|brick|timber/, subject: "building_materials", topic: "cement-concrete" },
    { test: /young|modulus|poisson|bending moment|shear force|torsion|euler/, subject: "solid_mechanics", topic: "stress-strain" },
    { test: /influence line|moment distribution|slope deflection|truss|arch/, subject: "structural_analysis", topic: "indeterminate" },
    { test: /rcc|reinforced|limit state|prestress|working stress/, subject: "design_concrete", topic: "rcc-beams" },
    { test: /steel.*beam|fillet weld|bolt|plate girder|is\s*800/, subject: "design_steel", topic: "connections" },
    { test: /cpm|pert|crash|float|estimate|rate analysis/, subject: "construction_mgmt", topic: "cpm-pert" },
    { test: /bernoulli|reynolds|pipe flow|turbine|pump|orifice|weir/, subject: "fluid_mechanics", topic: "flow-pipes" },
    { test: /hydrograph|rainfall|runoff|infiltration|unit hydrograph/, subject: "hydrology", topic: "hydrographs" },
    { test: /irrigation|duty|delta|canal|spillway|gravity dam/, subject: "irrigation", topic: "canals" },
    { test: /bod|cod|chlorine|sedimentation|activated sludge|sewer/, subject: "environmental", topic: "wastewater" },
    { test: /soil|void ratio|compaction|consolidation|bearing capacity|pierce|atterberg/, subject: "geotech", topic: "soil-properties" },
    { test: /levelling|theodolite|contour|tachometer|gis|gps/, subject: "surveying", topic: "levelling" },
    { test: /highway|pavement|cbr|superelevation|traffic|railway|airport/, subject: "transportation", topic: "highway-geom" },
    { test: /equilibrium|friction|centroid|moment of inertia|kinematics/, subject: "engineering_mechanics", topic: "statics" },
  ];
  for (const r of rules) {
    if (r.test.test(t)) return { subject: r.subject, topic: r.topic };
  }
  return { subject: "structural_analysis", topic: "statically-determinate" };
}

export { IES_REVISE_NOTES, type IesReviseBlock } from "./iesReviseNotes";
