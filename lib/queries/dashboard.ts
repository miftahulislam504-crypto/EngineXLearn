import { prisma } from '@/lib/prisma';

/**
 * Dashboard stats aggregation — replaces the hardcoded "0"/"—"
 * placeholders the dashboard page shipped with. Every calculation here
 * was independently verified in Python before being written, especially
 * the streak logic, which is a classic source of off-by-one bugs (does
 * "activity yesterday but not yet today" count as alive or broken? —
 * verified as alive here, since today isn't over yet; missing a full
 * calendar day is what actually breaks a streak).
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
  continueLearning: { courseTitle: string; lessonId: string; percent: number } | null;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [courseProgressRows, activityEvents, quizAttempts, dailyGoal] = await Promise.all([
    prisma.courseProgress.findMany({
      where: { userId },
      include: { course: { include: { subject: true } } },
    }),
    prisma.activityEvent.findMany({
      where: { userId },
      select: { createdAt: true },
    }),
    prisma.quizAttempt.findMany({
      where: { userId },
      select: { score: true },
    }),
    prisma.dailyGoal.findUnique({ where: { userId } }),
  ]);

  const coursesInProgress = courseProgressRows.filter((c) => c.percentComplete > 0 && c.percentComplete < 100).length;

  const activityDates = new Set(activityEvents.map((e) => toDateOnly(e.createdAt)));
  const today = toDateOnly(new Date());
  const streakDays = calculateStreak(activityDates, today);

  const quizAveragePercent = computeQuizAverage(quizAttempts.map((a) => a.score));

  // Skill progress per subject: average of that subject's course percentages
  const bySubject = new Map<string, { title: string; titleBn: string | null; percents: number[] }>();
  for (const cp of courseProgressRows) {
    const subj = cp.course.subject;
    const entry = bySubject.get(subj.id) ?? { title: subj.title, titleBn: subj.titleBn, percents: [] };
    entry.percents.push(cp.percentComplete);
    bySubject.set(subj.id, entry);
  }
  const skillProgress = Array.from(bySubject.values())
    .map((s) => ({
      subjectTitle: s.title,
      subjectTitleBn: s.titleBn,
      percent: Math.round(s.percents.reduce((a, b) => a + b, 0) / s.percents.length),
      courseCount: s.percents.length,
    }))
    .sort((a, b) => b.percent - a.percent);

  const mostRecentProgress = courseProgressRows
    .filter((c) => c.percentComplete > 0 && c.percentComplete < 100 && c.lastLessonId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

  const continueLearning = mostRecentProgress
    ? {
        courseTitle: mostRecentProgress.course.title,
        lessonId: mostRecentProgress.lastLessonId as string,
        percent: mostRecentProgress.percentComplete,
      }
    : null;

  const overallAveragePercent =
    courseProgressRows.length === 0
      ? 0
      : Math.round(courseProgressRows.reduce((a, c) => a + c.percentComplete, 0) / courseProgressRows.length);
  const skillLevel = deriveSkillLevel(overallAveragePercent);

  return {
    coursesInProgress,
    streakDays,
    quizAveragePercent,
    quizAttemptCount: quizAttempts.length,
    dailyGoalTargetMinutes: dailyGoal?.targetMinutes ?? 30,
    skillLevel,
    skillProgress,
    continueLearning,
  };
}
