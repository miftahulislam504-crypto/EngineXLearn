/**
 * Volume Calculator — standard solid-shape formulas, plus the
 * average-end-area method for earthwork cut/fill volume between two
 * survey cross-sections (V = (A1+A2)/2 × L) — the most immediately
 * useful "volume" calculation in civil practice, not just a textbook
 * solid.
 */

export type VolumeShape = 'box' | 'cylinder' | 'cone' | 'sphere' | 'earthwork';

export function computeVolume(shape: VolumeShape, inputs: Record<string, number>): number {
  switch (shape) {
    case 'box':
      return inputs.length * inputs.width * inputs.height;
    case 'cylinder':
      return Math.PI * inputs.radius ** 2 * inputs.height;
    case 'cone':
      return (1 / 3) * Math.PI * inputs.radius ** 2 * inputs.height;
    case 'sphere':
      return (4 / 3) * Math.PI * inputs.radius ** 3;
    case 'earthwork':
      return ((inputs.area1 + inputs.area2) / 2) * inputs.distance;
    default:
      return NaN;
  }
}

export const VOLUME_SHAPE_FIELDS: Record<VolumeShape, { key: string; defaultValue: number; unit: string }[]> = {
  box: [
    { key: 'length', defaultValue: 2, unit: 'm' },
    { key: 'width', defaultValue: 3, unit: 'm' },
    { key: 'height', defaultValue: 4, unit: 'm' },
  ],
  cylinder: [
    { key: 'radius', defaultValue: 1, unit: 'm' },
    { key: 'height', defaultValue: 5, unit: 'm' },
  ],
  cone: [
    { key: 'radius', defaultValue: 1, unit: 'm' },
    { key: 'height', defaultValue: 3, unit: 'm' },
  ],
  sphere: [{ key: 'radius', defaultValue: 2, unit: 'm' }],
  earthwork: [
    { key: 'area1', defaultValue: 12.5, unit: 'm²' },
    { key: 'area2', defaultValue: 15.2, unit: 'm²' },
    { key: 'distance', defaultValue: 20, unit: 'm' },
  ],
};
