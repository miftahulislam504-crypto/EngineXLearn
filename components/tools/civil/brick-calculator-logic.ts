/**
 * Brick Calculator — number of bricks for a wall from wall dimensions,
 * brick size, and mortar joint thickness. Uses the standard estimation
 * approach: wall volume ÷ (brick volume including its share of the
 * mortar joint) — the same convention as every commonly-published brick
 * calculator, not a bond-pattern-specific model (real bond patterns —
 * English, Flemish, stretcher — do shift the exact count slightly; this
 * gives a reliable estimating figure, which is what this kind of tool
 * is for, not a bricklayer's cutting list). Exposing brick size and
 * mortar thickness as inputs, rather than hardcoding them, means the
 * result can be tuned to a specific supplier's actual brick dimensions.
 */

export interface BrickInputs {
  wallLengthM: number;
  wallHeightM: number;
  wallThicknessM: number;
  brickLengthMm: number;
  brickWidthMm: number;
  brickHeightMm: number;
  mortarThicknessMm: number;
  wastagePercent: number;
}

export interface BrickResult {
  wallVolumeM3: number;
  brickWithMortarVolumeM3: number;
  baseBrickCount: number;
  brickCountWithWastage: number;
}

export function computeBrickCount(inputs: BrickInputs): BrickResult {
  const wallVolumeM3 = inputs.wallLengthM * inputs.wallHeightM * inputs.wallThicknessM;

  const mortarM = inputs.mortarThicknessMm / 1000;
  const lM = inputs.brickLengthMm / 1000 + mortarM;
  const wM = inputs.brickWidthMm / 1000 + mortarM;
  const hM = inputs.brickHeightMm / 1000 + mortarM;
  const brickWithMortarVolumeM3 = lM * wM * hM;

  const baseBrickCount = wallVolumeM3 / brickWithMortarVolumeM3;
  const brickCountWithWastage = baseBrickCount * (1 + inputs.wastagePercent / 100);

  return {
    wallVolumeM3: Math.round(wallVolumeM3 * 1000) / 1000,
    brickWithMortarVolumeM3: Math.round(brickWithMortarVolumeM3 * 1e6) / 1e6,
    baseBrickCount: Math.ceil(baseBrickCount),
    brickCountWithWastage: Math.ceil(brickCountWithWastage),
  };
}

export const DEFAULT_BRICK_INPUTS: BrickInputs = {
  wallLengthM: 5,
  wallHeightM: 3,
  wallThicknessM: 0.25,
  brickLengthMm: 240,
  brickWidthMm: 115,
  brickHeightMm: 70,
  mortarThicknessMm: 10,
  wastagePercent: 5,
};
