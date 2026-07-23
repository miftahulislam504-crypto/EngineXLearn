'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolNumberField, ToolResultRow, ToolSelectRow } from '../tool-frame';
import {
  computeRequiredVolume,
  cylindricalTankHeight,
  rectangularTankHeight,
} from './water-tank-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function WaterTankTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.waterTank;

  const [people, setPeople] = useState(5);
  const [litersPerPerson, setLitersPerPerson] = useState(150);
  const [storageDays, setStorageDays] = useState(1);
  const [tankShape, setTankShape] = useState<'cylindrical' | 'rectangular'>('cylindrical');
  const [diameterM, setDiameterM] = useState(1.2);
  const [lengthM, setLengthM] = useState(1.5);
  const [widthM, setWidthM] = useState(1.0);

  const sizing = useMemo(
    () => computeRequiredVolume(people, litersPerPerson, storageDays),
    [people, litersPerPerson, storageDays]
  );

  const height = useMemo(() => {
    return tankShape === 'cylindrical'
      ? cylindricalTankHeight(sizing.requiredM3, diameterM)
      : rectangularTankHeight(sizing.requiredM3, lengthM, widthM);
  }, [tankShape, sizing.requiredM3, diameterM, lengthM, widthM]);

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'water-tank-calculator',
        loggedIn,
        inputData: { people, litersPerPerson, storageDays, tankShape, diameterM, lengthM, widthM },
        results: { ...sizing, heightM: height },
      }}
      inputs={
        <div className="space-y-3">
          <ToolNumberField label={t.peopleLabel} value={people} onChange={setPeople} />
          <ToolNumberField label={t.demandLabel} value={litersPerPerson} onChange={setLitersPerPerson} unit="L/person/day" />
          <ToolNumberField label={t.storageDaysLabel} value={storageDays} onChange={setStorageDays} unit={t.daysUnit} />
          <ToolSelectRow
            label={t.shapeLabel}
            value={tankShape}
            onChange={(v) => setTankShape(v as 'cylindrical' | 'rectangular')}
            options={[
              { value: 'cylindrical', label: t.shapeCylindrical },
              { value: 'rectangular', label: t.shapeRectangular },
            ]}
          />
          {tankShape === 'cylindrical' ? (
            <ToolNumberField label={t.diameterLabel} value={diameterM} onChange={setDiameterM} unit="m" step={0.1} />
          ) : (
            <>
              <ToolNumberField label={t.lengthLabel} value={lengthM} onChange={setLengthM} unit="m" step={0.1} />
              <ToolNumberField label={t.widthLabel} value={widthM} onChange={setWidthM} unit="m" step={0.1} />
            </>
          )}
        </div>
      }
      results={
        <div>
          <ToolResultRow label={t.dailyDemandLabel} value={`${sizing.dailyDemandL} L`} />
          <ToolResultRow label={t.requiredVolumeLabel} value={`${sizing.requiredL} L (${sizing.requiredM3} m³)`} emphasize />
          <ToolResultRow label={t.tankHeightLabel} value={`${height} m`} emphasize />
        </div>
      }
    />
  );
}
