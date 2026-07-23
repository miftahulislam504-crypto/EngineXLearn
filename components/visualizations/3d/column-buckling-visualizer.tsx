'use client';

import { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { VisualizationFrame, VizSlider } from '../visualization-frame';
import { useDictionary } from '@/lib/i18n/dictionary-context';

/**
 * Column Buckling Visualizer — shows Euler's critical buckling load and the
 * resulting deflected shape live as slenderness ratio changes. Renders in
 * 3D (React Three Fiber) rather than 2D because buckling is fundamentally
 * about a column's cross-section and length interacting in three
 * dimensions — a 2D side-view can show the deflected shape, but it can't
 * show *why* a column buckles about its weak axis, which is the actual
 * teaching point or BNBC design check.
 *
 *   P_cr = π²EI / (KL)²
 *
 * E = modulus of elasticity (steel, fixed for this lesson's worked example)
 * I = moment of inertia (varies with the column's chosen cross-section)
 * K = effective length factor (pinned-pinned = 1.0, fixed here for clarity)
 * L = unsupported length
 */

const E_STEEL_MPA = 200_000; // 200 GPa in MPa, typical structural steel
const K_FACTOR = 1.0; // pinned-pinned, the textbook baseline case

function ColumnMesh({ length, slendernessRatio }: { length: number; slendernessRatio: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Map slenderness ratio to a visible deflected curvature — purely for
  // display; the *magnitude* of real buckling deflection is indeterminate
  // at P_cr itself (that's the mathematical nature of the eigenvalue
  // problem), so this shows the *mode shape* (a half sine wave, correct
  // for pinned-pinned columns) scaled for visibility, not a literal
  // deflection amount.
  const curvePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 40;
    const amplitude = Math.min(0.15 + slendernessRatio / 400, 0.6);
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = t * length - length / 2;
      const x = amplitude * Math.sin(Math.PI * t);
      points.push(new THREE.Vector3(x, y, 0));
    }
    return points;
  }, [length, slendernessRatio]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(curvePoints), [curvePoints]);
  const tubeGeometry = useMemo(
    () => new THREE.TubeGeometry(curve, 40, 0.08, 8, false),
    [curve]
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002; // slow ambient rotation, not user-driven
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={tubeGeometry}>
        <meshStandardMaterial color="#6B9CA2" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Base + top plates, anchoring the column visually as "pinned" */}
      <mesh position={[0, -length / 2 - 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#8B8478" />
      </mesh>
      <mesh position={[0, length / 2 + 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#8B8478" />
      </mesh>
    </group>
  );
}

export function ColumnBucklingVisualizer() {
  const dict = useDictionary();
  const t = dict.visualizations.columnBuckling;
  const [slenderness, setSlenderness] = useState(80); // KL/r, dimensionless

  // Solve backwards from slenderness ratio to a display length + P_cr,
  // holding a representative radius of gyration constant so the slider
  // reads as "one clear variable changing" rather than three at once.
  const radiusOfGyrationMm = 40; // representative mid-size steel column, mm
  const rM = radiusOfGyrationMm / 1000;
  const lengthM = (slenderness * rM) / K_FACTOR;
  const lengthMm = lengthM * 1000;

  // I from r: r² = I/A. We don't need a real A for a *relative* P_cr
  // comparison, but we do for absolute kN — use a representative A for a
  // mid-size steel column so the number on screen means something concrete.
  const areaMm2 = 4800; // representative mid-size steel column cross-section
  const iMm4 = radiusOfGyrationMm ** 2 * areaMm2;

  // Euler buckling, kept entirely in N and mm (E is naturally MPa = N/mm²,
  // I is naturally mm⁴), then the final result converted once to kN.
  // Mixing unit systems mid-formula is the easiest place to introduce a
  // silent order-of-magnitude error here — see the derivation check this
  // component's math was verified against before shipping.
  const pCrN = (Math.PI ** 2 * E_STEEL_MPA * iMm4) / (K_FACTOR * lengthMm) ** 2;
  const pCrKN = pCrN / 1000;

  const classification =
    slenderness < 50 ? t.shortColumn : slenderness < 120 ? t.intermediate : t.slenderColumn;

  return (
    <VisualizationFrame
      title={t.title}
      reference={t.reference}
      onReset={() => setSlenderness(80)}
      controls={
        <div className="space-y-3">
          <VizSlider
            label={t.slendernessLabel}
            value={slenderness}
            displayValue={slenderness.toFixed(0)}
            min={20}
            max={200}
            step={1}
            onChange={setSlenderness}
          />
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              P_cr ≈ <span className="text-steel-600 dark:text-steel-300">{pCrKN.toFixed(0)} kN</span>
            </span>
            <span>
              L ≈ <span className="text-foreground">{lengthM.toFixed(2)} m</span>
            </span>
            <span className="text-foreground">{classification}</span>
          </div>
        </div>
      }
    >
      <div className="h-72 w-full">
        <Canvas camera={{ position: [2.5, 0, 2.5], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 3, 3]} intensity={0.8} />
          <ColumnMesh length={2} slendernessRatio={slenderness} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={6}
            autoRotate={false}
          />
        </Canvas>
      </div>
    </VisualizationFrame>
  );
}
