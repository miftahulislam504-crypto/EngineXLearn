/**
 * Slump Test (Concrete Workability) — calculation and classification logic.
 * ASTM C143 / BNBC 2020.
 *
 * Unlike Sieve Analysis or Levelling, this test has almost no arithmetic —
 * slump is a direct height measurement, not a derived quantity. The
 * engineering content that actually needs to be right here is the
 * workability classification bands and the shear/collapse validity check,
 * not a formula. Kept as its own logic file anyway, for the same reason
 * as every other lab: one place to read and verify independent of the UI.
 */

export const SLUMP_CONE_HEIGHT_MM = 300;
export const SLUMP_CONE_BOTTOM_DIAMETER_MM = 200;
export const SLUMP_CONE_TOP_DIAMETER_MM = 100;

export type SlumpFailureMode = 'true' | 'shear' | 'collapse';

export type WorkabilityBand = 'very-low' | 'low' | 'medium' | 'high' | 'very-high' | 'collapse' | 'invalid-shear';

export interface SlumpResult {
  slumpMm: number;
  failureMode: SlumpFailureMode;
  valid: boolean; // false for 'shear' — the test must be redone with a fresh sample
  band: WorkabilityBand;
}

const CLASSIFICATION_BANDS: { min: number; max: number; band: WorkabilityBand }[] = [
  { min: 0, max: 25, band: 'very-low' },
  { min: 25, max: 50, band: 'low' },
  { min: 50, max: 100, band: 'medium' },
  { min: 100, max: 175, band: 'high' },
  { min: 175, max: 230, band: 'very-high' },
];

/**
 * Computes the slump result. `centerDropMm` is how far the center of the
 * slumped concrete mass dropped below the cone's original 300mm height —
 * what a technician actually measures in the field with a rule laid
 * across the upturned mold.
 *
 * Returns a `band` key rather than formatted text — the UI layer maps
 * this to the current locale's dictionary for both the band name and its
 * description, keeping this file free of any specific language.
 */
export function computeSlump(
  centerDropMm: number,
  failureMode: SlumpFailureMode
): SlumpResult {
  const slumpMm = Math.round(Math.max(0, Math.min(centerDropMm, SLUMP_CONE_HEIGHT_MM)) * 10) / 10;

  if (failureMode === 'shear') {
    return {
      slumpMm,
      failureMode,
      valid: false,
      band: 'invalid-shear',
    };
  }

  if (failureMode === 'collapse' || slumpMm >= SLUMP_CONE_HEIGHT_MM - 70) {
    return {
      slumpMm,
      failureMode: 'collapse',
      valid: true,
      band: 'collapse',
    };
  }

  const matchedBand = CLASSIFICATION_BANDS.find((b) => slumpMm >= b.min && slumpMm < b.max);

  return {
    slumpMm,
    failureMode: 'true',
    valid: true,
    band: matchedBand?.band ?? 'very-high',
  };
}
