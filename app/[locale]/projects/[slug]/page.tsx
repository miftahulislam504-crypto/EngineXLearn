'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ImageOff, Box, FlaskConical, Package } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { getProjectBySlug } from '@/lib/content/project-catalog';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

type SectionKey = keyof Dictionary['projects']['sections'];

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const dict = useDictionary();
  const t = dict.projects;

  const entry = getProjectBySlug(params.slug);
  if (!entry) notFound();

  const listCopy = t.list[entry.slug];

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/projects"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.backToProjects}
        </Link>

        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{listCopy.title}</h1>
        <p className="mb-4 max-w-xl text-sm text-muted-foreground">{listCopy.summary}</p>

        <Card className="mb-8 border-steel-400/30 bg-steel-500/5">
          <CardContent className="p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">{t.representativeNote}</p>
          </CardContent>
        </Card>

        {entry.sectionKeys.map((key) => {
          const section = t.sections[key as SectionKey];
          return (
            <div key={key} className="prose prose-sm mb-8 max-w-none dark:prose-invert">
              <h2 className="font-display text-lg font-semibold tracking-tight">{section.title}</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
            </div>
          );
        })}

        {entry.relatedVisualizationKeys.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedVisualizationsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedVisualizationKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={`/visualizations/${key}`}
                    className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline"
                  >
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
                  <Link
                    href={`/lab/${key}`}
                    className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline"
                  >
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
                  <Link
                    href={`/materials/${slug}`}
                    className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline"
                  >
                    <Package className="h-3.5 w-3.5 shrink-0" />
                    {dict.materialLibrary.materials[slug as keyof typeof dict.materialLibrary.materials].title}
                  </Link>
                </li>
              ))}
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
