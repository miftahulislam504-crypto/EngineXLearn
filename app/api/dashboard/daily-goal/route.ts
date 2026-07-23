import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const goal = await prisma.dailyGoal.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ targetMinutes: goal?.targetMinutes ?? 30 });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { targetMinutes } = await request.json();
  if (typeof targetMinutes !== 'number' || targetMinutes <= 0) {
    return NextResponse.json({ error: 'targetMinutes must be a positive number' }, { status: 400 });
  }

  const goal = await prisma.dailyGoal.upsert({
    where: { userId: user.id },
    update: { targetMinutes },
    create: { userId: user.id, targetMinutes },
  });

  return NextResponse.json({ status: 'ok', goal });
}
