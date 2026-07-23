/**
 * Water Flow — open-channel flow in a rectangular channel via Manning's
 * Equation, one of the most widely-used formulas in hydraulics for
 * irrigation channels, storm drains, and culverts.
 *
 *   V = (1/n) · R^(2/3) · S^(1/2)      (velocity, m/s)
 *   Q = V · A                          (discharge, m³/s)
 *
 * For a rectangular channel of width b and flow depth y:
 *   A = b·y                (cross-sectional flow area)
 *   P = b + 2y              (wetted perimeter — bottom + two sides, not the open top)
 *   R = A/P                 (hydraulic radius)
 *
 * Verified independently before this file was written: a 2m-wide
 * concrete-lined channel (n=0.013, slope=0.001) at 1.0m depth produces
 * Q ≈ 3.06 m³/s, and discharge increases monotonically with depth across
 * a range of depths (0.3m–1.5m) — the correct physical behavior for a
 * simple rectangular channel with fixed width.
 */

export interface ChannelInputs {
  widthM: number; // b
  depthM: number; // y
  manningsN: number; // roughness coefficient
  slope: number; // dimensionless, e.g. 0.001 = 0.1%
}

export interface ChannelResult {
  areaM2: number;
  wettedPerimeterM: number;
  hydraulicRadiusM: number;
  velocityMs: number;
  dischargeM3s: number;
}

export const MANNINGS_N_PRESETS = {
  concrete: 0.013,
  earth: 0.025,
  gravel: 0.03,
} as const;

export const DEFAULT_CHANNEL_INPUTS: ChannelInputs = {
  widthM: 2.0,
  depthM: 0.8,
  manningsN: MANNINGS_N_PRESETS.concrete,
  slope: 0.001,
};

export function computeChannelFlow(inputs: ChannelInputs): ChannelResult {
  const { widthM, depthM, manningsN, slope } = inputs;

  const areaM2 = widthM * depthM;
  const wettedPerimeterM = widthM + 2 * depthM;
  const hydraulicRadiusM = wettedPerimeterM > 0 ? areaM2 / wettedPerimeterM : 0;

  const velocityMs =
    manningsN > 0 ? (1 / manningsN) * hydraulicRadiusM ** (2 / 3) * slope ** 0.5 : 0;
  const dischargeM3s = velocityMs * areaM2;

  return {
    areaM2: Math.round(areaM2 * 1000) / 1000,
    wettedPerimeterM: Math.round(wettedPerimeterM * 1000) / 1000,
    hydraulicRadiusM: Math.round(hydraulicRadiusM * 10000) / 10000,
    velocityMs: Math.round(velocityMs * 1000) / 1000,
    dischargeM3s: Math.round(dischargeM3s * 1000) / 1000,
  };
}
