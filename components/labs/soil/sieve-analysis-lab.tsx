'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import { GradationCurve } from './gradation-curve';
import {
  STANDARD_SIEVES_MM,
  SAMPLE_RETAINED_G,
  SAMPLE_TOTAL_MASS_G,
  computeGradation,
  type SieveRow,
} from './sieve-analysis-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function SieveAnalysisLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.sieveAnalysis;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [totalMassG, setTotalMassG] = useState(SAMPLE_TOTAL_MASS_G);
  const [retained, setRetained] = useState<Record<number, number>>(SAMPLE_RETAINED_G);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const rows: SieveRow[] = useMemo(
    () => STANDARD_SIEVES_MM.map((sizeMm) => ({ sizeMm, retainedG: retained[sizeMm] ?? 0 })),
    [retained]
  );

  const result = useMemo(() => computeGradation(rows, totalMassG), [rows, totalMassG]);

  const sumRetained = rows.reduce((s, r) => s + r.retainedG, 0);
  const massBalanceWarning = sumRetained > totalMassG;

  const classificationText = useMemo(() => {
    const c = result.classification;
    if (c.kind === 'insufficient-data') return t.classificationInsufficientData;
    if (c.kind === 'well-graded') return t.classificationWellGraded;
    const reasons: string[] = [];
    if (c.failedCu) reasons.push(t.reasonCuNotGreaterThan4(c.cu.toFixed(2)));
    if (c.failedCc) reasons.push(t.reasonCcOutsideRange(c.cc.toFixed(2)));
    return t.classificationPoorlyGraded(reasons.join(` ${t.and} `), c.failedCu, c.failedCc);
  }, [result.classification, t]);

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
        body: JSON.stringify({
          inputData: { totalMassG, retained },
          results: result,
        }),
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
  }, [lessonId, loggedIn, totalMassG, retained, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="ASTM D6913 / BNBC 2020 §6.2.1"
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
          <LabStageFooter onNext={() => advance('procedure', 'data-entry')} nextLabel={dict.lab.runTheTest} />
        </div>
      )}

      {stage === 'data-entry' && (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">{t.dataEntryIntro}</p>

          <div className="mb-4">
            <label className="flex items-center gap-3 text-sm">
              <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
                {t.totalMassLabel}
              </span>
              <input
                type="number"
                value={totalMassG}
                onChange={(e) => setTotalMassG(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.sieveColumnLabel}
                </th>
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.retainedColumnLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {STANDARD_SIEVES_MM.map((sizeMm) => (
                <tr key={sizeMm} className="border-b border-border/60">
                  <td className="px-2 py-1.5 font-mono text-xs">{sizeMm.toFixed(3)}</td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={retained[sizeMm] ?? 0}
                      onChange={(e) =>
                        setRetained((prev) => ({
                          ...prev,
                          [sizeMm]: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="h-8 w-24 rounded-md border border-input bg-background px-2 font-mono text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>{t.sumRetainedLabel(sumRetained.toFixed(1), totalMassG.toFixed(1))}</span>
            {massBalanceWarning && (
              <span className="flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                {t.massBalanceWarning}
              </span>
            )}
          </div>

          <LabStageFooter
            onNext={() => advance('data-entry', 'report')}
            nextLabel={dict.lab.generateReport}
            disabled={massBalanceWarning}
          />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <GradationCurve points={result.points} />

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">D10</p>
              <p className="font-display text-lg font-semibold">
                {result.d10 ? `${result.d10.toFixed(3)} mm` : '—'}
              </p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">D30</p>
              <p className="font-display text-lg font-semibold">
                {result.d30 ? `${result.d30.toFixed(3)} mm` : '—'}
              </p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">D60</p>
              <p className="font-display text-lg font-semibold">
                {result.d60 ? `${result.d60.toFixed(3)} mm` : '—'}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              Cu = <span className="text-foreground">{result.coefficientOfUniformity ?? '—'}</span>
            </span>
            <span>
              Cc = <span className="text-foreground">{result.coefficientOfCurvature ?? '—'}</span>
            </span>
            <span>
              {t.panLabel} = <span className="text-foreground">{result.panG.toFixed(1)} g</span>
            </span>
          </div>

          <div className="mt-4 rounded-md border border-border bg-muted/40 p-3.5 text-sm leading-relaxed">
            {classificationText}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <p
              className={cn(
                'font-mono text-xs',
                saveError ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
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
