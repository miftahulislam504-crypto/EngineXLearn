'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ImageOff, Box, FlaskConical, Package, Wrench, AlertTriangle } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { getPracticalCategory } from '@/lib/content/practical-catalog';
import { getToolBySlug } from '@/components/tools/registry';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

type TopicKey = keyof Dictionary['practical']['topics'];
type MistakeKey = keyof Dictionary['practical']['mistakes'];

const VIS_KEY_TO_DICT_SECTION = {
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
} as const;

const LAB_KEY_TO_DICT_SECTION = {
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

export default function PracticalCategoryPage({ params }: { params: { category: string } }) {
  const dict = useDictionary();
  const t = dict.practical;

  const entry = getPracticalCategory(params.category);
  if (!entry) notFound();

  const copy = t.categories[entry.category];

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/practical"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.backToHub}
        </Link>

        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{copy.title}</h1>
        <p className="mb-8 max-w-xl text-sm text-muted-foreground">{copy.summary}</p>

        {entry.topicKeys.map((key) => {
          const topic = t.topics[key as TopicKey];
          return (
            <div key={key} className="mb-6">
              <h2 className="mb-1.5 font-display text-sm font-semibold tracking-tight">{topic.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{topic.body}</p>
            </div>
          );
        })}

        {entry.mistakeKeys.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 flex items-center gap-1.5 font-display text-sm font-semibold tracking-tight">
              <AlertTriangle className="h-4 w-4 text-oxide-500" />
              {t.commonMistakesHeading}
            </h2>
            <div className="space-y-3">
              {entry.mistakeKeys.map((key) => {
                const mistake = t.mistakes[key as MistakeKey];
                return (
                  <Card key={key} className="border-oxide-400/30 bg-oxide-400/5">
                    <CardContent className="p-4">
                      <p className="font-display text-sm font-semibold">{mistake.title}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{mistake.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {entry.relatedVisualizationKeys.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedVisualizationsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedVisualizationKeys.map((key) => (
                <li key={key}>
                  <Link href={`/visualizations/${key}`} className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline">
                    <Box className="h-3.5 w-3.5 shrink-0" />
                    {dict.visualizations[VIS_KEY_TO_DICT_SECTION[key]].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {entry.relatedLabKeys.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedLabsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedLabKeys.map((key) => (
                <li key={key}>
                  <Link href={`/lab/${key}`} className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline">
                    <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                    {(dict[LAB_KEY_TO_DICT_SECTION[key]] as { title: string }).title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {entry.relatedMaterialSlugs.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedMaterialsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedMaterialSlugs.map((slug) => (
                <li key={slug}>
                  <Link href={`/materials/${slug}`} className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline">
                    <Package className="h-3.5 w-3.5 shrink-0" />
                    {dict.materialLibrary.materials[slug as keyof typeof dict.materialLibrary.materials].title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {entry.relatedToolSlugs.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedToolsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedToolSlugs.map((slug) => {
                const tool = getToolBySlug(slug);
                if (!tool) return null;
                return (
                  <li key={slug}>
                    <Link href={`/tools/${tool.slug}`} className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline">
                      <Wrench className="h-3.5 w-3.5 shrink-0" />
                      {dict.tools.toolTitles[tool.slug as keyof typeof dict.tools.toolTitles]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.mediaHeading}</h2>
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <ImageOff className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">{t.mediaNote}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
