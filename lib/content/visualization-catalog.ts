import { ALL_LESSONS } from '@/lib/content';
import type { VisualizationKey } from '@/components/visualizations/registry';

/**
 * Ordered catalog backing the standalone Visualization Gallery
 * (/visualizations). Each entry is structure only — slug and category —
 * matching the project's convention of keeping presentation text (title,
 * description) in the i18n dictionary instead of a data file (see
 * dictionary-type.ts's `visualizationGallery` section).
 *
 * The "used in" lesson list below is deliberately NOT hardcoded here.
 * Hardcoding it would drift the moment a lesson's interactiveKey changes;
 * instead getLessonsForVisualization() derives it live from ALL_LESSONS,
 * the same single source of truth the lesson viewer itself reads from.
 */
export interface VisualizationCatalogEntry {
  key: VisualizationKey;
  category: '2d' | '3d';
}

export const VISUALIZATION_CATALOG: VisualizationCatalogEntry[] = [
  { key: 'moment-diagram-explorer', category: '2d' },
  { key: 'column-failure-comparator', category: '2d' },
  { key: 'foundation-pressure-visualizer', category: '2d' },
  { key: 'crack-formation-visualizer', category: '2d' },
  { key: 'earthquake-motion-visualizer', category: '2d' },
  { key: 'column-buckling-visualizer', category: '3d' },
  { key: 'load-transfer-visualizer', category: '3d' },
  { key: 'reinforcement-details-visualizer', category: '3d' },
  { key: 'water-flow-visualizer', category: '3d' },
  { key: 'soil-layers-visualizer', category: '3d' },
  { key: 'building-structure-visualizer', category: '3d' },
  { key: 'reinforcement-model-visualizer', category: '3d' },
  { key: 'construction-sequence-visualizer', category: '3d' },
];

export interface VisualizationLessonRef {
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonTitleBn: string | null;
}

/** Every lesson currently wired to this visualization key, derived live
 * from ALL_LESSONS rather than duplicated by hand. */
export function getLessonsForVisualization(key: VisualizationKey): VisualizationLessonRef[] {
  return ALL_LESSONS.filter((l) => l.interactiveKey === key).map((l) => ({
    courseSlug: l.courseSlug,
    courseTitle: l.courseTitle,
    lessonId: l.id,
    lessonTitle: l.title,
    lessonTitleBn: l.titleBn,
  }));
}
