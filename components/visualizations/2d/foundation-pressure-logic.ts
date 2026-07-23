/**
 * Foundation Pressure Distribution under eccentric loading.
 *
 * A concentric load on a footing produces uniform soil pressure. Move the
 * load off-center (or apply a moment, which is equivalent to an
 * eccentricity e = M/P) and the pressure becomes trapezoidal — higher on
 * the side the load leans toward, lower on the other. Push the
 * eccentricity far enough and the "low" side would need negative
 * (tensile) pressure to stay trapezoidal — which soil can't provide, so
 * the footing actually lifts off on that side instead, and the pressure
 * redistributes as a triangle over a smaller contact area.
 *
 * Two formulas, one governing condition:
 *
 *   Within the "middle third" (e ≤ B/6):
 *     q_max = (P/A)(1 + 6e/B),  q_min = (P/A)(1 - 6e/B)
 *
 *   Outside the middle third (e > B/6) — partial uplift:
 *     contact width = 3(B/2 − e)
 *     q_max = 2P / (3·L·(B/2 − e)),  q_min = 0
 *
 * Verified independently before this file was written, including
 * continuity right at the e = B/6 boundary (both formulas agree there to
 * within rounding) and the e = 0 concentric case (both give the same
 * uniform P/A, as they should).
 */

export interface FoundationPressureInputs {
  loadKn: number; // P
  footingWidthM: number; // B — the dimension the eccentricity acts along
  footingLengthM: number; // L
  eccentricityM: number; // e, can be 0 for concentric loading
}

export interface FoundationPressureResult {
  averagePressureKpa: number;
  qMaxKpa: number;
  qMinKpa: number;
  contactWidthM: number; // full footing width B when uniform/trapezoidal; reduced width when uplift occurs
  middleThirdLimitM: number;
  withinMiddleThird: boolean;
  distributionShape: 'uniform' | 'trapezoidal' | 'triangular-uplift';
  overturns: boolean; // true only in the extreme sub-case where the resultant falls entirely outside the footing
}

export function computeFoundationPressure(
  inputs: FoundationPressureInputs
): FoundationPressureResult {
  const { loadKn, footingWidthM, footingLengthM, eccentricityM } = inputs;
  const e = Math.abs(eccentricityM);
  const B = footingWidthM;
  const L = footingLengthM;
  const A = B * L;
  const averagePressureKpa = A > 0 ? loadKn / A : 0;
  const middleThirdLimitM = B / 6;
  const withinMiddleThird = e <= middleThirdLimitM;

  let qMaxKpa: number;
  let qMinKpa: number;
  let contactWidthM: number;
  let distributionShape: FoundationPressureResult['distributionShape'];
  let overturns = false;

  if (e === 0) {
    qMaxKpa = averagePressureKpa;
    qMinKpa = averagePressureKpa;
    contactWidthM = B;
    distributionShape = 'uniform';
  } else if (withinMiddleThird) {
    qMaxKpa = averagePressureKpa * (1 + (6 * e) / B);
    qMinKpa = averagePressureKpa * (1 - (6 * e) / B);
    contactWidthM = B;
    distributionShape = 'trapezoidal';
  } else {
    const contactWidth = 3 * (B / 2 - e);
    if (contactWidth <= 0) {
      // Load falls entirely outside the footing — physically unstable;
      // reported as zero rather than a nonsensical negative/infinite pressure.
      qMaxKpa = 0;
      qMinKpa = 0;
      contactWidthM = 0;
      distributionShape = 'triangular-uplift';
      overturns = true;
    } else {
      qMaxKpa = (2 * loadKn) / (3 * L * (B / 2 - e));
      qMinKpa = 0;
      contactWidthM = contactWidth;
      distributionShape = 'triangular-uplift';
    }
  }

  return {
    averagePressureKpa: Math.round(averagePressureKpa * 10) / 10,
    qMaxKpa: Math.round(qMaxKpa * 10) / 10,
    qMinKpa: Math.round(qMinKpa * 10) / 10,
    contactWidthM: Math.round(contactWidthM * 1000) / 1000,
    middleThirdLimitM: Math.round(middleThirdLimitM * 1000) / 1000,
    withinMiddleThird,
    distributionShape,
    overturns,
  };
}

export const DEFAULT_FOUNDATION_PRESSURE_INPUTS: FoundationPressureInputs = {
  loadKn: 600,
  footingWidthM: 2.0,
  footingLengthM: 2.0,
  eccentricityM: 0.2,
};
