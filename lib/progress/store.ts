'use client';

/**
 * All user progress — lesson completion, course %, lab/tool results, quiz
 * attempts, daily goal, activity streak — lives in the browser's
 * localStorage, scoped per signed-in user (see keyFor below). There is no
 * server database: Firebase here is Auth only (see lib/auth-context.tsx),
 * and every course/quiz in lib/content/ is a hardcoded, read-only
 * catalog. That means progress does NOT sync across devices or survive a
 * cleared browser — it's genuinely local, not a cache of something
 * server-side.
 *
 * Every read/write function in this file is guarded for SSR: Next.js
 * renders pages on the server first, where `window`/`localStorage` don't
 * exist, so every function checks `typeof window === 'undefined'` and
 * returns an empty/default value rather than throwing. Callers should
 * only read real values inside a `useEffect` (i.e. after mount, client-
 * side) — see hooks.ts for the React hook wrapper that does this.
 */

const STORAGE_VERSION = 1;

function storageKey(uid: string, bucket: string): string {
  return `civillearn:v${STORAGE_VERSION}:${uid}:${bucket}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — progress
    // silently doesn't persist rather than crashing the app.
  }
}

// ---------------------------------------------------------------------------
// Lesson / course progress
// ---------------------------------------------------------------------------

export interface LessonProgressMap {
  [lessonId: string]: { completed: boolean; completedAt: string | null };
}

export function getLessonProgress(uid: string): LessonProgressMap {
  return readJson(storageKey(uid, 'lessonProgress'), {});
}

export function setLessonComplete(uid: string, lessonId: string, completed: boolean): void {
  const map = getLessonProgress(uid);
  map[lessonId] = { completed, completedAt: completed ? new Date().toISOString() : null };
  writeJson(storageKey(uid, 'lessonProgress'), map);
  if (completed) logActivity(uid, 'lesson_completed', { lessonId });
}

export function isLessonComplete(uid: string, lessonId: string): boolean {
  return getLessonProgress(uid)[lessonId]?.completed ?? false;
}

export function getCompletedLessonIds(uid: string): Set<string> {
  const map = getLessonProgress(uid);
  return new Set(Object.keys(map).filter((id) => map[id].completed));
}

/** Percent complete for a course, computed from its actual lesson count —
 * not stored separately, so it can never drift out of sync with the
 * lesson-level completion records above. */
export function getCourseProgressPercent(uid: string, allLessonIdsInCourse: string[]): number {
  if (allLessonIdsInCourse.length === 0) return 0;
  const completed = getCompletedLessonIds(uid);
  const completedCount = allLessonIdsInCourse.filter((id) => completed.has(id)).length;
  return Math.round((completedCount / allLessonIdsInCourse.length) * 100);
}

// ---------------------------------------------------------------------------
// Lab results
// ---------------------------------------------------------------------------

export interface LabResult {
  id: string;
  lessonId: string;
  inputData: unknown;
  results: unknown;
  createdAt: string;
}

export function getLabResults(uid: string, lessonId?: string): LabResult[] {
  const all = readJson<LabResult[]>(storageKey(uid, 'labResults'), []);
  return lessonId ? all.filter((r) => r.lessonId === lessonId) : all;
}

export function saveLabResult(uid: string, lessonId: string, inputData: unknown, results: unknown): LabResult {
  const all = readJson<LabResult[]>(storageKey(uid, 'labResults'), []);
  const entry: LabResult = {
    id: `lab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    lessonId,
    inputData,
    results,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  writeJson(storageKey(uid, 'labResults'), all.slice(0, 200)); // cap history so storage can't grow unbounded
  logActivity(uid, 'lab_result_saved', { lessonId });
  return entry;
}

// ---------------------------------------------------------------------------
// Tool results
// ---------------------------------------------------------------------------

export interface ToolResult {
  id: string;
  toolSlug: string;
  inputData: unknown;
  results: unknown;
  createdAt: string;
}

export function getToolResults(uid: string, toolSlug?: string): ToolResult[] {
  const all = readJson<ToolResult[]>(storageKey(uid, 'toolResults'), []);
  return toolSlug ? all.filter((r) => r.toolSlug === toolSlug) : all;
}

export function saveToolResult(uid: string, toolSlug: string, inputData: unknown, results: unknown): ToolResult {
  const all = readJson<ToolResult[]>(storageKey(uid, 'toolResults'), []);
  const entry: ToolResult = {
    id: `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    toolSlug,
    inputData,
    results,
    createdAt: new Date().toISOString(),
  };
  all.unshift(entry);
  writeJson(storageKey(uid, 'toolResults'), all.slice(0, 200));
  logActivity(uid, 'tool_result_saved', { toolSlug });
  return entry;
}

// ---------------------------------------------------------------------------
// Quiz attempts
// ---------------------------------------------------------------------------

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  answers: unknown;
  startedAt: string;
  finishedAt: string;
}

export function getQuizAttempts(uid: string): QuizAttempt[] {
  return readJson<QuizAttempt[]>(storageKey(uid, 'quizAttempts'), []);
}

export function saveQuizAttempt(uid: string, quizId: string, score: number, answers: unknown): QuizAttempt {
  const all = getQuizAttempts(uid);
  const now = new Date().toISOString();
  const entry: QuizAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    quizId,
    score,
    answers,
    startedAt: now,
    finishedAt: now,
  };
  all.unshift(entry);
  writeJson(storageKey(uid, 'quizAttempts'), all.slice(0, 200));
  logActivity(uid, 'quiz_attempted', { quizId, score });
  return entry;
}

// ---------------------------------------------------------------------------
// Daily goal
// ---------------------------------------------------------------------------

const DEFAULT_DAILY_GOAL_MINUTES = 30;

export function getDailyGoalMinutes(uid: string): number {
  return readJson(storageKey(uid, 'dailyGoal'), DEFAULT_DAILY_GOAL_MINUTES);
}

export function setDailyGoalMinutes(uid: string, minutes: number): void {
  writeJson(storageKey(uid, 'dailyGoal'), minutes);
}

// ---------------------------------------------------------------------------
// Activity log (streak calculation)
// ---------------------------------------------------------------------------

export type ActivityType = 'lesson_completed' | 'lab_result_saved' | 'tool_result_saved' | 'quiz_attempted';

interface ActivityEvent {
  type: ActivityType;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

function logActivity(uid: string, type: ActivityType, metadata?: Record<string, unknown>): void {
  const all = readJson<ActivityEvent[]>(storageKey(uid, 'activity'), []);
  all.push({ type, metadata: metadata ?? null, createdAt: new Date().toISOString() });
  // Activity log only needs to cover the current streak window — capping
  // at 400 events keeps storage bounded without ever realistically
  // truncating a real streak (400 events is well over a year of daily use).
  writeJson(storageKey(uid, 'activity'), all.slice(-400));
}

export function getActivityDates(uid: string): Set<string> {
  const all = readJson<ActivityEvent[]>(storageKey(uid, 'activity'), []);
  return new Set(all.map((e) => e.createdAt.slice(0, 10))); // YYYY-MM-DD
}
