/**
 * Formula Search (Part 21) — reference dataset. Every formula here was
 * already independently verified in Python at the point it was first
 * built into this platform (a Lab, a Tool, or a Visualization) — this
 * file re-states them for search/reference, it does not re-derive or
 * introduce anything new. Where a formula traces back to a specific
 * built feature, `relatedTool`/`relatedVisualization` links to it, so
 * "search for a formula" and "use the calculator for it" stay
 * connected rather than becoming two disconnected sources of truth.
 */

export type FormulaCategory =
  | 'structural'
  | 'geotechnical'
  | 'concrete'
  | 'survey'
  | 'general';

export interface FormulaEntry {
  id: string;
  name: string;
  nameBn: string;
  category: FormulaCategory;
  formula: string; // plain-text notation, e.g. "M = wL²/8"
  variables: { symbol: string; meaning: string; meaningBn: string }[];
  description: string;
  descriptionBn: string;
  reference?: string;
  relatedToolSlug?: string;
  relatedLabSlug?: string;
}

export const FORMULAS: FormulaEntry[] = [
  {
    id: 'beam-moment-udl',
    name: 'Maximum Bending Moment — Simply-Supported Beam, UDL',
    nameBn: 'সর্বোচ্চ বেন্ডিং মোমেন্ট — সিম্পলি-সাপোর্টেড বিম, UDL',
    category: 'structural',
    formula: 'M = wL² / 8',
    variables: [
      { symbol: 'w', meaning: 'Uniformly distributed load per unit length', meaningBn: 'প্রতি একক length-এ uniformly distributed load' },
      { symbol: 'L', meaning: 'Span length', meaningBn: 'স্প্যান length' },
    ],
    description: 'Maximum bending moment occurs at mid-span for a simply-supported beam carrying a uniformly distributed load.',
    descriptionBn: 'একটা simply-supported beam-এ যা uniformly distributed load বহন করে, তার mid-span-এ সর্বোচ্চ bending moment হয়।',
    reference: 'Statics',
    relatedToolSlug: 'beam-calculator',
  },
  {
    id: 'beam-shear-udl',
    name: 'Maximum Shear Force — Simply-Supported Beam, UDL',
    nameBn: 'সর্বোচ্চ শিয়ার ফোর্স — সিম্পলি-সাপোর্টেড বিম, UDL',
    category: 'structural',
    formula: 'V = wL / 2',
    variables: [
      { symbol: 'w', meaning: 'Uniformly distributed load per unit length', meaningBn: 'প্রতি একক length-এ uniformly distributed load' },
      { symbol: 'L', meaning: 'Span length', meaningBn: 'স্প্যান length' },
    ],
    description: 'Maximum shear force occurs at the supports for a simply-supported beam under a UDL.',
    descriptionBn: 'একটা UDL-এর নিচে থাকা simply-supported beam-এ সাপোর্টে সর্বোচ্চ shear force হয়।',
    reference: 'Statics',
    relatedToolSlug: 'beam-calculator',
  },
  {
    id: 'beam-moment-point-load',
    name: 'Bending Moment — Point Load',
    nameBn: 'বেন্ডিং মোমেন্ট — পয়েন্ট লোড',
    category: 'structural',
    formula: 'M = Ra × a (general); M = PL/4 (point load at mid-span)',
    variables: [
      { symbol: 'Ra', meaning: 'Reaction at the nearer support', meaningBn: 'কাছের সাপোর্টে reaction' },
      { symbol: 'a', meaning: 'Distance from that support to the load', meaningBn: 'সেই সাপোর্ট থেকে load পর্যন্ত distance' },
      { symbol: 'P', meaning: 'Point load magnitude', meaningBn: 'Point load-এর magnitude' },
      { symbol: 'L', meaning: 'Span length', meaningBn: 'স্প্যান length' },
    ],
    description: 'Maximum moment under a single point load occurs directly beneath it; the mid-span case (PL/4) is the common special case.',
    descriptionBn: 'একটা single point load-এর নিচে সর্বোচ্চ moment ঠিক তার নিচেই হয়; mid-span case (PL/4) সবচেয়ে সাধারণ special case।',
    reference: 'Statics',
    relatedToolSlug: 'beam-calculator',
  },
  {
    id: 'flexural-strength-middle-third',
    name: 'Modulus of Rupture — Fracture in the Middle Third',
    nameBn: 'মডুলাস অফ রাপচার — মিডল থার্ডে ফ্র্যাকচার',
    category: 'concrete',
    formula: 'R = PL / bd²',
    variables: [
      { symbol: 'P', meaning: 'Maximum (failure) load', meaningBn: 'সর্বোচ্চ (failure) load' },
      { symbol: 'L', meaning: 'Span between supports', meaningBn: 'সাপোর্টের মধ্যে span' },
      { symbol: 'b', meaning: 'Beam width', meaningBn: 'বিম width' },
      { symbol: 'd', meaning: 'Beam depth', meaningBn: 'বিম depth' },
    ],
    description: 'ASTM C78 third-point loading flexural strength, when fracture occurs within the middle third of the span.',
    descriptionBn: 'ASTM C78 third-point loading flexural strength, যখন fracture span-এর middle third-এর ভেতরে হয়।',
    reference: 'ASTM C78',
    relatedLabSlug: 'flexural-test',
  },
  {
    id: 'flexural-strength-outside-middle-third',
    name: 'Modulus of Rupture — Fracture Outside the Middle Third',
    nameBn: 'মডুলাস অফ রাপচার — মিডল থার্ডের বাইরে ফ্র্যাকচার',
    category: 'concrete',
    formula: 'R = 3Pa / bd²',
    variables: [
      { symbol: 'P', meaning: 'Maximum (failure) load', meaningBn: 'সর্বোচ্চ (failure) load' },
      { symbol: 'a', meaning: 'Distance from the nearest support to the fracture line', meaningBn: 'নিকটতম সাপোর্ট থেকে fracture line পর্যন্ত distance' },
      { symbol: 'b', meaning: 'Beam width', meaningBn: 'বিম width' },
      { symbol: 'd', meaning: 'Beam depth', meaningBn: 'বিম depth' },
    ],
    description: 'Used instead of R=PL/bd² when the fracture falls outside the middle third of the span, per ASTM C78.',
    descriptionBn: 'ASTM C78 অনুযায়ী fracture span-এর middle third-এর বাইরে পড়লে R=PL/bd²-এর বদলে এটা ব্যবহার করা হয়।',
    reference: 'ASTM C78',
    relatedLabSlug: 'flexural-test',
  },
  {
    id: 'steel-bar-weight',
    name: 'Reinforcement Bar Unit Weight',
    nameBn: 'রিইনফোর্সমেন্ট বার ইউনিট ওয়েট',
    category: 'concrete',
    formula: 'W = (π/4) × d² × 7850 kg/m³   (≈ d² / 162.2)',
    variables: [
      { symbol: 'd', meaning: 'Bar diameter, in meters (or mm/1000)', meaningBn: 'বার diameter, মিটারে (বা mm/1000)' },
    ],
    description: "Mild steel unit weight per meter of bar length; the d²/162.2 industry rule of thumb matches this exact physics to within 0.01%.",
    descriptionBn: 'বারের প্রতি মিটার length-এ mild steel-এর unit weight; d²/162.2 industry rule of thumb এই exact physics-এর সাথে ০.০১%-এর মধ্যে মেলে।',
    relatedToolSlug: 'steel-weight-calculator',
  },
  {
    id: 'concrete-dry-volume',
    name: 'Concrete Dry Volume Factor',
    nameBn: 'কংক্রিট ড্রাই ভলিউম ফ্যাক্টর',
    category: 'concrete',
    formula: 'Dry Volume = Wet Volume × 1.54',
    variables: [],
    description: 'Dry, loose ingredient volumes exceed the finished wet concrete volume, since compaction closes the voids between dry particles.',
    descriptionBn: 'Dry, loose ingredient volume আসলে finished wet concrete volume-এর চেয়ে বেশি হয়, কারণ compaction dry particle-এর মধ্যে void বন্ধ করে দেয়।',
    relatedToolSlug: 'concrete-calculator',
  },
  {
    id: 'terzaghi-bearing-capacity-strip',
    name: "Terzaghi's Ultimate Bearing Capacity — Strip Footing",
    nameBn: "Terzaghi-র Ultimate Bearing Capacity — স্ট্রিপ ফুটিং",
    category: 'geotechnical',
    formula: 'qu = c·Nc + q·Nq + 0.5·γ·B·Nγ',
    variables: [
      { symbol: 'c', meaning: 'Soil cohesion', meaningBn: 'Soil cohesion' },
      { symbol: 'q', meaning: 'Overburden pressure at footing base (γ×Df)', meaningBn: 'Footing base-এ overburden pressure (γ×Df)' },
      { symbol: 'γ', meaning: 'Soil unit weight', meaningBn: 'Soil unit weight' },
      { symbol: 'B', meaning: 'Footing width', meaningBn: 'ফুটিং width' },
      { symbol: 'Nc, Nq, Nγ', meaning: "Terzaghi's bearing capacity factors (function of friction angle φ)", meaningBn: 'Terzaghi-র bearing capacity factor (friction angle φ-এর function)' },
    ],
    description: "Nc and Nq have closed-form expressions; Nγ does not (Terzaghi derived it graphically) and is standardly read from a table instead.",
    descriptionBn: 'Nc এবং Nq-এর closed-form expression আছে; Nγ-এর নেই (Terzaghi graphically derive করেছিলেন) এবং সাধারণত table থেকে পড়া হয়।',
    reference: 'Terzaghi (1943), general shear case',
    relatedToolSlug: 'soil-bearing-calculator',
  },
  {
    id: 'plasticity-index',
    name: 'Plasticity Index',
    nameBn: 'প্লাস্টিসিটি ইনডেক্স',
    category: 'geotechnical',
    formula: 'PI = LL − PL',
    variables: [
      { symbol: 'LL', meaning: 'Liquid Limit', meaningBn: 'Liquid Limit' },
      { symbol: 'PL', meaning: 'Plastic Limit', meaningBn: 'Plastic Limit' },
    ],
    description: 'The range of moisture content over which a fine-grained soil stays plastic (moldable) rather than liquid or crumbly.',
    descriptionBn: 'যে moisture content-এর range জুড়ে একটা fine-grained soil liquid বা crumbly না হয়ে plastic (moldable) থাকে।',
    reference: 'ASTM D4318',
    relatedLabSlug: 'atterberg-limits',
  },
  {
    id: 'casagrande-a-line',
    name: "Casagrande A-Line",
    nameBn: 'Casagrande A-Line',
    category: 'geotechnical',
    formula: 'PI = 0.73 × (LL − 20)',
    variables: [
      { symbol: 'LL', meaning: 'Liquid Limit', meaningBn: 'Liquid Limit' },
    ],
    description: 'The boundary on the plasticity chart separating clay-like behavior (above the line) from silt-like behavior (below it).',
    descriptionBn: 'Plasticity chart-এ যে boundary clay-like behavior (line-এর উপরে) কে silt-like behavior (নিচে) থেকে আলাদা করে।',
    reference: 'Casagrande plasticity chart',
    relatedLabSlug: 'atterberg-limits',
  },
  {
    id: 'effective-stress',
    name: "Terzaghi's Effective Stress Principle",
    nameBn: "Terzaghi-র Effective Stress Principle",
    category: 'geotechnical',
    formula: "σᵥ′ = σᵥ − u",
    variables: [
      { symbol: 'σᵥ′', meaning: 'Effective vertical stress — what actually governs soil strength', meaningBn: 'Effective vertical stress — যা আসলে soil strength নিয়ন্ত্রণ করে' },
      { symbol: 'σᵥ', meaning: 'Total vertical stress', meaningBn: 'Total vertical stress' },
      { symbol: 'u', meaning: 'Pore water pressure', meaningBn: 'Pore water pressure' },
    ],
    description: 'Pore water pressure reduces effective stress below total stress; effective stress, not total stress, governs soil strength.',
    descriptionBn: 'Pore water pressure effective stress-কে total stress-এর চেয়ে কমিয়ে দেয়; total stress না, effective stress-ই soil strength নিয়ন্ত্রণ করে।',
      },
  {
    id: 'load-combination-strength',
    name: 'Strength-Level Load Combination',
    nameBn: 'Strength-Level Load Combination',
    category: 'structural',
    formula: 'Wu = 1.2D + 1.6L',
    variables: [
      { symbol: 'D', meaning: 'Dead load', meaningBn: 'ডেড লোড' },
      { symbol: 'L', meaning: 'Live load', meaningBn: 'লাইভ লোড' },
    ],
    description: 'The governing gravity load combination for strength design under BNBC 2020 / ACI 318-19.',
    descriptionBn: 'BNBC 2020 / ACI 318-19-এর অধীনে strength design-এর জন্য governing gravity load combination।',
    reference: 'BNBC 2020 / ACI 318-19',
    relatedToolSlug: 'load-calculator',
  },
  {
    id: 'beam-as-min',
    name: 'Minimum Flexural Reinforcement',
    nameBn: 'ন্যূনতম ফ্লেক্সারাল রিইনফোর্সমেন্ট',
    category: 'concrete',
    formula: 'As,min = max[ (1.4/fy)×b×d , (√fck / 4fy)×b×d ]',
    variables: [
      { symbol: 'b', meaning: 'Beam width', meaningBn: 'বিম width' },
      { symbol: 'd', meaning: 'Effective depth', meaningBn: 'Effective depth' },
      { symbol: 'fy', meaning: 'Steel yield strength', meaningBn: 'Steel yield strength' },
      { symbol: 'fck', meaning: 'Concrete characteristic strength', meaningBn: 'Concrete characteristic strength' },
    ],
    description: 'The minimum reinforcement a beam needs regardless of the moment demand, to avoid a sudden, brittle failure at first cracking.',
    descriptionBn: 'Moment demand যাই হোক না কেন, একটা বিম-এর ন্যূনতম যে reinforcement লাগে, প্রথম cracking-এই একটা sudden, brittle failure এড়াতে।',
    reference: 'BNBC 2020 / ACI 318-19',
  },
  {
    id: 'column-tie-spacing',
    name: 'Column Tie Spacing (Governing Minimum)',
    nameBn: 'কলাম টাই স্পেসিং (Governing Minimum)',
    category: 'concrete',
    formula: 'spacing = min( 16×dbar , 48×dtie , least column dimension )',
    variables: [
      { symbol: 'dbar', meaning: 'Longitudinal bar diameter', meaningBn: 'Longitudinal bar diameter' },
      { symbol: 'dtie', meaning: 'Tie bar diameter', meaningBn: 'Tie bar diameter' },
    ],
    description: 'The tightest of three code-based limits governs actual tie spacing in a tied column.',
    descriptionBn: 'একটা tied column-এ actual tie spacing তিনটা code-based limit-এর মধ্যে সবচেয়ে tight-টা দিয়ে governed হয়।',
    reference: 'ACI 318-19 / BNBC 2020',
  },
  {
    id: 'traverse-misclosure',
    name: 'Traverse Linear Misclosure',
    nameBn: 'ট্রাভার্স লিনিয়ার মিসক্লোজার',
    category: 'survey',
    formula: 'Misclosure = √( (ΣΔN)² + (ΣΔE)² )',
    variables: [
      { symbol: 'ΣΔN', meaning: 'Sum of latitudes (northing components) around the closed loop', meaningBn: 'Closed loop জুড়ে latitude (northing component)-এর যোগফল' },
      { symbol: 'ΣΔE', meaning: 'Sum of departures (easting components) around the closed loop', meaningBn: 'Closed loop জুড়ে departure (easting component)-এর যোগফল' },
    ],
    description: 'The residual gap between where a closed traverse\'s math says it ended and where it actually started — a direct measure of survey accuracy.',
    descriptionBn: 'একটা closed traverse-এর math যেখানে শেষ হয়েছে বলছে আর যেখানে আসলে শুরু হয়েছিল তার মধ্যে residual gap — survey accuracy-র একটা সরাসরি measure।',
    relatedLabSlug: 'traverse',
  },
  {
    id: 'slope-angle-from-ratio',
    name: 'Slope Angle from Ratio',
    nameBn: 'রেশিও থেকে স্লোপ অ্যাঙ্গেল',
    category: 'general',
    formula: 'θ = atan(V / H)',
    variables: [
      { symbol: 'V', meaning: 'Vertical rise', meaningBn: 'ভার্টিক্যাল rise' },
      { symbol: 'H', meaning: 'Horizontal run', meaningBn: 'হরাইজন্টাল run' },
    ],
    description: 'Converts a slope expressed as a ratio (e.g. 1.5:1) into an angle in degrees.',
    descriptionBn: 'একটা slope-কে ratio হিসেবে (যেমন 1.5:1) express করা থেকে degree-তে angle-এ convert করে।',
    relatedToolSlug: 'slope-calculator',
  },
  {
    id: 'stair-walking-line',
    name: 'Stair Walking-Line Rule',
    nameBn: 'স্টেয়ার ওয়াকিং-লাইন রুল',
    category: 'general',
    formula: '2×Riser + Tread ≈ 600mm',
    variables: [],
    description: 'The standard comfort target for residential stairs — this range keeps a natural stride comfortable across varying riser/tread proportions.',
    descriptionBn: 'Residential stair-এর জন্য standard comfort target — এই range বিভিন্ন riser/tread proportion জুড়ে একটা natural stride comfortable রাখে।',
    relatedToolSlug: 'stair-calculator',
  },
];

export function searchFormulas(query: string): FormulaEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return FORMULAS.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.nameBn.includes(query.trim()) ||
      f.description.toLowerCase().includes(q) ||
      f.formula.toLowerCase().includes(q) ||
      f.variables.some((v) => v.meaning.toLowerCase().includes(q))
  );
}
