import { Link } from '@/components/i18n/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Card, CardContent } from '@/components/ui/card';
import { getAllPublishedCoursesGrouped } from '@/lib/queries/learning';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { localize } from '@/lib/i18n/localize-content';

export const revalidate = 300; // 5 min — subject/course lists change rarely

export default async function LearningPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const subjects = await getAllPublishedCoursesGrouped();

  return (
    <>
      <SiteHeader />
      <main className="container max-w-5xl py-12 md:py-16">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">
            {dict.learning.curriculumEyebrow}
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {dict.learning.curriculumTitle}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {dict.learning.curriculumDescription}
          </p>
        </div>

        <div className="space-y-12">
          {subjects.map((subject) => {
            const subjectTitle = localize(locale, subject.title, subject.titleBn);
            const subjectDescription = localize(locale, subject.description, subject.descriptionBn);

            return (
              <section key={subject.id}>
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold tracking-tight">
                      {subjectTitle}
                    </h2>
                    {subjectDescription && (
                      <p className="mt-1 text-sm text-muted-foreground">{subjectDescription}</p>
                    )}
                  </div>
                  <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                    {dict.learning.courseCount(subject.courses.length)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {subject.courses.map((c) => {
                    const moduleCount = c.modules.length;
                    const courseTitle = localize(locale, c.title, c.titleBn);
                    const courseDescription = localize(locale, c.description, c.descriptionBn);

                    return (
                      <Link key={c.id} href={`/learning/${c.slug}`}>
                        <Card className="group h-full transition-colors hover:border-steel-400/60">
                          <CardContent className="flex items-start gap-3 p-4">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-steel-500">
                              <BookOpen className="h-4 w-4" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-display text-sm font-semibold leading-snug">
                                {courseTitle}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                {courseDescription}
                              </p>
                              <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                                {dict.learning.moduleCount(moduleCount)}
                                {!c.published && ` · ${dict.learning.structureOnly}`}
                              </p>
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
      </main>
      <SiteFooter />
    </>
  );
}
