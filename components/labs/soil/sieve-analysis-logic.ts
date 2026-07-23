/**
 * Sieve Analysis (Gradation Test) — calculation logic.
 *
 * Kept separate from the React component so the math is one place to read,
 * review, and (if this project ever adds a test runner) unit test —
 * exactly the kind of file where the buckling-visualizer unit bug from
 * Phase 3 would have been caught faster if the formula had lived somewhere
 * this isolated to begin with.
 */

export const STANDARD_SIEVES_MM = [19.0, 9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15, 0.075] as const;

export interface SieveRow {
  sizeMm: number;
  retainedG: number;
}

export interface GradationPoint {
  sizeMm: number;
  cumulativeRetainedG: number;
  percentPassing: number;
}

export type GradationClassification =
  | { kind: 'insufficient-data' }
  | { kind: 'well-graded' }
  | { kind: 'poorly-graded'; failedCu: boolean; failedCc: boolean; cu: number; cc: number };

export interface GradationResult {
  points: GradationPoint[];
  panG: number;
  totalMassG: number;
  massBalanceOk: boolean; // sum(retained) + pan should equal totalMassG within tolerance
  d10: number | null;
  d30: number | null;
  d60: number | null;
  coefficientOfUniformity: number | null; // Cu = D60/D10
  coefficientOfCurvature: number | null; // Cc = D30² / (D10 × D60)
  classification: GradationClassification;
}

/**
 * A representative sandy-gravel sample — realistic retained weights that
 * produce a genuine S-shaped gradation curve, not a straight line. Used to
 * pre-fill the data-entry stage so the lab is immediately runnable as a
 * demo, while every cell stays editable.
 */
export const SAMPLE_RETAINED_G: Record<number, number> = {
  19.0: 0,
  9.5: 25,
  4.75: 75,
  2.36: 90,
  1.18: 85,
  0.6: 80,
  0.3: 65,
  0.15: 45,
  0.075: 25,
};
export const SAMPLE_TOTAL_MASS_G = 500;

/**
 * Linear interpolation in log(sieve size) space to find the sieve size at
 * which percent-passing crosses a target value. Log space, not linear
 * space, because gradation curves are conventionally plotted (and read)
 * on a log-x axis — particle sizes span orders of magnitude, and reading
 * D10/D30/D60 off a linearly-interpolated curve would give a different
 * (incorrect, relative to how the test is actually practiced) answer than
 * reading it off the semi-log plot a real lab report uses.
 */
function interpolateD(
  targetPercent: number,
  points: GradationPoint[]
): number | null {
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    // percentPassing decreases monotonically as sieve size decreases (coarse -> fine),
    // so look for the bracketing pair where target falls between them.
    if (p1.percentPassing >= targetPercent && targetPercent >= p2.percentPassing) {
      if (p1.percentPassing === p2.percentPassing) return p1.sizeMm;
      const logS1 = Math.log10(p1.sizeMm);
      const logS2 = Math.log10(p2.sizeMm);
      const frac = (p1.percentPassing - targetPercent) / (p1.percentPassing - p2.percentPassing);
      const logD = logS1 + frac * (logS2 - logS1);
      return Math.pow(10, logD);
    }
  }
  return null; // target percent is outside the tested range — can't interpolate
}

export function computeGradation(rows: SieveRow[], totalMassG: number): GradationResult {
  const sorted = [...rows].sort((a, b) => b.sizeMm - a.sizeMm); // coarse to fine

  const sumRetained = sorted.reduce((sum, r) => sum + r.retainedG, 0);
  const panG = Math.max(0, totalMassG - sumRetained);
  const massBalanceOk = Math.abs(sumRetained + panG - totalMassG) < 0.01;

  let cumulative = 0;
  const points: GradationPoint[] = sorted.map((row) => {
    cumulative += row.retainedG;
    const percentPassing = totalMassG > 0 ? (100 * (totalMassG - cumulative)) / totalMassG : 0;
    return {
      sizeMm: row.sizeMm,
      cumulativeRetainedG: cumulative,
      percentPassing: Math.round(percentPassing * 10) / 10,
    };
  });

  const d10 = interpolateD(10, points);
  const d30 = interpolateD(30, points);
  const d60 = interpolateD(60, points);

  const coefficientOfUniformity = d10 && d60 && d10 > 0 ? Math.round((d60 / d10) * 100) / 100 : null;
  const coefficientOfCurvature =
    d10 && d30 && d60 && d10 > 0 && d60 > 0
      ? Math.round(((d30 * d30) / (d10 * d60)) * 100) / 100
      : null;

  const classification = classifyGradation(coefficientOfUniformity, coefficientOfCurvature);

  return {
    points,
    panG,
    totalMassG,
    massBalanceOk,
    d10,
    d30,
    d60,
    coefficientOfUniformity,
    coefficientOfCurvature,
    classification,
  };
}

/**
 * USCS-style well-graded check. This is deliberately the simplified
 * classroom version (Cu/Cc thresholds only) rather than the full USCS
 * flowchart (which also needs fines content, plasticity index, etc.) — the
 * lesson this lab attaches to is an introductory gradation test, not a
 * full soil classification course, so the report says exactly that rather
 * than implying a complete USCS classification was performed.
 */
/**
 * USCS-style well-graded check. This is deliberately the simplified
 * classroom version (Cu/Cc thresholds only) rather than the full USCS
 * flowchart (which also needs fines content, plasticity index, etc.).
 * Returns structured data rather than a formatted sentence — the caller
 * (a UI component with access to the current locale's dictionary) is
 * responsible for turning this into a translated sentence. Keeping
 * presentation text out of the calculation layer is what makes this
 * translatable without the logic file needing to know about locales.
 */
function classifyGradation(cu: number | null, cc: number | null): GradationClassification {
  if (cu === null || cc === null) {
    return { kind: 'insufficient-data' };
  }

  const wellGraded = cu > 4 && cc >= 1 && cc <= 3;

  if (wellGraded) {
    return { kind: 'well-graded' };
  }

  return {
    kind: 'poorly-graded',
    failedCu: cu <= 4,
    failedCc: cc < 1 || cc > 3,
    cu,
    cc,
  };
}
