'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import {
  computeReinforcement,
  DEFAULT_BEAM_SECTION,
} from './reinforcement-details-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Reinforcement Details — a beam cross-section rendered in 3D showing
 * actual bar layout: cover, stirrup, and longitudinal bars positioned
 * exactly where the calculation logic places them (not an illustrative
 * approximation — the mesh positions come directly from barPositions).
 * Adjusting bar count live shows both the reinforcement-ratio check and
 * the spacing check responding together, since a real design has to
 * satisfy both simultaneously.
 */

const SCALE = 0.006; // mm -> 3D scene units

function BeamSection({
  widthMm,
  depthMm,
  coverMm,
  stirrupDiameterMm,
  barDiameterMm,
  barPositions,
  spacingOk,
}: {
  widthMm: number;
  depthMm: number;
  coverMm: number;
  stirrupDiameterMm: number;
  barDiameterMm: number;
  barPositions: { x: number; y: number }[];
  spacingOk: boolean;
}) {
  const w = widthMm * SCALE;
  const h = depthMm * SCALE;

  return (
    <group>
      {/* Concrete section */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, w * 0.6]} />
        <meshStandardMaterial color="#C9C4B8" opacity={0.55} transparent />
      </mesh>

      {/* Stirrup outline (a thin rectangular loop just inside the cover) */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry
          args={[
            w - 2 * coverMm * SCALE,
            h - 2 * coverMm * SCALE,
            w * 0.6 - 2 * coverMm * SCALE,
          ]}
        />
        <meshStandardMaterial color="#4A7C82" wireframe />
      </mesh>

      {/* Longitudinal bars, positioned exactly where the logic file puts them */}
      {barPositions.map((pos, i) => (
        <mesh
          key={i}
          position={[pos.x * SCALE, pos.y * SCALE, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry
            args={[(barDiameterMm / 2) * SCALE, (barDiameterMm / 2) * SCALE, w * 0.6, 16]}
          />
          <meshStandardMaterial color={spacingOk ? '#38636A' : '#C4632F'} metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function ReinforcementDetailsVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.reinforcementDetails;

  const [barCount, setBarCount] = useState(4);
  const inputs = DEFAULT_BEAM_SECTION;

  const result = useMemo(() => computeReinforcement(inputs, barCount), [inputs, barCount]);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => setBarCount(4)}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.barCountLabel}
            value={barCount}
            displayValue={t.barsUnit(barCount)}
            min={2}
            max={8}
            step={1}
            onChange={(v) => setBarCount(Math.round(v))}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              As = <span className={result.meetsMinimum ? 'text-steel-600 dark:text-steel-300' : 'text-destructive'}>
                {result.providedAsMm2} mm²
              </span>
              {' '}({t.asMinLabel} {result.asMinMm2} mm²)
            </span>
            <span>
              {t.clearSpacingLabel} ={' '}
              <span className={result.spacingOk ? 'text-steel-600 dark:text-steel-300' : 'text-destructive'}>
                {result.clearSpacingMm} mm
              </span>
              {' '}({t.minLabel} {result.minRequiredSpacingMm} mm)
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.meetsMinimum && result.spacingOk
              ? t.bothPass
              : !result.meetsMinimum
                ? t.failsMinimum
                : t.failsSpacing}
          </p>
        </div>
      }
    >
      <div className="h-72 w-full">
        <Canvas camera={{ position: [2, 1.5, 2.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 3]} intensity={0.8} />
          <BeamSection
            widthMm={inputs.widthMm}
            depthMm={inputs.effectiveDepthMm}
            coverMm={inputs.coverMm}
            stirrupDiameterMm={inputs.stirrupDiameterMm}
            barDiameterMm={inputs.barDiameterMm}
            barPositions={result.barPositions}
            spacingOk={result.spacingOk}
          />
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={5} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
