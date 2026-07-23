/**
 * Total Station — Radiation Method — calculation logic.
 * A total station combines angle and distance measurement (EDM) in one
 * instrument, so a single reading to a target — horizontal bearing,
 * vertical angle, and slope distance — gives that target's full 3D
 * position relative to the instrument in one shot ("radiation": several
 * targets measured outward from one fixed station, unlike Traverse's
 * chain of moving setups).
 *
 * Two pieces of geometry, applied together per reading:
 *  - Horizontal distance = slope distance × cos(vertical angle from horizontal)
 *  - Height difference (trigonometric leveling) = slope distance × sin(vertical
 *    angle) + instrument height − target (prism/staff) height
 * The horizontal distance combines with the bearing to place the target
 * in plan (N, E); the height difference places it in elevation.
 */

export interface TotalStationReading {
  targetName: string;
  bearingDeg: number; // 0-360, from north, clockwise
  verticalAngleDeg: number; // + = looking up from horizontal, - = looking down
  slopeDistanceM: number;
  targetHeightM: number; // prism/reflector or staff height above the target point
}

export interface TotalStationResult {
  targetName: string;
  horizontalDistanceM: number;
  heightDifferenceM: number;
  northing: number;
  easting: number;
  elevation: number;
}

export interface StationSetup {
  northing: number;
  easting: number;
  elevation: number;
  instrumentHeightM: number;
}

export function computeTotalStationTarget(
  station: StationSetup,
  reading: TotalStationReading
): TotalStationResult {
  const bearingRad = (((reading.bearingDeg % 360) + 360) % 360) * (Math.PI / 180);
  const verticalRad = reading.verticalAngleDeg * (Math.PI / 180);

  const horizontalDistanceM = reading.slopeDistanceM * Math.cos(verticalRad);
  const heightDifferenceM =
    reading.slopeDistanceM * Math.sin(verticalRad) + station.instrumentHeightM - reading.targetHeightM;

  const northing = station.northing + horizontalDistanceM * Math.cos(bearingRad);
  const easting = station.easting + horizontalDistanceM * Math.sin(bearingRad);
  const elevation = station.elevation + heightDifferenceM;

  return {
    targetName: reading.targetName,
    horizontalDistanceM: Math.round(horizontalDistanceM * 1000) / 1000,
    heightDifferenceM: Math.round(heightDifferenceM * 1000) / 1000,
    northing: Math.round(northing * 1000) / 1000,
    easting: Math.round(easting * 1000) / 1000,
    elevation: Math.round(elevation * 1000) / 1000,
  };
}

export function computeTotalStationTargets(
  station: StationSetup,
  readings: TotalStationReading[]
): TotalStationResult[] {
  return readings.map((r) => computeTotalStationTarget(station, r));
}

export const SAMPLE_STATION: StationSetup = {
  northing: 1000.0,
  easting: 2000.0,
  elevation: 100.0,
  instrumentHeightM: 1.5,
};

export const SAMPLE_READINGS: TotalStationReading[] = [
  { targetName: 'P1', bearingDeg: 0, verticalAngleDeg: 0, slopeDistanceM: 50.0, targetHeightM: 1.5 },
  { targetName: 'P2', bearingDeg: 90, verticalAngleDeg: 10, slopeDistanceM: 80.0, targetHeightM: 0 },
  { targetName: 'P3', bearingDeg: 225, verticalAngleDeg: -5, slopeDistanceM: 40.0, targetHeightM: 1.5 },
];
