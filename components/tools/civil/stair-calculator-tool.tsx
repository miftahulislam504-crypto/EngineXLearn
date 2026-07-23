'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ToolFrame, ToolNumberField, ToolResultRow } from '../tool-frame';
import { computeStairDesign } from './stair-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function StairCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.stairCalculator;

  const [totalRiseMm, setTotalRiseMm] = useState(3000);
  const [targetRiserMm, setTargetRiserMm] = useState(165);

  const result = useMemo(() => computeStairDesign(totalRiseMm, targetRiserMm), [totalRiseMm, targetRiserMm]);

  return (
    <ToolFrame
      title={t.title}
      reference={t.reference}
      saveConfig={{
        toolSlug: 'stair-calculator',
        loggedIn,
        inputData: { totalRiseMm, targetRiserMm },
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <ToolNumberField label={t.totalRiseLabel} value={totalRiseMm} onChange={setTotalRiseMm} unit="mm" />
          <ToolNumberField label={t.targetRiserLabel} value={targetRiserMm} onChange={setTargetRiserMm} unit="mm" />
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.riserCountLabel} value={String(result.riserCount)} />
          <ToolResultRow label={t.actualRiserLabel} value={`${result.actualRiserMm} mm`} emphasize />
          <ToolResultRow label={t.treadCountLabel} value={String(result.treadCount)} />
          <ToolResultRow label={t.treadLabel} value={`${result.treadMm} mm`} emphasize />
          <ToolResultRow label={t.totalGoingLabel} value={`${result.totalGoingMm} mm`} />
          <ToolResultRow label={t.walkingLineLabel} value={`${result.walkingLineMm} mm`} />
          {!result.riserInComfortRange && (
            <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t.riserOutOfRangeWarning}
            </p>
          )}
        </div>
      }
      note={t.walkingLineNote}
    />
  );
}
