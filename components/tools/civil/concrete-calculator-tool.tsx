'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolResultRow } from '../tool-frame';
import { computeConcreteQuantities, STANDARD_MIXES } from './concrete-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function ConcreteCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.concreteCalculator;

  const [volumeM3, setVolumeM3] = useState(1);
  const [mixIdx, setMixIdx] = useState(1); // default M20

  const result = useMemo(
    () => computeConcreteQuantities(volumeM3, STANDARD_MIXES[mixIdx].ratio),
    [volumeM3, mixIdx]
  );

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'concrete-calculator',
        loggedIn,
        inputData: { volumeM3, mix: STANDARD_MIXES[mixIdx].label },
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.mixLabel}</span>
            <div className="flex flex-wrap gap-1.5">
              {STANDARD_MIXES.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => setMixIdx(i)}
                  className={`rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
                    mixIdx === i
                      ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.volumeLabel}</span>
            <span className="flex items-center gap-1.5">
              <input
                type="number"
                value={volumeM3}
                onChange={(e) => setVolumeM3(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
              <span className="font-mono text-xs text-muted-foreground">m³</span>
            </span>
          </div>
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.dryVolumeLabel} value={`${result.dryVolumeM3} m³`} />
          <ToolResultRow label={t.cementLabel} value={t.bagsValue(result.cementBags)} emphasize />
          <ToolResultRow label={t.sandLabel} value={`${result.sandM3} m³`} emphasize />
          <ToolResultRow label={t.aggregateLabel} value={`${result.aggregateM3} m³`} emphasize />
        </div>
      }
      note={t.assumptionsNote}
    />
  );
}
