'use client';

import { Link } from '@/components/i18n/link';
import { ChevronRight, Mountain, HardHat, Route, Compass } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { LAB_CATALOG, type LabCatalogEntry } from '@/lib/content/lab-catalog';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

/**
 * The `lab` dictionary namespace (equipment/procedure labels) is
 * separate from the 12 per-lab sections (sieveAnalysis, slumpTest,
 * etc.) that each carry a `.title`. This maps the kebab-case registry
 * key to the camelCase dictionary section, same approach as the
 * Visualization Gallery's SLUG_TO_DICT_KEY.
 */
const KEY_TO_DICT_SECTION = {
  'sieve-analysis': 'sieveAnalysis',
  'atterberg-limits': 'atterbergLimits',
  'compaction-test': 'compactionTest',
  'direct-shear': 'directShear',
  'slump-test': 'slumpTest',
  'compression-test': 'compressionTest',
  'flexural-test': 'flexuralTest',
  'aggregate-impact-value': 'aggregateImpact',
  'bitumen-penetration': 'bitumenPenetration',
  levelling: 'levelling',
  'total-station': 'totalStation',
  traverse: 'traverse',
} as const;

export function labTitle(dict: Dictionary, key: LabCatalogEntry['key']): string {
  const section = KEY_TO_DICT_SECTION[key];
  return (dict[section] as { title: string }).title;
}

const CATEGORIES: LabCatalogEntry['category'][] = ['soil', 'concrete', 'highway', 'survey'];

export default function LabGalleryPage() {
  const dict = useDictionary();
  const t = dict.labGallery;

  const categoryLabels: Record<LabCatalogEntry['category'], string> = {
    soil: t.categorySoil,
    concrete: t.categoryConcrete,
    highway: t.categoryHighway,
    survey: t.categorySurvey,
  };
  const categoryIcons: Record<LabCatalogEntry['category'], typeof Mountain> = {
    soil: Mountain,
    concrete: HardHat,
    highway: Route,
    survey: Compass,
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
            const entries = LAB_CATALOG.filter((e) => e.category === category);
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
                    const title = labTitle(dict, entry.key);
                    const description = t.descriptions[entry.key];
                    return (
                      <Link key={entry.key} href={`/lab/${entry.key}`}>
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

        <p className="mt-4 text-center font-mono text-xs text-muted-foreground">{t.count(LAB_CATALOG.length)}</p>
      </main>
    </AppShell>
  );
}
