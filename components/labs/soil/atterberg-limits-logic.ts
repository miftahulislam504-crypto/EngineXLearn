/**
 * Atterberg Limits (Liquid Limit + Plastic Limit) — calculation logic.
 * ASTM D4318 / BNBC 2020 §6.3. The natural next step after the Sieve
 * Analysis lab: gradation classifies coarse-grained soil by particle size,
 * while Atterberg Limits classify fine-grained soil (silt/clay) by how it
 * behaves at different moisture contents — a property particle size alone
 * can't capture, since two clays with identical grain-size curves can
 * behave completely differently depending on their mineralogy.
 *
 * Liquid Limit (LL) — Casagrande method: several trials at different blow
 * counts (N) are plotted as a "flow curve" — moisture content (%) vs.
 * log₁₀(N) — and LL is read as the moisture content at N = 25 off the
 * best-fit straight line through those points. This is a genuine linear
 * regression in log-N space, not a two-point interpolation, because a real
 * flow curve is fit through 4+ trials, not read off the nearest two.
 *
 * Plastic Limit (PL) — the moisture content at which a 3mm-diameter soil
 * thread just crumbles when rolled by hand; a direct measurement, not a
 * derived quantity (same "almost no arithmetic" character as the Slump
 * Test's center-drop reading).
 *
 * Plasticity Index PI = LL − PL, then classified against the Casagrande
 * plasticity chart's A-line — the same "simplified classroom version, not
 * the full flowchart" convention already used for Sieve Analysis's
 * well-graded check (that check needs fines content and other data the
 * gradation test alone doesn't produce; a full USCS classification would
 * need this test too).
 */

export interface LiquidLimitTrial {
  blows: number;
  moisturePercent: number;
}

export interface FlowCurveFit {
  slope: number;
  intercept: number;
  liquidLimitPercent: number;
}

/**
 * Least-squares linear regression of moisture% against log10(blows),
 * evaluated at N = 25 (the standard reference blow count) to get LL.
 * Needs at least 2 trials with distinct blow counts; returns null
 * otherwise rather than dividing by zero.
 */
export function fitFlowCurve(trials: LiquidLimitTrial[]): FlowCurveFit | null {
  const valid = trials.filter((t) => t.blows > 0 && t.moisturePercent > 0);
  if (valid.length < 2) return null;

  const xs = valid.map((t) => Math.log10(t.blows));
  const ys = valid.map((t) => t.moisturePercent);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY);
    den += (xs[i] - meanX) ** 2;
  }
  if (den === 0) return null; // all trials at the same blow count — can't fit a line

  const slope = num / den;
  const intercept = meanY - slope * meanX;
  const liquidLimitPercent = Math.round((slope * Math.log10(25) + intercept) * 10) / 10;

  return { slope, intercept, liquidLimitPercent };
}

export type PlasticityGroup = 'CL' | 'CH' | 'ML' | 'MH' | 'non-plastic';

export interface AtterbergResult {
  liquidLimitPercent: number | null;
  plasticLimitPercent: number;
  plasticityIndex: number | null;
  aLinePi: number | null;
  group: PlasticityGroup | 'insufficient-data';
}

/**
 * A-line: PI = 0.73 × (LL − 20) — the Casagrande chart boundary that
 * separates clay-like behavior (above the line) from silt-like behavior
 * (below it). Combined with the LL = 50 split between low (L) and high
 * (H) plasticity, this gives the four common fine-grained USCS groups.
 * PI < 4 is called non-plastic-to-slightly-plastic territory (ML/CL-ML
 * border zone in the full USCS chart) — reported distinctly here rather
 * than forced into CL or ML, since forcing a near-zero PI into either
 * group would overstate what a PI that small actually tells you.
 */
export function classifyPlasticity(
  liquidLimitPercent: number | null,
  plasticLimitPercent: number
): { plasticityIndex: number | null; aLinePi: number | null; group: PlasticityGroup | 'insufficient-data' } {
  if (liquidLimitPercent === null) {
    return { plasticityIndex: null, aLinePi: null, group: 'insufficient-data' };
  }

  const plasticityIndex = Math.round((liquidLimitPercent - plasticLimitPercent) * 10) / 10;
  const aLinePi = Math.round(0.73 * (liquidLimitPercent - 20) * 10) / 10;

  if (plasticityIndex < 4) {
    return { plasticityIndex, aLinePi, group: 'non-plastic' };
  }

  const highPlasticity = liquidLimitPercent >= 50;
  const aboveALine = plasticityIndex > aLinePi;

  let group: PlasticityGroup;
  if (aboveALine) {
    group = highPlasticity ? 'CH' : 'CL';
  } else {
    group = highPlasticity ? 'MH' : 'ML';
  }

  return { plasticityIndex, aLinePi, group };
}

export function computeAtterbergLimits(
  trials: LiquidLimitTrial[],
  plasticLimitPercent: number
): AtterbergResult {
  const fit = fitFlowCurve(trials);
  const liquidLimitPercent = fit?.liquidLimitPercent ?? null;
  const { plasticityIndex, aLinePi, group } = classifyPlasticity(liquidLimitPercent, plasticLimitPercent);

  return { liquidLimitPercent, plasticLimitPercent, plasticityIndex, aLinePi, group };
}

export const SAMPLE_LL_TRIALS: LiquidLimitTrial[] = [
  { blows: 15, moisturePercent: 42.5 },
  { blows: 20, moisturePercent: 39.8 },
  { blows: 28, moisturePercent: 36.5 },
  { blows: 35, moisturePercent: 34.0 },
];

export const SAMPLE_PL_PERCENT = 21.3;
