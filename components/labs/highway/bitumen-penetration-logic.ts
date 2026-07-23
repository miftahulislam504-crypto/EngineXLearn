/**
 * Bitumen Penetration Test — calculation logic. ASTM D5 / BS EN 1426,
 * BNBC 2020 §6.4. A standard needle (100g combined load: 50g needle +
 * 50g weight) penetrates a bitumen sample at 25°C for 5 seconds; the
 * penetration depth is read in "penetration units" (1 unit = 0.1mm).
 *
 * Three trials are averaged, with a repeatability check first — the same
 * "is this reading even valid before we report it" pattern as the Slump
 * Test's shear/collapse check and the Sieve Analysis mass-balance check.
 * The real ASTM D5 repeatability tolerance actually varies by penetration
 * range; this uses one simplified threshold across the whole range,
 * stated plainly as a simplification (same honesty convention as the
 * Sieve Analysis "simplified classroom version" of USCS).
 *
 * Grading matters because standard bitumen grades have genuine GAPS
 * between them (30/40, 40/50, 60/70, 80/100, 120/150 — there is no
 * standard "50/60" grade). A result landing in one of those gaps isn't a
 * calculation error; it's a real result that doesn't match a standard
 * commercial grade, and the classifier reports that explicitly rather
 * than mis-filing it into whichever band happens to be nearest.
 */

export interface PenetrationGradeBand {
  minDmm: number;
  maxDmm: number;
  label: string;
}

export const GRADE_BANDS: PenetrationGradeBand[] = [
  { minDmm: 30, maxDmm: 40, label: '30/40' },
  { minDmm: 40, maxDmm: 50, label: '40/50' },
  { minDmm: 60, maxDmm: 70, label: '60/70' },
  { minDmm: 80, maxDmm: 100, label: '80/100' },
  { minDmm: 120, maxDmm: 150, label: '120/150' },
];

export const REPEATABILITY_MAX_SPREAD_DMM = 4;
const EPS = 1e-6;

export type GradeClassification =
  | { kind: 'standard-grade'; label: string }
  | { kind: 'between-grades'; lower: string; upper: string }
  | { kind: 'below-range' }
  | { kind: 'above-range' };

export interface PenetrationResult {
  averageDmm: number;
  spreadDmm: number;
  repeatable: boolean;
  classification: GradeClassification | null; // null when not repeatable — no grade is reported off an invalid test
}

export function classifyPenetrationGrade(avgDmm: number): GradeClassification {
  if (avgDmm < GRADE_BANDS[0].minDmm) return { kind: 'below-range' };
  const last = GRADE_BANDS[GRADE_BANDS.length - 1];
  if (avgDmm > last.maxDmm) return { kind: 'above-range' };

  for (const band of GRADE_BANDS) {
    if (avgDmm >= band.minDmm && avgDmm <= band.maxDmm) {
      return { kind: 'standard-grade', label: band.label };
    }
  }

  // Falls in a genuine gap between two standard grades.
  const lower = GRADE_BANDS.filter((b) => b.maxDmm < avgDmm).sort((a, b) => b.maxDmm - a.maxDmm)[0];
  const upper = GRADE_BANDS.filter((b) => b.minDmm > avgDmm).sort((a, b) => a.minDmm - b.minDmm)[0];
  return { kind: 'between-grades', lower: lower.label, upper: upper.label };
}

export function computePenetration(trialsDmm: number[]): PenetrationResult {
  const valid = trialsDmm.filter((v) => v >= 0);
  const averageDmm = Math.round((valid.reduce((s, v) => s + v, 0) / valid.length) * 10) / 10;
  const spreadDmm = Math.round((Math.max(...valid) - Math.min(...valid)) * 10) / 10;
  const repeatable = spreadDmm <= REPEATABILITY_MAX_SPREAD_DMM + EPS;

  return {
    averageDmm,
    spreadDmm,
    repeatable,
    classification: repeatable ? classifyPenetrationGrade(averageDmm) : null,
  };
}

export const SAMPLE_TRIALS_DMM = [64, 67, 66];
