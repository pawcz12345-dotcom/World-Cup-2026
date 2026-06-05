import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

// GET: return all tiebreaker orders for current user as { [groupId]: string[] }
export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await prisma.tiebreakerPick.findMany({ where: { userId: user.userId } });
  const picks: Record<string, string[]> = {};
  for (const row of rows) {
    try {
      picks[row.groupId] = JSON.parse(row.teamOrder) as string[];
    } catch {
      // skip malformed rows
    }
  }
  return NextResponse.json({ picks });
}

// DELETE: clear all tiebreaker picks for current user
export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.tiebreakerPick.deleteMany({ where: { userId: user.userId } });
  return NextResponse.json({ ok: true });
}

// POST: upsert a tiebreaker order for one group
// Body: { groupId: string; teamOrder: string[] }
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { groupId, teamOrder } = (await request.json()) as { groupId: string; teamOrder: string[] };

    if (!groupId || !Array.isArray(teamOrder))
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    await prisma.tiebreakerPick.upsert({
      where: { userId_groupId: { userId: user.userId, groupId } },
      update: { teamOrder: JSON.stringify(teamOrder) },
      create: { userId: user.userId, groupId, teamOrder: JSON.stringify(teamOrder) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Save tiebreaker error:', err);
    return NextResponse.json({ error: 'Failed to save tiebreaker' }, { status: 500 });
  }
}
