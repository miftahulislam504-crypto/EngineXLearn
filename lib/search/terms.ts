/**
 * Engineering Term Search (Part 21) — a glossary of core terms that
 * already appear throughout this platform's lesson content, labs,
 * tools, and visualizations. Definitions here are restated consistent
 * with how each term was already explained where it was first taught
 * — not fresh, independent definitions that could drift from what a
 * learner already read in a lesson.
 */

export type TermCategory = 'structural' | 'geotechnical' | 'concrete' | 'survey' | 'general';

export interface TermEntry {
  id: string;
  term: string;
  termBn: string;
  category: TermCategory;
  definition: string;
  definitionBn: string;
}

export const TERMS: TermEntry[] = [
  {
    id: 'bending-moment',
    term: 'Bending Moment',
    termBn: 'বেন্ডিং মোমেন্ট',
    category: 'structural',
    definition: 'The internal rotational effect that causes a beam to bend — the product of a force and its distance from the point being considered.',
    definitionBn: 'একটা internal rotational effect যা একটা beam-কে বাঁকায় — একটা force এবং যে পয়েন্ট বিবেচনা করা হচ্ছে তার থেকে distance-এর গুণফল।',
  },
  {
    id: 'shear-force',
    term: 'Shear Force',
    termBn: 'শিয়ার ফোর্স',
    category: 'structural',
    definition: 'The internal force acting perpendicular to a beam\'s axis at a given section — what tends to cause one part of the beam to slide past the adjacent part.',
    definitionBn: 'একটা beam-এর axis-এর সাথে perpendicular ভাবে একটা নির্দিষ্ট section-এ কাজ করা internal force — যা beam-এর একটা অংশকে পাশের অংশের উপর দিয়ে slide করাতে চায়।',
  },
  {
    id: 'effective-stress',
    term: 'Effective Stress',
    termBn: 'ইফেক্টিভ স্ট্রেস',
    category: 'geotechnical',
    definition: "The portion of total soil stress actually carried by the soil skeleton (particle-to-particle contact), not the pore water — the stress that governs soil strength, per Terzaghi's principle.",
    definitionBn: 'Total soil stress-এর যে অংশ আসলে soil skeleton (particle-to-particle contact) বহন করে, pore water না — যে stress soil strength নিয়ন্ত্রণ করে, Terzaghi-র principle অনুযায়ী।',
  },
  {
    id: 'bearing-capacity',
    term: 'Bearing Capacity',
    termBn: 'বেয়ারিং ক্যাপাসিটি',
    category: 'geotechnical',
    definition: 'The maximum pressure a soil can support without shear failure (ultimate) or without excessive settlement (safe, after applying a factor of safety).',
    definitionBn: 'একটা soil shear failure ছাড়া (ultimate) বা অতিরিক্ত settlement ছাড়া (safe, একটা factor of safety apply করার পর) যে সর্বোচ্চ pressure বহন করতে পারে।',
  },
  {
    id: 'plasticity-index-term',
    term: 'Plasticity Index (PI)',
    termBn: 'প্লাস্টিসিটি ইনডেক্স (PI)',
    category: 'geotechnical',
    definition: 'The range of moisture content (Liquid Limit minus Plastic Limit) over which a fine-grained soil behaves as a plastic, moldable material.',
    definitionBn: 'যে moisture content range (Liquid Limit বিয়োগ Plastic Limit) জুড়ে একটা fine-grained soil একটা plastic, moldable material হিসেবে behave করে।',
  },
  {
    id: 'liquid-limit',
    term: 'Liquid Limit (LL)',
    termBn: 'লিকুইড লিমিট (LL)',
    category: 'geotechnical',
    definition: 'The moisture content at which a fine-grained soil transitions from a liquid-like to a plastic (moldable) state, measured by the Casagrande method.',
    definitionBn: 'যে moisture content-এ একটা fine-grained soil liquid-like থেকে plastic (moldable) state-এ transition করে, Casagrande method দিয়ে মাপা হয়।',
  },
  {
    id: 'plastic-limit',
    term: 'Plastic Limit (PL)',
    termBn: 'প্লাস্টিক লিমিট (PL)',
    category: 'geotechnical',
    definition: 'The moisture content at which a fine-grained soil transitions from plastic to semi-solid — the point where a 3mm-diameter rolled thread just crumbles.',
    definitionBn: 'যে moisture content-এ একটা fine-grained soil plastic থেকে semi-solid-এ transition করে — যে পয়েন্টে একটা 3mm-diameter rolled thread ঠিক crumble করে।',
  },
  {
    id: 'modulus-of-rupture',
    term: 'Modulus of Rupture',
    termBn: 'মডুলাস অফ রাপচার',
    category: 'concrete',
    definition: "Concrete's flexural (bending) tensile strength, measured by breaking a beam in third-point loading — genuinely different from, and much lower than, its compressive strength.",
    definitionBn: 'কংক্রিটের flexural (bending) tensile strength, third-point loading-এ একটা beam ভেঙে মাপা হয় — এর compressive strength থেকে সত্যিই ভিন্ন, এবং অনেক কম।',
  },
  {
    id: 'characteristic-strength',
    term: 'Characteristic Strength',
    termBn: 'ক্যারেক্টারিস্টিক স্ট্রেংথ',
    category: 'concrete',
    definition: 'The strength value below which no more than 5% of test results are expected to fall — not the raw average, which is why concrete mixes are designed with a margin above it.',
    definitionBn: 'যে strength value-এর নিচে test result-এর ৫%-এর বেশি পড়ার কথা না — raw average না, যে কারণে কংক্রিট mix এর উপরে একটা margin দিয়ে design করা হয়।',
  },
  {
    id: 'factor-of-safety',
    term: 'Factor of Safety',
    termBn: 'ফ্যাক্টর অফ সেফটি',
    category: 'general',
    definition: 'The ratio of a system\'s ultimate (failure) capacity to the actual demand placed on it — a deliberate margin covering real-world variability, not a precision estimate.',
    definitionBn: 'একটা system-এর ultimate (failure) capacity এবং তার উপর প্রকৃত demand-এর ratio — real-world variability কভার করার একটা deliberate margin, একটা precision estimate না।',
  },
  {
    id: 'zero-air-voids',
    term: 'Zero Air Voids (ZAV)',
    termBn: 'জিরো এয়ার ভয়েডস (ZAV)',
    category: 'geotechnical',
    definition: 'The theoretical maximum dry density a soil could reach at a given moisture content if every air void were eliminated — a physical ceiling real compaction can approach but never exceed.',
    definitionBn: 'একটা soil একটা নির্দিষ্ট moisture content-এ যে theoretical maximum dry density-তে পৌঁছাতে পারত যদি প্রতিটা air void বাদ যেত — একটা physical ceiling যা real compaction কাছাকাছি যেতে পারে কিন্তু কখনো ছাড়িয়ে যেতে পারে না।',
  },
  {
    id: 'optimum-moisture-content',
    term: 'Optimum Moisture Content (OMC)',
    termBn: 'অপটিমাম ময়েশ্চার কন্টেন্ট (OMC)',
    category: 'geotechnical',
    definition: 'The moisture content at which a given compactive effort achieves the maximum dry density — water lubricates particles up to this point, then starts displacing them past it.',
    definitionBn: 'যে moisture content-এ একটা নির্দিষ্ট compactive effort সর্বোচ্চ dry density অর্জন করে — এই পয়েন্ট পর্যন্ত পানি particle-কে lubricate করে, তারপর এর পরে particle-কে displace করা শুরু করে।',
  },
  {
    id: 'cohesion',
    term: 'Cohesion (c)',
    termBn: 'কোহেশন (c)',
    category: 'geotechnical',
    definition: 'The shear strength a soil has even under zero normal stress — particle-to-particle bonding that clay-rich soils have and clean sands essentially don\'t.',
    definitionBn: 'শূন্য normal stress-এর নিচেও একটা soil-এর যে shear strength থাকে — particle-to-particle bonding যা clay-rich soil-এর আছে এবং clean sand-এর মূলত নেই।',
  },
  {
    id: 'friction-angle',
    term: 'Friction Angle (φ)',
    termBn: 'ফ্রিকশন অ্যাঙ্গেল (φ)',
    category: 'geotechnical',
    definition: 'How much additional shear strength a soil develops as normal stress on it increases — the primary strength source for cohesionless soils like clean sand.',
    definitionBn: 'একটা soil-এর উপর normal stress বাড়ার সাথে সাথে কতটা additional shear strength develop করে — clean sand-এর মতো cohesionless soil-এর জন্য প্রধান strength উৎস।',
  },
  {
    id: 'development-length',
    term: 'Development Length',
    termBn: 'ডেভেলপমেন্ট লেংথ',
    category: 'concrete',
    definition: 'The embedment length a reinforcing bar needs within concrete to develop its full design stress through bond, without slipping or pulling out.',
    definitionBn: 'বন্ডের মাধ্যমে তার পূর্ণ design stress develop করতে একটা reinforcing bar-এর কংক্রিটের ভেতরে যে embedment length লাগে, slip বা pull out না করে।',
  },
  {
    id: 'slump',
    term: 'Slump',
    termBn: 'স্লাম্প',
    category: 'concrete',
    definition: "A measure of fresh concrete's workability — how much a standard cone-shaped sample settles under its own weight after the mould is lifted.",
    definitionBn: 'Fresh কংক্রিটের workability-র একটা measure — mould তুলে ফেলার পর একটা স্ট্যান্ডার্ড cone-shaped নমুনা নিজের ওজনে কতটা settle করে।',
  },
  {
    id: 'relative-precision',
    term: 'Relative Precision',
    termBn: 'রিলেটিভ প্রিসিশন',
    category: 'survey',
    definition: 'A survey\'s linear misclosure expressed as a ratio to the total distance measured (1:N) — comparable across surveys of any size, unlike raw misclosure alone.',
    definitionBn: 'একটা survey-র linear misclosure মোট মাপা distance-এর সাথে একটা ratio হিসেবে express করা (1:N) — যেকোনো size-এর survey জুড়ে comparable, শুধু raw misclosure-এর মতো না।',
  },
  {
    id: 'misclosure',
    term: 'Misclosure',
    termBn: 'মিসক্লোজার',
    category: 'survey',
    definition: 'The small gap between where a closed traverse\'s measurements say it ended and where it actually started — a direct, built-in check on survey accuracy.',
    definitionBn: 'একটা closed traverse-এর measurement যেখানে শেষ হয়েছে বলছে আর যেখানে আসলে শুরু হয়েছিল তার মধ্যে ছোট gap — survey accuracy-র একটা সরাসরি, built-in check।',
  },
  {
    id: 'tributary-area',
    term: 'Tributary Area',
    termBn: 'ট্রিবিউটারি এরিয়া',
    category: 'structural',
    definition: 'The floor area whose load is assumed to funnel into a particular column or beam — used to estimate that member\'s share of the total building load.',
    definitionBn: 'যে floor area-র load একটা নির্দিষ্ট column বা beam-এ funnel হওয়ার কথা ধরা হয় — সেই member-এর মোট building load-এর share estimate করতে ব্যবহার করা হয়।',
  },
  {
    id: 'dead-load',
    term: 'Dead Load',
    termBn: 'ডেড লোড',
    category: 'structural',
    definition: 'The permanent, unchanging weight of a structure itself — its own materials, finishes, and fixed equipment — as opposed to occupancy-dependent live load.',
    definitionBn: 'একটা structure-এর নিজের permanent, অপরিবর্তনীয় ওজন — নিজের material, finishes, এবং fixed equipment — occupancy-নির্ভর live load-এর বিপরীতে।',
  },
  {
    id: 'live-load',
    term: 'Live Load',
    termBn: 'লাইভ লোড',
    category: 'structural',
    definition: 'The variable, occupancy-dependent load a structure carries — people, furniture, movable equipment — as opposed to the fixed dead load.',
    definitionBn: 'একটা structure যে variable, occupancy-নির্ভর load বহন করে — মানুষ, furniture, movable equipment — fixed dead load-এর বিপরীতে।',
  },
  {
    id: 'gradation',
    term: 'Gradation',
    termBn: 'গ্রেডেশন',
    category: 'geotechnical',
    definition: 'The particle-size distribution of a granular soil or aggregate — whether it has a good spread of sizes (well-graded) or is dominated by a narrow size range (poorly-graded).',
    definitionBn: 'একটা granular soil বা aggregate-এর particle-size distribution — এতে size-এর একটা ভালো spread আছে (well-graded) নাকি একটা narrow size range dominate করে (poorly-graded)।',
  },
  {
    id: 'penetration-grade',
    term: 'Penetration Grade (Bitumen)',
    termBn: 'পেনিট্রেশন গ্রেড (বিটুমেন)',
    category: 'general',
    definition: 'A bitumen hardness classification (e.g. 60/70) based on how far a standard needle sinks into a sample under fixed load, temperature, and time — higher penetration means softer bitumen.',
    definitionBn: 'একটা bitumen hardness classification (যেমন 60/70) — fixed load, temperature, এবং time-এ একটা standard needle একটা নমুনায় কতদূর sink করে তার ভিত্তিতে — বেশি penetration মানে নরম বিটুমেন।',
  },
];

export function searchTerms(query: string): TermEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.termBn.includes(query.trim()) ||
      t.definition.toLowerCase().includes(q)
  );
}
