'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import {
  computeTotalStationTargets,
  SAMPLE_STATION,
  SAMPLE_READINGS,
  type StationSetup,
  type TotalStationReading,
} from './total-station-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function TotalStationLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.totalStation;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [station, setStation] = useState<StationSetup>(SAMPLE_STATION);
  const [readings, setReadings] = useState<TotalStationReading[]>(SAMPLE_READINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const results = useMemo(() => computeTotalStationTargets(station, readings), [station, readings]);

  const updateReading = (index: number, field: keyof TotalStationReading, value: string | number) => {
    setReadings((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const handleSaveReport = useCallback(async () => {
    if (!loggedIn) {
      setSaveError(dict.lab.loginToSave);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/lab-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputData: { station, readings }, results }),
      });
      if (res.ok) {
        setSaved(true);
      } else {
        setSaveError(dict.lab.saveError);
      }
    } catch {
      setSaveError(dict.lab.saveError);
    } finally {
      setSaving(false);
    }
  }, [lessonId, loggedIn, station, readings, results, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="BNBC 2020 §6.7 — trigonometric leveling & radiation method"
      stage={stage}
      onStageChange={setStage}
      completedStages={completedStages}
    >
      {stage === 'equipment' && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{t.equipmentIntro}</p>
          <ul className="space-y-3">
            {t.equipmentItems.map((item) => (
              <li key={item.name} className="flex gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <LabStageFooter onNext={() => advance('equipment', 'procedure')} />
        </div>
      )}

      {stage === 'procedure' && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{t.procedureIntro}</p>
          <ol className="space-y-3">
            {t.procedureSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] text-muted-foreground">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <LabStageFooter onNext={() => advance('procedure', 'data-entry')} nextLabel={dict.lab.runTheSurvey} />
        </div>
      )}

      {stage === 'data-entry' && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{t.dataEntryIntro}</p>

          <p className="mb-2 font-mono text-xs font-medium text-muted-foreground">{t.stationSetupLabel}</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-mono text-muted-foreground">N</span>
              <input
                type="number"
                value={station.northing}
                onChange={(e) => setStation((s) => ({ ...s, northing: parseFloat(e.target.value) || 0 }))}
                className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-mono text-muted-foreground">E</span>
              <input
                type="number"
                value={station.easting}
                onChange={(e) => setStation((s) => ({ ...s, easting: parseFloat(e.target.value) || 0 }))}
                className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-mono text-muted-foreground">{t.elevationLabel}</span>
              <input
                type="number"
                value={station.elevation}
                onChange={(e) => setStation((s) => ({ ...s, elevation: parseFloat(e.target.value) || 0 }))}
                className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-mono text-muted-foreground">{t.instrumentHeightLabel}</span>
              <input
                type="number"
                value={station.instrumentHeightM}
                onChange={(e) =>
                  setStation((s) => ({ ...s, instrumentHeightM: parseFloat(e.target.value) || 0 }))
                }
                className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs"
              />
            </label>
          </div>

          <p className="mb-2 font-mono text-xs font-medium text-muted-foreground">{t.readingsLabel}</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-1.5 py-2 text-left font-mono text-[11px] font-medium text-muted-foreground">
                  {t.targetColumn}
                </th>
                <th className="px-1.5 py-2 text-left font-mono text-[11px] font-medium text-muted-foreground">
                  {t.bearingColumn}
                </th>
                <th className="px-1.5 py-2 text-left font-mono text-[11px] font-medium text-muted-foreground">
                  {t.verticalAngleColumn}
                </th>
                <th className="px-1.5 py-2 text-left font-mono text-[11px] font-medium text-muted-foreground">
                  {t.slopeDistColumn}
                </th>
                <th className="px-1.5 py-2 text-left font-mono text-[11px] font-medium text-muted-foreground">
                  {t.targetHeightColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="px-1.5 py-1.5">
                    <input
                      type="text"
                      value={r.targetName}
                      onChange={(e) => updateReading(i, 'targetName', e.target.value)}
                      className="h-8 w-14 rounded-md border border-input bg-background px-1.5 font-mono text-xs"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={r.bearingDeg}
                      onChange={(e) => updateReading(i, 'bearingDeg', parseFloat(e.target.value) || 0)}
                      className="h-8 w-16 rounded-md border border-input bg-background px-1.5 font-mono text-xs"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={r.verticalAngleDeg}
                      onChange={(e) => updateReading(i, 'verticalAngleDeg', parseFloat(e.target.value) || 0)}
                      className="h-8 w-16 rounded-md border border-input bg-background px-1.5 font-mono text-xs"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={r.slopeDistanceM}
                      onChange={(e) => updateReading(i, 'slopeDistanceM', parseFloat(e.target.value) || 0)}
                      className="h-8 w-16 rounded-md border border-input bg-background px-1.5 font-mono text-xs"
                    />
                  </td>
                  <td className="px-1.5 py-1.5">
                    <input
                      type="number"
                      value={r.targetHeightM}
                      onChange={(e) => updateReading(i, 'targetHeightM', parseFloat(e.target.value) || 0)}
                      className="h-8 w-16 rounded-md border border-input bg-background px-1.5 font-mono text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <LabStageFooter
            onNext={() => advance('data-entry', 'report')}
            nextLabel={dict.lab.generateReport}
          />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left font-mono text-[11px] font-medium text-muted-foreground">
                  {t.targetColumn}
                </th>
                <th className="px-2 py-2 text-right font-mono text-[11px] font-medium text-muted-foreground">
                  N
                </th>
                <th className="px-2 py-2 text-right font-mono text-[11px] font-medium text-muted-foreground">
                  E
                </th>
                <th className="px-2 py-2 text-right font-mono text-[11px] font-medium text-muted-foreground">
                  {t.elevationLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.targetName} className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-medium">{r.targetName}</td>
                  <td className="px-2 py-1.5 text-right font-mono text-xs">{r.northing.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right font-mono text-xs">{r.easting.toFixed(3)}</td>
                  <td className="px-2 py-1.5 text-right font-mono text-xs">{r.elevation.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 text-sm text-muted-foreground">{t.explainResult}</p>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <p className={cn('font-mono text-xs', saveError ? 'text-destructive' : 'text-muted-foreground')}>
              {saveError ?? (saved ? dict.lab.savedToHistory : dict.lab.saveThisRun)}
            </p>
            <button
              onClick={handleSaveReport}
              disabled={saving || saved}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {saved ? dict.dashboard.saved : saving ? dict.lab.saving : dict.lab.saveReport}
            </button>
          </div>
        </div>
      )}
    </LabFrame>
  );
}
