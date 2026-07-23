'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import { computeAggregateImpactValue, type AggregateGrade } from './aggregate-impact-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function AggregateImpactLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.aggregateImpact;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [originalMassG, setOriginalMassG] = useState(350);
  const [passingG, setPassingG] = useState(63);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const result = useMemo(
    () => computeAggregateImpactValue(originalMassG, passingG),
    [originalMassG, passingG]
  );

  const massInvalid = passingG > originalMassG;

  const GRADE_LABELS: Record<AggregateGrade, string> = {
    exceptional: t.gradeExceptional,
    strong: t.gradeStrong,
    satisfactory: t.gradeSatisfactory,
    weak: t.gradeWeak,
  };
  const GRADE_SUITABILITY: Record<AggregateGrade, string> = {
    exceptional: t.suitExceptional,
    strong: t.suitStrong,
    satisfactory: t.suitSatisfactory,
    weak: t.suitWeak,
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
          inputData: { originalMassG, passingG },
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
  }, [lessonId, loggedIn, originalMassG, passingG, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="BS 812-112 / BNBC 2020 §6.1.3"
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
                {t.originalMassLabel}
              </span>
              <input
                type="number"
                value={originalMassG}
                onChange={(e) => setOriginalMassG(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
            <label className="flex items-center gap-3 text-sm">
              <span className="w-52 shrink-0 font-mono text-xs text-muted-foreground">
                {t.passingMassLabel}
              </span>
              <input
                type="number"
                value={passingG}
                onChange={(e) => setPassingG(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
          </div>

          {massInvalid && (
            <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              {t.massInvalidWarning}
            </p>
          )}

          <LabStageFooter
            onNext={() => advance('data-entry', 'report')}
            nextLabel={dict.lab.generateReport}
            disabled={massInvalid}
          />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-steel-500/10 text-steel-600 dark:text-steel-300">
              <span className="font-display text-lg font-semibold">{result.aivPercent}%</span>
            </div>
            <div>
              <p className="font-display text-base font-semibold">{GRADE_LABELS[result.grade]}</p>
              <p className="font-mono text-xs text-muted-foreground">{t.lowerIsHigher}</p>
            </div>
          </div>

          <div className="mt-4 rounded-md border border-border bg-muted/40 p-3.5 text-sm leading-relaxed">
            {GRADE_SUITABILITY[result.grade]}
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
