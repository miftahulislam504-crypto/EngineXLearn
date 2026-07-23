'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { VisualizationFrame } from '../visualization-frame';
import {
  generateColumns,
  generateBeams,
  computeColumnRebar,
  computeBeamRebar,
} from './building-model';
import { ColumnMesh, BeamMesh, ColumnRebar, BeamRebar, GroundPlane } from './building-geometry-parts';
import { useDictionary } from '@/lib/i18n/dictionary-context';

function ReinforcementScene({ xray }: { xray: boolean }) {
  const columns = useMemo(() => generateColumns(), []);
  const beams = useMemo(() => generateBeams(), []);
  const columnRebar = useMemo(() => computeColumnRebar(), []);
  const beamRebar = useMemo(() => computeBeamRebar(), []);

  const concreteOpacity = xray ? 0.15 : 1;

  return (
    <group>
      <GroundPlane />
      {columns.map((c) => (
        <ColumnMesh key={c.id} column={c} opacity={concreteOpacity} />
      ))}
      {beams.map((b) => (
        <BeamMesh key={b.id} beam={b} opacity={concreteOpacity} />
      ))}
      {xray &&
        columns.map((c) => (
          <ColumnRebar
            key={`rebar-${c.id}`}
            column={c}
            cornerBarOffsetMm={columnRebar.cornerBarOffsetMm}
            barDiameterMm={columnRebar.barDiameterMm}
            tieDiameterMm={columnRebar.tieDiameterMm}
            representativeTieCount={columnRebar.representativeTieCount}
          />
        ))}
      {xray &&
        beams.map((b) => (
          <BeamRebar
            key={`rebar-${b.id}`}
            beam={b}
            barDiameterMm={beamRebar.barDiameterMm}
            barCount={beamRebar.barCount}
            topBarOffsetMm={beamRebar.topBarOffsetMm}
            stirrupDiameterMm={beamRebar.stirrupDiameterMm}
            representativeStirrupCount={beamRebar.representativeStirrupCount}
          />
        ))}
    </group>
  );
}

export function ReinforcementModelVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.reinforcementModel;

  const [xray, setXray] = useState(true);
  const columnRebar = useMemo(() => computeColumnRebar(), []);
  const beamRebar = useMemo(() => computeBeamRebar(), []);

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => setXray(true)}
      controls={
        <div className="space-y-3">
          <button
            onClick={() => setXray((v) => !v)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              xray
                ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {xray ? t.toggleXrayOn : t.toggleXrayOff}
          </button>

          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              {t.columnLabel}: 4×{columnRebar.barDiameterMm}mm + {t.tiesLabel}@{columnRebar.tieSpacingMm}mm
            </span>
            <span>
              {t.beamLabel}: {beamRebar.barCount}×{beamRebar.barDiameterMm}mm + {t.stirrupsLabel}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">{t.simplificationNote}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">{t.explanation}</p>
        </div>
      }
    >
      <div className="h-80 w-full">
        <Canvas camera={{ position: [16, 12, 16], fov: 42 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 15, 8]} intensity={1.0} />
          <directionalLight position={[-8, 6, -8]} intensity={0.3} />
          <ReinforcementScene xray={xray} />
          <OrbitControls enablePan={true} minDistance={6} maxDistance={35} maxPolarAngle={Math.PI / 2.05} />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
