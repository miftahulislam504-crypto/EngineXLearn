/**
 * Shared building data model for the three Part 6.3 "Interactive Models"
 * — Building Structure, Reinforcement Model, and Construction Sequence
 * all render views of this *same* sample building, rather than being
 * three disconnected demonstrations.
 *
 * The building: a G+2 (ground + 2 upper floors) reinforced concrete
 * frame, 3 bays × 2 bays, proportioned to be structurally plausible —
 * checked independently before this file was written (beam span/depth
 * against standard deflection-control minimums, a rough gross-section
 * column capacity check against estimated tributary load, and a footing
 * size check against the assumed safe bearing capacity), not just
 * numbers picked to look reasonable.
 *
 * Every generation function here (columns, beams, slabs, footings,
 * walls, construction stages) was verified in Python before being
 * ported: every beam endpoint lands exactly on a column grid point,
 * every beam's level exactly matches a column story boundary, every
 * member is assigned to exactly one construction stage with no gaps
 * and no duplicates, and cumulative visible members increase
 * monotonically stage over stage — a real "the building never loses a
 * piece" check on the sequence itself.
 */

// ---------------------------------------------------------------------------
// Grid configuration

export const BAY_X_M = [0, 3.5, 7.0, 10.5]; // 4 grid lines, 3 bays along X
export const BAY_Y_M = [0, 3.0, 6.0]; // 3 grid lines, 2 bays along Y
export const FLOOR_LEVELS_M = [0, 3.0, 6.0, 9.0]; // ground/plinth, 1st, 2nd, roof

export const COLUMN_SIZE_MM = 300;
export const BEAM_WIDTH_MM = 250;
export const BEAM_DEPTH_MM = 400;
export const SLAB_THICKNESS_MM = 125;
export const WALL_THICKNESS_MM = 125;
export const PARAPET_HEIGHT_M = 1.0;

export const FOOTING_SIZE_M = 1.6;
export const FOOTING_THICKNESS_M = 0.4;
export const FOOTING_DEPTH_M = 1.2; // below ground level

// ---------------------------------------------------------------------------
// Structural members

export interface ColumnMember {
  id: string;
  gridX: number; // index into BAY_X_M
  gridY: number; // index into BAY_Y_M
  x: number;
  y: number;
  zBottom: number;
  zTop: number;
  story: number; // 0 = ground story, 1 = 1st story, 2 = 2nd story
}

