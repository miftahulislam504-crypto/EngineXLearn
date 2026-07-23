/**
 * Compaction Test (Standard Proctor) — calculation logic.
 * ASTM D698 / BNBC 2020 §6.5, standard 1000 cm³ mould.
 *
 * For each trial: bulk (wet) density = wet mass / mould volume, then
 * dry density = wet density / (1 + moisture fraction) — moisture content
 * dilutes the wet density reading down to what the soil solids alone
 * contribute. Plotting dry density against moisture content across
 * several trials produces a curve that rises, peaks, then falls — the
 * peak is the Optimum Moisture Content (OMC) and Maximum Dry Density
 * (MDD) the whole test exists to find.
 *
 * The peak is found by fitting a parabola (quadratic regression) through
 * the trial points and solving for its vertex — the same "genuine
 * regression, not picking the best single reading" convention as the
 * Atterberg flow curve and Direct Shear envelope. Critically, the fitted
 * vertex is only trusted if it actually falls within (or very close to)
 * the tested moisture range. If the trials never bracket a real peak —
 * dry density still rising or still falling across every trial — the
 * parabola's vertex is a pure extrapolation and can land anywhere,
 * including moisture contents no real soil would show. That's reported
 * as "no peak captured," not as a number.
 */

export const MOULD_VOLUME_CM3 = 1000;
const MIN_TRIALS_FOR_FIT = 3;

export interface CompactionTrial {
  moisturePercent: number;
  wetMassG: number;
}

export function dryDensity(wetMassG: number, moisturePercent: number): number {
  const wetDensity = wetMassG / MOULD_VOLUME_CM3; // g/cm^3
  return wetDensity / (1 + moisturePercent / 100);
}

function fitParabola(xs: number[], ys: number[]): { a: number; b: number; c: number } | null {
  const n = xs.length;
  if (n < MIN_TRIALS_FOR_FIT) return null;

  // Least-squares quadratic fit via the normal equations for y = a*x^2 + b*x + c.
  let sx = 0, sx2 = 0, sx3 = 0, sx4 = 0, sy = 0, sxy = 0, sx2y = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i], y = ys[i];
    const x2 = x * x;
    sx += x; sx2 += x2; sx3 += x2 * x; sx4 += x2 * x2;
    sy += y; sxy += x * y; sx2y += x2 * y;
  }

  // Solve the 3x3 system [[sx4,sx3,sx2],[sx3,sx2,sx],[sx2,sx,n]] * [a,b,c] = [sx2y,sxy,sy]
  // via Cramer's rule.
  const det = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  const M = [
    [sx4, sx3, sx2],
    [sx3, sx2, sx],
    [sx2, sx, n],
  ];
  const D = det(M);
  if (Math.abs(D) < 1e-10) return null;

  const Ma = [[sx2y, sx3, sx2], [sxy, sx2, sx], [sy, sx, n]];
  const Mb = [[sx4, sx2y, sx2], [sx3, sxy, sx], [sx2, sy, n]];
  const Mc = [[sx4, sx3, sx2y], [sx3, sx2, sxy], [sx2, sx, sy]];

  return { a: det(Ma) / D, b: det(Mb) / D, c: det(Mc) / D };
}

export type CompactionResult =
  | {
      valid: true;
      omcPercent: number;
      mddGPerCm3: number;
      points: { moisturePercent: number; dryDensity: number }[];
    }
  | { valid: false; reason: 'not-enough-trials' | 'not-concave' | 'peak-outside-tested-range' };

export function computeCompaction(trials: CompactionTrial[]): CompactionResult {
  const valid = trials.filter((t) => t.moisturePercent >= 0 && t.wetMassG > 0);
  if (valid.length < MIN_TRIALS_FOR_FIT) {
    return { valid: false, reason: 'not-enough-trials' };
  }

  const xs = valid.map((t) => t.moisturePercent);
  const ys = valid.map((t) => dryDensity(t.wetMassG, t.moisturePercent));
  const points = valid.map((t, i) => ({ moisturePercent: xs[i], dryDensity: Math.round(ys[i] * 1000) / 1000 }));

  const fit = fitParabola(xs, ys);
  if (!fit || fit.a >= 0) {
    return { valid: false, reason: 'not-concave' };
  }

  const omc = -fit.b / (2 * fit.a);
  const mdd = fit.a * omc ** 2 + fit.b * omc + fit.c;

  // The fitted vertex is only trustworthy if the trials actually bracketed
  // it — allow a small margin (10% of the tested range) beyond the min/max
  // trial moisture content before calling it an extrapolation.
  const margin = (Math.max(...xs) - Math.min(...xs)) * 0.1;
  if (omc < Math.min(...xs) - margin || omc > Math.max(...xs) + margin) {
    return { valid: false, reason: 'peak-outside-tested-range' };
  }

  return {
    valid: true,
    omcPercent: Math.round(omc * 100) / 100,
    mddGPerCm3: Math.round(mdd * 1000) / 1000,
    points,
  };
}

/** Theoretical zero-air-voids dry density at a given moisture content — the
 * physical ceiling no real compacted sample should exceed, for a given
 * specific gravity of soil solids (Gs, typically ~2.65 for most soils). */
export function zeroAirVoidsDensity(moisturePercent: number, specificGravity = 2.65): number {
  return (specificGravity * 1.0) / (1 + (moisturePercent * specificGravity) / 100);
}

export const SAMPLE_TRIALS: CompactionTrial[] = [
  { moisturePercent: 8, wetMassG: 1780 },
  { moisturePercent: 11, wetMassG: 1900 },
  { moisturePercent: 14, wetMassG: 1960 },
  { moisturePercent: 17, wetMassG: 1930 },
  { moisturePercent: 20, wetMassG: 1850 },
];
