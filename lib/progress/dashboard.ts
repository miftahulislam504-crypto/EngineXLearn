'use client';

import { ALL_COURSES, getSubjectBySlug, type Course } from '@/lib/content';
import {
  getCompletedLessonIds,
  getQuizAttempts,
  getActivityDates,
  getDailyGoalMinutes,
  getLabResults,
  getToolResults,
} from '@/lib/progress/store';

/**
 * Dashboard stats aggregation — client-side equivalent of the old,
 * now-deleted lib/queries/dashboard.ts (which read Prisma). The pure
 * calculation functions below (calculateStreak, computeCoursePercent,
 * computeQuizAverage, computeDailyGoalProgress, deriveSkillLevel) are
 * unchanged from that version, verified math doesn't depend on where
 * the underlying rows came from. Only getDashboardStats itself changed,
 * from async Prisma queries to synchronous localStorage/content reads.
 */

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD, UTC calendar day
}

/** Consecutive-day streak ending at the most recent activity day. Zero
 * if there's no activity, or if the most recent activity is more than
 * one calendar day old (streak broken by a missed day). */
export function calculateStreak(activityDates: Set<string>, today: string): number {
  if (activityDates.size === 0) return 0;

  const sortedDates = Array.from(activityDates).sort();
  const mostRecent = sortedDates[sortedDates.length - 1];

  const daysSinceLastActivity = Math.round(
    (Date.parse(today) - Date.parse(mostRecent)) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceLastActivity > 1) return 0;

  let streak = 0;
  let cursor = mostRecent;
  while (activityDates.has(cursor)) {
    streak++;
    const prev = new Date(Date.parse(cursor) - 24 * 60 * 60 * 1000);
    cursor = toDateOnly(prev);
  }
  return streak;
}

export function computeCoursePercent(completedLessonCount: number, totalLessonCount: number): number {
  if (totalLessonCount === 0) return 0;
  return Math.round((completedLessonCount / totalLessonCount) * 100);
}

export function computeQuizAverage(scores: (number | null)[]): number | null {
  const valid = scores.filter((s): s is number => s !== null);
  if (valid.length === 0) return null;
  return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
}

