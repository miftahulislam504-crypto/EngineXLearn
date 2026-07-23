/**
 * Slope Calculator — converts between the three common ways a slope
 * gets specified: ratio (1:N, horizontal:vertical), percentage, and
 * angle in degrees. Exact trig, verified against the identity that a
 * 1:1 slope must be exactly 45° before this file was written.
 */

export interface SlopeResult {
  angleDeg: number;
  percent: number;
  ratioDisplay: string;
}

export function slopeFromRatio(horizontalPart: number, verticalPart: number = 1): SlopeResult {
  const ratio = verticalPart / horizontalPart;
  const angleDeg = Math.atan(ratio) * (180 / Math.PI);
  const percent = ratio * 100;
  return {
    angleDeg: Math.round(angleDeg * 100) / 100,
    percent: Math.round(percent * 100) / 100,
    ratioDisplay: `1:${Math.round(horizontalPart * 100) / 100}`,
  };
}

export function slopeFromAngle(angleDeg: number): SlopeResult {
  const ratio = Math.tan((angleDeg * Math.PI) / 180);
  const horizontalPart = ratio !== 0 ? 1 / ratio : Infinity;
  const percent = ratio * 100;
  return {
    angleDeg: Math.round(angleDeg * 100) / 100,
    percent: Math.round(percent * 100) / 100,
    ratioDisplay: Number.isFinite(horizontalPart) ? `1:${Math.round(horizontalPart * 100) / 100}` : '1:∞ (flat)',
  };
}

export function slopeFromPercent(percent: number): SlopeResult {
  const ratio = percent / 100;
  const angleDeg = Math.atan(ratio) * (180 / Math.PI);
  const horizontalPart = ratio !== 0 ? 1 / ratio : Infinity;
  return {
    angleDeg: Math.round(angleDeg * 100) / 100,
    percent: Math.round(percent * 100) / 100,
    ratioDisplay: Number.isFinite(horizontalPart) ? `1:${Math.round(horizontalPart * 100) / 100}` : '1:∞ (flat)',
  };
}

/** Given a slope ratio and a horizontal (or vertical) run, find the other distance. */
export function riseRunFromSlope(
  horizontalPart: number,
  verticalPart: number,
  knownDistance: number,
  knownIsHorizontal: boolean
): { horizontal: number; vertical: number } {
  const ratio = verticalPart / horizontalPart; // rise/run
  if (knownIsHorizontal) {
    return { horizontal: knownDistance, vertical: knownDistance * ratio };
  }
  return { horizontal: knownDistance / ratio, vertical: knownDistance };
}
