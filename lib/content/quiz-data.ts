/**
 * All quiz/question content, hardcoded — no database. Same convention as
 * lib/content/course-data.ts: this was originally Prisma seed data, and
 * the quiz content itself is unchanged — only the loading mechanism
 * changed from "write these rows to Postgres" to "import this array
 * directly". `lib/content/index.ts` hydrates this with stable ids.
 */

// ---------------------------------------------------------------------
// Practice & Exam System (Part 14) — a starting set of two quizzes, not
// comprehensive coverage across every subject (same "structure now,
// content later" honesty as the rest of this seed file). Every
// numerical answer here is a value already independently verified
// elsewhere in this platform's build (the Beam, Soil Bearing, and
// Steel Weight tools) — reused, not re-derived from scratch, so a
// quiz answer can never quietly drift from the tool that taught the
// same number.
// ---------------------------------------------------------------------

export type QuizSeed = {
  title: string;
  category: string;
  timedSeconds: number | null;
  questions: {
    type: 'mcq' | 'numerical' | 'cq';
    prompt: string;
    choices?: { id: string; text: string }[];
    answer: Record<string, unknown>;
  }[];
};

export const rawQuizzes: QuizSeed[] = [
  {
    title: 'Structural Analysis Fundamentals',
    category: 'Structural Engineering',
    timedSeconds: 600,
    questions: [
      {
        type: 'mcq',
        prompt:
          'For a simply-supported beam under a uniformly distributed load, the maximum bending moment occurs:',
        choices: [
          { id: 'a', text: 'At the supports' },
          { id: 'b', text: 'At mid-span' },
          { id: 'c', text: 'At the quarter points' },
          { id: 'd', text: 'Nowhere in particular — it is constant along the span' },
        ],
        answer: { kind: 'mcq', correctChoiceIds: ['b'] },
      },
      {
        type: 'mcq',
        prompt: 'A short reinforced concrete column fails primarily by:',
        choices: [
          { id: 'a', text: 'Elastic (Euler) buckling' },
          { id: 'b', text: 'Material crushing' },
          { id: 'c', text: 'Fatigue' },
          { id: 'd', text: 'Creep' },
        ],
        answer: { kind: 'mcq', correctChoiceIds: ['b'] },
      },
      {
        type: 'numerical',
        prompt:
          'A simply-supported beam spans 6m and carries a uniformly distributed load of 10 kN/m. What is the maximum bending moment?',
        answer: { kind: 'numerical', value: 45.0, tolerancePercent: 2.0, unit: 'kN·m' },
      },
      {
        type: 'numerical',
        prompt: 'For that same beam, what is the maximum shear force?',
        answer: { kind: 'numerical', value: 30.0, tolerancePercent: 2.0, unit: 'kN' },
      },
      {
        type: 'cq',
        prompt:
          'Explain why reinforced concrete beams need both longitudinal bars and stirrups — why not longitudinal bars alone?',
        answer: {
          kind: 'cq',
          modelAnswer:
            'Longitudinal bars resist the tension a beam develops on its stretched face under bending — plain concrete is weak in tension, so steel carries that load instead. But bending isn\'t the only thing a beam resists: shear force produces diagonal tension cracks running at roughly 45° near the supports, and longitudinal bars (running along the beam\'s length) can\'t cross those diagonal cracks effectively. Stirrups, wrapped transversely around the section, cross those diagonal cracks directly and resist the shear-induced diagonal tension. Stirrups also hold the longitudinal bars in their correct position during casting and provide some confinement to the concrete core.',
        },
      },
    ],
  },
  {
    title: 'Geotechnical & Materials Basics',
    category: 'Geotechnical Engineering',
    timedSeconds: 480,
    questions: [
      {
        type: 'mcq',
        prompt: "Terzaghi's bearing capacity factor Nγ is typically obtained from:",
        choices: [
          { id: 'a', text: 'A closed-form formula, exactly like Nc and Nq' },
          { id: 'b', text: 'Tabulated values, since it has no clean closed form' },
          { id: 'c', text: 'It is always zero for any soil' },
          { id: 'd', text: 'Direct field measurement only, never a calculation' },
        ],
        answer: { kind: 'mcq', correctChoiceIds: ['b'] },
      },
      {
        type: 'mcq',
        prompt: "A soil's Plasticity Index (PI) is defined as:",
        choices: [
          { id: 'a', text: 'Liquid Limit + Plastic Limit' },
          { id: 'b', text: 'Liquid Limit − Plastic Limit' },
          { id: 'c', text: 'Liquid Limit ÷ Plastic Limit' },
          { id: 'd', text: 'Plastic Limit − Liquid Limit' },
        ],
        answer: { kind: 'mcq', correctChoiceIds: ['b'] },
      },
      {
        type: 'numerical',
        prompt:
          'A strip footing has cohesion c=0 kPa, friction angle φ=30°, soil unit weight γ=18 kN/m³, footing depth Df=1.5m, and width B=2.0m. Using Terzaghi\'s equation with Nc=37.2, Nq=22.5, Nγ=19.7, what is the ultimate bearing capacity qu?',
        answer: { kind: 'numerical', value: 962.1, tolerancePercent: 2.0, unit: 'kPa' },
      },
      {
        type: 'numerical',
        prompt: 'A 16mm diameter mild steel reinforcement bar has a unit weight of approximately how many kg per meter?',
        answer: { kind: 'numerical', value: 1.58, tolerancePercent: 3.0, unit: 'kg/m' },
      },
      {
        type: 'cq',
        prompt:
          "Explain why a soil's Optimum Moisture Content (OMC) exists — why doesn't compaction just keep improving as more water is added?",
        answer: {
          kind: 'cq',
          modelAnswer:
            "A little water lubricates soil particles, letting them slide past each other into a denser arrangement under the same compactive effort — so dry density rises as moisture increases, at first. Past a certain point, though, additional water starts filling void space that soil particles could otherwise have occupied, so dry density starts falling again even though more water keeps being added. That rise-then-fall is why there's a genuine peak — the Optimum Moisture Content — rather than a 'more water is always better' relationship, and it's also why no real compacted sample can exceed the theoretical zero-air-voids density at any given moisture content.",
        },
      },
    ],
  },
];

