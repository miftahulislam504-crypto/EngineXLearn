/**
 * Reinforcement Details — minimum reinforcement, bar layout, and clear
 * spacing for a rectangular beam cross-section (ACI 318-19 / BNBC 2020).
 *
 * Unlike a single-formula visualization, this one is fundamentally about
 * detailing GEOMETRY: how many bars, what diameter, how they physically
 * fit within the section with proper cover and spacing. Getting the
 * geometry rules right matters as much as any formula here.
 *
 * As,min = max( (1.4/fy)·b·d , (√fc'/(4·fy))·b·d )   [ACI 318-19 §9.6.1.2, fy/fc' in MPa]
 *
 * Verified independently before this file was written: a 300×500mm beam
 * (fc'=25MPa, fy=420MPa) needs As,min = 500 mm², satisfiable with 3×16mm,
 * 2×20mm, or 2×25mm bars; a 4×20mm layout in that section clears its
 * minimum spacing requirement with room to spare (40mm actual vs 25mm
 * minimum).
 */

export interface BeamSectionInputs {
  widthMm: number; // b
  effectiveDepthMm: number; // d
  fcPrimeMpa: number; // concrete compressive strength
  fyMpa: number; // steel yield strength
  barDiameterMm: number;
  coverMm: number;
  stirrupDiameterMm: number;
}

export interface BarPosition {
  x: number; // mm from section center, for layout purposes
  y: number; // mm from bottom of section
}

export interface ReinforcementResult {
  asMinMm2: number;
  barAreaMm2: number;
  barCount: number;
  providedAsMm2: number;
  meetsMinimum: boolean;
  clearSpacingMm: number;
  minRequiredSpacingMm: number;
  spacingOk: boolean;
  barPositions: BarPosition[];
}

export const DEFAULT_BEAM_SECTION: BeamSectionInputs = {
  widthMm: 300,
  effectiveDepthMm: 500,
  fcPrimeMpa: 25,
  fyMpa: 420,
  barDiameterMm: 20,
  coverMm: 40,
  stirrupDiameterMm: 10,
};

function barArea(diameterMm: number): number {
  return Math.PI * (diameterMm / 2) ** 2;
}

export function computeReinforcement(
  inputs: BeamSectionInputs,
  barCount: number
): ReinforcementResult {
  const { widthMm, effectiveDepthMm, fcPrimeMpa, fyMpa, barDiameterMm, coverMm, stirrupDiameterMm } =
    inputs;

  const option1 = (1.4 / fyMpa) * widthMm * effectiveDepthMm;
  const option2 = (Math.sqrt(fcPrimeMpa) / (4 * fyMpa)) * widthMm * effectiveDepthMm;
  const asMinMm2 = Math.max(option1, option2);

  const singleBarArea = barArea(barDiameterMm);
  const providedAsMm2 = singleBarArea * barCount;
  const meetsMinimum = providedAsMm2 >= asMinMm2;

  // Available horizontal space for bars + gaps, after cover and stirrup
  const availableWidth = widthMm - 2 * coverMm - 2 * stirrupDiameterMm - barCount * barDiameterMm;
  const gaps = barCount - 1;
  const clearSpacingMm = gaps > 0 ? availableWidth / gaps : availableWidth;
  const minRequiredSpacingMm = Math.max(25, barDiameterMm);
  const spacingOk = clearSpacingMm >= minRequiredSpacingMm;

  // Bar center positions, evenly distributed across the available width,
  // for the 3D visualization to place actual bar meshes.
  const barPositions: BarPosition[] = [];
  const totalBarSpan = barCount * barDiameterMm + gaps * Math.max(clearSpacingMm, 0);
  const startX = -totalBarSpan / 2 + barDiameterMm / 2;
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barDiameterMm + Math.max(clearSpacingMm, 0));
    barPositions.push({ x, y: coverMm + stirrupDiameterMm + barDiameterMm / 2 });
  }

  return {
    asMinMm2: Math.round(asMinMm2 * 10) / 10,
    barAreaMm2: Math.round(singleBarArea * 10) / 10,
    barCount,
    providedAsMm2: Math.round(providedAsMm2 * 10) / 10,
    meetsMinimum,
    clearSpacingMm: Math.round(clearSpacingMm * 10) / 10,
    minRequiredSpacingMm,
    spacingOk,
    barPositions,
  };
}
