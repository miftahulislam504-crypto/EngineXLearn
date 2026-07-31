'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { VirtualLab, isKnownLab } from '@/components/labs/registry';
import { LAB_CATALOG, getLessonsForLab } from '@/lib/content/lab-catalog';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';

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

export default function LabDetailPage({ params }: { params: { key: string } }) {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();
  const t = dict.labGallery;

  if (!isKnownLab(params.key)) notFound();

  const entry = LAB_CATALOG.find((e) => e.key === params.key);
  if (!entry) notFound();

  const dictSection = KEY_TO_DICT_SECTION[entry.key];
  const title = (dict[dictSection] as { title: string }).title;
  const description = t.descriptions[entry.key];
  const linkedLessons = getLessonsForLab(entry.key);

  // VirtualLab needs a lessonId to attach saved results to. Every lab
  // currently maps to exactly one lesson (see the mapping check this
  // gallery was built from), so the first linked lesson is used. If a
  // lab is ever reused across a second lesson, results saved from
  // here still land under a real, correct lesson id — just always
  // the first one — rather than a synthetic id that would show up
  // nowhere in the Profile page's activity feed.
  const lessonIdForSaving = linkedLessons[0]?.lessonId ?? entry.key;

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/lab"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t.backToGallery}
        </Link>

        <h1 className="mb-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mb-6 max-w-xl text-sm text-muted-foreground">{description}</p>

        <VirtualLab labKey={entry.key} lessonId={lessonIdForSaving} loggedIn={!!user} />

        <div className="mt-8">
          <h2 className="mb-2 font-display text-sm font-semibold tracking-tight">{t.usedInLessons}</h2>
          {linkedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noLessonYet}</p>
          ) : (
            <ul className="space-y-1.5">
              {linkedLessons.map((ref) => (
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
