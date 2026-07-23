'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolNumberField, ToolResultRow } from '../tool-frame';
import { computeFactoredLoads, type LoadCombination } from './load-calculator-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function LoadCalculatorTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.loadCalculator;

  const [deadKn, setDeadKn] = useState(50);
  const [liveKn, setLiveKn] = useState(30);
  const [windKn, setWindKn] = useState(0);

  const result = useMemo(() => computeFactoredLoads(deadKn, liveKn, windKn), [deadKn, liveKn, windKn]);

  const comboLabels: Record<LoadCombination, string> = {
    service: t.comboService,
    strength: t.comboStrength,
    wind: t.comboWind,
  };

  return (
    <ToolFrame
      title={t.title}
      reference={t.reference}
      saveConfig={{
        toolSlug: 'load-calculator',
        loggedIn,
        inputData: { deadKn, liveKn, windKn },
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <ToolNumberField label={t.deadLoadLabel} value={deadKn} onChange={setDeadKn} unit="kN" />
          <ToolNumberField label={t.liveLoadLabel} value={liveKn} onChange={setLiveKn} unit="kN" />
          <ToolNumberField label={t.windLoadLabel} value={windKn} onChange={setWindKn} unit="kN" />
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.comboService} value={`${result.serviceLoadKn} kN`} />
          <ToolResultRow label={t.comboStrength} value={`${result.strengthLoadKn} kN`} />
          <ToolResultRow label={t.comboWind} value={`${result.windLoadKn} kN`} />
          <div className="mt-2 border-t border-border pt-2">
            <ToolResultRow label={t.governingLabel} value={`${result.governingKn} kN (${comboLabels[result.governingCombo]})`} emphasize />
          </div>
        </div>
      }
      note={t.scopeNote}
    />
  );
}
