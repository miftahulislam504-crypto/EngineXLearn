'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolResultRow, ToolNumberField } from '../tool-frame';
import { riseRunFromSlope } from './slope-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function SlopeCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.slopeCalculator;

  const [horizontalPart, setHorizontalPart] = useState(1.5);
  const [verticalPart, setVerticalPart] = useState(1);
  const [horizontalDistance, setHorizontalDistance] = useState(10);

  const angleDeg = useMemo(
    () => Math.atan(verticalPart / horizontalPart) * (180 / Math.PI),
    [horizontalPart, verticalPart]
  );
  const percent = useMemo(() => (verticalPart / horizontalPart) * 100, [horizontalPart, verticalPart]);
  const rise = useMemo(
    () => riseRunFromSlope(horizontalPart, verticalPart, horizontalDistance, true),
    [horizontalPart, verticalPart, horizontalDistance]
  );

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'slope-calculator',
        loggedIn,
        inputData: { horizontalPart, verticalPart, horizontalDistance },
        results: { angleDeg, percent, verticalRise: rise.vertical },
      }}
      inputs={
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.slopeRatioLabel}</span>
            <span className="flex items-center gap-1.5 font-mono text-sm">
              {t.ratioVerticalPrefix}
              <input
                type="number"
                value={verticalPart}
                onChange={(e) => setVerticalPart(parseFloat(e.target.value) || 0)}
                className="h-9 w-16 rounded-md border border-input bg-background px-2 text-center font-mono text-sm"
              />
              :
              <input
                type="number"
                value={horizontalPart}
                onChange={(e) => setHorizontalPart(parseFloat(e.target.value) || 0.001)}
                className="h-9 w-16 rounded-md border border-input bg-background px-2 text-center font-mono text-sm"
              />
              {t.ratioHorizontalSuffix}
            </span>
          </div>
          <ToolNumberField
            label={t.horizontalDistanceLabel}
            value={horizontalDistance}
            onChange={setHorizontalDistance}
            unit="m"
          />
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.angleLabel} value={`${angleDeg.toFixed(2)}°`} emphasize />
          <ToolResultRow label={t.percentLabel} value={`${percent.toFixed(1)}%`} emphasize />
          <ToolResultRow label={t.verticalRiseLabel} value={`${rise.vertical.toFixed(3)} m`} />
        </div>
      }
    />
  );
}
