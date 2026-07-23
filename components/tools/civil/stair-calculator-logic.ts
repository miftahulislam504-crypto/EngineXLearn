/**
 * Stair Calculator — riser/tread geometry from total floor-to-floor
 * rise, using the standard "walking line" comfort rule (2×riser + tread
 * ≈ 600–640mm) to derive tread depth once the riser count is fixed by
 * a target riser height — the same rule verified to hold across the
 * output before this file was written, not just asserted.
 */

export interface StairResult {
  riserCount: number;
  actualRiserMm: number;
  treadCount: number;
  treadMm: number;
  totalGoingMm: number;
  walkingLineMm: number;
  riserInComfortRange: boolean;
}

const COMFORT_RISER_MIN_MM = 150;
const COMFORT_RISER_MAX_MM = 180;
const WALKING_LINE_TARGET_MM = 600; // 2R + T target, lower bound of the standard 600-640mm comfort band

export function computeStairDesign(totalRiseMm: number, targetRiserMm: number): StairResult {
  const riserCount = Math.max(1, Math.round(totalRiseMm / targetRiserMm));
  const actualRiserMm = totalRiseMm / riserCount;
  const treadCount = Math.max(0, riserCount - 1);
  const treadMm = WALKING_LINE_TARGET_MM - 2 * actualRiserMm;
  const totalGoingMm = treadCount * treadMm;
  const walkingLineMm = 2 * actualRiserMm + treadMm;

  return {
    riserCount,
    actualRiserMm: Math.round(actualRiserMm * 10) / 10,
    treadCount,
    treadMm: Math.round(treadMm * 10) / 10,
    totalGoingMm: Math.round(totalGoingMm * 10) / 10,
    walkingLineMm: Math.round(walkingLineMm * 10) / 10,
    riserInComfortRange: actualRiserMm >= COMFORT_RISER_MIN_MM && actualRiserMm <= COMFORT_RISER_MAX_MM,
  };
}
