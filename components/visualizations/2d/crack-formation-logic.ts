/**
 * Crack Formation / Shear Failure — how crack orientation changes along a
 * beam span, from vertical flexural cracks near midspan to diagonal shear
 * cracks near the supports.
 *
 * This uses the same simply-supported, single-point-load beam physics as
 * the homepage hero (components/visuals/beam-diagram.tsx) and the Moment
 * Diagram Explorer — same R1/R2 reactions, same piecewise M(x) — so the
 * crack pattern shown here is consistent with the moment/shear diagrams
 * a student has already seen elsewhere on the platform, not a
 * disconnected new example.
 *
 * Crack angle model: this is a deliberately SIMPLIFIED teaching model, not
 * a rigorous Mohr's-circle principal-stress derivation. It captures the
 * correct qualitative behavior (cracks rotate from vertical toward ~45°
 * diagonal as shear dominates over flexure) using the ratio of local
 * shear to local moment as a proxy for the shear/flexural-stress ratio,
 * which is the standard simplification used at introductory level. A
 * full treatment would need section geometry (to get actual stresses,
 * not just internal forces) — reserved for a more advanced lesson.
 */

export interface CrackPoint {
  xFraction: number; // 0 to 1 along the span
  shearKn: number;
  momentKnm: number;
  crackAngleFromVerticalDeg: number;
}

export function computeShear(xFraction: number, spanM: number, loadPositionFraction: number, loadKn: number): number {
  // For a simply-supported beam with a single point load, shear is
  // constant on each side of the load, equal to the reaction on that side.
  const a = loadPositionFraction * spanM;
  const r1 = (loadKn * (spanM - a)) / spanM;
  const r2 = (loadKn * a) / spanM;
  const x = xFraction * spanM;
  return x < a ? r1 : -r2;
}

export function computeMoment(xFraction: number, spanM: number, loadPositionFraction: number, loadKn: number): number {
  const a = loadPositionFraction * spanM;
  const r1 = (loadKn * (spanM - a)) / spanM;
  const r2 = (loadKn * a) / spanM;
  const x = xFraction * spanM;
  return x <= a ? r1 * x : r2 * (spanM - x);
}

/**
 * Generates crack angle data across the span. The crack angle at each
 * point uses |shear| / (|moment| + shearReferenceKnm) as the "how much
 * does shear dominate here" proxy — the added reference term keeps the
 * ratio well-behaved right at the load point and supports, where moment
 * or shear individually could be zero or the ratio could otherwise spike
 * without bound.
 */
export function generateCrackPattern(
  spanM: number,
  loadPositionFraction: number,
  loadKn: number,
  points: number
): CrackPoint[] {
  const shearReferenceKnm = 1; // stabilizing term, in kN·m units to match moment
  const result: CrackPoint[] = [];

  for (let i = 0; i <= points; i++) {
    const xFraction = i / points;
    const shearKn = computeShear(xFraction, spanM, loadPositionFraction, loadKn);
    const momentKnm = computeMoment(xFraction, spanM, loadPositionFraction, loadKn);

    const ratio = Math.abs(shearKn) / (Math.abs(momentKnm) + shearReferenceKnm);
    const cappedRatio = Math.min(ratio, 1);
    const angleFromVerticalDeg = Math.atan(cappedRatio) * (180 / Math.PI);

    result.push({
      xFraction: Math.round(xFraction * 1000) / 1000,
      shearKn: Math.round(shearKn * 100) / 100,
      momentKnm: Math.round(momentKnm * 100) / 100,
      crackAngleFromVerticalDeg: Math.round(angleFromVerticalDeg * 10) / 10,
    });
  }

  return result;
}
