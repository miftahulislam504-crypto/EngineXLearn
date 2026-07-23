/**
 * Steel Weight Calculator — reinforcement bar weight from diameter and
 * length. Uses the exact physics (mild steel density 7850 kg/m³ ×
 * cross-sectional area), which independently reproduces the widely-used
 * d²/162.2 rule-of-thumb to within 0.01% at every standard bar size —
 * verified before this file was written, so the "quick" formula and the
 * "exact" formula are confirmed to be the same thing, not two competing
 * approximations.
 */

export const STEEL_DENSITY_KG_M3 = 7850;
export const STANDARD_BAR_DIAMETERS_MM = [6, 8, 10, 12, 16, 20, 25, 28, 32];

export function barWeightKgPerM(diameterMm: number): number {
  const areaM2 = (Math.PI / 4) * (diameterMm / 1000) ** 2;
  return STEEL_DENSITY_KG_M3 * areaM2;
}

export interface SteelWeightResult {
  weightPerMeterKg: number;
  totalWeightKg: number;
}

export function computeSteelWeight(diameterMm: number, lengthM: number, quantity: number): SteelWeightResult {
  const weightPerMeterKg = Math.round(barWeightKgPerM(diameterMm) * 10000) / 10000;
  const totalWeightKg = Math.round(weightPerMeterKg * lengthM * quantity * 100) / 100;
  return { weightPerMeterKg, totalWeightKg };
}
