/**
 * Closed Traverse — closure error + Bowditch (compass rule) adjustment.
 * ASTM/standard surveying practice, BNBC 2020 §6.7.
 *
 * A closed traverse measures a loop of stations back to its own starting
 * point. Each leg (bearing + distance) resolves into a latitude
 * (northing component, D·cos(bearing)) and departure (easting component,
 * D·sin(bearing)). For a perfectly closed loop these should sum to
 * exactly zero — in practice, real field measurement error leaves a
 * small residual (the "misclosure"), and the Bowditch rule distributes
 * that residual back across every leg in proportion to its length,
 * producing adjusted coordinates that close exactly by construction.
 *
 * Two things this implementation guards against explicitly:
 *  - Zero total distance (all-zero or missing leg lengths) would divide
 *    by zero in the Bowditch correction — checked before that division,
 *    not caught after the fact.
 *  - The adjustment always closes exactly; what it does NOT do is fix a
 *    genuinely bad survey. The precision classification (relative
 *    misclosure, expressed as 1:N) is what actually tells you whether
 *    the raw field measurements were good enough to trust — Bowditch
 *    adjustment closes the numbers, not the underlying accuracy.
 */

export interface TraverseLeg {
  bearingDeg: number; // 0-360, from north, clockwise
  distanceM: number;
}

export interface AdjustedLeg extends TraverseLeg {
  latitude: number;
  departure: number;
  latitudeCorrection: number;
  departureCorrection: number;
  adjustedNorthing: number;
  adjustedEasting: number;
}

export type TraverseResult =
  | {
      valid: true;
      totalDistanceM: number;
      misclosureM: number;
      relativePrecisionDenominator: number;
      precisionClass: 'high-precision' | 'acceptable' | 'below-standard';
      adjustedLegs: AdjustedLeg[];
    }
  | { valid: false; reason: 'not-enough-legs' | 'zero-total-distance' };

const MIN_LEGS = 3; // fewer than 3 legs can't enclose an area

export function computeTraverse(
  legs: TraverseLeg[],
  startNorthing = 1000.0,
  startEasting = 1000.0
): TraverseResult {
  const valid = legs.filter((l) => l.distanceM > 0);
  if (valid.length < MIN_LEGS) {
    return { valid: false, reason: 'not-enough-legs' };
  }

  const totalDistanceM = valid.reduce((s, l) => s + l.distanceM, 0);
  if (totalDistanceM === 0) {
    return { valid: false, reason: 'zero-total-distance' };
  }

  const raw = valid.map((l) => {
    const rad = (((l.bearingDeg % 360) + 360) % 360) * (Math.PI / 180);
    return { ...l, latitude: l.distanceM * Math.cos(rad), departure: l.distanceM * Math.sin(rad) };
  });

  const sumLatitude = raw.reduce((s, r) => s + r.latitude, 0);
  const sumDeparture = raw.reduce((s, r) => s + r.departure, 0);
  const misclosureM = Math.sqrt(sumLatitude ** 2 + sumDeparture ** 2);
  const relativePrecisionDenominator = misclosureM > 0 ? totalDistanceM / misclosureM : Infinity;

  let precisionClass: 'high-precision' | 'acceptable' | 'below-standard';
  if (relativePrecisionDenominator >= 10000) precisionClass = 'high-precision';
  else if (relativePrecisionDenominator >= 5000) precisionClass = 'acceptable';
  else precisionClass = 'below-standard';

  let n = startNorthing;
  let e = startEasting;
  const adjustedLegs: AdjustedLeg[] = raw.map((r) => {
    const latitudeCorrection = -sumLatitude * (r.distanceM / totalDistanceM);
    const departureCorrection = -sumDeparture * (r.distanceM / totalDistanceM);
    n += r.latitude + latitudeCorrection;
    e += r.departure + departureCorrection;
    return {
      bearingDeg: r.bearingDeg,
      distanceM: r.distanceM,
      latitude: Math.round(r.latitude * 1000) / 1000,
      departure: Math.round(r.departure * 1000) / 1000,
      latitudeCorrection: Math.round(latitudeCorrection * 1000) / 1000,
      departureCorrection: Math.round(departureCorrection * 1000) / 1000,
      adjustedNorthing: Math.round(n * 1000) / 1000,
      adjustedEasting: Math.round(e * 1000) / 1000,
    };
  });

  return {
    valid: true,
    totalDistanceM: Math.round(totalDistanceM * 1000) / 1000,
    misclosureM: Math.round(misclosureM * 10000) / 10000,
    relativePrecisionDenominator: Math.round(relativePrecisionDenominator),
    precisionClass,
    adjustedLegs,
  };
}

export const SAMPLE_START_NORTHING = 1000.0;
export const SAMPLE_START_EASTING = 1000.0;

export const SAMPLE_LEGS: TraverseLeg[] = [
  { bearingDeg: 40.0, distanceM: 85.04 },
  { bearingDeg: 112.0, distanceM: 84.97 },
  { bearingDeg: 184.0, distanceM: 85.08 },
  { bearingDeg: 256.0, distanceM: 84.95 },
  { bearingDeg: 328.0, distanceM: 85.02 },
];
