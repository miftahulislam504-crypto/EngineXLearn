/**
 * Beam Calculator — quick max bending moment and shear force for a
 * simply-supported beam under a uniformly distributed load and/or a
 * single point load at an arbitrary position. Standard statics, each
 * term verified independently against the textbook special cases
 * (wL²/8 and wL/2 for UDL, PL/4 and P/2 for a mid-span point load)
 * before this file was written. This is a quick design-check tool, not
 * a full structural analysis — no support conditions besides simple
 * support, no multiple spans, no combined load-case envelopes.
 */

export interface BeamResult {
  maxMomentKnm: number;
  maxShearKn: number;
  reactionAKn: number;
  reactionBKn: number;
}

export function computeBeamAnalysis(
  spanM: number,
  udlKnPerM: number,
  pointLoadKn: number,
  pointLoadPositionM: number | null
): BeamResult {
  const L = spanM;

  // UDL contributions
  const momentUdl = (udlKnPerM * L ** 2) / 8;
  const shearUdl = (udlKnPerM * L) / 2;
  const reactionUdlEach = (udlKnPerM * L) / 2;

  // Point load contributions
  let momentPoint = 0;
  let reactionAPoint = 0;
  let reactionBPoint = 0;
  if (pointLoadKn > 0) {
    const a = pointLoadPositionM ?? L / 2;
    const b = L - a;
    reactionAPoint = (pointLoadKn * b) / L;
    reactionBPoint = (pointLoadKn * a) / L;
    momentPoint = reactionAPoint * a;
  }

  const reactionAKn = reactionUdlEach + reactionAPoint;
  const reactionBKn = reactionUdlEach + reactionBPoint;

  return {
    maxMomentKnm: Math.round((momentUdl + momentPoint) * 100) / 100,
    maxShearKn: Math.round(Math.max(reactionAKn, reactionBKn) * 100) / 100,
    reactionAKn: Math.round(reactionAKn * 100) / 100,
    reactionBKn: Math.round(reactionBKn * 100) / 100,
  };
}
