/**
 * Load Transfer — the slab → beam → column → foundation → soil load path.
 *
 * Unlike a single-formula visualization (Euler buckling, a moment
 * diagram), this is a CHAIN: a distributed load becomes progressively
 * more concentrated through the structure, then spreads back out at the
 * foundation to keep soil bearing pressure within safe limits. That
 * transformation — area load -> line load -> point load -> point load ->
 * area pressure again — is the actual teaching point.
 *
 * The chain below was verified against a hand-worked numerical example
 * before this file was written: a 5 kN/m² slab load over a 4m tributary
 * width becomes a 20 kN/m beam line load, a 60 kN column point load, and
 * (sized against a 150 kN/m² safe bearing capacity) needs a ~0.4m²
 * footing — which brings the soil pressure back to exactly the bearing
 * capacity, confirming the chain is self-consistent stage to stage.
 */

export interface LoadTransferInputs {
  slabUdlKpa: number; // kN/m² — combined dead + live load on the slab
  tributaryWidthM: number; // m — width of slab contributing to one beam
  beamSpanM: number; // m — beam span between columns
  safeBearingCapacityKpa: number; // kN/m² — allowable soil bearing pressure
}

export interface LoadTransferStage {
  key: 'slab' | 'beam' | 'column' | 'foundation' | 'soil';
  value: number;
  unit: string;
  loadType: 'area' | 'line' | 'point';
}

export interface LoadTransferResult {
  stages: LoadTransferStage[];
  tributaryWidthM: number;
  beamTotalLoadKn: number;
  beamSpanM: number;
  safeBearingCapacityKpa: number;
  requiredFootingAreaM2: number;
  footingSideM: number;
  finalSoilPressureKpa: number;
}

export function computeLoadTransfer(inputs: LoadTransferInputs): LoadTransferResult {
  const { slabUdlKpa, tributaryWidthM, beamSpanM, safeBearingCapacityKpa } = inputs;

  const beamLineLoadKnPerM = slabUdlKpa * tributaryWidthM;
  const beamTotalLoadKn = beamLineLoadKnPerM * beamSpanM;
  const columnPointLoadKn = beamTotalLoadKn / 2; // symmetric simply-supported beam, load splits to both end columns
  const foundationPointLoadKn = columnPointLoadKn; // unchanged through the column (self-weight ignored for clarity)

  const requiredFootingAreaM2 =
    safeBearingCapacityKpa > 0 ? foundationPointLoadKn / safeBearingCapacityKpa : 0;
  const footingSideM = Math.sqrt(Math.max(0, requiredFootingAreaM2));
  const finalSoilPressureKpa =
    requiredFootingAreaM2 > 0 ? foundationPointLoadKn / requiredFootingAreaM2 : 0;

  const stages: LoadTransferStage[] = [
    {
      key: 'slab',
      value: Math.round(slabUdlKpa * 100) / 100,
      unit: 'kN/m²',
      loadType: 'area',
    },
    {
      key: 'beam',
      value: Math.round(beamLineLoadKnPerM * 100) / 100,
      unit: 'kN/m',
      loadType: 'line',
    },
    {
      key: 'column',
      value: Math.round(columnPointLoadKn * 100) / 100,
      unit: 'kN',
      loadType: 'point',
    },
    {
      key: 'foundation',
      value: Math.round(foundationPointLoadKn * 100) / 100,
      unit: 'kN',
      loadType: 'point',
    },
    {
      key: 'soil',
      value: Math.round(finalSoilPressureKpa * 100) / 100,
      unit: 'kN/m²',
      loadType: 'area',
    },
  ];

  return {
    stages,
    tributaryWidthM,
    beamTotalLoadKn: Math.round(beamTotalLoadKn * 100) / 100,
    beamSpanM,
    safeBearingCapacityKpa,
    requiredFootingAreaM2: Math.round(requiredFootingAreaM2 * 1000) / 1000,
    footingSideM: Math.round(footingSideM * 1000) / 1000,
    finalSoilPressureKpa: Math.round(finalSoilPressureKpa * 100) / 100,
  };
}

export const DEFAULT_LOAD_TRANSFER_INPUTS: LoadTransferInputs = {
  slabUdlKpa: 5.0,
  tributaryWidthM: 4.0,
  beamSpanM: 6.0,
  safeBearingCapacityKpa: 150,
};
