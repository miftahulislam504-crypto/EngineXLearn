import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { getQuizById } from '@/lib/queries/practice';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale, DEFAULT_LOCALE, type Locale } from '@/lib/i18n/config';
import { getCurrentUser } from '@/lib/current-user';
import { QuizTaking, type QuizData } from '@/components/practice/quiz-taking';
import type { QuestionType, QuestionAnswer } from '@/components/practice/quiz-logic';

export default async function QuizDetailPage({
  params,
}: {
  params: { quizId: string; locale: string };
}) {
  const locale: Locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  const quiz = await getQuizById(params.quizId);
  if (!quiz) notFound();

  const currentUser = await getCurrentUser();

  // DB rows store `answer` as untyped Json — cast at this one boundary
  // (server-side, right after the query) rather than trusting the shape
  // implicitly everywhere the question data gets used downstream.
  const quizData: QuizData = {
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    timedSeconds: quiz.timedSeconds ?? null,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type as QuestionType,
      prompt: q.prompt,
      choices: (q.choices as { id: string; text: string }[] | null) ?? undefined,
      answer: q.answer as unknown as QuestionAnswer,
    })),
  };

  return (
    <>
      <SiteHeader />
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/practice"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {dict.practice.backToPractice}
        </Link>

        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{quiz.title}</h1>

        <QuizTaking quiz={quizData} loggedIn={!!currentUser} />
      </main>
      <SiteFooter />
    </>
  );
}
