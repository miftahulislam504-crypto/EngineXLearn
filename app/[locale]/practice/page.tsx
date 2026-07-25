import { Link } from '@/components/i18n/link';
import { ChevronRight, HelpCircle, Clock } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Card, CardContent } from '@/components/ui/card';
import { getAllQuizzesGrouped } from '@/lib/queries/practice';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';

// Rendered on request instead of at build time: the build environment has
// no DATABASE_URL, so a build-time fetch of this Prisma query fails the
// Vercel build. Runtime requests use the real DATABASE_URL and are fine.
export const dynamic = 'force-dynamic';

export default async function PracticePage({ params }: { params: { locale: string } }) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const t = dict.practice;

  const grouped = await getAllQuizzesGrouped();
  const categories = Array.from(grouped.keys());

  return (
    <>
      <SiteHeader />
      <main className="container max-w-5xl py-12 md:py-16">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-wider text-steel-500">{t.eyebrow}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">{t.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{t.pageDescription}</p>
        </div>

        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">{t.noQuizzesYet}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">{category}</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(grouped.get(category) ?? []).map((quiz) => (
                    <Link key={quiz.id} href={`/practice/${quiz.id}`}>
                      <Card className="group h-full transition-colors hover:border-steel-400/60">
                        <CardContent className="p-4">
                          <p className="font-display text-sm font-semibold leading-snug">{quiz.title}</p>
                          <div className="mt-2 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                            <span>{t.questionCount(quiz._count.questions)}</span>
                            {quiz.timedSeconds && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.round(quiz.timedSeconds / 60)} {t.minutesUnit}
                              </span>
                            )}
                            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
