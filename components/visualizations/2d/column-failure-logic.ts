/**
 * Column Failure — crushing capacity vs. Euler buckling capacity compared
 * across slenderness ratio, showing which failure mode actually governs
 * and where the two curves cross.
 *
 * Crushing (squash) capacity: P_crush = Fy × A — constant, independent of
 * length/slenderness entirely.
 *
 * Buckling capacity: P_cr = π²EI / (KL)² — the same formula as
 * column-buckling-visualizer.tsx, decreasing as slenderness increases.
 *
 * The crossover slenderness (where P_crush = P_cr) has a closed form,
 * solved analytically rather than searched for numerically:
 *
 *   s_crossover = √(π²EI / (Fy·A·r²))
 *
 * Verified independently before this file was written: for the
 * representative column below (same cross-section as the buckling
 * visualizer, Fy = 250 MPa), the crossover comes out to slenderness
 * ≈ 88.86, and both formulas agree there at exactly 1200.00 kN —
 * confirming the closed form against the two capacity formulas directly.
 */

const E_STEEL_MPA = 200_000;
const FY_STEEL_MPA = 250; // mild structural steel yield stress
const K_FACTOR = 1.0;

// Same representative mid-size steel column as column-buckling-visualizer.tsx —
// kept consistent so the two visualizations describe the same physical column.
export const RADIUS_OF_GYRATION_MM = 40;
export const AREA_MM2 = 4800;
const I_MM4 = RADIUS_OF_GYRATION_MM ** 2 * AREA_MM2;

export interface ColumnFailureResult {
  crushingCapacityKn: number; // constant across all slenderness
  bucklingCapacityKn: number; // at the given slenderness
  governingMode: 'crushing' | 'buckling';
  governingCapacityKn: number;
  crossoverSlenderness: number;
}

export function computeColumnFailure(slenderness: number): ColumnFailureResult {
  const crushingCapacityN = FY_STEEL_MPA * AREA_MM2;

  const lengthMm = (slenderness * RADIUS_OF_GYRATION_MM) / K_FACTOR;
  const bucklingCapacityN =
    lengthMm > 0 ? (Math.PI ** 2 * E_STEEL_MPA * I_MM4) / (K_FACTOR * lengthMm) ** 2 : Infinity;

  const governingMode: 'crushing' | 'buckling' =
    crushingCapacityN <= bucklingCapacityN ? 'crushing' : 'buckling';
  const governingCapacityN = Math.min(crushingCapacityN, bucklingCapacityN);

  const crossoverSlenderness = Math.sqrt(
    (Math.PI ** 2 * E_STEEL_MPA * I_MM4) / (FY_STEEL_MPA * AREA_MM2 * RADIUS_OF_GYRATION_MM ** 2)
  );

  return {
    crushingCapacityKn: Math.round((crushingCapacityN / 1000) * 100) / 100,
    bucklingCapacityKn: Math.round((bucklingCapacityN / 1000) * 100) / 100,
    governingMode,
    governingCapacityKn: Math.round((governingCapacityN / 1000) * 100) / 100,
    crossoverSlenderness: Math.round(crossoverSlenderness * 100) / 100,
  };
}

/**
 * Generates a data series across a slenderness range for plotting both
 * curves together — used by the chart, not by the single-point summary.
 */
export function generateColumnFailureCurve(
  minSlenderness: number,
  maxSlenderness: number,
  steps: number
): { slenderness: number; crushingKn: number; bucklingKn: number }[] {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const slenderness = minSlenderness + ((maxSlenderness - minSlenderness) * i) / steps;
    const result = computeColumnFailure(slenderness);
    points.push({
      slenderness: Math.round(slenderness * 10) / 10,
      crushingKn: result.crushingCapacityKn,
      bucklingKn: result.bucklingCapacityKn,
    });
  }
  return points;
}
