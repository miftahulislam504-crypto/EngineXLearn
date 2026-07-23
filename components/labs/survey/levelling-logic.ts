/**
 * Differential Levelling — Rise & Fall method.
 *
 * A level instrument stays at one setup while staff readings are taken:
 * Back Sight (BS) on a point of known/starting elevation, then Fore Sight
 * (FS) on the next point (a "change point," which becomes the new known
 * point once the instrument moves). Intermediate Sights (IS) are optional
 * extra points read from the same setup without moving the instrument.
 *
 * Rule: comparing consecutive staff readings —
 *   if the earlier reading > the later reading  -> the ground RISES
 *   if the earlier reading < the later reading  -> the ground FALLS
 * (A higher staff reading means the ground at that point is lower — the
 * level line is a fixed height above the ground, so a bigger number means
 * more distance between the fixed line and the ground, i.e. lower ground.)
 *
 * Reduced Level (RL) of each point = RL of previous point + Rise − Fall.
 *
 * Arithmetic check (mandatory in real field practice — this is what
 * actually catches booking/calculation mistakes before they propagate):
 *   ΣBS − ΣFS  =  ΣRise − ΣFall  =  Last RL − First RL
 * If these three don't agree, there's an arithmetic error in the booking
 * (this checks the sums, not whether the underlying readings themselves
 * were captured correctly — a separate check, loop closure, catches that
 * kind of error and isn't attempted here for a single open traverse).
 */

export type StationReading = {
  station: string;
  bs: number | null;
  is: number | null; // intermediate sight
  fs: number | null;
};

export interface ReducedStation {
  station: string;
  bs: number | null;
  is: number | null;
  fs: number | null;
  rise: number | null;
  fall: number | null;
  rl: number;
}

export interface LevellingResult {
  stations: ReducedStation[];
  sumBS: number;
  sumFS: number;
  sumRise: number;
  sumFall: number;
  firstRL: number;
  lastRL: number;
  arithmeticCheckOk: boolean;
  checkA: number; // ΣBS − ΣFS
  checkB: number; // ΣRise − ΣFall
  checkC: number; // Last RL − First RL
}

const TOLERANCE = 0.002; // meters — allows for floating-point rounding, not a real survey tolerance

export function computeLevelling(
  readings: StationReading[],
  startingRL: number
): LevellingResult {
  const stations: ReducedStation[] = [];

  let prevReading: number | null = null;
  let prevRL = startingRL;
  let sumBS = 0;
  let sumFS = 0;
  let sumRise = 0;
  let sumFall = 0;

  readings.forEach((r, i) => {
    if (r.bs !== null) sumBS += r.bs;

    const currentReading = r.is !== null ? r.is : r.fs !== null ? r.fs : r.bs;

    if (i === 0 || prevReading === null || currentReading === null) {
      // First station establishes the starting RL — there's nothing to
      // compare it against yet, so no rise/fall for this row.
      stations.push({
        station: r.station,
        bs: r.bs,
        is: r.is,
        fs: r.fs,
        rise: null,
        fall: null,
        rl: Math.round(startingRL * 1000) / 1000,
      });
      prevReading = r.bs;
      prevRL = startingRL;
      return;
    }

    if (r.fs !== null) sumFS += r.fs;

    const diff = prevReading - currentReading;
    const rise = diff > 0 ? diff : 0;
    const fall = diff < 0 ? -diff : 0;

    sumRise += rise;
    sumFall += fall;

    const rl = prevRL + rise - fall;

    stations.push({
      station: r.station,
      bs: r.bs,
      is: r.is,
      fs: r.fs,
      rise: rise > 0 ? Math.round(rise * 1000) / 1000 : null,
      fall: fall > 0 ? Math.round(fall * 1000) / 1000 : null,
      rl: Math.round(rl * 1000) / 1000,
    });

    // After a fore sight, that reading becomes the reference point for the
    // next back sight (the instrument moves to a new setup). Otherwise,
    // stay on the same reading for the next intermediate/fore sight from
    // this same setup.
    prevReading = r.bs !== null ? r.bs : currentReading;
    prevRL = rl;
  });

  const firstRL = startingRL;
  const lastRL = stations[stations.length - 1]?.rl ?? startingRL;

  const checkA = Math.round((sumBS - sumFS) * 1000) / 1000;
  const checkB = Math.round((sumRise - sumFall) * 1000) / 1000;
  const checkC = Math.round((lastRL - firstRL) * 1000) / 1000;

  const arithmeticCheckOk =
    Math.abs(checkA - checkB) < TOLERANCE && Math.abs(checkB - checkC) < TOLERANCE;

  return {
    stations,
    sumBS: Math.round(sumBS * 1000) / 1000,
    sumFS: Math.round(sumFS * 1000) / 1000,
    sumRise: Math.round(sumRise * 1000) / 1000,
    sumFall: Math.round(sumFall * 1000) / 1000,
    firstRL,
    lastRL,
    arithmeticCheckOk,
    checkA,
    checkB,
    checkC,
  };
}

/** A representative 4-station field-book example, matching a real survey pattern. */
export const SAMPLE_READINGS: StationReading[] = [
  { station: 'A (BM)', bs: 2.285, is: null, fs: null },
  { station: 'B', bs: null, is: 1.965, fs: null },
  { station: 'C (CP)', bs: 1.86, is: null, fs: 0.855 },
  { station: 'D', bs: null, is: null, fs: 1.325 },
];
export const SAMPLE_STARTING_RL = 100.0;
