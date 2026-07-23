import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';
import { logActivityEvent } from '@/lib/queries/activity';

export async function POST(request: NextRequest, { params }: { params: { quizId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { answers, score } = await request.json();

  if (answers === undefined) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: params.quizId,
      score: typeof score === 'number' ? score : 0,
      answers,
      finishedAt: new Date(),
    },
  });
  await logActivityEvent(user.id, 'quiz_attempted', { quizId: params.quizId, score });

  return NextResponse.json({ status: 'ok', attempt });
}
