'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Shared chrome for every interactive lesson visualization — 2D (JSXGraph)
 * or 3D (React Three Fiber) alike. Gives every visualization the same
 * instructional framing: a title, a units/reference note, a controls
 * panel, and a reset action. This is the "board a professor draws on"
 * convention, not a generic app widget — labeled, annotated, consistent
 * regardless of which rendering engine is underneath.
 */
export function VisualizationFrame({
  title,
  reference,
  onReset,
  controls,
  children,
  className,
}: {
  title: string;
  reference?: string; // e.g. "Euler buckling — BNBC 2020 §6.2"
  onReset?: () => void;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const dict = useDictionary();

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-sm font-semibold tracking-tight">{title}</p>
          {reference && (
            <p className="font-mono text-[11px] text-muted-foreground">{reference}</p>
          )}
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={dict.visualization.resetAria}
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.9} />
          </button>
        )}
      </div>

      <div
        className="relative bg-vellum-50 dark:bg-structural-950"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--grid-line)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line)) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {children}
      </div>

      {controls && (
        <div className="border-t border-border bg-muted/40 px-4 py-3">{controls}</div>
      )}
    </div>
  );
}

/**
 * A single labeled slider — the most common control across visualizations
 * (load position, slenderness ratio, load magnitude). Keeps every
 * visualization's controls looking like the same instrument panel rather
 * than each inventing its own slider styling.
 */
export function VizSlider({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-oxide-500"
      />
      <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums text-foreground">
        {displayValue}
      </span>
    </label>
  );
}
