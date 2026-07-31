'use client';

import { Link } from '@/components/i18n/link';
import { ChevronRight, Box, Shapes } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { VISUALIZATION_CATALOG } from '@/lib/content/visualization-catalog';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

type VisualizationDictKey = keyof Dictionary['visualizations'];

/**
 * The `visualizations` dictionary section (per-component control labels)
 * uses camelCase keys (momentDiagram) while the registry/catalog uses
 * kebab-case slugs (moment-diagram-explorer) that double as URL segments.
 * This maps one to the other so the gallery can pull each title from the
 * single source of truth instead of duplicating 13 titles a second time.
 */
const SLUG_TO_DICT_KEY: Record<string, VisualizationDictKey> = {
  'moment-diagram-explorer': 'momentDiagram',
  'column-buckling-visualizer': 'columnBuckling',
  'load-transfer-visualizer': 'loadTransfer',
  'column-failure-comparator': 'columnFailure',
  'foundation-pressure-visualizer': 'foundationPressure',
  'reinforcement-details-visualizer': 'reinforcementDetails',
  'crack-formation-visualizer': 'crackFormation',
  'water-flow-visualizer': 'waterFlow',
  'earthquake-motion-visualizer': 'earthquakeMotion',
  'soil-layers-visualizer': 'soilLayers',
  'building-structure-visualizer': 'buildingStructure',
  'reinforcement-model-visualizer': 'reinforcementModel',
  'construction-sequence-visualizer': 'constructionSequence',
};

const CATEGORIES: ('2d' | '3d')[] = ['2d', '3d'];

export default function VisualizationGalleryPage() {
  const dict = useDictionary();
  const t = dict.visualizationGallery;

  const categoryLabels: Record<'2d' | '3d', string> = {
    '2d': t.category2d,
    '3d': t.category3d,
  };
  const categoryIcons: Record<'2d' | '3d', typeof Shapes> = {
    '2d': Shapes,
    '3d': Box,
  };

  return (
    <AppShell>
      <main className="container max-w-5xl py-12 md:py-16">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">{t.eyebrow}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">{t.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.pageDescription}</p>
        </div>

        <div className="space-y-12">
          {CATEGORIES.map((category) => {
            const entries = VISUALIZATION_CATALOG.filter((e) => e.category === category);
            const Icon = categoryIcons[category];
            return (
              <section key={category}>
                <div className="mb-4 flex items-baseline justify-between">
                  <h2 className="font-display text-xl font-semibold tracking-tight">{categoryLabels[category]}</h2>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {t.count(entries.length)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {entries.map((entry) => {
                    const title = dict.visualizations[SLUG_TO_DICT_KEY[entry.key]].title;
                    const description = t.descriptions[entry.key];
                    return (
                      <Link key={entry.key} href={`/visualizations/${entry.key}`}>
                        <Card className="group h-full transition-colors hover:border-steel-400/60">
                          <CardContent className="flex items-start gap-3 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
                              <Icon className="h-4 w-4" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-sm font-semibold leading-snug">{title}</p>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                            </div>
                            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                <div className="dim-divider mt-8" />
              </section>
            );
          })}
        </div>

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">
          {t.count(VISUALIZATION_CATALOG.length)}
        </p>
      </main>
    </AppShell>
  );
}

