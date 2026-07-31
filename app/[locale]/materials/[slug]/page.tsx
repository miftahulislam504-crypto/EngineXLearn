'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, FlaskConical, Wrench } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { getMaterialBySlug } from '@/lib/content/material-catalog';
import { getToolBySlug } from '@/components/tools/registry';
import { useDictionary } from '@/lib/i18n/dictionary-context';

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

function Section({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{heading}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const dict = useDictionary();
  const t = dict.materialLibrary;

  const entry = getMaterialBySlug(params.slug);
  if (!entry || !(entry.slug in t.materials)) notFound();

  const copy = t.materials[entry.slug as keyof typeof t.materials];

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/materials"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.backToMaterials}
        </Link>

        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{copy.title}</h1>
        <p className="mb-8 max-w-xl text-sm text-muted-foreground">{copy.summary}</p>

        <Section heading={t.propertiesHeading} items={copy.properties} />
        <Section heading={t.advantagesHeading} items={copy.advantages} />
        <Section heading={t.disadvantagesHeading} items={copy.disadvantages} />
        <Section heading={t.usesHeading} items={copy.uses} />
        <Section heading={t.testingHeading} items={copy.testing} />

        <div className="mb-6">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.marketInfoHeading}</h2>
          <p className="text-sm text-muted-foreground">{copy.marketInfo}</p>
        </div>

        {entry.relatedLabKeys.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedLabsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedLabKeys.map((labKey) => {
                const dictSection = LAB_KEY_TO_DICT_SECTION[labKey];
                const labTitle = (dict[dictSection] as { title: string }).title;
                return (
                  <li key={labKey}>
                    <Link
                      href={`/lab/${labKey}`}
                      className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline"
                    >
                      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
                      {labTitle}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {entry.relatedToolSlugs.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.relatedToolsHeading}</h2>
            <ul className="space-y-1.5">
              {entry.relatedToolSlugs.map((toolSlug) => {
                const tool = getToolBySlug(toolSlug);
                if (!tool) return null;
                return (
                  <li key={toolSlug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-2 text-sm text-steel-500 underline-offset-2 hover:underline"
                    >
                      <Wrench className="h-3.5 w-3.5 shrink-0" />
                      {dict.tools.toolTitles[tool.slug as keyof typeof dict.tools.toolTitles]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </AppShell>
  );
}
