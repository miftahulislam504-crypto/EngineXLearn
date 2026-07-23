'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizationFrame } from '../visualization-frame';
import {
  generateColumns,
  generateBeams,
  generateSlabs,
  generateFootings,
  generateWalls,
  FOOTING_SIZE_M,
  FOOTING_THICKNESS_M,
  FOOTING_DEPTH_M,
  FLOOR_LEVELS_M,
} from './building-model';
import { ColumnMesh, BeamMesh, SlabMesh, FootingMesh, WallMesh, GroundPlane } from './building-geometry-parts';
import { useDictionary } from '@/lib/i18n/dictionary-context';

function BuildingScene({ showWalls, showFootings, maxLevelIdx }: { showWalls: boolean; showFootings: boolean; maxLevelIdx: number }) {
  const columns = useMemo(() => generateColumns(), []);
  const beams = useMemo(() => generateBeams(), []);
  const slabs = useMemo(() => generateSlabs(), []);
  const footings = useMemo(() => generateFootings(), []);
  const walls = useMemo(() => generateWalls(), []);

  const visibleColumns = columns.filter((c) => c.story <= maxLevelIdx);
  const visibleBeams = beams.filter((b) => b.levelIdx <= maxLevelIdx);
  const visibleSlabs = slabs.filter((s) => s.levelIdx <= maxLevelIdx);
  const visibleWalls = walls.filter((w) => w.story <= maxLevelIdx);

  return (
    <group>
      <GroundPlane />
      {showFootings &&
        footings.map((f) => (
          <FootingMesh
            key={f.id}
            footing={f}
            footingSizeM={FOOTING_SIZE_M}
            footingThicknessM={FOOTING_THICKNESS_M}
            footingDepthM={FOOTING_DEPTH_M}
          />
        ))}
      {visibleColumns.map((c) => (
        <ColumnMesh key={c.id} column={c} />
      ))}
      {visibleBeams.map((b) => (
        <BeamMesh key={b.id} beam={b} />
      ))}
      {visibleSlabs.map((s) => (
        <SlabMesh key={s.id} slab={s} />
      ))}
      {showWalls && visibleWalls.map((w) => <WallMesh key={w.id} wall={w} />)}
    </group>
  );
}

export function BuildingStructureVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.buildingStructure;

  const [showWalls, setShowWalls] = useState(true);
  const [showFootings, setShowFootings] = useState(true);
  const [maxLevelIdx, setMaxLevelIdx] = useState(FLOOR_LEVELS_M.length - 2); // full building by default

  const levelLabels = [t.levelGround, t.level1, t.level2, t.levelRoof];

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => {
        setShowWalls(true);
        setShowFootings(true);
        setMaxLevelIdx(FLOOR_LEVELS_M.length - 2);
      }}
      controls={
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowWalls((v) => !v)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                showWalls
                  ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {t.toggleWalls}
            </button>
            <button
              onClick={() => setShowFootings((v) => !v)}
              className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                showFootings
                  ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {t.toggleFootings}
            </button>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-xs text-muted-foreground">{t.storiesShownLabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {levelLabels.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setMaxLevelIdx(i)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    maxLevelIdx === i
                      ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{t.explanation}</p>
        </div>
      }
    >
      <div className="h-80 w-full">
        <Canvas camera={{ position: [16, 12, 16], fov: 42 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 8]} intensity={1.0} />
          <directionalLight position={[-8, 6, -8]} intensity={0.3} />
          <BuildingScene showWalls={showWalls} showFootings={showFootings} maxLevelIdx={maxLevelIdx} />
          <OrbitControls enablePan={true} minDistance={6} maxDistance={35} maxPolarAngle={Math.PI / 2.05} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
