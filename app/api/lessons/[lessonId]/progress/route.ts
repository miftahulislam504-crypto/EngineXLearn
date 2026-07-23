import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/current-user';
import { markLessonComplete, markLessonIncomplete } from '@/lib/queries/learning';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { completed } = await request.json();

  const result = completed
    ? await markLessonComplete(user.id, params.lessonId)
    : await markLessonIncomplete(user.id, params.lessonId);

  return NextResponse.json({ status: 'ok', progress: result });
}
