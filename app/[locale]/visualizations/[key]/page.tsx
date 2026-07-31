'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { InteractiveVisualization, isKnownVisualization } from '@/components/visualizations/registry';
import { VISUALIZATION_CATALOG, getLessonsForVisualization } from '@/lib/content/visualization-catalog';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

type VisualizationDictKey = keyof Dictionary['visualizations'];

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

export default function VisualizationDetailPage({ params }: { params: { key: string } }) {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.visualizationGallery;

  if (!isKnownVisualization(params.key) || !(params.key in SLUG_TO_DICT_KEY)) notFound();

  const entry = VISUALIZATION_CATALOG.find((e) => e.key === params.key);
  if (!entry) notFound();

  const title = dict.visualizations[SLUG_TO_DICT_KEY[entry.key]].title;
  const description = t.descriptions[entry.key];
  const usedInLessons = getLessonsForVisualization(entry.key);

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/visualizations"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.backToGallery}
        </Link>

        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mb-6 max-w-xl text-sm text-muted-foreground">{description}</p>

        <InteractiveVisualization interactiveKey={entry.key} />

        <div className="mt-8">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.usedInLessons}</h2>
          {usedInLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noLessonYet}</p>
          ) : (
            <ul className="space-y-1.5">
              {usedInLessons.map((ref) => (
                <li key={ref.lessonId}>
                  <Link
                    href={`/learning/${ref.courseSlug}/${ref.lessonId}`}
                    className="text-sm text-steel-500 underline-offset-2 hover:underline"
                  >
                    {ref.courseTitle} — {locale === 'bn' && ref.lessonTitleBn ? ref.lessonTitleBn : ref.lessonTitle}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </AppShell>
  );
}
