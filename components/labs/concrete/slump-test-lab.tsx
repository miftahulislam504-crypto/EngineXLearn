'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import { VizSlider } from '../../visualizations/visualization-frame';
import {
  computeSlump,
  SLUMP_CONE_HEIGHT_MM,
  type SlumpFailureMode,
} from './slump-test-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { useAuth } from '@/lib/auth-context';
import { saveLabResult } from '@/lib/progress/store';

export function SlumpTestLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.slumpTest;
  const { user } = useAuth();

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [centerDropMm, setCenterDropMm] = useState(85);
  const [failureMode, setFailureMode] = useState<SlumpFailureMode>('true');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const result = useMemo(
    () => computeSlump(centerDropMm, failureMode),
    [centerDropMm, failureMode]
  );

  const BAND_LABELS: Record<string, string> = {
    'very-low': t.bandVeryLow,
    low: t.bandLow,
    medium: t.bandMedium,
    high: t.bandHigh,
    'very-high': t.bandVeryHigh,
    collapse: t.bandCollapse,
    'invalid-shear': t.invalidRetest,
  };

  const BAND_DESCRIPTIONS: Record<string, string> = {
    'very-low': t.descVeryLow,
    low: t.descLow,
    medium: t.descMedium,
    high: t.descHigh,
    'very-high': t.descVeryHigh,
    collapse: t.descCollapseTrue,
    'invalid-shear': t.descShearInvalid,
  };

  const handleSaveReport = useCallback(() => {
    if (!loggedIn || !user) {
      setSaveError(dict.lab.loginToSave);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      saveLabResult(user.uid, lessonId, { centerDropMm, failureMode }, result);
      setSaved(true);
    } catch {
      setSaveError(dict.lab.saveError);
    } finally {
      setSaving(false);
    }
  }, [lessonId, loggedIn, user, centerDropMm, failureMode, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="ASTM C143 / BNBC 2020 §5.3"
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
          <p className="mb-5 text-sm text-muted-foreground">{t.dataEntryIntro}</p>

          <VizSlider
            label={t.centerDropLabel}
            value={centerDropMm}
            displayValue={`${centerDropMm.toFixed(0)} mm`}
            min={0}
            max={SLUMP_CONE_HEIGHT_MM}
            step={1}
            onChange={setCenterDropMm}
          />

          <div className="mt-5">
            <p className="mb-2 font-mono text-xs text-muted-foreground">{t.failureShapeLabel}</p>
            <div className="flex gap-2">
              {(['true', 'shear', 'collapse'] as SlumpFailureMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFailureMode(mode)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors',
                    failureMode === mode
                      ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  )}
                >
                  {mode === 'true' ? t.trueSlump : mode === 'shear' ? t.shear : t.collapse}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {failureMode === 'true' && t.trueSlumpDesc}
              {failureMode === 'shear' && t.shearDesc}
              {failureMode === 'collapse' && t.collapseDesc}
            </p>
          </div>

          <LabStageFooter onNext={() => advance('data-entry', 'report')} nextLabel={dict.lab.generateReport} />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-full',
                result.valid ? 'bg-steel-500/10 text-steel-600 dark:text-steel-300' : 'bg-destructive/10 text-destructive'
              )}
            >
              {result.valid ? (
                <span className="font-display text-lg font-semibold">{result.slumpMm}</span>
              ) : (
                <XCircle className="h-7 w-7" />
              )}
            </div>
            <div>
              <p className="font-display text-base font-semibold">
                {result.valid ? t.slumpResult(result.slumpMm) : t.invalidReading}
              </p>
              <p className="font-mono text-xs text-muted-foreground">{BAND_LABELS[result.band]}</p>
            </div>
          </div>

          <div
            className={cn(
              'mt-4 flex gap-2.5 rounded-md border p-3.5 text-sm leading-relaxed',
              result.valid ? 'border-border bg-muted/40' : 'border-destructive/30 bg-destructive/5'
            )}
          >
            {!result.valid && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />}
            <span>{BAND_DESCRIPTIONS[result.band]}</span>
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
