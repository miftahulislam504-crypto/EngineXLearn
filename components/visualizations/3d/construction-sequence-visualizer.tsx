'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VisualizationFrame } from '../visualization-frame';
import {
  generateColumns,
  generateBeams,
  generateSlabs,
  generateFootings,
  generateWalls,
  stageForColumn,
  stageForBeam,
  stageForSlab,
  stageForFooting,
  stageForWall,
  stageIndex,
  CONSTRUCTION_STAGES,
  FOOTING_SIZE_M,
  FOOTING_THICKNESS_M,
  FOOTING_DEPTH_M,
  type ConstructionStage,
} from './building-model';
import { ColumnMesh, BeamMesh, SlabMesh, FootingMesh, WallMesh, GroundPlane } from './building-geometry-parts';
import { useDictionary } from '@/lib/i18n/dictionary-context';

function ExcavationPits() {
  // Simple excavated-pit indicators at each footing location, shown only
  // at the excavation stage before anything is actually built.
  const footings = useMemo(() => generateFootings(), []);
  return (
    <group>
      {footings.map((f) => (
        <mesh key={f.id} position={[f.x, -FOOTING_DEPTH_M / 2 - 0.05, f.y]}>
          <boxGeometry args={[FOOTING_SIZE_M + 0.3, FOOTING_DEPTH_M + 0.1, FOOTING_SIZE_M + 0.3]} />
          <meshStandardMaterial color="#6B5D4A" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function SequenceScene({ currentStageIdx }: { currentStageIdx: number }) {
  const columns = useMemo(() => generateColumns(), []);
  const beams = useMemo(() => generateBeams(), []);
  const slabs = useMemo(() => generateSlabs(), []);
  const footings = useMemo(() => generateFootings(), []);
  const walls = useMemo(() => generateWalls(), []);

  const isBuilt = (stage: ConstructionStage) => stageIndex(stage) <= currentStageIdx;
  const showExcavation = currentStageIdx === 0;

  return (
    <group>
      <GroundPlane />
      {showExcavation && <ExcavationPits />}
      {footings.filter((f) => isBuilt(stageForFooting(f))).map((f) => (
        <FootingMesh
          key={f.id}
          footing={f}
          footingSizeM={FOOTING_SIZE_M}
          footingThicknessM={FOOTING_THICKNESS_M}
          footingDepthM={FOOTING_DEPTH_M}
        />
      ))}
      {columns.filter((c) => isBuilt(stageForColumn(c))).map((c) => (
        <ColumnMesh key={c.id} column={c} />
      ))}
      {beams.filter((b) => isBuilt(stageForBeam(b))).map((b) => (
        <BeamMesh key={b.id} beam={b} />
      ))}
      {slabs.filter((s) => isBuilt(stageForSlab(s))).map((s) => (
        <SlabMesh key={s.id} slab={s} />
      ))}
      {walls.filter((w) => isBuilt(stageForWall(w))).map((w) => (
        <WallMesh key={w.id} wall={w} />
      ))}
    </group>
  );
}

export function ConstructionSequenceVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.constructionSequence;

  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const stageLabels: Record<ConstructionStage, string> = {
    excavation: t.stageExcavation,
    footings: t.stageFootings,
    'ground-columns-plinth-beams': t.stageGroundColumns,
    'floor1-slab': t.stageFloor1Slab,
    'story1-columns': t.stageStory1Columns,
    'floor2-slab': t.stageFloor2Slab,
    'story2-columns': t.stageStory2Columns,
    'roof-slab': t.stageRoofSlab,
    walls: t.stageWalls,
    'parapet-finishing': t.stageParapetFinishing,
  };

  const stageExplanations: Record<ConstructionStage, string> = {
    excavation: t.explainExcavation,
    footings: t.explainFootings,
    'ground-columns-plinth-beams': t.explainGroundColumns,
    'floor1-slab': t.explainFloor1Slab,
    'story1-columns': t.explainStory1Columns,
    'floor2-slab': t.explainFloor2Slab,
    'story2-columns': t.explainStory2Columns,
    'roof-slab': t.explainRoofSlab,
    walls: t.explainWalls,
    'parapet-finishing': t.explainParapetFinishing,
  };

  const currentStage = CONSTRUCTION_STAGES[currentStageIdx];

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => setCurrentStageIdx(0)}
      controls={
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentStageIdx((i) => Math.max(0, i - 1))}
              disabled={currentStageIdx === 0}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="font-mono text-[11px] text-muted-foreground">
                {t.stageProgress(currentStageIdx + 1, CONSTRUCTION_STAGES.length)}
              </p>
              <p className="font-display text-sm font-semibold">{stageLabels[currentStage]}</p>
            </div>
            <button
              onClick={() => setCurrentStageIdx((i) => Math.min(CONSTRUCTION_STAGES.length - 1, i + 1))}
              disabled={currentStageIdx === CONSTRUCTION_STAGES.length - 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-1">
            {CONSTRUCTION_STAGES.map((s, i) => (
              <button
                key={s}
                onClick={() => setCurrentStageIdx(i)}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStageIdx ? 'bg-oxide-500' : 'bg-border'
                }`}
                aria-label={stageLabels[s]}
              />
            ))}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">{stageExplanations[currentStage]}</p>
        </div>
      }
    >
      <div className="h-80 w-full">
        <Canvas camera={{ position: [16, 12, 16], fov: 42 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 8]} intensity={1.0} />
          <directionalLight position={[-8, 6, -8]} intensity={0.3} />
          <SequenceScene currentStageIdx={currentStageIdx} />
          <OrbitControls enablePan={true} minDistance={6} maxDistance={35} maxPolarAngle={Math.PI / 2.05} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
