'use client';

import { useState, useEffect, useRef } from 'react';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import { computeSdofResponse, DEFAULT_SDOF_INPUTS } from './earthquake-motion-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Earthquake Motion — a simple building (SDOF oscillator) responds to
 * harmonic ground shaking, animated in real time. Adjusting the ground
 * motion's period relative to the building's own natural period shows
 * resonance directly: the building's sway amplitude visibly spikes as the
 * two periods converge, then drops off as they diverge — driven by the
 * verified DAF formula, not a hand-tuned animation.
 */

export function EarthquakeMotionVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.earthquakeMotion;

  const [periodSec, setPeriodSec] = useState(DEFAULT_SDOF_INPUTS.periodSec);
  const [groundMotionPeriodSec, setGroundMotionPeriodSec] = useState(
    DEFAULT_SDOF_INPUTS.groundMotionPeriodSec
  );
  const [phase, setPhase] = useState(0);
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>();

  const result = computeSdofResponse({
    periodSec,
    dampingRatio: DEFAULT_SDOF_INPUTS.dampingRatio,
    groundMotionPeriodSec,
  });

  useEffect(() => {
    function tick(time: number) {
      if (lastTimeRef.current !== undefined) {
        const dt = (time - lastTimeRef.current) / 1000;
        setPhase((p) => p + dt);
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = undefined;
    };
  }, []);

  // Ground displacement: simple harmonic motion at the ground motion's frequency
  const groundOmega = (2 * Math.PI) / groundMotionPeriodSec;
  const groundAmplitudePx = 12;
  const groundX = groundAmplitudePx * Math.sin(groundOmega * phase);

  // Building response: same forcing frequency, but scaled by the DAF and
  // phase-shifted (a real SDOF response lags the forcing near/past
  // resonance — shown here as a simple fixed lag for the teaching visual,
  // not a full transient solution).
  const responseAmplitudePx = Math.min(groundAmplitudePx * result.dynamicAmplificationFactor, 90);
  const phaseLag = result.frequencyRatio < 1 ? 0 : Math.PI * 0.6;
  const buildingX = responseAmplitudePx * Math.sin(groundOmega * phase - phaseLag);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => {
        setPeriodSec(DEFAULT_SDOF_INPUTS.periodSec);
        setGroundMotionPeriodSec(DEFAULT_SDOF_INPUTS.groundMotionPeriodSec);
      }}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.buildingPeriodLabel}
            value={periodSec}
            displayValue={`${periodSec.toFixed(2)} s`}
            min={0.2}
            max={1.5}
            step={0.02}
            onChange={setPeriodSec}
          />
          <VizSlider
            label={t.groundMotionPeriodLabel}
            value={groundMotionPeriodSec}
            displayValue={`${groundMotionPeriodSec.toFixed(2)} s`}
            min={0.2}
            max={1.5}
            step={0.02}
            onChange={setGroundMotionPeriodSec}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              r = <span className="text-foreground">{result.frequencyRatio.toFixed(2)}</span>
            </span>
            <span>
              DAF ={' '}
              <span className={result.nearResonance ? 'text-destructive' : 'text-steel-600 dark:text-steel-300'}>
                {result.dynamicAmplificationFactor.toFixed(1)}×
              </span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.nearResonance ? t.resonanceWarning : t.offResonance}
          </p>
        </div>
      }
    >
      <svg viewBox="0 0 300 220" className="h-72 w-full">
        {/* Ground */}
        <g transform={`translate(${groundX}, 0)`}>
          <rect x="0" y="185" width="300" height="25" className="fill-concrete-400" />
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={i * 30 - 10}
              y1="185"
              x2={i * 30 - 20}
              y2="210"
              className="stroke-concrete-600"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Building column, base fixed to ground motion, top swaying with response */}
        <g>
          <line
            x1={150 + groundX}
            y1="185"
            x2={150 + groundX + buildingX}
            y2="60"
            className="stroke-structural-700 dark:stroke-vellum-200"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Roof mass */}
          <rect
            x={150 + groundX + buildingX - 30}
            y="40"
            width="60"
            height="24"
            rx="3"
            className={result.nearResonance ? 'fill-destructive' : 'fill-oxide-500'}
          />
        </g>

        <text x="10" y="20" className="fill-muted-foreground font-mono text-[10px]">
          {t.svgCaption}
        </text>
      </svg>
    </VisualizationFrame>
  );
}
