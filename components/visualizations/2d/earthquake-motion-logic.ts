/**
 * Earthquake Motion — single-degree-of-freedom (SDOF) structural response
 * to harmonic ground shaking, showing resonance: the building's response
 * amplifies sharply when the ground motion's forcing frequency approaches
 * the structure's own natural frequency.
 *
 * Dynamic Amplification Factor (steady-state harmonic response):
 *
 *   DAF = 1 / √[ (1 − r²)² + (2ζr)² ]
 *
 * where r = ω_forcing / ω_natural (frequency ratio) and ζ is the damping
 * ratio. This is standard SDOF structural dynamics, not a simplification
 * specific to this platform — it's the same formula that explains why
 * earthquake-induced building damage often has little to do with how
 * "strong" the shaking was in absolute terms, and everything to do with
 * how close the shaking's dominant frequency landed to the building's
 * natural frequency.
 *
 * Verified independently before this file was written: at r=1 (exact
 * resonance) with ζ=0.05, DAF=10.00, matching the closed-form peak
 * 1/(2ζ)=10.00 exactly; DAF→1 as r→0 (static-like loading) and DAF→0 as
 * r becomes large (structure can't respond fast enough to keep up).
 */

export interface SdofInputs {
  periodSec: number; // building's natural period T (s) — taller/more flexible = longer T
  dampingRatio: number; // ζ, dimensionless (0.05 = 5%, typical for RC)
  groundMotionPeriodSec: number; // period of the (simplified harmonic) ground motion
}

export interface SdofResult {
  naturalFrequencyHz: number;
  forcingFrequencyHz: number;
  frequencyRatio: number;
  dynamicAmplificationFactor: number;
  nearResonance: boolean;
}

export function computeSdofResponse(inputs: SdofInputs): SdofResult {
  const { periodSec, dampingRatio, groundMotionPeriodSec } = inputs;

  const naturalFrequencyHz = 1 / periodSec;
  const forcingFrequencyHz = 1 / groundMotionPeriodSec;
  const r = forcingFrequencyHz / naturalFrequencyHz;

  const daf = 1 / Math.sqrt((1 - r ** 2) ** 2 + (2 * dampingRatio * r) ** 2);

  return {
    naturalFrequencyHz: Math.round(naturalFrequencyHz * 1000) / 1000,
    forcingFrequencyHz: Math.round(forcingFrequencyHz * 1000) / 1000,
    frequencyRatio: Math.round(r * 1000) / 1000,
    dynamicAmplificationFactor: Math.round(daf * 100) / 100,
    nearResonance: Math.abs(r - 1) < 0.15,
  };
}

export const DEFAULT_SDOF_INPUTS: SdofInputs = {
  periodSec: 0.5, // a representative stiff mid-rise building
  dampingRatio: 0.05,
  groundMotionPeriodSec: 0.5,
};
