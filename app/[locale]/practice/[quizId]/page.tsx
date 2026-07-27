'use client';

import { Link } from '@/components/i18n/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { getQuizById } from '@/lib/content';
import { useDictionary } from '@/lib/i18n/dictionary-context';
import { useAuth } from '@/lib/auth-context';
import { QuizTaking, type QuizData } from '@/components/practice/quiz-taking';
import type { QuestionType, QuestionAnswer } from '@/components/practice/quiz-logic';

export default function QuizDetailPage({
  params,
}: {
  params: { quizId: string };
}) {
  const dict = useDictionary();
  const { user } = useAuth();

  const quiz = getQuizById(params.quizId);
  if (!quiz) notFound();

  // Content data stores `answer` as a loosely-typed Record — cast at this
  // one boundary (right where the static quiz data is read) rather than
  // trusting the shape implicitly everywhere the question data gets used
  // downstream.
  const quizData: QuizData = {
    id: quiz.id,
    title: quiz.title,
    category: quiz.category,
    timedSeconds: quiz.timedSeconds ?? null,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      type: q.type as QuestionType,
      prompt: q.prompt,
      choices: q.choices ?? undefined,
      answer: q.answer as unknown as QuestionAnswer,
    })),
  };

  return (
    <AppShell>
      <main className="container max-w-2xl py-10 md:py-14">
        <Link
          href="/practice"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {dict.practice.backToPractice}
        </Link>

        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">{quiz.title}</h1>

        <QuizTaking quiz={quizData} loggedIn={!!user} />
      </main>
    </AppShell>
  );
}
