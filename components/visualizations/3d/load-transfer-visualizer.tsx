'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import {
  computeLoadTransfer,
  DEFAULT_LOAD_TRANSFER_INPUTS,
  type LoadTransferStage,
} from './load-transfer-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Load Transfer — a simplified one-bay building (slab, beam, column,
 * foundation, soil) rendered in 3D, with the load path highlighted stage
 * by stage. The teaching point isn't any single formula; it's watching a
 * distributed load become concentrated, then spread back out — which is
 * why this is a spatial visualization rather than a chart: the "area ->
 * line -> point -> point -> area" transformation is genuinely about the
 * shape of the load, and a flat diagram can't show that as clearly as
 * actually seeing the slab, beam, and footing at their relative sizes.
 */

const STAGE_COLORS: Record<LoadTransferStage['key'], string> = {
  slab: '#8FB8BD',
  beam: '#6B9CA2',
  column: '#4A7C82',
  foundation: '#38636A',
  soil: '#8B8478',
};

function Scene({ activeStage }: { activeStage: LoadTransferStage['key'] }) {
  const highlight = (key: LoadTransferStage['key']) =>
    key === activeStage ? '#C4632F' : STAGE_COLORS[key];

  return (
    <group position={[0, -1, 0]}>
      {/* Slab */}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[2.6, 0.15, 2.6]} />
        <meshStandardMaterial color={highlight('slab')} />
      </mesh>

      {/* Beam (running along one axis under the slab) */}
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[2.6, 0.2, 0.25]} />
        <meshStandardMaterial color={highlight('beam')} />
      </mesh>

      {/* Two columns supporting the beam ends */}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 1.0, 0]}>
          <boxGeometry args={[0.25, 2.0, 0.25]} />
          <meshStandardMaterial color={highlight('column')} />
        </mesh>
      ))}

      {/* Two footings beneath the columns */}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, -0.15, 0]}>
          <boxGeometry args={[0.7, 0.3, 0.7]} />
          <meshStandardMaterial color={highlight('foundation')} />
        </mesh>
      ))}

      {/* Soil block beneath, representing the bearing area */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[3.4, 0.5, 2.2]} />
        <meshStandardMaterial color={highlight('soil')} opacity={0.85} transparent />
      </mesh>

      {/* Load path arrows — visible only from the slab down through the
          active stage's column, giving a sense of "this is the path"
          without cluttering the scene with every possible path at once. */}
      {activeStage !== 'slab' && (
        <Line
          points={[
            [0, 2.3, 0],
            [1.15, 2.3, 0],
            [1.15, -0.05, 0],
          ]}
          color="#C4632F"
          lineWidth={2}
          dashed
          dashSize={0.15}
          gapSize={0.08}
        />
      )}
    </group>
  );
}

export function LoadTransferVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.loadTransfer;

  const [inputs, setInputs] = useState(DEFAULT_LOAD_TRANSFER_INPUTS);
  const [activeStage, setActiveStage] = useState<LoadTransferStage['key']>('slab');

  const result = useMemo(() => computeLoadTransfer(inputs), [inputs]);
  const activeStageData = result.stages.find((s) => s.key === activeStage)!;

  const STAGE_LABELS: Record<LoadTransferStage['key'], string> = {
    slab: t.slabStage,
    beam: t.beamStage,
    column: t.columnStage,
    foundation: t.foundationStage,
    soil: t.soilStage,
  };

  const STAGE_DESCRIPTIONS: Record<LoadTransferStage['key'], string> = {
    slab: t.slabDesc,
    beam: t.beamDesc(result.tributaryWidthM.toString()),
    column: t.columnDesc(result.beamTotalLoadKn.toString(), result.beamSpanM.toString()),
    foundation: t.foundationDesc,
    soil: t.soilDesc(result.requiredFootingAreaM2.toFixed(2), result.safeBearingCapacityKpa.toString()),
  };

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => {
        setInputs(DEFAULT_LOAD_TRANSFER_INPUTS);
        setActiveStage('slab');
      }}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.slabLoadLabel}
            value={inputs.slabUdlKpa}
            displayValue={`${inputs.slabUdlKpa.toFixed(1)} kN/m²`}
            min={2}
            max={10}
            step={0.5}
            onChange={(v) => setInputs((p) => ({ ...p, slabUdlKpa: v }))}
          />
          <VizSlider
            label={t.bearingCapacityLabel}
            value={inputs.safeBearingCapacityKpa}
            displayValue={`${inputs.safeBearingCapacityKpa.toFixed(0)} kN/m²`}
            min={75}
            max={300}
            step={5}
            onChange={(v) => setInputs((p) => ({ ...p, safeBearingCapacityKpa: v }))}
          />

          {/* Stage selector — click through the chain */}
          <div className="flex gap-1.5 pt-1">
            {result.stages.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveStage(s.key)}
                className={`flex-1 rounded-md border px-2 py-1.5 font-mono text-[11px] transition-colors ${
                  activeStage === s.key
                    ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {STAGE_LABELS[s.key]}
              </button>
            ))}
          </div>

          <div className="rounded-md bg-muted/60 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {activeStageData.value} {activeStageData.unit}
            </span>{' '}
            ({activeStageData.loadType}) — {STAGE_DESCRIPTIONS[activeStage]}
          </div>
        </div>
      }
    >
      <div className="h-72 w-full">
        <Canvas camera={{ position: [4, 2.5, 4], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 4]} intensity={0.8} />
          <Scene activeStage={activeStage} />
          <OrbitControls enablePan={false} minDistance={3} maxDistance={9} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
