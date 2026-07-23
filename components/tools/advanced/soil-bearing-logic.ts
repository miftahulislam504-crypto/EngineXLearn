/**
 * Soil Bearing Calculator — Terzaghi's bearing capacity equation,
 * qu = c·Nc + q·Nq + 0.5·γ·B·Nγ (strip) or the standard shape-corrected
 * versions for square/circular footings.
 *
 * Nc and Nq have clean closed forms that were checked against this
 * table (to within 0.1 at every entry) before this file was written.
 * Nγ does NOT have a clean closed form — Terzaghi derived it
 * graphically, which is exactly why every geotechnical textbook
 * tabulates it directly rather than computing it from a formula. An
 * early version of this file used a Meyerhof-style closed-form
 * approximation for Nγ and was off by as much as 30% against the
 * standard table at some friction angles — caught during verification
 * and replaced with the actual tabulated values (general shear case),
 * linearly interpolated between table entries.
 */

export const TERZAGHI_TABLE: { phiDeg: number; Nc: number; Nq: number; Ngamma: number }[] = [
  { phiDeg: 0, Nc: 5.7, Nq: 1.0, Ngamma: 0.0 },
  { phiDeg: 5, Nc: 7.3, Nq: 1.6, Ngamma: 0.5 },
  { phiDeg: 10, Nc: 9.6, Nq: 2.7, Ngamma: 1.2 },
  { phiDeg: 15, Nc: 12.9, Nq: 4.4, Ngamma: 2.5 },
  { phiDeg: 20, Nc: 17.7, Nq: 7.4, Ngamma: 5.0 },
  { phiDeg: 25, Nc: 25.1, Nq: 12.7, Ngamma: 9.7 },
  { phiDeg: 30, Nc: 37.2, Nq: 22.5, Ngamma: 19.7 },
  { phiDeg: 35, Nc: 57.8, Nq: 41.4, Ngamma: 42.4 },
  { phiDeg: 40, Nc: 95.7, Nq: 81.3, Ngamma: 100.4 },
  { phiDeg: 45, Nc: 172.3, Nq: 173.3, Ngamma: 297.5 },
];

export function bearingFactors(phiDeg: number): { Nc: number; Nq: number; Ngamma: number } {
  const table = TERZAGHI_TABLE;
  if (phiDeg <= table[0].phiDeg) return { Nc: table[0].Nc, Nq: table[0].Nq, Ngamma: table[0].Ngamma };
  const last = table[table.length - 1];
  if (phiDeg >= last.phiDeg) return { Nc: last.Nc, Nq: last.Nq, Ngamma: last.Ngamma };

  for (let i = 0; i < table.length - 1; i++) {
    const p0 = table[i];
    const p1 = table[i + 1];
    if (phiDeg >= p0.phiDeg && phiDeg <= p1.phiDeg) {
      const frac = (phiDeg - p0.phiDeg) / (p1.phiDeg - p0.phiDeg);
      return {
        Nc: p0.Nc + frac * (p1.Nc - p0.Nc),
        Nq: p0.Nq + frac * (p1.Nq - p0.Nq),
        Ngamma: p0.Ngamma + frac * (p1.Ngamma - p0.Ngamma),
      };
    }
  }
  return { Nc: last.Nc, Nq: last.Nq, Ngamma: last.Ngamma };
}

export type FootingShape = 'strip' | 'square';

export interface BearingResult {
  Nc: number;
  Nq: number;
  Ngamma: number;
  overburdenKpa: number;
  ultimateKpa: number;
  safeKpa: number;
}

export function computeBearingCapacity(
  cKpa: number,
  phiDeg: number,
  gammaKnM3: number,
  depthM: number,
  widthM: number,
  shape: FootingShape,
  factorOfSafety: number
): BearingResult {
  const { Nc, Nq, Ngamma } = bearingFactors(phiDeg);
  const overburdenKpa = gammaKnM3 * depthM;

  const ultimateKpa =
    shape === 'strip'
      ? cKpa * Nc + overburdenKpa * Nq + 0.5 * gammaKnM3 * widthM * Ngamma
      : 1.3 * cKpa * Nc + overburdenKpa * Nq + 0.4 * gammaKnM3 * widthM * Ngamma;

  return {
    Nc: Math.round(Nc * 100) / 100,
    Nq: Math.round(Nq * 100) / 100,
    Ngamma: Math.round(Ngamma * 100) / 100,
    overburdenKpa: Math.round(overburdenKpa * 100) / 100,
    ultimateKpa: Math.round(ultimateKpa * 100) / 100,
    safeKpa: Math.round((ultimateKpa / factorOfSafety) * 100) / 100,
  };
}
