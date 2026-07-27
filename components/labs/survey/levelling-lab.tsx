'use client';

import { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LabFrame, LabStageFooter, type LabStage } from '../lab-frame';
import {
  computeLevelling,
  SAMPLE_READINGS,
  SAMPLE_STARTING_RL,
  type StationReading,
} from './levelling-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { useAuth } from '@/lib/auth-context';
import { saveLabResult } from '@/lib/progress/store';

export function LevellingLab({ lessonId, loggedIn }: { lessonId: string; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.levelling;
  const { user } = useAuth();

  const [stage, setStage] = useState<LabStage>('equipment');
  const [completedStages, setCompletedStages] = useState<Set<LabStage>>(new Set());

  const [startingRL, setStartingRL] = useState(SAMPLE_STARTING_RL);
  const [readings, setReadings] = useState<StationReading[]>(SAMPLE_READINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const advance = useCallback((from: LabStage, to: LabStage) => {
    setCompletedStages((prev) => new Set(prev).add(from));
    setStage(to);
  }, []);

  const result = useMemo(() => computeLevelling(readings, startingRL), [readings, startingRL]);

  const checkText = result.arithmeticCheckOk
    ? t.checkAgree(result.checkA.toFixed(3), result.checkB.toFixed(3), result.checkC.toFixed(3))
    : t.checkDisagree(result.checkA.toFixed(3), result.checkB.toFixed(3), result.checkC.toFixed(3));

  const updateReading = useCallback(
    (index: number, field: 'bs' | 'is' | 'fs', rawValue: string) => {
      setReadings((prev) => {
        const next = [...prev];
        const value = rawValue === '' ? null : parseFloat(rawValue);
        next[index] = { ...next[index], [field]: Number.isNaN(value as number) ? null : value };
        return next;
      });
    },
    []
  );

  const handleSaveReport = useCallback(() => {
    if (!loggedIn || !user) {
      setSaveError(dict.lab.loginToSave);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      saveLabResult(user.uid, lessonId, { startingRL, readings }, result);
      setSaved(true);
    } catch {
      setSaveError(dict.lab.saveError);
    } finally {
      setSaving(false);
    }
  }, [lessonId, loggedIn, user, startingRL, readings, result, dict.lab]);

  return (
    <LabFrame
      title={t.title}
      standard="BNBC 2020 §7.2"
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

          <div className="mb-4">
            <label className="flex items-center gap-3 text-sm">
              <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground">
                {t.startingRlLabel}
              </span>
              <input
                type="number"
                step="0.001"
                value={startingRL}
                onChange={(e) => setStartingRL(parseFloat(e.target.value) || 0)}
                className="h-9 w-32 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                    {t.stationColumn}
                  </th>
                  <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                    {t.bsColumn}
                  </th>
                  <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                    {t.isColumn}
                  </th>
                  <th className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground">
                    {t.fsColumn}
                  </th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="px-2 py-1.5 font-mono text-xs">{r.station}</td>
                    {(['bs', 'is', 'fs'] as const).map((field) => (
                      <td key={field} className="px-2 py-1.5">
                        <input
                          type="number"
                          step="0.001"
                          value={r[field] ?? ''}
                          onChange={(e) => updateReading(i, field, e.target.value)}
                          placeholder="—"
                          className="h-8 w-20 rounded-md border border-input bg-background px-2 font-mono text-xs"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <LabStageFooter onNext={() => advance('data-entry', 'report')} nextLabel={dict.lab.generateReport} />
        </div>
      )}

      {stage === 'report' && (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  {[t.stationColumn, 'BS', 'IS', 'FS', t.riseColumn, t.fallColumn, t.rlColumn].map((h) => (
                    <th
                      key={h}
                      className="px-2 py-2 text-left font-mono text-xs font-medium text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.stations.map((s, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="px-2 py-1.5 font-mono text-xs">{s.station}</td>
                    <td className="px-2 py-1.5 font-mono text-xs">{s.bs?.toFixed(3) ?? '—'}</td>
                    <td className="px-2 py-1.5 font-mono text-xs">{s.is?.toFixed(3) ?? '—'}</td>
                    <td className="px-2 py-1.5 font-mono text-xs">{s.fs?.toFixed(3) ?? '—'}</td>
                    <td className="px-2 py-1.5 font-mono text-xs text-steel-600 dark:text-steel-300">
                      {s.rise?.toFixed(3) ?? '—'}
                    </td>
                    <td className="px-2 py-1.5 font-mono text-xs text-oxide-600 dark:text-oxide-400">
                      {s.fall?.toFixed(3) ?? '—'}
                    </td>
                    <td className="px-2 py-1.5 font-mono text-xs font-medium">{s.rl.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={cn(
              'mt-4 flex gap-2.5 rounded-md border p-3.5 text-sm leading-relaxed',
              result.arithmeticCheckOk
                ? 'border-border bg-muted/40'
                : 'border-destructive/30 bg-destructive/5'
            )}
          >
            {result.arithmeticCheckOk ? (
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            )}
            <span className="font-mono text-xs">{checkText}</span>
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