export function computeDailyGoalProgress(minutesToday: number, targetMinutes: number): number {
  if (targetMinutes <= 0) return 0;
  return Math.min(100, Math.round((minutesToday / targetMinutes) * 100));
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

/** A simple, stated derivation — not a blueprint-specified algorithm —
 * from average progress across all courses the user has touched:
 * under 20% average = beginner, 20-59% = intermediate, 60%+ = advanced. */
export function deriveSkillLevel(averagePercent: number): SkillLevel {
  if (averagePercent >= 60) return 'advanced';
  if (averagePercent >= 20) return 'intermediate';
  return 'beginner';
}

export interface DashboardStats {
  coursesInProgress: number;
  streakDays: number;
  quizAveragePercent: number | null;
  quizAttemptCount: number;
  dailyGoalTargetMinutes: number;
  skillLevel: SkillLevel;
  skillProgress: { subjectTitle: string; subjectTitleBn: string | null; percent: number; courseCount: number }[];
  continueLearning: { courseTitle: string; courseSlug: string; lessonId: string; percent: number } | null;
}

function courseLessonIds(course: Course): string[] {
  return course.modules.flatMap((m) => m.lessons.map((l) => l.id));
}

export function getDashboardStats(uid: string): DashboardStats {
  const completedLessonIds = getCompletedLessonIds(uid);

  const courseStats = ALL_COURSES.map((course) => {
    const lessonIds = courseLessonIds(course);
    const completedCount = lessonIds.filter((id) => completedLessonIds.has(id)).length;
    const percent = computeCoursePercent(completedCount, lessonIds.length);
    return { course, percent, completedCount, totalCount: lessonIds.length };
  });

  const touchedCourses = courseStats.filter((c) => c.completedCount > 0);
  const coursesInProgress = touchedCourses.filter((c) => c.percent > 0 && c.percent < 100).length;

  const activityDates = getActivityDates(uid);
  const today = toDateOnly(new Date());
  const streakDays = calculateStreak(activityDates, today);

  const attempts = getQuizAttempts(uid);
  const quizAveragePercent = computeQuizAverage(attempts.map((a) => a.score));

  // Skill progress grouped by subject — average of that subject's touched-course percentages.
  const percentsBySubjectSlug = new Map<string, number[]>();
  for (const cs of touchedCourses) {
    const list = percentsBySubjectSlug.get(cs.course.subjectSlug) ?? [];
    list.push(cs.percent);
    percentsBySubjectSlug.set(cs.course.subjectSlug, list);
  }

  const skillProgress = Array.from(percentsBySubjectSlug.entries())
    .map(([subjectSlug, percents]) => {
      const subject = getSubjectBySlug(subjectSlug);
      return {
        subjectTitle: subject?.title ?? subjectSlug,
        subjectTitleBn: subject?.titleBn ?? null,
        percent: Math.round(percents.reduce((a, b) => a + b, 0) / percents.length),
        courseCount: percents.length,
      };
    })
    .sort((a, b) => b.percent - a.percent);

  const mostRecentTouched = touchedCourses.filter((c) => c.percent > 0 && c.percent < 100)[0];
  const continueLearning = mostRecentTouched
    ? {
        courseTitle: mostRecentTouched.course.title,
        courseSlug: mostRecentTouched.course.slug,
        lessonId:
          mostRecentTouched.course.modules
            .flatMap((m) => m.lessons)
            .find((l) => !completedLessonIds.has(l.id))?.id ??
          mostRecentTouched.course.modules[0]?.lessons[0]?.id ??
          '',
        percent: mostRecentTouched.percent,
      }
    : null;

  const overallAveragePercent =
    touchedCourses.length === 0
      ? 0
      : Math.round(touchedCourses.reduce((a, c) => a + c.percent, 0) / touchedCourses.length);
  const skillLevel = deriveSkillLevel(overallAveragePercent);

  return {
    coursesInProgress,
    streakDays,
    quizAveragePercent,
    quizAttemptCount: attempts.length,
    dailyGoalTargetMinutes: getDailyGoalMinutes(uid),
    skillLevel,
    skillProgress,
    continueLearning,
  };
}

// ---------------------------------------------------------------------------
// Recent activity feed (Profile System, blueprint Part 20)
// ---------------------------------------------------------------------------

/**
 * Unified recent-activity feed across lab results, tool results, and quiz
 * attempts — the same "merge every real source, don't build a parallel
 * per-source UI" approach unifiedSearch (Part 21) already took. Returns
 * structure only (type, key, lessonId, timestamp) with no display text:
 * the Profile page resolves each item's title (lesson/tool/quiz name)
 * itself, since that's presentation, not data, and titles need the
 * localized dictionary this file has no access to.
 *
 * This is also what finally gives getLabResults/getToolResults a real
 * reader — both were previously write-only (every lab/tool save called
 * them, but nothing ever read the results back for display).
 */
export interface RecentActivityItem {
  type: 'lab' | 'tool' | 'quiz';
  /** lessonId for a lab result, toolSlug for a tool result, quizId for a quiz attempt. */
  key: string;
  createdAt: string;
}

export function getRecentActivity(uid: string, limit = 6): RecentActivityItem[] {
  const labs: RecentActivityItem[] = getLabResults(uid).map((r) => ({
    type: 'lab',
    key: r.lessonId,
    createdAt: r.createdAt,
  }));
  const tools: RecentActivityItem[] = getToolResults(uid).map((r) => ({
    type: 'tool',
    key: r.toolSlug,
    createdAt: r.createdAt,
  }));
  const quizzes: RecentActivityItem[] = getQuizAttempts(uid).map((r) => ({
    type: 'quiz',
    key: r.quizId,
    createdAt: r.finishedAt,
  }));

  return [...labs, ...tools, ...quizzes]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
