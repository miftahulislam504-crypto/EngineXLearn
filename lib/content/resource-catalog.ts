/**
 * Resource Library catalog (blueprint Part 16). Same separation as
 * visualization-catalog.ts / lab-catalog.ts: structure here, display
 * text (title/description) in the dictionary's `resourceLibrary`
 * section, keyed by `id`.
 *
 * Every entry is one of three honest states:
 * - `filePath` set → a real file shipped in /public/resources, actually
 *   downloadable right now.
 * - `filePath` null, `isReference` false → catalogued but not yet
 *   downloadable (this build has no file-hosting backend — Firebase is
 *   Auth-only per the architecture note at the top of this project's
 *   README). Shown with an honest "not available yet" state, the same
 *   approach Phase 16's AI Search took rather than faking a link.
 * - `isReference` true → a real published book/code, listed as a
 *   bibliographic reference only (title/author/publisher) — like a
 *   reading list entry. Never downloadable from here; that would be
 *   redistributing copyrighted or officially-published material.
 */

export type ResourceCategory =
  | 'pdf-notes'
  | 'hand-notes'
  | 'cad-files'
  | 'excel-sheets'
  | 'templates'
  | 'checklists'
  | 'site-formats'
  | 'engineering-books'
  | 'code-books';

export type ResourceFormat = 'pdf' | 'xlsx' | 'dwg' | 'reference';

export interface ResourceItem {
  id: string;
  category: ResourceCategory;
  format: ResourceFormat;
  /** Relative to /public — e.g. '/resources/boq-template.xlsx'. Null if not yet available. */
  filePath: string | null;
  isReference: boolean;
}

export const RESOURCE_CATALOG: ResourceItem[] = [
  // Checklists — real, downloadable
  { id: 'concrete-pour-checklist', category: 'checklists', format: 'pdf', filePath: '/resources/concrete-pour-checklist.pdf', isReference: false },
  { id: 'site-safety-checklist', category: 'checklists', format: 'pdf', filePath: '/resources/site-safety-checklist.pdf', isReference: false },
  { id: 'foundation-inspection-checklist', category: 'checklists', format: 'pdf', filePath: '/resources/foundation-inspection-checklist.pdf', isReference: false },

  // Site Formats — real, downloadable
  { id: 'daily-site-report-format', category: 'site-formats', format: 'pdf', filePath: '/resources/daily-site-report-format.pdf', isReference: false },
  { id: 'material-requisition-format', category: 'site-formats', format: 'pdf', filePath: '/resources/material-requisition-format.pdf', isReference: false },
  { id: 'concrete-pour-record-format', category: 'site-formats', format: 'pdf', filePath: '/resources/concrete-pour-record-format.pdf', isReference: false },

  // Templates — real, downloadable
  { id: 'boq-template', category: 'templates', format: 'xlsx', filePath: '/resources/boq-template.xlsx', isReference: false },
  { id: 'material-estimate-template', category: 'templates', format: 'xlsx', filePath: '/resources/material-estimate-template.xlsx', isReference: false },

  // PDF Notes — one real, two catalogued
  { id: 'soil-classification-quick-notes', category: 'pdf-notes', format: 'pdf', filePath: '/resources/soil-classification-quick-notes.pdf', isReference: false },
  { id: 'rcc-design-quick-notes', category: 'pdf-notes', format: 'pdf', filePath: null, isReference: false },
  { id: 'surveying-quick-notes', category: 'pdf-notes', format: 'pdf', filePath: null, isReference: false },

  // Hand Notes — catalogued only (genuine handwritten scans need real source material this build has none of)
  { id: 'structural-analysis-hand-notes', category: 'hand-notes', format: 'pdf', filePath: null, isReference: false },
  { id: 'soil-mechanics-hand-notes', category: 'hand-notes', format: 'pdf', filePath: null, isReference: false },

  // CAD Files — catalogued only (no CAD authoring tool in this environment)
  { id: 'standard-foundation-details-dwg', category: 'cad-files', format: 'dwg', filePath: null, isReference: false },
  { id: 'standard-stair-details-dwg', category: 'cad-files', format: 'dwg', filePath: null, isReference: false },

  // Excel Sheets — catalogued only (deliberately not duplicating the interactive Tools section)
  { id: 'rebar-development-length-sheet', category: 'excel-sheets', format: 'xlsx', filePath: null, isReference: false },
  { id: 'earthwork-volume-sheet', category: 'excel-sheets', format: 'xlsx', filePath: null, isReference: false },

  // Engineering Books — bibliographic references only, never downloadable
  { id: 'design-of-reinforced-concrete', category: 'engineering-books', format: 'reference', filePath: null, isReference: true },
  { id: 'soil-mechanics-and-foundations', category: 'engineering-books', format: 'reference', filePath: null, isReference: true },
  { id: 'surveying-theory-and-practice', category: 'engineering-books', format: 'reference', filePath: null, isReference: true },

  // Code Books — bibliographic references only, never downloadable
  { id: 'bnbc-2020', category: 'code-books', format: 'reference', filePath: null, isReference: true },
  { id: 'aci-318-19', category: 'code-books', format: 'reference', filePath: null, isReference: true },
  { id: 'aashto-lrfd', category: 'code-books', format: 'reference', filePath: null, isReference: true },
];

export function getResourcesByCategory(category: ResourceCategory): ResourceItem[] {
  return RESOURCE_CATALOG.filter((r) => r.category === category);
}
