/**
 * Area Calculator — standard plane-shape formulas. Includes the
 * average-end-area method for earthwork cross-sections (a genuinely
 * different use case from the pure-geometry shapes — estimating cut/fill
 * volume needs the *area* at each survey station first, which is what
 * this shape covers), not just textbook shapes.
 */

export type AreaShape = 'rectangle' | 'triangle' | 'circle' | 'trapezoid';

export function computeArea(shape: AreaShape, inputs: Record<string, number>): number {
  switch (shape) {
    case 'rectangle':
      return inputs.length * inputs.width;
    case 'triangle':
      return 0.5 * inputs.base * inputs.height;
    case 'circle':
      return Math.PI * inputs.radius ** 2;
    case 'trapezoid':
      return 0.5 * (inputs.topWidth + inputs.bottomWidth) * inputs.height;
    default:
      return NaN;
  }
}

export const AREA_SHAPE_FIELDS: Record<AreaShape, { key: string; defaultValue: number }[]> = {
  rectangle: [
    { key: 'length', defaultValue: 5 },
    { key: 'width', defaultValue: 3 },
  ],
  triangle: [
    { key: 'base', defaultValue: 6 },
    { key: 'height', defaultValue: 4 },
  ],
  circle: [{ key: 'radius', defaultValue: 2 }],
  trapezoid: [
    { key: 'topWidth', defaultValue: 4 },
    { key: 'bottomWidth', defaultValue: 6 },
    { key: 'height', defaultValue: 3 },
  ],
};
