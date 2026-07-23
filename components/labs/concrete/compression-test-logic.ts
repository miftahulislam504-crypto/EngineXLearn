/**
 * Compression Test (Concrete Cube Strength) — calculation logic.
 * BS 1881-116 / BNBC 2020 §5.3, 150mm cube convention (the same convention
 * used throughout this platform's structural content — cube strength, not
 * cylinder f'c — since BNBC 2020 is the primary reference standard here).
 *
 * The single most important thing this test's report gets right isn't the
 * strength formula itself (load/area is as simple as arithmetic gets) — it's
 * the acceptance classification. A single cube result below the specified
 * grade doesn't automatically mean "failed concrete"; codes build in a
 * margin because concrete strength genuinely varies between nominally
 * identical cubes. Getting that margin wrong in either direction would
 * teach something actively misleading: too strict, and a normal result
 * looks like a site failure; too loose, and a real problem looks fine.
 */

export const CUBE_SIDE_MM = 150;
export const CUBE_AREA_MM2 = CUBE_SIDE_MM * CUBE_SIDE_MM; // 22,500 mm²

// Standard BNBC/BS characteristic cube strength grades (MPa at 28 days).
export const CONCRETE_GRADES = [15, 20, 25, 30, 35, 40] as const;
export type ConcreteGrade = (typeof CONCRETE_GRADES)[number];

export type CompressionAcceptance = 'meets-or-exceeds' | 'below-target-within-margin' | 'fails-acceptance';

export interface CompressionResult {
  strengthMpa: number;
  fckMpa: number;
  marginMpa: number;
  acceptance: CompressionAcceptance;
}

/**
 * Single-specimen acceptance margin, generalized from ACI 318-19 §26.12.3.1(b):
 * no individual strength test result should fall more than 3.5 MPa (≈500 psi)
 * below the specified strength for f'c ≤ 35 MPa, or 0.10×f'c below it for
 * f'c > 35 MPa. The code's full acceptance rule also requires the *average*
 * of 3 consecutive tests to meet or exceed f'c — this lab reports on one
 * cube at a time, so it applies only the individual-result margin and says
 * so plainly, rather than implying a full batch-acceptance decision from a
 * single specimen.
 */
export function acceptanceMarginMpa(fckMpa: number): number {
  return fckMpa <= 35 ? 3.5 : 0.1 * fckMpa;
}

export function computeCompressionStrength(loadKn: number, fckMpa: number): CompressionResult {
  const loadN = Math.max(0, loadKn) * 1000;
  const strengthMpa = Math.round((loadN / CUBE_AREA_MM2) * 100) / 100;
  const marginMpa = acceptanceMarginMpa(fckMpa);

  let acceptance: CompressionAcceptance;
  if (strengthMpa >= fckMpa) {
    acceptance = 'meets-or-exceeds';
  } else if (strengthMpa >= fckMpa - marginMpa) {
    acceptance = 'below-target-within-margin';
  } else {
    acceptance = 'fails-acceptance';
  }

  return { strengthMpa, fckMpa, marginMpa, acceptance };
}
