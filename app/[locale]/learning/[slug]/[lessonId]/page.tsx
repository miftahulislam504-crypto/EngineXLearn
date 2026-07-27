'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, MonitorPlay, PlayCircle } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { getLessonById } from '@/lib/content';
import { getCompletedLessonIds } from '@/lib/progress/store';
import { useAuth } from '@/lib/auth-context';
import { LessonSidebar } from '@/components/learning/lesson-sidebar';
import { DimensionProgress } from '@/components/learning/dimension-progress';
import { MarkCompleteButton } from '@/components/learning/mark-complete-button';
import { InteractiveVisualization } from '@/components/visualizations/registry';
import { VirtualLab } from '@/components/labs/registry';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import { localize } from '@/lib/i18n/localize-content';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionary-type';

export default function LessonViewerPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();

  const lesson = getLessonById(params.lessonId);

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (user) setCompletedLessonIds(getCompletedLessonIds(user.uid));
  }, [user]);

  if (!lesson || lesson.module.course.slug !== params.slug) notFound();

  const course = lesson.module.course;
  const allModules = course.modules; // already ordered, already carries every lesson — no separate fetch needed

  const flatLessons = allModules.flatMap((m) => m.lessons);
  const currentIndex = flatLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const currentModuleLessons = lesson.module.lessons.map((l) => ({
    id: l.id,
    title: localize(locale, l.title, l.titleBn),
    complete: completedLessonIds.has(l.id),
    current: l.id === lesson.id,
  }));

  const courseTitle = localize(locale, course.title, course.titleBn);
  const moduleTitle = localize(locale, lesson.module.title, lesson.module.titleBn);
  const lessonTitle = localize(locale, lesson.title, lesson.titleBn);

  const localizedModules = allModules.map((m) => ({
    ...m,
    title: localize(locale, m.title, m.titleBn),
    lessons: m.lessons.map((l) => ({ ...l, title: localize(locale, l.title, l.titleBn) })),
  }));

  return (
    <>
      <SiteHeader />
      <div className="container max-w-6xl py-8 md:py-10">
        <div className="flex flex-col gap-8 md:flex-row">
          <LessonSidebar
            courseSlug={course.slug}
            courseTitle={courseTitle}
            modules={localizedModules}
            currentLessonId={lesson.id}
            completedLessonIds={completedLessonIds}
          />

          <main className="min-w-0 flex-1">
            {/* Dimension-line progress through the current module */}
            <DimensionProgress courseSlug={course.slug} lessons={currentModuleLessons} />

            <div className="mt-6">
              <span className="font-mono text-xs uppercase tracking-wider text-steel-500">
                {moduleTitle}
              </span>
              <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {lessonTitle}
              </h1>
              {lesson.durationMin && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {dict.lesson.minutes(lesson.durationMin)} · {lesson.contentType}
                </p>
              )}
            </div>

            <div className="dim-divider my-6" />

            <LessonContent
              lesson={lesson}
              lessonId={lesson.id}
              loggedIn={!!user}
              locale={locale}
              dict={dict}
            />

            <div className="dim-divider my-8" />

            <div className="flex items-center justify-between">
              <MarkCompleteButton
                lessonId={lesson.id}
                initiallyComplete={completedLessonIds.has(lesson.id)}
                loggedIn={!!user}
                onToggle={(nextState) => {
                  setCompletedLessonIds((prev) => {
                    const next = new Set(prev);
                    if (nextState) next.add(lesson.id);
                    else next.delete(lesson.id);
                    return next;
                  });
                }}
              />

              <div className="flex gap-2">
                {prevLesson && (
                  <Link
                    href={`/learning/${course.slug}/${prevLesson.id}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md border border-border px-3.5 text-sm font-medium hover:bg-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {dict.lesson.previous}
                  </Link>
                )}
                {nextLesson ? (
                  <Link
                    href={`/learning/${course.slug}/${nextLesson.id}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md bg-accent px-3.5 text-sm font-medium text-accent-foreground hover:bg-oxide-600"
                  >
                    {dict.lesson.next}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/learning/${course.slug}`}
                    className="inline-flex h-10 items-center gap-1.5 rounded-md bg-accent px-3.5 text-sm font-medium text-accent-foreground hover:bg-oxide-600"
                  >
                    {dict.lesson.finishCourse}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function LessonContent({
  lesson,
  lessonId,
  loggedIn,
  locale,
  dict,
}: {
  lesson: {
    contentType: string;
    body: string | null;
    contentUrl?: string | null;
    interactiveKey: string | null;
    labKey: string | null;
  };
  lessonId: string;
  loggedIn: boolean;
  locale: Locale;
  dict: Dictionary;
}) {
  const localizedBody = localize(locale, lesson.body, null);

  if (lesson.contentType === 'reading' && localizedBody) {
    return (
      <article className="prose-lesson">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{localizedBody}</ReactMarkdown>
      </article>
    );
  }

  if (lesson.contentType === 'reading' && !localizedBody) {
    return (
      <EmptyLessonState icon={<PlayCircle className="h-5 w-5" />} message={dict.lesson.readingNotWritten} />
    );
  }

  if (lesson.contentType === 'video') {
    return (
      <EmptyLessonState icon={<MonitorPlay className="h-5 w-5" />} message={dict.lesson.videoNotWired} />
    );
  }

  if (lesson.contentType === 'interactive') {
    return <InteractiveVisualization interactiveKey={lesson.interactiveKey} />;
  }

  if (lesson.contentType === 'lab') {
    return <VirtualLab labKey={lesson.labKey} lessonId={lessonId} loggedIn={loggedIn} />;
  }

  return null;
}

function EmptyLessonState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
