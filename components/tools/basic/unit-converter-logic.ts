/**
 * Unit Converter — calculation logic. Conversion factors are the
 * standard, widely-published values (verified independently before
 * this file was written); every category converts through a common
 * base unit (SI) rather than pairwise, so adding a new unit only means
 * adding one factor, not one per existing unit in that category.
 */

export type UnitCategory = 'length' | 'area' | 'volume' | 'mass' | 'pressure' | 'force';

export interface UnitDef {
  key: string;
  label: string;
  toBase: number; // multiply by this to get the base (SI) unit
}

// Base units: length->m, area->m^2, volume->m^3, mass->kg, pressure->kPa, force->kN
export const UNIT_CATEGORIES: Record<UnitCategory, UnitDef[]> = {
  length: [
    { key: 'mm', label: 'mm', toBase: 0.001 },
    { key: 'cm', label: 'cm', toBase: 0.01 },
    { key: 'm', label: 'm', toBase: 1 },
    { key: 'km', label: 'km', toBase: 1000 },
    { key: 'in', label: 'in', toBase: 0.0254 },
    { key: 'ft', label: 'ft', toBase: 0.3048 },
  ],
  area: [
    { key: 'm2', label: 'm²', toBase: 1 },
    { key: 'ft2', label: 'ft²', toBase: 0.092903 },
    { key: 'hectare', label: 'hectare', toBase: 10000 },
    { key: 'acre', label: 'acre', toBase: 4046.86 },
    { key: 'katha', label: 'katha (BD)', toBase: 66.89 },
  ],
  volume: [
    { key: 'm3', label: 'm³', toBase: 1 },
    { key: 'ft3', label: 'ft³ (cft)', toBase: 0.0283168 },
    { key: 'litre', label: 'litre', toBase: 0.001 },
    { key: 'usgal', label: 'US gal', toBase: 0.00378541 },
  ],
  mass: [
    { key: 'kg', label: 'kg', toBase: 1 },
    { key: 'ton', label: 'metric ton', toBase: 1000 },
    { key: 'lb', label: 'lb', toBase: 0.453592 },
  ],
  pressure: [
    { key: 'kpa', label: 'kPa', toBase: 1 },
    { key: 'mpa', label: 'MPa', toBase: 1000 },
    { key: 'psi', label: 'psi', toBase: 6.89476 },
    { key: 'ksi', label: 'ksi', toBase: 6894.76 },
  ],
  force: [
    { key: 'kn', label: 'kN', toBase: 1 },
    { key: 'n', label: 'N', toBase: 0.001 },
    { key: 'lbf', label: 'lbf', toBase: 0.00444822 },
  ],
};

export function convertUnit(value: number, category: UnitCategory, fromKey: string, toKey: string): number {
  const units = UNIT_CATEGORIES[category];
  const from = units.find((u) => u.key === fromKey);
  const to = units.find((u) => u.key === toKey);
  if (!from || !to) return NaN;
  const baseValue = value * from.toBase;
  return baseValue / to.toBase;
}
