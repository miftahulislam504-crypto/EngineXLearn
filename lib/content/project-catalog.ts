import type { VisualizationKey } from '@/components/visualizations/registry';
import type { LabKey } from '@/components/labs/registry';

/**
 * Real Project Experience catalog (blueprint Part 11). Same
 * structure-only pattern as every other Phase 17+ catalog — display
 * text lives in the dictionary's `projects` section.
 *
 * Blueprint 11.2 asks for "Real Drawings, Site Photos, Construction
 * Videos / Construction Steps" per project. This platform has none of
 * those and cannot produce them authentically — no real completed
 * project exists behind this build, and there's no way to generate a
 * genuine site photograph or construction video. So each project page
 * is honest on two fronts: the narrative content is clearly framed as
 * a *representative example* (not a specific real, named, verifiable
 * building), and the Real Drawings/Site Photos/Construction Videos
 * section says plainly that it needs real project documentation this
 * platform doesn't have, rather than substituting stock imagery and
 * calling it "real."
 *
 * Cross-links to existing Visualizations/Labs/Materials are added
 * only where they're genuinely applicable to that specific project's
 * content — e.g. the Construction Sequence visualizer models a
 * *building's* stage-by-stage construction, so it's linked from
 * Residential and Commercial, but NOT from Bridge, whose construction
 * sequence (piling, pier construction, girder erection) is a
 * genuinely different process nothing on this platform models yet.
 */

export type ProjectSlug = 'residential' | 'commercial' | 'bridge' | 'road';

export interface ProjectCatalogEntry {
  slug: ProjectSlug;
  sectionKeys: string[];
  relatedVisualizationKeys: VisualizationKey[];
  relatedLabKeys: LabKey[];
  relatedMaterialSlugs: string[];
}

export const PROJECT_CATALOG: ProjectCatalogEntry[] = [
  {
    slug: 'residential',
    sectionKeys: ['planning', 'construction', 'finishing'],
    relatedVisualizationKeys: ['construction-sequence-visualizer', 'building-structure-visualizer'],
    relatedLabKeys: [],
    relatedMaterialSlugs: ['brick', 'cement', 'concrete'],
  },
  {
    slug: 'commercial',
    sectionKeys: ['structural-system', 'site-management'],
    relatedVisualizationKeys: ['building-structure-visualizer', 'reinforcement-model-visualizer'],
    relatedLabKeys: [],
    relatedMaterialSlugs: ['steel', 'concrete'],
  },
  {
    slug: 'bridge',
    sectionKeys: ['construction-sequence'],
    relatedVisualizationKeys: [], // deliberately empty — see file doc comment
    relatedLabKeys: ['compression-test'],
    relatedMaterialSlugs: ['steel', 'concrete'],
  },
  {
    slug: 'road',
    sectionKeys: ['pavement-layers'],
    relatedVisualizationKeys: [],
    relatedLabKeys: ['bitumen-penetration', 'aggregate-impact-value'],
    relatedMaterialSlugs: ['asphalt', 'aggregate'],
  },
];

export function getProjectBySlug(slug: string): ProjectCatalogEntry | undefined {
  return PROJECT_CATALOG.find((p) => p.slug === slug);
}
