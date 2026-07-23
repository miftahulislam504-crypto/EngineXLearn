/**
 * Direct Shear Test — calculation logic. ASTM D3080 / BNBC 2020 §6.6.
 *
 * Three (or more) trials, each at a different normal stress σ, each
 * measuring the peak shear stress τ the sample resists at failure. The
 * Mohr-Coulomb failure envelope — τ = c + σ·tan(φ) — is a straight line
 * through those points: cohesion c is the intercept, friction angle φ
 * comes from the slope (φ = atan(slope)). Same real-regression convention
 * as the Atterberg flow curve and the Compaction parabola: fit a line
 * through the actual trial points, don't just connect two of them.
 *
 * Real trial data is never perfectly linear, and a least-squares fit
 * through only 3 points can occasionally produce a small negative
 * intercept even for a genuinely cohesionless soil — that's measurement
 * scatter, not evidence of negative cohesion, which isn't physically
 * possible. Rather than silently reporting a negative number, this
 * clamps the *reported* cohesion at zero and says so explicitly when it
 * happens, while still using the raw regression line to explain the fit
 * quality.
 */

export interface ShearTrial {
  normalStressKpa: number;
  shearStressKpa: number;
}

export interface ShearEnvelopeFit {
  rawCohesionKpa: number;
  cohesionKpa: number; // clamped at 0
  cohesionClamped: boolean;
  frictionAngleDeg: number;
  slope: number;
  rSquared: number;
}

export function fitShearEnvelope(trials: ShearTrial[]): ShearEnvelopeFit | null {
  const valid = trials.filter((t) => t.normalStressKpa >= 0 && t.shearStressKpa >= 0);
  if (valid.length < 2) return null;

  const xs = valid.map((t) => t.normalStressKpa);
  const ys = valid.map((t) => t.shearStressKpa);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  if (den === 0) return null;

  const slope = num / den;
  const rawCohesionKpa = meanY - slope * meanX;
  const cohesionClamped = rawCohesionKpa < 0;
  const cohesionKpa = Math.max(0, Math.round(rawCohesionKpa * 10) / 10);
  const frictionAngleDeg = Math.round(Math.atan(slope) * (180 / Math.PI) * 100) / 100;

  const ssTot = ys.reduce((s, y) => s + (y - meanY) ** 2, 0);
  const ssRes = xs.reduce((s, x, i) => s + (ys[i] - (slope * x + rawCohesionKpa)) ** 2, 0);
  const rSquared = ssTot === 0 ? 1 : Math.round((1 - ssRes / ssTot) * 1000) / 1000;

  return {
    rawCohesionKpa: Math.round(rawCohesionKpa * 10) / 10,
    cohesionKpa,
    cohesionClamped,
    frictionAngleDeg,
    slope: Math.round(slope * 1000) / 1000,
    rSquared,
  };
}

export const SAMPLE_TRIALS: ShearTrial[] = [
  { normalStressKpa: 50, shearStressKpa: 38 },
  { normalStressKpa: 100, shearStressKpa: 68 },
  { normalStressKpa: 150, shearStressKpa: 98 },
];
