'use client';

import { useState, useMemo } from 'react';
import { ToolFrame, ToolSelectRow } from '../tool-frame';
import { UNIT_CATEGORIES, convertUnit, type UnitCategory } from './unit-converter-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

const CATEGORIES: UnitCategory[] = ['length', 'area', 'volume', 'mass', 'pressure', 'force'];

export function UnitConverterTool({ loggedIn }: { loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.tools.unitConverter;

  const [category, setCategory] = useState<UnitCategory>('length');
  const units = UNIT_CATEGORIES[category];
  const [fromKey, setFromKey] = useState(units[0].key);
  const [toKey, setToKey] = useState(units[1]?.key ?? units[0].key);
  const [value, setValue] = useState(1);

  const categoryLabels: Record<UnitCategory, string> = {
    length: t.categoryLength,
    area: t.categoryArea,
    volume: t.categoryVolume,
    mass: t.categoryMass,
    pressure: t.categoryPressure,
    force: t.categoryForce,
  };

  const handleCategoryChange = (c: string) => {
    const newCategory = c as UnitCategory;
    setCategory(newCategory);
    const newUnits = UNIT_CATEGORIES[newCategory];
    setFromKey(newUnits[0].key);
    setToKey(newUnits[1]?.key ?? newUnits[0].key);
  };

  const result = useMemo(() => convertUnit(value, category, fromKey, toKey), [value, category, fromKey, toKey]);
  const toUnit = units.find((u) => u.key === toKey);

  return (
    <ToolFrame
      title={t.title}
      saveConfig={{
        toolSlug: 'unit-converter',
        loggedIn,
        inputData: { category, fromKey, toKey, value },
        results: { result },
      }}
      inputs={
        <div className="space-y-3">
          <ToolSelectRow
            label={t.categoryLabel}
            value={category}
            onChange={handleCategoryChange}
            options={CATEGORIES.map((c) => ({ value: c, label: categoryLabels[c] }))}
          />
          <div className="flex items-center gap-3 text-sm">
            <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{t.valueLabel}</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
            />
          </div>
          <ToolSelectRow
            label={t.fromLabel}
            value={fromKey}
            onChange={setFromKey}
            options={units.map((u) => ({ value: u.key, label: u.label }))}
          />
          <ToolSelectRow
            label={t.toLabel}
            value={toKey}
            onChange={setToKey}
            options={units.map((u) => ({ value: u.key, label: u.label }))}
          />
        </div>
      }
      results={
        <div className="text-center">
          <p className="font-display text-2xl font-semibold">
            {Number.isFinite(result) ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'}{' '}
            <span className="text-base font-normal text-muted-foreground">{toUnit?.label}</span>
          </p>
        </div>
      }
    />
  );
}
