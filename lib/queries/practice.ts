import { prisma } from '@/lib/prisma';

/**
 * Query layer for the Practice & Exam System (blueprint Part 14),
 * matching the existing `lib/queries/learning.ts` convention — real
 * Prisma queries, no inline `prisma.*` calls scattered through page
 * components.
 */

export async function getAllQuizzesGrouped() {
  const quizzes = await prisma.quiz.findMany({
    include: { _count: { select: { questions: true } } },
    orderBy: { createdAt: 'asc' },
  });

  const grouped = new Map<string, typeof quizzes>();
  for (const quiz of quizzes) {
    const list = grouped.get(quiz.category) ?? [];
    list.push(quiz);
    grouped.set(quiz.category, list);
  }
  return grouped;
}

export async function getQuizById(id: string) {
  return prisma.quiz.findUnique({
    where: { id },
    include: { questions: true },
  });
}

export async function getRecentAttempts(userId: string, take = 10) {
  return prisma.quizAttempt.findMany({
    where: { userId },
    include: { quiz: { select: { title: true, category: true } } },
    orderBy: { startedAt: 'desc' },
    take,
  });
}
