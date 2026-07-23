'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import { ShearEnvelopeChart } from './shear-envelope-chart';
import { fitShearEnvelope, SAMPLE_TRIALS, type ShearTrial } from './direct-shear-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function DirectShearLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.directShear;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [trials, setTrials] = useState<ShearTrial[]>(SAMPLE_TRIALS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const fit = useMemo(() => fitShearEnvelope(trials), [trials]);

  const updateTrial = (index: number, field: keyof ShearTrial, value: number) => {
    setTrials((prev) => prev.map((tr, i) => (i === index ? { ...tr, [field]: value } : tr)));
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
        body: JSON.stringify({ inputData: { trials }, results: fit }),
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
  }, [lessonId, loggedIn, trials, fit, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="ASTM D3080 / BNBC 2020 §6.6"
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

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.normalStressColumn}
                </th>
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.shearStressColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {trials.map((trial, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={trial.normalStressKpa}
                      onChange={(e) => updateTrial(i, 'normalStressKpa', parseFloat(e.target.value) || 0)}
                      className="h-8 w-20 rounded-md border border-input bg-background px-2 font-mono text-xs"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={trial.shearStressKpa}
                      onChange={(e) => updateTrial(i, 'shearStressKpa', parseFloat(e.target.value) || 0)}
                      className="h-8 w-20 rounded-md border border-input bg-background px-2 font-mono text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <LabStageFooter
            onNext={() => advance('data-entry', 'report')}
            nextLabel={dict.lab.generateReport}
            disabled={!fit}
          />
        </div>
      )}

      {stage === 'report' && fit && (
        <div>
          <ShearEnvelopeChart trials={trials} fit={fit} />

          <div className="mt-5 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">c</p>
              <p className="font-display text-lg font-semibold">{fit.cohesionKpa} kPa</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">φ</p>
              <p className="font-display text-lg font-semibold">{fit.frictionAngleDeg}°</p>
            </div>
          </div>

          {fit.cohesionClamped && (
            <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t.cohesionClampedNote(fit.rawCohesionKpa)}
            </p>
          )}

          <p className="mt-3 text-sm text-muted-foreground">{t.rSquaredNote(fit.rSquared)}</p>

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
