/**
 * Flexural Test (Modulus of Rupture) — calculation logic.
 * ASTM C78 / BS EN 12390-5, standard 150×150×750mm prism, 450mm span
 * (3× depth) under third-point loading — two point loads, each L/3 from
 * a support, so the span splits into three equal parts.
 *
 * The one thing this test gets wrong if you oversimplify it: the formula
 * actually depends on WHERE the beam breaks, not just how much load it
 * took. If it breaks in the middle third (between the two load points,
 * where bending moment is uniform), the simple R = PL/bd² applies. If it
 * breaks outside that zone — closer to one of the loads — a different
 * formula (R = 3Pa/bd², using the distance from the nearest support to
 * the fracture) has to be used instead, because the bending moment there
 * isn't uniform. And if the fracture happens far enough outside the
 * middle third, ASTM C78 says discard the result entirely — the test
 * setup or specimen was flawed, not just "use formula two."
 */

export const BEAM_WIDTH_MM = 150;
export const BEAM_DEPTH_MM = 150;
export const SPAN_MM = 450;

const MIDDLE_THIRD_HALF_WIDTH_MM = SPAN_MM / 6; // middle third of the span, ±L/6 from center
const INVALID_TOLERANCE_MM = 0.05 * SPAN_MM; // ASTM C78: discard beyond 5% of span outside the middle third

export type FlexuralFormula = 'middle-third' | 'outside-middle-third';

export type FlexuralResult =
  | { valid: true; strengthMpa: number; formula: FlexuralFormula; fractureDistanceFromSupportMm: number }
  | { valid: false; reason: 'fracture-too-far-outside-middle-third' };

/**
 * @param loadKn Maximum (failure) load, kN
 * @param fractureOffsetFromCenterMm Distance of the fracture line from
 *   beam center along the span, in mm (0 = exactly center; sign doesn't
 *   matter, only distance from center does)
 */
export function computeFlexuralStrength(loadKn: number, fractureOffsetFromCenterMm: number): FlexuralResult {
  const loadN = Math.max(0, loadKn) * 1000;
  const offset = Math.abs(fractureOffsetFromCenterMm);
  const area = BEAM_WIDTH_MM * BEAM_DEPTH_MM ** 2;

  if (offset <= MIDDLE_THIRD_HALF_WIDTH_MM) {
    const strengthMpa = Math.round(((loadN * SPAN_MM) / area) * 100) / 100;
    return {
      valid: true,
      strengthMpa,
      formula: 'middle-third',
      fractureDistanceFromSupportMm: Math.round((SPAN_MM / 2 - offset) * 10) / 10,
    };
  }

  const excessBeyondMiddleThird = offset - MIDDLE_THIRD_HALF_WIDTH_MM;
  if (excessBeyondMiddleThird > INVALID_TOLERANCE_MM) {
    return { valid: false, reason: 'fracture-too-far-outside-middle-third' };
  }

  const distanceFromSupportMm = SPAN_MM / 2 - offset; // "a" in the ASTM formula, on the tension face
  const strengthMpa = Math.round(((3 * loadN * distanceFromSupportMm) / area) * 100) / 100;
  return {
    valid: true,
    strengthMpa,
    formula: 'outside-middle-third',
    fractureDistanceFromSupportMm: Math.round(distanceFromSupportMm * 10) / 10,
  };
}

export const SAMPLE_LOAD_KN = 28.5;
export const SAMPLE_FRACTURE_OFFSET_MM = 0;
