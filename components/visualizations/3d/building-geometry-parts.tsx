'use client';

/**
 * Reusable 3D building-part components, shared by Building Structure and
 * Reinforcement Model — both render the *same* building geometry, just
 * with different materials/overlays, so the actual box/cylinder placement
 * logic lives here once rather than being duplicated (and risking drift)
 * between the two visualizers.
 *
 * Window and door openings are built without CSG boolean subtraction
 * (not available in base Three.js r128 here) — instead each wall panel
 * with an opening decomposes into up to 4 solid sub-panels framing the
 * opening (bottom sill panel, top lintel panel, left and right jamb
 * panels), the same "picture frame" technique used in low-poly
 * architectural visualization generally. Panels with zero or negative
 * computed size (e.g. a door's sill panel, since doors sit at floor
 * level) are simply skipped rather than rendered as degenerate geometry.
 */

import type { ColumnMember, BeamMember, SlabPanel, Footing, WallPanel } from './building-model';
import { COLUMN_SIZE_MM, BEAM_WIDTH_MM, BEAM_DEPTH_MM, SLAB_THICKNESS_MM, WALL_THICKNESS_MM } from './building-model';

export const MATERIALS = {
  concrete: { color: '#C9C4B8', roughness: 0.85, metalness: 0.0 },
  concreteDark: { color: '#B0A99B', roughness: 0.9, metalness: 0.0 },
  brick: { color: '#A85D3F', roughness: 0.95, metalness: 0.0 },
  glass: { color: '#9FC3D6', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.45 },
  wood: { color: '#6B4426', roughness: 0.8, metalness: 0.0 },
  steel: { color: '#4A4A4A', roughness: 0.35, metalness: 0.6 },
  ground: { color: '#8FA888', roughness: 1.0, metalness: 0.0 },
  highlight: { color: '#C4632F', roughness: 0.6, metalness: 0.1 },
} as const;

const MM = 0.001; // convert millimeter member dimensions to meters (scene units)

