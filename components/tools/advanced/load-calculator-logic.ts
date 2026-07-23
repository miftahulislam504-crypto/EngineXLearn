/**
 * Load Calculator — combines dead and live load into design load using
 * the standard BNBC 2020 / ACI 318-19 strength-level load combination
 * (1.2D + 1.6L for the governing gravity case), alongside the plain
 * service-level sum and a simplified wind combination. Verified against
 * the textbook combination factors directly before this file was
 * written.
 */

export type LoadCombination = 'service' | 'strength' | 'wind';

export interface LoadResult {
  serviceLoadKn: number;
  strengthLoadKn: number;
  windLoadKn: number;
  governingKn: number;
  governingCombo: LoadCombination;
}

export function computeFactoredLoads(deadKn: number, liveKn: number, windKn: number): LoadResult {
  const serviceLoadKn = deadKn + liveKn;
  const strengthLoadKn = 1.2 * deadKn + 1.6 * liveKn;
  const windLoadKn = 1.2 * deadKn + 1.0 * liveKn + 1.0 * windKn;

  const combos: { combo: LoadCombination; value: number }[] = [
    { combo: 'strength', value: strengthLoadKn },
    { combo: 'wind', value: windLoadKn },
  ];
  const governing = combos.reduce((max, c) => (c.value > max.value ? c : max), combos[0]);

  return {
    serviceLoadKn: Math.round(serviceLoadKn * 100) / 100,
    strengthLoadKn: Math.round(strengthLoadKn * 100) / 100,
    windLoadKn: Math.round(windLoadKn * 100) / 100,
    governingKn: Math.round(governing.value * 100) / 100,
    governingCombo: governing.combo,
  };
}