export interface BeamMember {
  id: string;
  level: number;
  levelIdx: number;
  dir: 'X' | 'Y';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface SlabPanel {
  id: string;
  level: number;
  levelIdx: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface Footing {
  id: string;
  gridX: number;
  gridY: number;
  x: number;
  y: number;
}

export type WallSide = 'S' | 'N' | 'W' | 'E';

export interface WallPanel {
  id: string;
  side: WallSide;
  story: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  zBottom: number;
  zTop: number;
  opening: { kind: 'door' | 'window'; widthM: number; heightM: number; sillM: number } | null;
}

export function generateColumns(): ColumnMember[] {
  const columns: ColumnMember[] = [];
  for (let xi = 0; xi < BAY_X_M.length; xi++) {
    for (let yi = 0; yi < BAY_Y_M.length; yi++) {
      for (let si = 0; si < FLOOR_LEVELS_M.length - 1; si++) {
        columns.push({
          id: `C-${xi}-${yi}-S${si}`,
          gridX: xi,
          gridY: yi,
          x: BAY_X_M[xi],
          y: BAY_Y_M[yi],
          zBottom: FLOOR_LEVELS_M[si],
          zTop: FLOOR_LEVELS_M[si + 1],
          story: si,
        });
      }
    }
  }
  return columns;
}

export function generateBeams(): BeamMember[] {
  const beams: BeamMember[] = [];
  FLOOR_LEVELS_M.forEach((level, li) => {
    for (let yi = 0; yi < BAY_Y_M.length; yi++) {
      for (let xi = 0; xi < BAY_X_M.length - 1; xi++) {
        beams.push({
          id: `B-X-${xi}-${yi}-L${li}`,
          level,
          levelIdx: li,
          dir: 'X',
          x1: BAY_X_M[xi],
          y1: BAY_Y_M[yi],
          x2: BAY_X_M[xi + 1],
          y2: BAY_Y_M[yi],
        });
      }
    }
    for (let xi = 0; xi < BAY_X_M.length; xi++) {
      for (let yi = 0; yi < BAY_Y_M.length - 1; yi++) {
        beams.push({
          id: `B-Y-${xi}-${yi}-L${li}`,
          level,
          levelIdx: li,
          dir: 'Y',
          x1: BAY_X_M[xi],
          y1: BAY_Y_M[yi],
          x2: BAY_X_M[xi],
          y2: BAY_Y_M[yi + 1],
        });
      }
    }
  });
  return beams;
}

export function generateSlabs(): SlabPanel[] {
  const slabs: SlabPanel[] = [];
  FLOOR_LEVELS_M.forEach((level, li) => {
    if (li === 0) return; // ground/plinth level is slab-on-grade, not a suspended panel
    for (let xi = 0; xi < BAY_X_M.length - 1; xi++) {
      for (let yi = 0; yi < BAY_Y_M.length - 1; yi++) {
        slabs.push({
          id: `S-${xi}-${yi}-L${li}`,
          level,
          levelIdx: li,
          xMin: BAY_X_M[xi],
          xMax: BAY_X_M[xi + 1],
          yMin: BAY_Y_M[yi],
          yMax: BAY_Y_M[yi + 1],
        });
      }
    }
  });
  return slabs;
}

export function generateFootings(): Footing[] {
  const footings: Footing[] = [];
  for (let xi = 0; xi < BAY_X_M.length; xi++) {
    for (let yi = 0; yi < BAY_Y_M.length; yi++) {
      footings.push({ id: `F-${xi}-${yi}`, gridX: xi, gridY: yi, x: BAY_X_M[xi], y: BAY_Y_M[yi] });
    }
  }
  return footings;
}

export function generateWalls(): WallPanel[] {
  const walls: WallPanel[] = [];
  const storyCount = FLOOR_LEVELS_M.length - 1;

  for (let si = 0; si < storyCount; si++) {
    const zBottom = FLOOR_LEVELS_M[si];
    const zTop = FLOOR_LEVELS_M[si + 1];

    for (let xi = 0; xi < BAY_X_M.length - 1; xi++) {
      // South wall (y = 0): ground floor middle bay is the entrance (door), others get windows
      const isEntranceBay = si === 0 && xi === 1;
      walls.push({
        id: `W-S-${xi}-S${si}`,
        side: 'S',
        story: si,
        x1: BAY_X_M[xi],
        y1: BAY_Y_M[0],
        x2: BAY_X_M[xi + 1],
        y2: BAY_Y_M[0],
        zBottom,
        zTop,
        opening: isEntranceBay
          ? { kind: 'door', widthM: 1.2, heightM: 2.1, sillM: 0 }
          : { kind: 'window', widthM: 1.2, heightM: 1.2, sillM: 1.0 },
      });
      // North wall (y = max): windows throughout
      walls.push({
        id: `W-N-${xi}-S${si}`,
        side: 'N',
        story: si,
        x1: BAY_X_M[xi],
        y1: BAY_Y_M[BAY_Y_M.length - 1],
        x2: BAY_X_M[xi + 1],
        y2: BAY_Y_M[BAY_Y_M.length - 1],
        zBottom,
        zTop,
        opening: { kind: 'window', widthM: 1.2, heightM: 1.2, sillM: 1.0 },
      });
    }

    for (let yi = 0; yi < BAY_Y_M.length - 1; yi++) {
      walls.push({
        id: `W-W-${yi}-S${si}`,
        side: 'W',
        story: si,
        x1: BAY_X_M[0],
        y1: BAY_Y_M[yi],
        x2: BAY_X_M[0],
        y2: BAY_Y_M[yi + 1],
        zBottom,
        zTop,
        opening: { kind: 'window', widthM: 1.2, heightM: 1.2, sillM: 1.0 },
      });
      walls.push({
        id: `W-E-${yi}-S${si}`,
        side: 'E',
        story: si,
        x1: BAY_X_M[BAY_X_M.length - 1],
        y1: BAY_Y_M[yi],
        x2: BAY_X_M[BAY_X_M.length - 1],
        y2: BAY_Y_M[yi + 1],
        zBottom,
        zTop,
        opening: { kind: 'window', widthM: 1.2, heightM: 1.2, sillM: 1.0 },
      });
    }
  }

  return walls;
}

// ---------------------------------------------------------------------------
// Construction stages — every member above is assigned to exactly one of
// these, in build order. Verified: 164 total members (columns + beams +
// slabs + footings + walls), zero unassigned, zero duplicates, cumulative
// visible count strictly non-decreasing stage over stage.

export const CONSTRUCTION_STAGES = [
  'excavation',
  'footings',
  'ground-columns-plinth-beams',
  'floor1-slab',
  'story1-columns',
  'floor2-slab',
  'story2-columns',
  'roof-slab',
  'walls',
  'parapet-finishing',
] as const;

export type ConstructionStage = (typeof CONSTRUCTION_STAGES)[number];

export function stageForColumn(c: ColumnMember): ConstructionStage {
  if (c.story === 0) return 'ground-columns-plinth-beams';
  if (c.story === 1) return 'story1-columns';
  return 'story2-columns';
}

export function stageForBeam(b: BeamMember): ConstructionStage {
  if (b.levelIdx === 0) return 'ground-columns-plinth-beams';
  if (b.levelIdx === 1) return 'floor1-slab';
  if (b.levelIdx === 2) return 'floor2-slab';
  return 'roof-slab';
}

export function stageForSlab(s: SlabPanel): ConstructionStage {
  if (s.levelIdx === 1) return 'floor1-slab';
  if (s.levelIdx === 2) return 'floor2-slab';
  return 'roof-slab';
}

export function stageForFooting(_f: Footing): ConstructionStage {
  return 'footings';
}

export function stageForWall(_w: WallPanel): ConstructionStage {
  return 'walls';
}

export function stageIndex(stage: ConstructionStage): number {
  return CONSTRUCTION_STAGES.indexOf(stage);
}

// ---------------------------------------------------------------------------
// Reinforcement layout — reuses the same cover/spacing convention as the
// Reinforcement Details lesson's beam bar-position logic, extended to a
// square tied column (4 corner bars) and to placing bars along a member's
// full 3D length rather than a single cross-section.
//
// Deliberately simplified for a whole-building view: ties/stirrups are
// shown at a reduced, representative frequency (a handful per member)
// rather than at their real ~150-250mm code spacing, which would mean
// thousands of ring meshes across 36 columns and 68 beams with no added
// teaching value over showing the pattern clearly. Longitudinal bars ARE
// shown at their real, full member length — it's only the tie/stirrup
// *frequency* that's a stated simplification, not the bar layout itself.

export interface ColumnRebarLayout {
  barDiameterMm: number;
  cornerBarOffsetMm: number; // distance from column center to each corner bar, both axes
  tieDiameterMm: number;
  tieSpacingMm: number;
  representativeTieCount: number;
}

export function computeColumnRebar(): ColumnRebarLayout {
  const barDiameterMm = 16;
  const coverMm = 40;
  const tieDiameterMm = 8;
  const cornerBarOffsetMm = COLUMN_SIZE_MM / 2 - (coverMm + tieDiameterMm + barDiameterMm / 2);
  const tieSpacingMm = Math.min(16 * barDiameterMm, 48 * tieDiameterMm, COLUMN_SIZE_MM);
  return { barDiameterMm, cornerBarOffsetMm, tieDiameterMm, tieSpacingMm, representativeTieCount: 5 };
}

export interface BeamRebarLayout {
  barDiameterMm: number;
  barCount: number;
  topBarOffsetMm: number; // distance from beam centerline (width direction) per bar row, symmetric
  effectiveDepthMm: number;
  stirrupDiameterMm: number;
  representativeStirrupCount: number;
}

export function computeBeamRebar(): BeamRebarLayout {
  const barDiameterMm = 16;
  const coverMm = 40;
  const stirrupDiameterMm = 8;
  const barCount = 3;
  const effectiveDepthMm = BEAM_DEPTH_MM - coverMm - stirrupDiameterMm - barDiameterMm / 2;
  // symmetric spacing across the beam width, same convention as computeReinforcement
  const availableWidth = BEAM_WIDTH_MM - 2 * coverMm - 2 * stirrupDiameterMm - barCount * barDiameterMm;
  const gaps = barCount - 1;
  const clearSpacing = gaps > 0 ? availableWidth / gaps : availableWidth;
  const totalSpan = barCount * barDiameterMm + gaps * Math.max(clearSpacing, 0);
  const topBarOffsetMm = totalSpan / 2 - barDiameterMm / 2;
  return {
    barDiameterMm,
    barCount,
    topBarOffsetMm,
    effectiveDepthMm,
    stirrupDiameterMm,
    representativeStirrupCount: 6,
  };
}
