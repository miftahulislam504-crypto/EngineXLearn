'use client';

/**
 * Shared chrome for every Engineering Tool (Part 12) — a title, an
 * optional standard/formula reference note, an inputs panel, and a
 * results panel. Tools are deliberately simpler than Labs (no
 * equipment/procedure staging — there's no physical apparatus to walk
 * through) and simpler than Visualizations (no canvas — most tools are
 * a straight calculation, not something inherently spatial). This is
 * the "instant calculator" convention: change an input, see the result
 * update immediately, no explicit "calculate" step required.
 *
 * Save-to-history is handled once, here, rather than once per tool —
 * unlike labs (where each lab file already carries its own multi-stage
 * flow and reasonably owns its save logic too), every tool's save
 * behavior is identical (POST inputData+results, show saved/error
 * state), so centralizing it avoids reimplementing the same
 * fetch/loading/error boilerplate twelve times.
 */

import { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export interface ToolSaveConfig {
  toolSlug: string;
  loggedIn: boolean;
  inputData: unknown;
  results: unknown;
}

export function ToolFrame({
  title,
  reference,
  inputs,
  results,
  note,
  saveConfig,
}: {
  title: string;
  reference?: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  note?: string;
  saveConfig?: ToolSaveConfig;
}) {
  const dict = useDictionary();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!saveConfig) return;
    if (!saveConfig.loggedIn) {
      setSaveError(dict.lab.loginToSave);
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/tools/${saveConfig.toolSlug}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputData: saveConfig.inputData, results: saveConfig.results }),
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
  }, [saveConfig, dict.lab]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
        {reference && <p className="font-mono text-[11px] text-muted-foreground">{reference}</p>}
      </div>

      <div className="p-4">{inputs}</div>

      <div className="border-t border-border bg-muted/40 p-4">{results}</div>

      {saveConfig && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className={cn('font-mono text-xs', saveError ? 'text-destructive' : 'text-muted-foreground')}>
            {saveError ?? (saved ? dict.lab.savedToHistory : dict.lab.saveThisRun)}
          </p>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            {saved ? dict.dashboard.saved : saving ? dict.lab.saving : dict.lab.saveReport}
          </button>
        </div>
      )}

      {note && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
        </div>
      )}
    </div>
  );
}

export function ToolNumberField({
  label,
  value,
  onChange,
  unit,
  min,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  step?: number;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          step={step ?? 'any'}
          className="h-9 w-28 rounded-md border border-input bg-background px-2.5 font-mono text-sm"
        />
        {unit && <span className="font-mono text-xs text-muted-foreground">{unit}</span>}
      </span>
    </label>
  );
}

export function ToolResultRow({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className={emphasize ? 'font-display text-base font-semibold' : 'font-mono text-sm'}>{value}</span>
    </div>
  );
}

export function ToolSelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-40 shrink-0 font-mono text-xs text-muted-foreground sm:w-48">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-md border px-2.5 py-1.5 font-mono text-xs font-medium transition-colors ${
              value === opt.value
                ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
