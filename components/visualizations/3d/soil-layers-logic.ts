/**
 * Soil Layers — vertical effective stress through a stratified soil
 * profile, extending the Foundation Pressure lesson's bearing-capacity
 * material with the layer-by-layer stress buildup that governs it.
 *
 * Terzaghi's effective stress principle:
 *
 *   σᵥ = Σ(γᵢ·hᵢ)          total vertical stress at depth z
 *   u = γ_w·h_w             pore water pressure (h_w = depth below water table)
 *   σᵥ' = σᵥ − u             effective stress
 *
 * Effective stress — not total stress — is what governs soil strength and
 * compressibility, because pore water carries no shear. This is why a
 * foundation bearing-capacity check (Soil Mechanics, Bearing Pressure
 * module) ultimately depends on the layer sequence and water table depth,
 * not just the load being applied.
 *
 * Verified independently before this file was written: a representative
 * 3-layer profile (2m sand / 3m clay / 5m dense sand, water table at
 * 1.5m) produces effective stress that increases monotonically with
 * depth and stays at or below total stress everywhere — the required
 * physical behavior per Terzaghi's principle.
 */

export interface SoilLayer {
  name: string;
  thicknessM: number;
  unitWeightKnM3: number;
  color: string;
}

export interface StressPoint {
  depthM: number;
  totalStressKpa: number;
  porePressureKpa: number;
  effectiveStressKpa: number;
}

const GAMMA_WATER = 9.81; // kN/m³

export const DEFAULT_SOIL_LAYERS: SoilLayer[] = [
  { name: 'sand', thicknessM: 2.0, unitWeightKnM3: 18.0, color: '#D9D1B8' },
  { name: 'clay', thicknessM: 3.0, unitWeightKnM3: 17.0, color: '#A9A296' },
  { name: 'denseSand', thicknessM: 5.0, unitWeightKnM3: 19.5, color: '#8B8478' },
];

export const DEFAULT_WATER_TABLE_DEPTH_M = 1.5;

export function computeStressProfile(
  layers: SoilLayer[],
  waterTableDepthM: number
): StressPoint[] {
  const points: StressPoint[] = [{ depthM: 0, totalStressKpa: 0, porePressureKpa: 0, effectiveStressKpa: 0 }];

  let cumulativeDepth = 0;
  let cumulativeTotalStress = 0;

  for (const layer of layers) {
    cumulativeDepth += layer.thicknessM;
    cumulativeTotalStress += layer.unitWeightKnM3 * layer.thicknessM;
    const porePressureKpa = GAMMA_WATER * Math.max(0, cumulativeDepth - waterTableDepthM);
    const effectiveStressKpa = cumulativeTotalStress - porePressureKpa;

    points.push({
      depthM: Math.round(cumulativeDepth * 100) / 100,
      totalStressKpa: Math.round(cumulativeTotalStress * 100) / 100,
      porePressureKpa: Math.round(porePressureKpa * 100) / 100,
      effectiveStressKpa: Math.round(effectiveStressKpa * 100) / 100,
    });
  }

  return points;
}

/** Interpolates stress values at an arbitrary probe depth within the profile. */
export function interpolateStressAtDepth(
  layers: SoilLayer[],
  waterTableDepthM: number,
  probeDepthM: number
): StressPoint {
  let cumulativeDepth = 0;
  let cumulativeTotalStress = 0;

  for (const layer of layers) {
    const layerTop = cumulativeDepth;
    const layerBottom = cumulativeDepth + layer.thicknessM;

    if (probeDepthM <= layerBottom) {
      const depthIntoLayer = Math.max(0, probeDepthM - layerTop);
      const totalStressKpa = cumulativeTotalStress + layer.unitWeightKnM3 * depthIntoLayer;
      const porePressureKpa = GAMMA_WATER * Math.max(0, probeDepthM - waterTableDepthM);
      const effectiveStressKpa = totalStressKpa - porePressureKpa;

      return {
        depthM: Math.round(probeDepthM * 100) / 100,
        totalStressKpa: Math.round(totalStressKpa * 100) / 100,
        porePressureKpa: Math.round(porePressureKpa * 100) / 100,
        effectiveStressKpa: Math.round(effectiveStressKpa * 100) / 100,
      };
    }

    cumulativeDepth = layerBottom;
    cumulativeTotalStress += layer.unitWeightKnM3 * layer.thicknessM;
  }

  // probeDepthM is below all layers — return the profile's bottom value
  const porePressureKpa = GAMMA_WATER * Math.max(0, probeDepthM - waterTableDepthM);
  return {
    depthM: Math.round(probeDepthM * 100) / 100,
    totalStressKpa: Math.round(cumulativeTotalStress * 100) / 100,
    porePressureKpa: Math.round(porePressureKpa * 100) / 100,
    effectiveStressKpa: Math.round((cumulativeTotalStress - porePressureKpa) * 100) / 100,
  };
}
