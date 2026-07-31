import { ALL_LESSONS } from '@/lib/content';
import type { LabKey } from '@/components/labs/registry';

/**
 * Ordered catalog backing the standalone Lab Gallery (/lab) — mirrors
 * lib/content/visualization-catalog.ts exactly, including the same
 * reasoning: structure only here, display text lives in the
 * dictionary, and "used in lesson" is derived live from ALL_LESSONS
 * rather than duplicated by hand.
 */
export interface LabCatalogEntry {
  key: LabKey;
  category: 'soil' | 'concrete' | 'highway' | 'survey';
}

export const LAB_CATALOG: LabCatalogEntry[] = [
  { key: 'sieve-analysis', category: 'soil' },
  { key: 'atterberg-limits', category: 'soil' },
  { key: 'compaction-test', category: 'soil' },
  { key: 'direct-shear', category: 'soil' },
  { key: 'slump-test', category: 'concrete' },
  { key: 'compression-test', category: 'concrete' },
  { key: 'flexural-test', category: 'concrete' },
  { key: 'aggregate-impact-value', category: 'highway' },
  { key: 'bitumen-penetration', category: 'highway' },
  { key: 'levelling', category: 'survey' },
  { key: 'total-station', category: 'survey' },
  { key: 'traverse', category: 'survey' },
];

export interface LabLessonRef {
  courseSlug: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  lessonTitleBn: string | null;
}

/** Every lesson currently wired to this lab key, derived live from
 * ALL_LESSONS. Each lab currently maps to exactly one lesson, but this
 * returns an array (not the first match) so a lab reused across a
 * second lesson later doesn't silently drop one. */
export function getLessonsForLab(key: LabKey): LabLessonRef[] {
  return ALL_LESSONS.filter((l) => l.labKey === key).map((l) => ({
    courseSlug: l.courseSlug,
    courseTitle: l.courseTitle,
    lessonId: l.id,
    lessonTitle: l.title,
    lessonTitleBn: l.titleBn,
  }));
}
