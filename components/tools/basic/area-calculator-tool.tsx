'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolSelectRow } from '../tool-frame';
import { computeArea, AREA_SHAPE_FIELDS, type AreaShape } from './area-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

const SHAPES: AreaShape[] = ['rectangle', 'triangle', 'circle', 'trapezoid'];

export function AreaCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.areaCalculator;

  const [shape, setShape] = useState<AreaShape>('rectangle');
  const [values, setValues] = useState<Record<AreaShape, Record<string, number>>>({
    rectangle: { length: 5, width: 3 },
    triangle: { base: 6, height: 4 },
    circle: { radius: 2 },
    trapezoid: { topWidth: 4, bottomWidth: 6, height: 3 },
  });

  const shapeLabels: Record<AreaShape, string> = {
    rectangle: t.shapeRectangle,
    triangle: t.shapeTriangle,
    circle: t.shapeCircle,
    trapezoid: t.shapeTrapezoid,
  };

  const fieldLabels: Record<string, string> = {
    length: t.fieldLength,
    width: t.fieldWidth,
    base: t.fieldBase,
    height: t.fieldHeight,
    radius: t.fieldRadius,
    topWidth: t.fieldTopWidth,
    bottomWidth: t.fieldBottomWidth,
  };

  const result = useMemo(() => computeArea(shape, values[shape]), [shape, values]);

  const updateField = (field: string, v: number) => {
    setValues((prev) => ({ ...prev, [shape]: { ...prev[shape], [field]: v } }));
  };

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'area-calculator',
        loggedIn,
        inputData: { shape, values: values[shape] },
        results: { areaM2: result },
      }}
      inputs={
        <div className="space-y-3">
          <ToolSelectRow
            label={t.shapeLabel}
            value={shape}
            onChange={(v) => setShape(v as AreaShape)}
            options={SHAPES.map((s) => ({ value: s, label: shapeLabels[s] }))}
          />
          {AREA_SHAPE_FIELDS[shape].map((f) => (
            <div key={f.key} className="flex items-center gap-3 text-sm">
              <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">
                {fieldLabels[f.key]}
              </span>
              <span className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={values[shape][f.key] ?? f.defaultValue}
                  onChange={(e) => updateField(f.key, parseFloat(e.target.value) || 0)}
                  className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
                />
                <span className="font-mono text-xs text-muted-foreground">m</span>
              </span>
            </div>
          ))}
        </div>
      }
      results={
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">
            {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}{' '}
            <span className="text-base font-normal text-muted-foreground">m²</span>
          </p>
        </div>
      }
    />
  );
}
