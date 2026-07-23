'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import {
  computeStressProfile,
  interpolateStressAtDepth,
  DEFAULT_SOIL_LAYERS,
  DEFAULT_WATER_TABLE_DEPTH_M,
} from './soil-layers-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Soil Layers — a stratified soil cross-section in 3D with a draggable
 * depth probe, showing total stress, pore pressure, and effective stress
 * building up through real soil layers (extends the Foundation Pressure
 * / Bearing Pressure material already in the Soil Mechanics course).
 */

const SCALE = 0.25; // meters -> 3D scene units
const TOTAL_DEPTH_M = DEFAULT_SOIL_LAYERS.reduce((sum, l) => sum + l.thicknessM, 0);

function SoilBlock() {
  let cumulativeDepth = 0;
  return (
    <group>
      {DEFAULT_SOIL_LAYERS.map((layer, i) => {
        const top = cumulativeDepth;
        cumulativeDepth += layer.thicknessM;
        const h = layer.thicknessM * SCALE;
        const y = -(top * SCALE) - h / 2;
        return (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[2.4, h, 1.6]} />
            <meshStandardMaterial color={layer.color} />
          </mesh>
        );
      })}

      {/* Water table plane */}
      <mesh position={[0, -DEFAULT_WATER_TABLE_DEPTH_M * SCALE, 0]}>
        <boxGeometry args={[2.5, 0.02, 1.7]} />
        <meshStandardMaterial color="#4A7C82" opacity={0.6} transparent />
      </mesh>
    </group>
  );
}

function ProbeMarker({ depthM }: { depthM: number }) {
  return (
    <mesh position={[0, -depthM * SCALE, 0.85]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color="#C4632F" />
    </mesh>
  );
}

export function SoilLayersVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.soilLayers;

  const [probeDepthM, setProbeDepthM] = useState(4.0);

  const stressAtProbe = useMemo(
    () => interpolateStressAtDepth(DEFAULT_SOIL_LAYERS, DEFAULT_WATER_TABLE_DEPTH_M, probeDepthM),
    [probeDepthM]
  );

  const LAYER_LABELS: Record<string, string> = {
    sand: t.sandLabel,
    clay: t.clayLabel,
    denseSand: t.denseSandLabel,
  };

  const currentLayer = useMemo(() => {
    let cumulative = 0;
    for (const layer of DEFAULT_SOIL_LAYERS) {
      cumulative += layer.thicknessM;
      if (probeDepthM <= cumulative) return layer;
    }
    return DEFAULT_SOIL_LAYERS[DEFAULT_SOIL_LAYERS.length - 1];
  }, [probeDepthM]);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => setProbeDepthM(4.0)}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.probeDepthLabel}
            value={probeDepthM}
            displayValue={`${probeDepthM.toFixed(1)} m`}
            min={0.2}
            max={TOTAL_DEPTH_M - 0.1}
            step={0.1}
            onChange={setProbeDepthM}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              {t.layerLabel}: <span className="text-foreground">{LAYER_LABELS[currentLayer.name]}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              σᵥ = <span className="text-foreground">{stressAtProbe.totalStressKpa} kPa</span>
            </span>
            <span>
              u = <span className="text-steel-600 dark:text-steel-300">{stressAtProbe.porePressureKpa} kPa</span>
            </span>
            <span>
              σᵥ′ = <span className="text-oxide-600 dark:text-oxide-400">{stressAtProbe.effectiveStressKpa} kPa</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {probeDepthM < DEFAULT_WATER_TABLE_DEPTH_M ? t.aboveWaterTable : t.belowWaterTable}
          </p>
        </div>
      }
    >
      <div className="h-72 w-full">
        <Canvas camera={{ position: [3, 0.5, 3], fov: 45 }}>
          <ambientLight intensity={0.75} />
          <directionalLight position={[3, 4, 3]} intensity={0.7} />
          <SoilBlock />
          <ProbeMarker depthM={probeDepthM} />
          <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
