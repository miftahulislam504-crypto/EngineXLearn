'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import {
  computeFlexuralStrength,
  SAMPLE_LOAD_KN,
  SAMPLE_FRACTURE_OFFSET_MM,
  SPAN_MM,
} from './flexural-test-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export function FlexuralTestLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.flexuralTest;

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [loadKn, setLoadKn] = useState(SAMPLE_LOAD_KN);
  const [fractureOffsetMm, setFractureOffsetMm] = useState(SAMPLE_FRACTURE_OFFSET_MM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const result = useMemo(
    () => computeFlexuralStrength(loadKn, fractureOffsetMm),
    [loadKn, fractureOffsetMm]
  );

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
          inputData: { loadKn, fractureOffsetMm },
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
  }, [lessonId, loggedIn, loadKn, fractureOffsetMm, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="ASTM C78 / BS EN 12390-5"
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
              <span className="w-56 shrink-0 font-mono text-xs text-muted-foreground">{t.loadLabel}</span>
              <input
                type="number"
                value={loadKn}
                onChange={(e) => setLoadKn(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
            <label className="flex items-center gap-3 text-sm">
              <span className="w-56 shrink-0 font-mono text-xs text-muted-foreground">
                {t.fractureOffsetLabel}
              </span>
              <input
                type="number"
                value={fractureOffsetMm}
                onChange={(e) => setFractureOffsetMm(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
          </div>

          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {t.spanNote(String(SPAN_MM))}
          </p>

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
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-steel-500/10 text-steel-600 dark:text-steel-300">
                  <span className="font-display text-base font-semibold">{result.strengthMpa}</span>
                </div>
                <div>
                  <p className="font-display text-base font-semibold">
                    {t.strengthResult(result.strengthMpa)}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {result.formula === 'middle-third' ? t.formulaMiddleThird : t.formulaOutsideMiddleThird}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-border bg-muted/40 p-3.5 text-sm leading-relaxed">
                {result.formula === 'middle-third'
                  ? t.explainMiddleThird
                  : t.explainOutsideMiddleThird(result.fractureDistanceFromSupportMm)}
              </div>
            </>
          ) : (
            <div className="flex gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 p-3.5 text-sm leading-relaxed">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>{t.explainInvalid}</span>
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
