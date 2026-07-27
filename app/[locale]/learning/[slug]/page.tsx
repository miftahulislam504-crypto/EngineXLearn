'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PlayCircle, FileText, FlaskConical, MonitorPlay, CheckCircle2, Circle } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { getCourseBySlug, getSubjectBySlug } from '@/lib/content';
import { getCompletedLessonIds } from '@/lib/progress/store';
import { useAuth } from '@/lib/auth-context';
import { useDictionary, useLocale } from '@/lib/i18n/dictionary-context';
import { localize } from '@/lib/i18n/localize-content';

const CONTENT_ICONS = {
  video: MonitorPlay,
  interactive: PlayCircle,
  reading: FileText,
  lab: FlaskConical,
} as const;

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const dict = useDictionary();
  const locale = useLocale();
  const { user } = useAuth();

  const course = getCourseBySlug(params.slug);

  // Completion state is only knowable client-side (localStorage), so it
  // starts empty and fills in after mount — the same "server renders
  // logged-out, client hydrates with real state" pattern used by
  // MarkCompleteButton and every lab/tool save flow.
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) setCompletedLessonIds(getCompletedLessonIds(user.uid));
  }, [user]);

  if (!course) notFound();

  const subject = getSubjectBySlug(course.subjectSlug);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const firstLesson = course.modules[0]?.lessons[0];
  const percentComplete =
    totalLessons > 0 ? Math.round((completedLessonIds.size / totalLessons) * 100) : 0;

  const subjectTitle = subject ? localize(locale, subject.title, subject.titleBn) : '';
  const courseTitle = localize(locale, course.title, course.titleBn);
  const courseDescription = localize(locale, course.description, null);

  return (
    <AppShell>
      <main className="container max-w-3xl py-10 md:py-14">
        <Link
          href="/learning"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {dict.learning.backToCurriculum}
        </Link>

        <div className="mt-4">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">
            {subjectTitle}
          </span>
          <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight md:text-3xl">
            {courseTitle}
          </h1>
          <p className="mt-2 text-muted-foreground">{courseDescription}</p>

          <div className="mt-5 flex items-center gap-4">
            {firstLesson ? (
              <Link href={`/learning/${course.slug}/${firstLesson.id}`}>
                <Button variant="accent">
                  {completedLessonIds.size > 0
                    ? dict.learning.continueCourse
                    : dict.learning.startCourse}
                </Button>
              </Link>
            ) : (
              <Button variant="accent" disabled>
                {dict.learning.noLessonsYet}
              </Button>
            )}

            {user && totalLessons > 0 && (
              <p className="font-mono text-xs text-muted-foreground">
                {dict.learning.percentComplete(percentComplete, completedLessonIds.size, totalLessons)}
              </p>
            )}
          </div>
        </div>

        <div className="dim-divider my-8" />

        <div className="space-y-8">
          {course.modules.map((module, mIdx) => {
            const moduleTitle = localize(locale, module.title, module.titleBn);

            return (
              <div key={module.id}>
                <h2 className="mb-3 flex items-baseline gap-2 font-display text-base font-semibold tracking-tight">
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(mIdx + 1).padStart(2, '0')}
                  </span>
                  {moduleTitle}
                </h2>

                <ul className="space-y-1.5">
                  {module.lessons.map((lesson) => {
                    const Icon =
                      CONTENT_ICONS[lesson.contentType as keyof typeof CONTENT_ICONS] ?? FileText;
                    const isComplete = completedLessonIds.has(lesson.id);
                    const lessonTitle = localize(locale, lesson.title, lesson.titleBn);

                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/learning/${course.slug}/${lesson.id}`}
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-muted"
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-steel-500" strokeWidth={2} />
                          ) : (
                            <Circle className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                          )}
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
                          <span className="flex-1">{lessonTitle}</span>
                          {lesson.durationMin && (
                            <span className="font-mono text-xs text-muted-foreground">
                              {dict.lesson.minutes(lesson.durationMin)}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}
