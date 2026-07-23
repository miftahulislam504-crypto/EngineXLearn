'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolNumberField, ToolResultRow } from '../tool-frame';
import { computeBrickCount, DEFAULT_BRICK_INPUTS, type BrickInputs } from './brick-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function BrickCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.brickCalculator;

  const [inputs, setInputs] = useState<BrickInputs>(DEFAULT_BRICK_INPUTS);
  const result = useMemo(() => computeBrickCount(inputs), [inputs]);

  const update = (field: keyof BrickInputs) => (v: number) => setInputs((prev) => ({ ...prev, [field]: v }));

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'brick-calculator',
        loggedIn,
        inputData: inputs,
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <p className="font-mono text-[11px] font-medium text-muted-foreground">{t.wallSection}</p>
          <ToolNumberField label={t.wallLengthLabel} value={inputs.wallLengthM} onChange={update('wallLengthM')} unit="m" />
          <ToolNumberField label={t.wallHeightLabel} value={inputs.wallHeightM} onChange={update('wallHeightM')} unit="m" />
          <ToolNumberField
            label={t.wallThicknessLabel}
            value={inputs.wallThicknessM}
            onChange={update('wallThicknessM')}
            unit="m"
            step={0.005}
          />
          <p className="pt-1 font-mono text-[11px] font-medium text-muted-foreground">{t.brickSection}</p>
          <ToolNumberField label={t.brickLengthLabel} value={inputs.brickLengthMm} onChange={update('brickLengthMm')} unit="mm" />
          <ToolNumberField label={t.brickWidthLabel} value={inputs.brickWidthMm} onChange={update('brickWidthMm')} unit="mm" />
          <ToolNumberField label={t.brickHeightLabel} value={inputs.brickHeightMm} onChange={update('brickHeightMm')} unit="mm" />
          <ToolNumberField label={t.mortarLabel} value={inputs.mortarThicknessMm} onChange={update('mortarThicknessMm')} unit="mm" />
          <ToolNumberField label={t.wastageLabel} value={inputs.wastagePercent} onChange={update('wastagePercent')} unit="%" />
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.wallVolumeLabel} value={`${result.wallVolumeM3} m³`} />
          <ToolResultRow label={t.baseCountLabel} value={t.brickCountValue(result.baseBrickCount)} />
          <ToolResultRow label={t.withWastageLabel} value={t.brickCountValue(result.brickCountWithWastage)} emphasize />
        </div>
      }
      note={t.estimateNote}
    />
  );
}
