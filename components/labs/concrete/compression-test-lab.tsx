'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import {
  computeCompressionStrength,
  CONCRETE_GRADES,
  CUBE_SIDE_MM,
  type CompressionAcceptance,
  type ConcreteGrade,
} from './compression-test-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function CompressionTestLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.compressionTest;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [loadKn, setLoadKn] = useState(495);
  const [fckMpa, setFckMpa] = useState<ConcreteGrade>(20);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const result = useMemo(() => computeCompressionStrength(loadKn, fckMpa), [loadKn, fckMpa]);

  const ACCEPTANCE_LABELS: Record<CompressionAcceptance, string> = {
    'meets-or-exceeds': t.acceptMeetsOrExceeds,
    'below-target-within-margin': t.acceptBelowMargin,
    'fails-acceptance': t.acceptFails,
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
        body: JSON.stringify({
          inputData: { loadKn, fckMpa },
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
  }, [lessonId, loggedIn, loadKn, fckMpa, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="BS 1881-116 / BNBC 2020 §5.3"
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

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm">
              <span className="w-52 shrink-0 font-mono text-xs text-muted-foreground">
                {t.loadLabel}
              </span>
              <input
                type="number"
                value={loadKn}
                onChange={(e) => setLoadKn(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
            <div className="flex items-center gap-3 text-sm">
              <span className="w-52 shrink-0 font-mono text-xs text-muted-foreground">
                {t.gradeLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CONCRETE_GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setFckMpa(g)}
                    className={cn(
                      'rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors',
                      fckMpa === g
                        ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    M{g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {t.areaNote(String(CUBE_SIDE_MM))}
          </p>

          <LabStageFooter onNext={() => advance('data-entry', 'report')} nextLabel={dict.lab.generateReport} />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-full',
                result.acceptance === 'meets-or-exceeds'
                  ? 'bg-steel-500/10 text-steel-600 dark:text-steel-300'
                  : result.acceptance === 'below-target-within-margin'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-destructive/10 text-destructive'
              )}
            >
              {result.acceptance === 'fails-acceptance' ? (
                <XCircle className="h-7 w-7" />
              ) : (
                <span className="font-display text-base font-semibold">{result.strengthMpa}</span>
              )}
            </div>
            <div>
              <p className="font-display text-base font-semibold">
                {t.strengthResult(result.strengthMpa)}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {ACCEPTANCE_LABELS[result.acceptance]}
              </p>
            </div>
          </div>

          <div
            className={cn(
              'mt-4 flex gap-2.5 rounded-md border p-3.5 text-sm leading-relaxed',
              result.acceptance === 'fails-acceptance'
                ? 'border-destructive/30 bg-destructive/5'
                : 'border-border bg-muted/40'
            )}
          >
            {result.acceptance !== 'meets-or-exceeds' && (
              <AlertTriangle
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  result.acceptance === 'fails-acceptance' ? 'text-destructive' : 'text-amber-500'
                )}
              />
            )}
            <span>
              {result.acceptance === 'meets-or-exceeds' && t.explainMeetsOrExceeds(result.fckMpa)}
              {result.acceptance === 'below-target-within-margin' &&
                t.explainBelowMargin(result.fckMpa, result.marginMpa)}
              {result.acceptance === 'fails-acceptance' && t.explainFails(result.fckMpa, result.marginMpa)}
            </span>
          </div>

          <p className="mt-3 font-mono text-[11px] text-muted-foreground">{t.singleSpecimenNote}</p>

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
