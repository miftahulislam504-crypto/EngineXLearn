import type { VisualizationKey } from '@/components/visualizations/registry';
import type { LabKey } from '@/components/labs/registry';

/**
 * Practical Engineering Hub catalog (blueprint Part 5) — the
 * blueprint's own words call this "the platform's most unique
 * part... centered on real site experience." Same honesty
 * constraint as Real Project Experience (Part 11, Phase 24): 5.7
 * asks for Real Photos, Real Videos, and Drone Views, none of which
 * this build can produce authentically. See the media note in
 * app/[locale]/practical/[category]/page.tsx for how that's handled
 * — the same "say so honestly" pattern as Phase 24, not repeated
 * here since it's identical reasoning.
 *
 * 43 individual topics across 6 categories (5.1–5.6) are grouped
 * under 6 category hub pages rather than 43 separate routes — the
 * same "reasonable subset, sensibly organized" choice this project
 * has made everywhere else (12 tools, not unlimited; 6 category
 * pages, not 43 atomic ones). Every one of the 43 topics is still
 * covered, as a subsection within its category.
 */

export type PracticalCategory =
  | 'site-engineering'
  | 'reinforcement-work'
  | 'concrete-technology'
  | 'foundation-systems'
  | 'road-construction'
  | 'site-safety';

export interface PracticalCategoryEntry {
  category: PracticalCategory;
  topicKeys: string[];
  mistakeKeys: string[];
  relatedVisualizationKeys: VisualizationKey[];
  relatedLabKeys: LabKey[];
  relatedMaterialSlugs: string[];
  relatedToolSlugs: string[];
}

export const PRACTICAL_CATALOG: PracticalCategoryEntry[] = [
  {
    category: 'site-engineering',
    topicKeys: [
      'site-setup',
      'excavation',
      'layout-work',
      'foundation-work',
      'column-casting',
      'beam-casting',
      'slab-casting',
      'pcc',
      'rcc-work',
      'brickwork',
      'plastering',
      'tile-work',
      'waterproofing',
      'painting',
      'finishing-work',
    ],
    mistakeKeys: ['mistake-curing', 'mistake-layout'],
    relatedVisualizationKeys: ['construction-sequence-visualizer'],
    relatedLabKeys: ['slump-test'],
    relatedMaterialSlugs: ['brick', 'cement'],
    relatedToolSlugs: ['brick-calculator'],
  },
  {
    category: 'reinforcement-work',
    topicKeys: ['bar-cutting', 'bar-bending', 'bar-placement', 'lapping', 'anchorage', 'cover-block', 'reinforcement-detailing'],
    mistakeKeys: ['mistake-cover', 'mistake-lap-location'],
    relatedVisualizationKeys: ['reinforcement-details-visualizer', 'reinforcement-model-visualizer'],
    relatedLabKeys: [],
    relatedMaterialSlugs: ['steel'],
    relatedToolSlugs: ['steel-weight-calculator'],
  },
  {
    category: 'concrete-technology',
    topicKeys: ['concrete-mix', 'water-cement-ratio', 'slump-test-practice', 'casting', 'vibrating-compaction', 'curing', 'concrete-failure'],
    mistakeKeys: ['mistake-water-added', 'mistake-curing'],
    relatedVisualizationKeys: ['crack-formation-visualizer'],
    relatedLabKeys: ['slump-test', 'compression-test', 'flexural-test'],
    relatedMaterialSlugs: ['cement', 'concrete'],
    relatedToolSlugs: ['concrete-calculator'],
  },
  {
    category: 'foundation-systems',
    topicKeys: ['isolated-footing', 'combined-footing', 'raft-foundation', 'pile-foundation'],
    mistakeKeys: ['mistake-founding-level'],
    relatedVisualizationKeys: ['foundation-pressure-visualizer', 'soil-layers-visualizer'],
    relatedLabKeys: ['direct-shear'],
    relatedMaterialSlugs: [],
    relatedToolSlugs: ['soil-bearing-calculator'],
  },
  {
    category: 'road-construction',
    topicKeys: ['subgrade', 'subbase', 'base-course', 'asphalt-work', 'road-compaction'],
    mistakeKeys: ['mistake-subgrade-skip'],
    relatedVisualizationKeys: [],
    relatedLabKeys: ['bitumen-penetration', 'aggregate-impact-value', 'compaction-test'],
    relatedMaterialSlugs: ['asphalt', 'aggregate'],
    relatedToolSlugs: [],
  },
  {
    category: 'site-safety',
    topicKeys: ['ppe', 'scaffolding', 'electrical-safety', 'crane-safety', 'site-risk-management'],
    mistakeKeys: ['mistake-ppe-culture'],
    relatedVisualizationKeys: [],
    relatedLabKeys: [],
    relatedMaterialSlugs: [],
    relatedToolSlugs: [],
  },
];

export function getPracticalCategory(category: string): PracticalCategoryEntry | undefined {
  return PRACTICAL_CATALOG.find((c) => c.category === category);
}
