import { prisma } from '@/lib/prisma';

/**
 * Shared activity logging — called from every place a user does
 * something worth counting toward their streak: completing a lesson,
 * saving a lab result, saving a tool calculation, submitting a quiz
 * attempt. One place, so the streak calculation in
 * `lib/queries/dashboard.ts` has one consistent source of "did
 * something today" rather than four different routes each deciding
 * independently whether their action counts.
 */

export type ActivityType = 'lesson_completed' | 'lab_result_saved' | 'tool_result_saved' | 'quiz_attempted';

export async function logActivityEvent(userId: string, type: ActivityType, metadata?: Record<string, unknown>) {
  return prisma.activityEvent.create({
    data: { userId, type, metadata: metadata ?? undefined },
  });
}
