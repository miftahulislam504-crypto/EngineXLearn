'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolNumberField, ToolResultRow } from '../tool-frame';
import { computeBeamAnalysis } from './beam-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function BeamCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.beamCalculator;

  const [spanM, setSpanM] = useState(6);
  const [udlKnPerM, setUdlKnPerM] = useState(10);
  const [pointLoadKn, setPointLoadKn] = useState(0);
  const [pointLoadPositionM, setPointLoadPositionM] = useState(3);

  const result = useMemo(
    () => computeBeamAnalysis(spanM, udlKnPerM, pointLoadKn, pointLoadKn > 0 ? pointLoadPositionM : null),
    [spanM, udlKnPerM, pointLoadKn, pointLoadPositionM]
  );

  return (
    <ToolFrame
      title={t.title}
      reference={t.reference}
      saveConfig={{
        toolSlug: 'beam-calculator',
        loggedIn,
        inputData: { spanM, udlKnPerM, pointLoadKn, pointLoadPositionM: pointLoadKn > 0 ? pointLoadPositionM : null },
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <ToolNumberField label={t.spanLabel} value={spanM} onChange={setSpanM} unit="m" />
          <ToolNumberField label={t.udlLabel} value={udlKnPerM} onChange={setUdlKnPerM} unit="kN/m" />
          <ToolNumberField label={t.pointLoadLabel} value={pointLoadKn} onChange={setPointLoadKn} unit="kN" />
          {pointLoadKn > 0 && (
            <ToolNumberField
              label={t.pointLoadPositionLabel}
              value={pointLoadPositionM}
              onChange={setPointLoadPositionM}
              unit="m"
              min={0}
            />
          )}
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.maxMomentLabel} value={`${result.maxMomentKnm} kN·m`} emphasize />
          <ToolResultRow label={t.maxShearLabel} value={`${result.maxShearKn} kN`} emphasize />
          <ToolResultRow label={t.reactionALabel} value={`${result.reactionAKn} kN`} />
          <ToolResultRow label={t.reactionBLabel} value={`${result.reactionBKn} kN`} />
        </div>
      }
      note={t.scopeNote}
    />
  );
}
