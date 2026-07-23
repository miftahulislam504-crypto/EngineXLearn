/**
 * Concrete Calculator — mix-ratio quantity estimation. Standard
 * assumptions, both stated explicitly rather than buried: a 1.54× dry
 * volume factor (dry, loose ingredient volumes exceed the finished wet
 * volume because compacting fresh concrete closes the voids between dry
 * particles) and 1440 kg/m³ loose cement bulk density. Different
 * references use slightly different constants for both figures — these
 * are the commonly-published values, and the tool states them rather
 * than presenting the output as if it were the only possible answer.
 */

export const DRY_VOLUME_FACTOR = 1.54;
export const CEMENT_BAG_KG = 50;
export const CEMENT_DENSITY_KG_M3 = 1440;

export const STANDARD_MIXES: { label: string; ratio: [number, number, number] }[] = [
  { label: 'M15 (1:2:4)', ratio: [1, 2, 4] },
  { label: 'M20 (1:1.5:3)', ratio: [1, 1.5, 3] },
  { label: 'M25 (1:1:2)', ratio: [1, 1, 2] },
];

export interface ConcreteResult {
  dryVolumeM3: number;
  cementBags: number;
  sandM3: number;
  aggregateM3: number;
}

export function computeConcreteQuantities(wetVolumeM3: number, ratio: [number, number, number]): ConcreteResult {
  const dryVolumeM3 = wetVolumeM3 * DRY_VOLUME_FACTOR;
  const totalParts = ratio[0] + ratio[1] + ratio[2];
  const cementVolM3 = (dryVolumeM3 * ratio[0]) / totalParts;
  const sandM3 = (dryVolumeM3 * ratio[1]) / totalParts;
  const aggregateM3 = (dryVolumeM3 * ratio[2]) / totalParts;
  const cementKg = cementVolM3 * CEMENT_DENSITY_KG_M3;

  return {
    dryVolumeM3: Math.round(dryVolumeM3 * 1000) / 1000,
    cementBags: Math.round((cementKg / CEMENT_BAG_KG) * 100) / 100,
    sandM3: Math.round(sandM3 * 1000) / 1000,
    aggregateM3: Math.round(aggregateM3 * 1000) / 1000,
  };
}
