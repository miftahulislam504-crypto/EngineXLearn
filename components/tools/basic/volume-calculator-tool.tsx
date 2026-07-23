'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolSelectRow } from '../tool-frame';
import { computeVolume, VOLUME_SHAPE_FIELDS, type VolumeShape } from './volume-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

const SHAPES: VolumeShape[] = ['box', 'cylinder', 'cone', 'sphere', 'earthwork'];

export function VolumeCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.volumeCalculator;

  const [shape, setShape] = useState<VolumeShape>('box');
  const [values, setValues] = useState<Record<VolumeShape, Record<string, number>>>({
    box: { length: 2, width: 3, height: 4 },
    cylinder: { radius: 1, height: 5 },
    cone: { radius: 1, height: 3 },
    sphere: { radius: 2 },
    earthwork: { area1: 12.5, area2: 15.2, distance: 20 },
  });

  const shapeLabels: Record<VolumeShape, string> = {
    box: t.shapeBox,
    cylinder: t.shapeCylinder,
    cone: t.shapeCone,
    sphere: t.shapeSphere,
    earthwork: t.shapeEarthwork,
  };

  const fieldLabels: Record<string, string> = {
    length: t.fieldLength,
    width: t.fieldWidth,
    height: t.fieldHeight,
    radius: t.fieldRadius,
    area1: t.fieldArea1,
    area2: t.fieldArea2,
    distance: t.fieldDistance,
  };

  const result = useMemo(() => computeVolume(shape, values[shape]), [shape, values]);

  const updateField = (field: string, v: number) => {
    setValues((prev) => ({ ...prev, [shape]: { ...prev[shape], [field]: v } }));
  };

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'volume-calculator',
        loggedIn,
        inputData: { shape, values: values[shape] },
        results: { volumeM3: result },
      }}
      inputs={
        <div className="space-y-3">
          <ToolSelectRow
            label={t.shapeLabel}
            value={shape}
            onChange={(v) => setShape(v as VolumeShape)}
            options={SHAPES.map((s) => ({ value: s, label: shapeLabels[s] }))}
          />
          {VOLUME_SHAPE_FIELDS[shape].map((f) => (
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
                <span className="font-mono text-xs text-muted-foreground">{f.unit}</span>
              </span>
            </div>
          ))}
          {shape === 'earthwork' && <p className="text-xs text-muted-foreground">{t.earthworkNote}</p>}
        </div>
      }
      results={
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">
            {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}{' '}
            <span className="text-base font-normal text-muted-foreground">m³</span>
          </p>
        </div>
      }
    />
  );
}
