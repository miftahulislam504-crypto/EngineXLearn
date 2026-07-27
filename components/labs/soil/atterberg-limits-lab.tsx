'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import { FlowCurve } from './flow-curve';
import {
  computeAtterbergLimits,
  fitFlowCurve,
  SAMPLE_LL_TRIALS,
  SAMPLE_PL_PERCENT,
  type LiquidLimitTrial,
  type PlasticityGroup,
} from './atterberg-limits-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { useAuth } from '@/lib/auth-context';
import { saveLabResult } from '@/lib/progress/store';

export function AtterbergLimitsLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.atterbergLimits;
  const { user } = useAuth();

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [trials, setTrials] = useState<LiquidLimitTrial[]>(SAMPLE_LL_TRIALS);
  const [plasticLimitPercent, setPlasticLimitPercent] = useState(SAMPLE_PL_PERCENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const fit = useMemo(() => fitFlowCurve(trials), [trials]);
  const result = useMemo(
    () => computeAtterbergLimits(trials, plasticLimitPercent),
    [trials, plasticLimitPercent]
  );

  const updateTrial = (index: number, field: keyof LiquidLimitTrial, value: number) => {
    setTrials((prev) => prev.map((tr, i) => (i === index ? { ...tr, [field]: value } : tr)));
  };

  const GROUP_LABELS: Record<PlasticityGroup, string> = {
    CL: t.groupCL,
    CH: t.groupCH,
    ML: t.groupML,
    MH: t.groupMH,
    'non-plastic': t.groupNonPlastic,
  };

  const GROUP_DESCRIPTIONS: Record<PlasticityGroup, string> = {
    CL: t.descCL,
    CH: t.descCH,
    ML: t.descML,
    MH: t.descMH,
    'non-plastic': t.descNonPlastic,
  };

  const handleSaveReport = useCallback(() => {
    if (!loggedIn || !user) {
      setSaveError(dict.lab.loginToSave);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      saveLabResult(user.uid, lessonId, { trials, plasticLimitPercent }, result);
      setSaved(true);
    } catch {
      setSaveError(dict.lab.saveError);
    } finally {
      setSaving(false);
    }
  }, [lessonId, loggedIn, user, trials, plasticLimitPercent, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="ASTM D4318 / BNBC 2020 §6.3"
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

          <p className="mb-2 font-mono text-xs font-medium text-muted-foreground">{t.llTrialsLabel}</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.blowsColumn}
                </th>
                <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                  {t.moistureColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {trials.map((trial, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={trial.blows}
                      onChange={(e) => updateTrial(i, 'blows', parseFloat(e.target.value) || 0)}
                      className="h-8 w-20 rounded-md border border-input bg-background px-2 font-mono text-xs"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={trial.moisturePercent}
                      onChange={(e) => updateTrial(i, 'moisturePercent', parseFloat(e.target.value) || 0)}
                      className="h-8 w-24 rounded-md border border-input bg-background px-2 font-mono text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <label className="flex items-center gap-3 text-sm">
              <span className="w-52 shrink-0 font-mono text-xs text-muted-foreground">
                {t.plLabel}
              </span>
              <input
                type="number"
                value={plasticLimitPercent}
                onChange={(e) => setPlasticLimitPercent(parseFloat(e.target.value) || 0)}
                className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
          </div>

          <LabStageFooter
            onNext={() => advance('data-entry', 'report')}
            nextLabel={dict.lab.generateReport}
            disabled={!fit}
          />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <FlowCurve trials={trials} fit={fit} />

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">LL</p>
              <p className="font-display text-lg font-semibold">
                {result.liquidLimitPercent !== null ? `${result.liquidLimitPercent}%` : '—'}
              </p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">PL</p>
              <p className="font-display text-lg font-semibold">{result.plasticLimitPercent}%</p>
            </div>
            <div className="rounded-md bg-muted p-3">
              <p className="font-mono text-[11px] text-muted-foreground">PI</p>
              <p className="font-display text-lg font-semibold">
                {result.plasticityIndex !== null ? result.plasticityIndex : '—'}
              </p>
            </div>
          </div>

          {result.group !== 'insufficient-data' && (
            <>
              <div className="mt-4 rounded-md border border-border bg-muted/40 p-3.5 text-sm leading-relaxed">
                <p className="mb-1 font-display text-sm font-semibold">{GROUP_LABELS[result.group]}</p>
                <p>{GROUP_DESCRIPTIONS[result.group]}</p>
              </div>
              <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                {t.aLineNote(result.aLinePi ?? 0)}
              </p>
            </>
          )}

          {result.group === 'insufficient-data' && (
            <p className="mt-4 text-sm text-muted-foreground">{t.insufficientData}</p>
          )}

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
