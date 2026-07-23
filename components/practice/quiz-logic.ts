/**
 * Practice & Exam System (Part 14) — scoring logic. Three question
 * types this phase: MCQ and Numerical are auto-graded; CQ (Creative
 * Questions — the standard Bangladesh curriculum format: a stimulus
 * followed by knowledge/comprehension/application/higher-order-thinking
 * sub-parts) is self-reviewed against a shown model answer, since
 * free-text grading isn't something this can auto-check reliably.
 * Viva/Interview question banks and Mock Test bundling are a natural
 * next addition, not built this phase — see the README.
 */

export type QuestionType = 'mcq' | 'numerical' | 'cq';

export interface McqAnswer {
  kind: 'mcq';
  correctChoiceIds: string[]; // single-select: one id; multi-select: several
}

export interface NumericalAnswer {
  kind: 'numerical';
  value: number;
  tolerancePercent: number;
  unit?: string;
}

export interface CqAnswer {
  kind: 'cq';
  modelAnswer: string;
}

export type QuestionAnswer = McqAnswer | NumericalAnswer | CqAnswer;

const EPS = 1e-9;

export function checkMcqAnswer(userChoiceIds: string[], correct: McqAnswer): boolean {
  if (userChoiceIds.length !== correct.correctChoiceIds.length) return false;
  const sortedUser = [...userChoiceIds].sort();
  const sortedCorrect = [...correct.correctChoiceIds].sort();
  return sortedUser.every((id, i) => id === sortedCorrect[i]);
}

export function checkNumericalAnswer(userValue: number | null, correct: NumericalAnswer): boolean {
  if (userValue === null || !Number.isFinite(userValue)) return false;
  if (correct.value === 0) return Math.abs(userValue) < 1e-9;
  const diffPercent = Math.abs((userValue - correct.value) / correct.value) * 100;
  return diffPercent <= correct.tolerancePercent + EPS;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  choices?: { id: string; text: string }[];
  answer: QuestionAnswer;
}

export type UserAnswer =
  | { type: 'mcq'; choiceIds: string[] }
  | { type: 'numerical'; value: number | null }
  | { type: 'cq'; selfMarkedCorrect: boolean | null }; // null = not yet self-reviewed

export interface QuestionResult {
  questionId: string;
  type: QuestionType;
  autoGraded: boolean;
  correct: boolean | null; // null for CQ before self-review
}

export interface QuizScoreResult {
  autoGradableCount: number;
  autoGradedCorrectCount: number;
  scorePercent: number | null; // null when there are zero auto-gradable questions
  questionResults: QuestionResult[];
}

export function computeQuizScore(questions: QuizQuestion[], userAnswers: Map<string, UserAnswer>): QuizScoreResult {
  const questionResults: QuestionResult[] = [];
  let autoGradableCount = 0;
  let autoGradedCorrectCount = 0;

  for (const q of questions) {
    const ua = userAnswers.get(q.id);

    if (q.type === 'mcq' && q.answer.kind === 'mcq') {
      autoGradableCount++;
      const userChoiceIds = ua && ua.type === 'mcq' ? ua.choiceIds : [];
      const correct = checkMcqAnswer(userChoiceIds, q.answer);
      if (correct) autoGradedCorrectCount++;
      questionResults.push({ questionId: q.id, type: q.type, autoGraded: true, correct });
    } else if (q.type === 'numerical' && q.answer.kind === 'numerical') {
      autoGradableCount++;
      const userValue = ua && ua.type === 'numerical' ? ua.value : null;
      const correct = checkNumericalAnswer(userValue, q.answer);
      if (correct) autoGradedCorrectCount++;
      questionResults.push({ questionId: q.id, type: q.type, autoGraded: true, correct });
    } else {
      // CQ — self-reviewed, not counted in the auto-graded score
      const selfMarked = ua && ua.type === 'cq' ? ua.selfMarkedCorrect : null;
      questionResults.push({ questionId: q.id, type: q.type, autoGraded: false, correct: selfMarked });
    }
  }

  const scorePercent = autoGradableCount > 0 ? Math.round((autoGradedCorrectCount / autoGradableCount) * 100) : null;

  return { autoGradableCount, autoGradedCorrectCount, scorePercent, questionResults };
}

/** Seconds remaining in a timed quiz, clamped to [0, totalSeconds] so
 * clock skew or a stale timestamp can't produce a negative or
 * over-long countdown. */
export function timeRemainingSeconds(totalSeconds: number, startedAtEpochMs: number, nowEpochMs: number): number {
  const elapsedSeconds = (nowEpochMs - startedAtEpochMs) / 1000;
  const remaining = totalSeconds - elapsedSeconds;
  return Math.max(0, Math.min(totalSeconds, Math.round(remaining)));
}
