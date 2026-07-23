'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import { TraversePlot } from './traverse-plot';
import {
  computeTraverse,
  SAMPLE_LEGS,
  SAMPLE_START_NORTHING,
  SAMPLE_START_EASTING,
  type TraverseLeg,
} from './traverse-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function TraverseLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.traverse;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [legs, setLegs] = useState<TraverseLeg[]>(SAMPLE_LEGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const result = useMemo(
    () => computeTraverse(legs, SAMPLE_START_NORTHING, SAMPLE_START_EASTING),
    [legs]
  );

  const updateLeg = (index: number, field: keyof TraverseLeg, value: number) => {
    setLegs((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const INVALID_REASONS: Record<string, string> = {
    'not-enough-legs': t.reasonNotEnoughLegs,
    'zero-total-distance': t.reasonZeroDistance,
  };

  const PRECISION_LABELS: Record<string, string> = {
    'high-precision': t.precisionHigh,
    acceptable: t.precisionAcceptable,
    'below-standard': t.precisionBelowStandard,
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
        body: JSON.stringify({ inputData: { legs }, results: result }),
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
  }, [lessonId, loggedIn, legs, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="BNBC 2020 §6.7 — closed traverse, Bowditch rule"
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

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.legColumn}
                </th>
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.bearingColumn}
                </th>
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.distanceColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {legs.map((leg, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-mono text-xs text-muted-foreground">{i + 1}</td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={leg.bearingDeg}
                      onChange={(e) => updateLeg(i, 'bearingDeg', parseFloat(e.target.value) || 0)}
                      className="h-8 w-20 rounded-md border border-input bg-background px-2 font-mono text-xs"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={leg.distanceM}
                      onChange={(e) => updateLeg(i, 'distanceM', parseFloat(e.target.value) || 0)}
                      className="h-8 w-24 rounded-md border border-input bg-background px-2 font-mono text-xs"
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
          {result.valid ? (
            <>
              <TraversePlot
                adjustedLegs={result.adjustedLegs}
                startNorthing={SAMPLE_START_NORTHING}
                startEasting={SAMPLE_START_EASTING}
              />

              <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-md bg-muted p-3">
                  <p className="font-mono text-[11px] text-muted-foreground">{t.misclosureLabel}</p>
                  <p className="font-display text-lg font-semibold">{result.misclosureM} m</p>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <p className="font-mono text-[11px] text-muted-foreground">{t.precisionLabel}</p>
                  <p className="font-display text-lg font-semibold">
                    1:{result.relativePrecisionDenominator}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-border bg-muted/40 p-3.5 text-sm leading-relaxed">
                {PRECISION_LABELS[result.precisionClass]}
              </div>

              <p className="mt-3 font-mono text-[11px] text-muted-foreground">{t.closureNote}</p>
            </>
          ) : (
            <div className="flex gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3.5 text-sm leading-relaxed">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>{INVALID_REASONS[result.reason]}</span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <p className={cn('font-mono text-xs', saveError ? 'text-destructive' : 'text-muted-foreground')}>
              {saveError ?? (saved ? dict.lab.savedToHistory : dict.lab.saveThisRun)}
            </p>
            <button
              onClick={handleSaveReport}
              disabled={saving || saved || !result.valid}
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