export function ColumnMesh({ column, opacity = 1 }: { column: ColumnMember; opacity?: number }) {
  const height = column.zTop - column.zBottom;
  const sizeM = COLUMN_SIZE_MM * MM;
  return (
    <mesh position={[column.x, column.zBottom + height / 2, column.y]}>
      <boxGeometry args={[sizeM, height, sizeM]} />
      <meshStandardMaterial {...MATERIALS.concrete} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

export function BeamMesh({ beam, opacity = 1 }: { beam: BeamMember; opacity?: number }) {
  const widthM = BEAM_WIDTH_MM * MM;
  const depthM = BEAM_DEPTH_MM * MM;
  const dx = beam.x2 - beam.x1;
  const dy = beam.y2 - beam.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const midX = (beam.x1 + beam.x2) / 2;
  const midY = (beam.y1 + beam.y2) / 2;
  // beam soffit sits just below the level it supports; centerline drops by half the depth
  const centerZ = beam.level - depthM / 2;
  const rotationY = beam.dir === 'X' ? 0 : Math.PI / 2;

  return (
    <mesh position={[midX, centerZ, midY]} rotation={[0, rotationY, 0]}>
      <boxGeometry args={[length, depthM, widthM]} />
      <meshStandardMaterial {...MATERIALS.concreteDark} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

export function SlabMesh({ slab, opacity = 1 }: { slab: SlabPanel; opacity?: number }) {
  const thicknessM = SLAB_THICKNESS_MM * MM;
  const width = slab.xMax - slab.xMin;
  const depth = slab.yMax - slab.yMin;
  const midX = (slab.xMin + slab.xMax) / 2;
  const midY = (slab.yMin + slab.yMax) / 2;
  return (
    <mesh position={[midX, slab.level - thicknessM / 2, midY]}>
      <boxGeometry args={[width, thicknessM, depth]} />
      <meshStandardMaterial {...MATERIALS.concrete} transparent={opacity < 1} opacity={opacity} />
    </mesh>
  );
}

export function FootingMesh({
  footing,
  footingSizeM,
  footingThicknessM,
  footingDepthM,
}: {
  footing: Footing;
  footingSizeM: number;
  footingThicknessM: number;
  footingDepthM: number;
}) {
  const centerZ = -footingDepthM + footingThicknessM / 2;
  return (
    <mesh position={[footing.x, centerZ, footing.y]}>
      <boxGeometry args={[footingSizeM, footingThicknessM, footingSizeM]} />
      <meshStandardMaterial {...MATERIALS.concreteDark} />
    </mesh>
  );
}

/** A wall panel with an optional door/window opening, decomposed into up
 * to 4 solid sub-panels around the opening. `along` is the horizontal
 * unit direction of the wall (for positioning sub-panels along its run);
 * `thicknessAxis` picks whether thickness applies along X or Y in world
 * space, since perimeter walls run in both directions. */
export function WallMesh({ wall }: { wall: WallPanel }) {
  const thicknessM = WALL_THICKNESS_MM * MM;
  const runsAlongX = wall.side === 'S' || wall.side === 'N';
  const wallLength = runsAlongX ? wall.x2 - wall.x1 : wall.y2 - wall.y1;
  const wallHeight = wall.zTop - wall.zBottom;
  const midAlong = runsAlongX ? (wall.x1 + wall.x2) / 2 : (wall.y1 + wall.y2) / 2;
  const fixedAcross = runsAlongX ? wall.y1 : wall.x1;

  const panels: { alongOffset: number; alongSize: number; zCenter: number; zSize: number }[] = [];

  if (!wall.opening) {
    panels.push({ alongOffset: 0, alongSize: wallLength, zCenter: wall.zBottom + wallHeight / 2, zSize: wallHeight });
  } else {
    const { widthM: openW, heightM: openH, sillM } = wall.opening;
    const sideMargin = (wallLength - openW) / 2;

    // Left and right jamb panels (full height, flanking the opening)
    if (sideMargin > 0.01) {
      panels.push({
        alongOffset: -wallLength / 2 + sideMargin / 2,
        alongSize: sideMargin,
        zCenter: wall.zBottom + wallHeight / 2,
        zSize: wallHeight,
      });
      panels.push({
        alongOffset: wallLength / 2 - sideMargin / 2,
        alongSize: sideMargin,
        zCenter: wall.zBottom + wallHeight / 2,
        zSize: wallHeight,
      });
    }

    // Sill panel below the opening (skipped for a door, which sits at sillM = 0)
    if (sillM > 0.01) {
      panels.push({
        alongOffset: 0,
        alongSize: openW,
        zCenter: wall.zBottom + sillM / 2,
        zSize: sillM,
      });
    }

    // Lintel panel above the opening, up to the top of the wall
    const lintelHeight = wallHeight - sillM - openH;
    if (lintelHeight > 0.01) {
      panels.push({
        alongOffset: 0,
        alongSize: openW,
        zCenter: wall.zBottom + sillM + openH + lintelHeight / 2,
        zSize: lintelHeight,
      });
    }
  }

  return (
    <group>
      {panels.map((p, i) => {
        const along = midAlong + p.alongOffset;
        const position: [number, number, number] = runsAlongX
          ? [along, p.zCenter, fixedAcross]
          : [fixedAcross, p.zCenter, along];
        const size: [number, number, number] = runsAlongX
          ? [p.alongSize, p.zSize, thicknessM]
          : [thicknessM, p.zSize, p.alongSize];
        return (
          <mesh key={i} position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial {...MATERIALS.brick} />
          </mesh>
        );
      })}

      {wall.opening && wall.opening.kind === 'window' && (
        <WindowPane wall={wall} runsAlongX={runsAlongX} midAlong={midAlong} fixedAcross={fixedAcross} thicknessM={thicknessM} />
      )}
      {wall.opening && wall.opening.kind === 'door' && (
        <DoorPanel wall={wall} runsAlongX={runsAlongX} midAlong={midAlong} fixedAcross={fixedAcross} thicknessM={thicknessM} />
      )}
    </group>
  );
}

function WindowPane({
  wall,
  runsAlongX,
  midAlong,
  fixedAcross,
  thicknessM,
}: {
  wall: WallPanel;
  runsAlongX: boolean;
  midAlong: number;
  fixedAcross: number;
  thicknessM: number;
}) {
  if (!wall.opening) return null;
  const { widthM: openW, heightM: openH, sillM } = wall.opening;
  const zCenter = wall.zBottom + sillM + openH / 2;
  const position: [number, number, number] = runsAlongX
    ? [midAlong, zCenter, fixedAcross]
    : [fixedAcross, zCenter, midAlong];
  const size: [number, number, number] = runsAlongX
    ? [openW, openH, thicknessM * 0.4]
    : [thicknessM * 0.4, openH, openW];
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial {...MATERIALS.glass} />
    </mesh>
  );
}

function DoorPanel({
  wall,
  runsAlongX,
  midAlong,
  fixedAcross,
  thicknessM,
}: {
  wall: WallPanel;
  runsAlongX: boolean;
  midAlong: number;
  fixedAcross: number;
  thicknessM: number;
}) {
  if (!wall.opening) return null;
  const { widthM: openW, heightM: openH, sillM } = wall.opening;
  const zCenter = wall.zBottom + sillM + openH / 2;
  const position: [number, number, number] = runsAlongX
    ? [midAlong, zCenter, fixedAcross]
    : [fixedAcross, zCenter, midAlong];
  const size: [number, number, number] = runsAlongX
    ? [openW, openH, thicknessM * 0.5]
    : [thicknessM * 0.5, openH, openW];
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial {...MATERIALS.wood} />
    </mesh>
  );
}

export function GroundPlane() {
  return (
    <mesh position={[5.25, -0.02, 3.0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[24, 20]} />
      <meshStandardMaterial {...MATERIALS.ground} />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Reinforcement — longitudinal bars run the member's real full length;
// ties/stirrups are drawn at a reduced, representative frequency (a
// stated simplification — see building-model.ts) rather than at their
// real code spacing.

export function ColumnRebar({
  column,
  cornerBarOffsetMm,
  barDiameterMm,
  tieDiameterMm,
  representativeTieCount,
}: {
  column: ColumnMember;
  cornerBarOffsetMm: number;
  barDiameterMm: number;
  tieDiameterMm: number;
  representativeTieCount: number;
}) {
  const offsetM = cornerBarOffsetMm * MM;
  const barRadiusM = (barDiameterMm / 2) * MM;
  const height = column.zTop - column.zBottom;
  const centerZ = column.zBottom + height / 2;
  const corners: [number, number][] = [
    [-offsetM, -offsetM],
    [offsetM, -offsetM],
    [-offsetM, offsetM],
    [offsetM, offsetM],
  ];

  const tieHalfM = (COLUMN_SIZE_MM / 2 - 20) * MM; // ties trace a square loop just inside the concrete cover
  const tieThicknessM = tieDiameterMm * MM;

  return (
    <group position={[column.x, 0, column.y]}>
      {corners.map(([dx, dy], i) => (
        <mesh key={i} position={[dx, centerZ, dy]}>
          <cylinderGeometry args={[barRadiusM, barRadiusM, height, 8]} />
          <meshStandardMaterial {...MATERIALS.steel} />
        </mesh>
      ))}
      {Array.from({ length: representativeTieCount }).map((_, i) => {
        const z = column.zBottom + (height * (i + 0.5)) / representativeTieCount;
        const side = tieHalfM * 2;
        return (
          <group key={`tie-${i}`} position={[0, z, 0]}>
            {/* Rectangular tie loop — 4 segments tracing the column's actual
                square cross-section, not a circle, since a circular ring
                around a square column would be geometrically wrong, not
                just simplified. */}
            <mesh position={[0, 0, -tieHalfM]}>
              <boxGeometry args={[side, tieThicknessM, tieThicknessM]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
            <mesh position={[0, 0, tieHalfM]}>
              <boxGeometry args={[side, tieThicknessM, tieThicknessM]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
            <mesh position={[-tieHalfM, 0, 0]}>
              <boxGeometry args={[tieThicknessM, tieThicknessM, side]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
            <mesh position={[tieHalfM, 0, 0]}>
              <boxGeometry args={[tieThicknessM, tieThicknessM, side]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function BeamRebar({
  beam,
  barDiameterMm,
  barCount,
  topBarOffsetMm,
  stirrupDiameterMm,
  representativeStirrupCount,
}: {
  beam: BeamMember;
  barDiameterMm: number;
  barCount: number;
  topBarOffsetMm: number;
  stirrupDiameterMm: number;
  representativeStirrupCount: number;
}) {
  const dx = beam.x2 - beam.x1;
  const dy = beam.y2 - beam.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const midX = (beam.x1 + beam.x2) / 2;
  const midY = (beam.y1 + beam.y2) / 2;
  const depthM = BEAM_DEPTH_MM * MM;
  const widthM = BEAM_WIDTH_MM * MM;
  const centerZ = beam.level - depthM / 2;
  const rotationY = beam.dir === 'X' ? 0 : Math.PI / 2;

  const barRadiusM = (barDiameterMm / 2) * MM;
  const barCoverM = 40 * MM + (stirrupDiameterMm / 2) * MM;
  const bottomZOffset = -depthM / 2 + barCoverM;
  const topZOffset = depthM / 2 - barCoverM;

  const barOffsets: number[] = [];
  if (barCount === 1) {
    barOffsets.push(0);
  } else {
    const step = (topBarOffsetMm * MM * 2) / (barCount - 1);
    for (let i = 0; i < barCount; i++) barOffsets.push(-topBarOffsetMm * MM + i * step);
  }

  const stirrupHalfWidthM = (widthM - 2 * 30 * MM) / 2;
  const stirrupHalfDepthM = (depthM - 2 * 30 * MM) / 2;
  const stirrupThicknessM = stirrupDiameterMm * MM;

  return (
    <group position={[midX, 0, midY]} rotation={[0, rotationY, 0]}>
      {barOffsets.map((offset, i) => (
        <group key={`bar-${i}`}>
          <mesh position={[0, centerZ + bottomZOffset, offset]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[barRadiusM, barRadiusM, length, 8]} />
            <meshStandardMaterial {...MATERIALS.steel} />
          </mesh>
          <mesh position={[0, centerZ + topZOffset, offset]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[barRadiusM, barRadiusM, length, 8]} />
            <meshStandardMaterial {...MATERIALS.steel} />
          </mesh>
        </group>
      ))}
      {Array.from({ length: representativeStirrupCount }).map((_, i) => {
        const along = -length / 2 + (length * (i + 0.5)) / representativeStirrupCount;
        return (
          <group key={`stirrup-${i}`} position={[along, centerZ, 0]}>
            {/* Rectangular stirrup loop tracing the beam's actual cross-
                section (width x depth), not a circle. */}
            <mesh position={[0, stirrupHalfDepthM, 0]}>
              <boxGeometry args={[stirrupThicknessM, stirrupThicknessM, stirrupHalfWidthM * 2]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
            <mesh position={[0, -stirrupHalfDepthM, 0]}>
              <boxGeometry args={[stirrupThicknessM, stirrupThicknessM, stirrupHalfWidthM * 2]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
            <mesh position={[0, 0, stirrupHalfWidthM]}>
              <boxGeometry args={[stirrupThicknessM, stirrupHalfDepthM * 2, stirrupThicknessM]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
            <mesh position={[0, 0, -stirrupHalfWidthM]}>
              <boxGeometry args={[stirrupThicknessM, stirrupHalfDepthM * 2, stirrupThicknessM]} />
              <meshStandardMaterial {...MATERIALS.steel} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
