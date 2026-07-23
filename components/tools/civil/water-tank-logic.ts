/**
 * Water Tank Calculator — required storage volume from household size
 * and daily per-person demand, then sized into a cylindrical or
 * rectangular tank. The 150 L/person/day default is a commonly-used
 * planning figure for Bangladesh residential water demand; it's exposed
 * as an editable input rather than baked in, since actual demand varies
 * by household and by source (BNBC's own design figures vary by
 * building type).
 */

export interface TankSizingResult {
  dailyDemandL: number;
  requiredL: number;
  requiredM3: number;
}

export function computeRequiredVolume(people: number, litersPerPersonPerDay: number, storageDays: number): TankSizingResult {
  const dailyDemandL = people * litersPerPersonPerDay;
  const requiredL = dailyDemandL * storageDays;
  return {
    dailyDemandL: Math.round(dailyDemandL),
    requiredL: Math.round(requiredL),
    requiredM3: Math.round((requiredL / 1000) * 1000) / 1000,
  };
}

export function cylindricalTankHeight(volumeM3: number, diameterM: number): number {
  const radius = diameterM / 2;
  const area = Math.PI * radius ** 2;
  return Math.round((volumeM3 / area) * 1000) / 1000;
}

export function rectangularTankHeight(volumeM3: number, lengthM: number, widthM: number): number {
  return Math.round((volumeM3 / (lengthM * widthM)) * 1000) / 1000;
}
