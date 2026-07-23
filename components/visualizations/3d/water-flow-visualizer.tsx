'use client';

import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import {
  computeChannelFlow,
  DEFAULT_CHANNEL_INPUTS,
  MANNINGS_N_PRESETS,
} from './water-flow-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

const SCALE = 0.6; // meters -> 3D scene units

function FlowingWater({ widthM, depthM, velocityMs }: { widthM: number; depthM: number; velocityMs: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Animate a simple scrolling texture-like offset via geometry translation
  // to suggest flow direction and relative speed — purely illustrative,
  // not a fluid simulation, but the animation SPEED does scale with the
  // real computed velocity so faster flow visibly looks faster.
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z += delta * Math.min(velocityMs, 3) * 0.4;
      if (groupRef.current.position.z > 1) groupRef.current.position.z -= 1;
    }
  });

  const w = widthM * SCALE;
  const d = depthM * SCALE;

  return (
    <group>
      {/* Channel bed + walls (static concrete) */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[w + 0.2, 0.1, 3]} />
        <meshStandardMaterial color="#8B8478" />
      </mesh>
      <mesh position={[-w / 2 - 0.05, d / 2, 0]}>
        <boxGeometry args={[0.1, d + 0.1, 3]} />
        <meshStandardMaterial color="#8B8478" />
      </mesh>
      <mesh position={[w / 2 + 0.05, d / 2, 0]}>
        <boxGeometry args={[0.1, d + 0.1, 3]} />
        <meshStandardMaterial color="#8B8478" />
      </mesh>

      {/* Water body, sized to the calculated depth */}
      <mesh position={[0, d / 2, 0]}>
        <boxGeometry args={[w, d, 3]} />
        <meshStandardMaterial color="#4A7C82" opacity={0.75} transparent />
      </mesh>

      {/* Flow-direction indicator stripes, animated */}
      <group ref={groupRef}>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((z) => (
          <mesh key={z} position={[0, d + 0.02, z]}>
            <boxGeometry args={[w * 0.9, 0.02, 0.06]} />
            <meshStandardMaterial color="#C4632F" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function WaterFlowVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.waterFlow;

  const [depthM, setDepthM] = useState(DEFAULT_CHANNEL_INPUTS.depthM);
  const [surfaceType, setSurfaceType] = useState<keyof typeof MANNINGS_N_PRESETS>('concrete');

  const inputs = useMemo(
    () => ({ ...DEFAULT_CHANNEL_INPUTS, depthM, manningsN: MANNINGS_N_PRESETS[surfaceType] }),
    [depthM, surfaceType]
  );

  const result = computeChannelFlow(inputs);

  const SURFACE_LABELS: Record<keyof typeof MANNINGS_N_PRESETS, string> = {
    concrete: t.concreteLabel,
    earth: t.earthLabel,
    gravel: t.gravelLabel,
  };

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => {
        setDepthM(DEFAULT_CHANNEL_INPUTS.depthM);
        setSurfaceType('concrete');
      }}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.depthLabel}
            value={depthM}
            displayValue={`${depthM.toFixed(2)} m`}
            min={0.2}
            max={1.6}
            step={0.05}
            onChange={setDepthM}
          />

          <div className="flex gap-1.5">
            {(Object.keys(MANNINGS_N_PRESETS) as (keyof typeof MANNINGS_N_PRESETS)[]).map((key) => (
              <button
                key={key}
                onClick={() => setSurfaceType(key)}
                className={`flex-1 rounded-md border px-2 py-1.5 font-mono text-[11px] transition-colors ${
                  surfaceType === key
                    ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {SURFACE_LABELS[key]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              V = <span className="text-foreground">{result.velocityMs.toFixed(2)} m/s</span>
            </span>
            <span>
              Q = <span className="text-steel-600 dark:text-steel-300">{result.dischargeM3s.toFixed(2)} m³/s</span>
            </span>
            <span>
              R = <span className="text-foreground">{result.hydraulicRadiusM.toFixed(3)} m</span>
            </span>
          </div>
        </div>
      }
    >
      <div className="h-72 w-full">
        <Canvas camera={{ position: [2, 1.2, 2.2], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 3]} intensity={0.8} />
          <FlowingWater widthM={inputs.widthM} depthM={depthM} velocityMs={result.velocityMs} />
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={5} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
