'use client';

import { useState } from 'react';
import { Check, ChevronRight, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Shared chrome for every virtual lab lesson, structured around the four
 * features the blueprint names explicitly for the Experiment & Lab System
 * (Part 7): Equipment Explanation, Step-by-step Procedure, [virtual data
 * entry as] Interactive Simulation, and Result Calculation feeding an Auto
 * Lab Report. Rather than freeform content, every lab is the same fixed
 * four-stage sequence — this is what makes "add a new lab" mean "write the
 * equipment list, procedure steps, and calculation logic" instead of also
 * re-inventing the flow each time.
 */

export type LabStage = 'equipment' | 'procedure' | 'data-entry' | 'report';

export function LabFrame({
  title,
  standard,
  stage,
  onStageChange,
  completedStages,
  children,
}: {
  title: string;
  standard?: string; // e.g. "ASTM D6913 / BNBC 2020 §6.2.1"
  stage: LabStage;
  onStageChange: (stage: LabStage) => void;
  completedStages: Set<LabStage>;
  children: React.ReactNode;
}) {
  const dict = useDictionary();

  const STAGES: { key: LabStage; label: string }[] = [
    { key: 'equipment', label: dict.lab.equipment },
    { key: 'procedure', label: dict.lab.procedure },
    { key: 'data-entry', label: dict.lab.runTest },
    { key: 'report', label: dict.lab.labReport },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
          <FlaskConical className="h-4.5 w-4.5" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
          {standard && <p className="font-mono text-[11px] text-muted-foreground">{standard}</p>}
        </div>
      </div>

      {/* Stage tabs — a lab is always this same four-step sequence */}
      <div className="flex border-b border-border">
        {STAGES.map((s, i) => {
          const isActive = s.key === stage;
          const isDone = completedStages.has(s.key);
          const isReachable = i === 0 || completedStages.has(STAGES[i - 1].key);

          return (
            <button
              key={s.key}
              disabled={!isReachable}
              onClick={() => isReachable && onStageChange(s.key)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'border-oxide-500 text-foreground'
                  : 'border-transparent text-muted-foreground',
                isReachable && !isActive && 'hover:bg-muted hover:text-foreground',
                !isReachable && 'cursor-not-allowed opacity-40'
              )}
            >
              {isDone ? (
                <Check className="h-3.5 w-3.5 text-steel-500" strokeWidth={2.5} />
              ) : (
                <span className="font-mono">{i + 1}</span>
              )}
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="p-5">{children}</div>
    </div>
  );
}

export function LabStageFooter({
  onNext,
  nextLabel,
  disabled = false,
}: {
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  const dict = useDictionary();

  return (
    <div className="mt-6 flex justify-end border-t border-border pt-4">
      <button
        onClick={onNext}
        disabled={disabled}
        className="inline-flex h-10 items-center gap-1.5 rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-oxide-600 disabled:pointer-events-none disabled:opacity-50"
      >
        {nextLabel ?? dict.lab.continueButton}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
