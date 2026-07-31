import type { LabKey } from '@/components/labs/registry';

/**
 * Engineering Material Library catalog (blueprint Part 10). Same
 * separation as the other Phase 17-19 catalogs: structure only here
 * (slug, order, cross-links to real Labs/Tools that already exist),
 * all display text (properties, advantages, etc.) lives in the
 * dictionary's `materialLibrary` section, keyed by slug.
 *
 * relatedLabKeys/relatedToolSlugs are genuine cross-links, not
 * decoration — e.g. Cement links to the real Slump Test and
 * Compression Test labs (Phase 9), Steel links to the real Steel
 * Weight Calculator tool (Phase 12). Only added where an actual lab
 * or tool exists for that material; nothing here points at anything
 * unbuilt.
 */
export interface MaterialCatalogEntry {
  slug: string;
  relatedLabKeys: LabKey[];
  relatedToolSlugs: string[];
}

export const MATERIAL_CATALOG: MaterialCatalogEntry[] = [
  { slug: 'cement', relatedLabKeys: ['slump-test', 'compression-test'], relatedToolSlugs: ['concrete-calculator'] },
  { slug: 'sand', relatedLabKeys: ['sieve-analysis'], relatedToolSlugs: [] },
  { slug: 'aggregate', relatedLabKeys: ['sieve-analysis', 'aggregate-impact-value'], relatedToolSlugs: ['concrete-calculator'] },
  { slug: 'steel', relatedLabKeys: [], relatedToolSlugs: ['steel-weight-calculator'] },
  { slug: 'brick', relatedLabKeys: [], relatedToolSlugs: ['brick-calculator'] },
  { slug: 'concrete', relatedLabKeys: ['slump-test', 'compression-test', 'flexural-test'], relatedToolSlugs: ['concrete-calculator'] },
  { slug: 'asphalt', relatedLabKeys: ['bitumen-penetration'], relatedToolSlugs: [] },
  { slug: 'wood', relatedLabKeys: [], relatedToolSlugs: [] },
  { slug: 'glass', relatedLabKeys: [], relatedToolSlugs: [] },
  { slug: 'aluminum', relatedLabKeys: [], relatedToolSlugs: [] },
];

export function getMaterialBySlug(slug: string): MaterialCatalogEntry | undefined {
  return MATERIAL_CATALOG.find((m) => m.slug === slug);
}
