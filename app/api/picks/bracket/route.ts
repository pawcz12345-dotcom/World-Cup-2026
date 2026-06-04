import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { BRACKET_ROUNDS, ALL_TEAMS } from '@/lib/worldcup-data';

// GET: fetch current user's bracket picks
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const picks = await prisma.bracketPick.findMany({
    where: { userId: user.userId },
  });

  return NextResponse.json({ picks });
}

// POST: save/update bracket picks
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { picks } = body as {
      picks: Array<{ round: string; slot: number; team: string }>;
    };

    if (!Array.isArray(picks)) {
      return NextResponse.json({ error: 'Invalid picks data' }, { status: 400 });
    }

    const validRounds = new Set(BRACKET_ROUNDS.map((r) => r.id));
    const validTeams = new Set(ALL_TEAMS);

    const upserts = [];

    for (const pick of picks) {
      const { round, slot, team } = pick;

      // Validate
      if (!validRounds.has(round)) continue;
      if (!team || !validTeams.has(team)) continue;

      const roundDef = BRACKET_ROUNDS.find((r) => r.id === round);
      if (!roundDef) continue;
      if (slot < 1 || slot > roundDef.slots) continue;

      upserts.push(
        prisma.bracketPick.upsert({
          where: {
            userId_round_slot: { userId: user.userId, round, slot },
          },
          update: { team },
          create: { userId: user.userId, round, slot, team },
        })
      );
    }

    await prisma.$transaction(upserts);

    return NextResponse.json({ message: 'Bracket picks saved', count: upserts.length });
  } catch (error) {
    console.error('Save bracket picks error:', error);
    return NextResponse.json({ error: 'Failed to save picks' }, { status: 500 });
  }
}
