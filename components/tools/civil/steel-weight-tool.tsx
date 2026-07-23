'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolResultRow } from '../tool-frame';
import { computeSteelWeight, STANDARD_BAR_DIAMETERS_MM } from './steel-weight-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function SteelWeightTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.steelWeight;

  const [diameterMm, setDiameterMm] = useState(16);
  const [lengthM, setLengthM] = useState(12);
  const [quantity, setQuantity] = useState(10);

  const result = useMemo(() => computeSteelWeight(diameterMm, lengthM, quantity), [diameterMm, lengthM, quantity]);

  return (
    <ToolFrame
      title={t.title}
      reference={t.reference}
      saveConfig={{
        toolSlug: 'steel-weight-calculator',
        loggedIn,
        inputData: { diameterMm, lengthM, quantity },
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.diameterLabel}</span>
            <div className="flex flex-wrap gap-1.5">
              {STANDARD_BAR_DIAMETERS_MM.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiameterMm(d)}
                  className={`rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                    diameterMm === d
                      ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {d}mm
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.lengthLabel}</span>
            <input
              type="number"
              value={lengthM}
              onChange={(e) => setLengthM(parseFloat(e.target.value) || 0)}
              className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
            />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.quantityLabel}</span>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
            />
          </div>
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.perMeterLabel} value={`${result.weightPerMeterKg} kg/m`} />
          <ToolResultRow label={t.totalLabel} value={`${result.totalWeightKg} kg`} emphasize />
        </div>
      }
    />
  );
}
