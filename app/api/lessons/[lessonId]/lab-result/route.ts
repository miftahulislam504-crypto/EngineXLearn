import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';
import { logActivityEvent } from '@/lib/queries/activity';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { inputData, results } = await request.json();

  if (inputData === undefined || results === undefined) {
    return NextResponse.json({ error: 'Missing inputData or results' }, { status: 400 });
  }

  const labResult = await prisma.labResult.create({
    data: {
      userId: user.id,
      lessonId: params.lessonId,
      inputData,
      results,
    },
  });
  await logActivityEvent(user.id, 'lab_result_saved', { lessonId: params.lessonId });

  return NextResponse.json({ status: 'ok', labResult });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const results = await prisma.labResult.findMany({
    where: { userId: user.id, lessonId: params.lessonId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({ results });
}
