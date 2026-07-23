import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';
import { logActivityEvent } from '@/lib/queries/activity';

export async function POST(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { inputData, results } = await request.json();

  if (inputData === undefined || results === undefined) {
    return NextResponse.json({ error: 'Missing inputData or results' }, { status: 400 });
  }

  const toolResult = await prisma.toolResult.create({
    data: {
      userId: user.id,
      toolSlug: params.toolSlug,
      inputData,
      results,
    },
  });
  await logActivityEvent(user.id, 'tool_result_saved', { toolSlug: params.toolSlug });

  return NextResponse.json({ status: 'ok', toolResult });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { toolSlug: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const results = await prisma.toolResult.findMany({
    where: { userId: user.id, toolSlug: params.toolSlug },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({ results });
}
