'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolNumberField, ToolResultRow, ToolSelectRow } from '../tool-frame';
import { computeBearingCapacity, type FootingShape } from './soil-bearing-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function SoilBearingTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.soilBearing;

  const [cKpa, setCKpa] = useState(0);
  const [phiDeg, setPhiDeg] = useState(30);
  const [gammaKnM3, setGammaKnM3] = useState(18);
  const [depthM, setDepthM] = useState(1.5);
  const [widthM, setWidthM] = useState(2.0);
  const [shape, setShape] = useState<FootingShape>('strip');
  const [factorOfSafety, setFactorOfSafety] = useState(3);

  const result = useMemo(
    () => computeBearingCapacity(cKpa, phiDeg, gammaKnM3, depthM, widthM, shape, factorOfSafety),
    [cKpa, phiDeg, gammaKnM3, depthM, widthM, shape, factorOfSafety]
  );

  return (
    <ToolFrame
      title={t.title}
      reference={t.reference}
      saveConfig={{
        toolSlug: 'soil-bearing-calculator',
        loggedIn,
        inputData: { cKpa, phiDeg, gammaKnM3, depthM, widthM, shape, factorOfSafety },
        results: result,
      }}
      inputs={
        <div className="space-y-3">
          <ToolNumberField label={t.cohesionLabel} value={cKpa} onChange={setCKpa} unit="kPa" />
          <ToolNumberField label={t.frictionAngleLabel} value={phiDeg} onChange={setPhiDeg} unit="°" min={0} />
          <ToolNumberField label={t.unitWeightLabel} value={gammaKnM3} onChange={setGammaKnM3} unit="kN/m³" />
          <ToolNumberField label={t.depthLabel} value={depthM} onChange={setDepthM} unit="m" />
          <ToolNumberField label={t.widthLabel} value={widthM} onChange={setWidthM} unit="m" />
          <ToolSelectRow
            label={t.shapeLabel}
            value={shape}
            onChange={(v) => setShape(v as FootingShape)}
            options={[
              { value: 'strip', label: t.shapeStrip },
              { value: 'square', label: t.shapeSquare },
            ]}
          />
          <ToolNumberField label={t.fosLabel} value={factorOfSafety} onChange={setFactorOfSafety} min={1} />
        </div>
      }
      results={
        <div>
          <div className="mb-2 flex flex-wrap gap-x-4 font-mono text-[11px] text-muted-foreground">
            <span>Nc={result.Nc}</span>
            <span>Nq={result.Nq}</span>
            <span>Nγ={result.Ngamma}</span>
          </div>
          <ToolResultRow label={t.overburdenLabel} value={`${result.overburdenKpa} kPa`} />
          <ToolResultRow label={t.ultimateLabel} value={`${result.ultimateKpa} kPa`} />
          <ToolResultRow label={t.safeLabel} value={`${result.safeKpa} kPa`} emphasize />
        </div>
      }
      note={t.tableNote}
    />
  );
}
