'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  computeQuizScore,
  timeRemainingSeconds,
  type QuizQuestion,
  type UserAnswer,
} from './quiz-logic';
import { useDictionary } from '@/lib/i18n/dictionary-context';

export interface QuizData {
  id: string;
  title: string;
  category: string;
  timedSeconds: number | null;
  questions: QuizQuestion[];
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function QuizTaking({ quiz, loggedIn }: { quiz: QuizData; loggedIn: boolean }) {
  const dict = useDictionary();
  const t = dict.practice;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const startedAtRef = useRef(Date.now());
  const [nowTick, setNowTick] = useState(Date.now());

  const isTimed = quiz.timedSeconds !== null && quiz.timedSeconds > 0;
  const secondsRemaining = useMemo(
    () => (isTimed ? timeRemainingSeconds(quiz.timedSeconds as number, startedAtRef.current, nowTick) : null),
    [isTimed, quiz.timedSeconds, nowTick]
  );

  const currentQuestion = quiz.questions[currentIdx];
  const isLast = currentIdx === quiz.questions.length - 1;

  const scoreResult = useMemo(() => computeQuizScore(quiz.questions, answers), [quiz.questions, answers]);

  const submit = useCallback(async () => {
    setSubmitted(true);
    if (!loggedIn) return;
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.fromEntries(answers),
          score: scoreResult.scorePercent,
        }),
      });
      if (!res.ok) setSaveError(t.saveError);
    } catch {
      setSaveError(t.saveError);
    } finally {
      setSaving(false);
    }
  }, [loggedIn, quiz.id, answers, scoreResult.scorePercent, t.saveError]);

  useEffect(() => {
    if (!isTimed || submitted) return;
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isTimed, submitted]);

  useEffect(() => {
    if (isTimed && secondsRemaining === 0 && !submitted) {
      submit();
    }
  }, [isTimed, secondsRemaining, submitted, submit]);

  const setMcqAnswer = (choiceIds: string[]) => {
    setAnswers((prev) => new Map(prev).set(currentQuestion.id, { type: 'mcq', choiceIds }));
  };
  const setNumericalAnswer = (value: number | null) => {
    setAnswers((prev) => new Map(prev).set(currentQuestion.id, { type: 'numerical', value }));
  };
  const setCqSelfMark = (correct: boolean) => {
    setAnswers((prev) => new Map(prev).set(currentQuestion.id, { type: 'cq', selfMarkedCorrect: correct }));
  };

  if (submitted) {
    return <QuizResults quiz={quiz} scoreResult={scoreResult} saving={saving} saveError={saveError} />;
  }

  const answer = answers.get(currentQuestion.id);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            {t.questionProgress(currentIdx + 1, quiz.questions.length)}
          </p>
          {isTimed && secondsRemaining !== null && (
            <p
              className={cn(
                'flex items-center gap-1.5 font-mono text-xs',
                secondsRemaining <= 30 ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              {formatTime(secondsRemaining)}
            </p>
          )}
        </div>
        <Progress value={((currentIdx + 1) / quiz.questions.length) * 100} />
      </div>

      <div className="p-4">
        <p className="mb-4 text-sm leading-relaxed">{currentQuestion.prompt}</p>

        {currentQuestion.type === 'mcq' && currentQuestion.choices && (
          <div className="space-y-2">
            {currentQuestion.choices.map((choice) => {
              const selected = answer && answer.type === 'mcq' && answer.choiceIds.includes(choice.id);
              return (
                <button
                  key={choice.id}
                  onClick={() => setMcqAnswer([choice.id])}
                  className={cn(
                    'w-full rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors',
                    selected
                      ? 'border-oxide-500 bg-oxide-500/10 text-oxide-600 dark:text-oxide-400'
                      : 'border-border hover:bg-muted'
                  )}
                >
                  {choice.text}
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion.type === 'numerical' && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={answer && answer.type === 'numerical' && answer.value !== null ? answer.value : ''}
              onChange={(e) => setNumericalAnswer(e.target.value === '' ? null : parseFloat(e.target.value))}
              placeholder={t.numericalPlaceholder}
              className="h-10 w-40 rounded-md border border-input bg-background px-3 font-mono text-sm"
            />
            {currentQuestion.answer.kind === 'numerical' && currentQuestion.answer.unit && (
              <span className="font-mono text-xs text-muted-foreground">{currentQuestion.answer.unit}</span>
            )}
          </div>
        )}

        {currentQuestion.type === 'cq' && currentQuestion.answer.kind === 'cq' && (
          <CqQuestionBlock
            modelAnswer={currentQuestion.answer.modelAnswer}
            selfMarked={answer && answer.type === 'cq' ? answer.selfMarkedCorrect : null}
            onSelfMark={setCqSelfMark}
            t={t}
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          {t.previous}
        </button>
        {isLast ? (
          <button
            onClick={submit}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-oxide-500 px-3.5 text-xs font-medium text-white transition-colors hover:bg-oxide-600"
          >
            {t.submitQuiz}
          </button>
        ) : (
          <button
            onClick={() => setCurrentIdx((i) => Math.min(quiz.questions.length - 1, i + 1))}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-3 text-xs font-medium transition-colors hover:bg-muted"
          >
            {t.next}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function CqQuestionBlock({
  modelAnswer,
  selfMarked,
  onSelfMark,
  t,
}: {
  modelAnswer: string;
  selfMarked: boolean | null;
  onSelfMark: (correct: boolean) => void;
  t: any;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <textarea
        placeholder={t.cqPlaceholder}
        rows={4}
        className="w-full rounded-md border border-input bg-background p-3 text-sm"
      />
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="mt-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          {t.revealModelAnswer}
        </button>
      ) : (
        <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
          <p className="mb-1 font-mono text-[11px] font-medium text-muted-foreground">{t.modelAnswerLabel}</p>
          <p className="mb-3 text-sm leading-relaxed">{modelAnswer}</p>
          <p className="mb-2 font-mono text-[11px] text-muted-foreground">{t.selfMarkPrompt}</p>
          <div className="flex gap-2">
            <button
              onClick={() => onSelfMark(true)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                selfMarked === true ? 'border-steel-500 bg-steel-500/10 text-steel-600' : 'border-border hover:bg-muted'
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t.selfMarkCorrect}
            </button>
            <button
              onClick={() => onSelfMark(false)}
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                selfMarked === false ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border hover:bg-muted'
              )}
            >
              <XCircle className="h-3.5 w-3.5" />
              {t.selfMarkIncorrect}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizResults({
  quiz,
  scoreResult,
  saving,
  saveError,
}: {
  quiz: QuizData;
  scoreResult: ReturnType<typeof computeQuizScore>;
  saving: boolean;
  saveError: string | null;
}) {
  const dict = useDictionary();
  const t = dict.practice;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="font-display text-sm font-semibold">{t.resultsTitle}</p>
      </div>
      <div className="p-4">
        {scoreResult.scorePercent !== null ? (
          <div className="text-center">
            <p className="font-display text-3xl font-semibold">{scoreResult.scorePercent}%</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {t.scoreDetail(scoreResult.autoGradedCorrectCount, scoreResult.autoGradableCount)}
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">{t.noAutoGradableQuestions}</p>
        )}

        <div className="mt-5 space-y-2">
          {scoreResult.questionResults.map((r, i) => (
            <div key={r.questionId} className="flex items-center gap-2.5 rounded-md border border-border p-2.5 text-sm">
              {r.autoGraded ? (
                r.correct ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-steel-500" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                )
              ) : r.correct === null ? (
                <HelpCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : r.correct ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-steel-500" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0 text-destructive" />
              )}
              <span className="text-muted-foreground">{t.questionLabel(i + 1)}</span>
            </div>
          ))}
        </div>

        {saveError && <p className="mt-3 font-mono text-xs text-destructive">{saveError}</p>}
        {saving && <p className="mt-3 font-mono text-xs text-muted-foreground">{t.saving}</p>}
      </div>
    </div>
  );
}
