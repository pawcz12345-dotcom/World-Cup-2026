import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { GROUP_MATCHES } from '@/lib/worldcup-data';

// GET: fetch current user's group picks (and optionally match results)
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const wantsResults = searchParams.get('results') === '1';

  if (wantsResults) {
    const results = await prisma.matchResult.findMany();
    return NextResponse.json({ results });
  }

  const picks = await prisma.groupPick.findMany({
    where: { userId: user.userId },
  });

  return NextResponse.json({ picks });
}

// POST: save/update group picks
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { picks } = body as { picks: Record<string, string> };

    if (!picks || typeof picks !== 'object') {
      return NextResponse.json({ error: 'Invalid picks data' }, { status: 400 });
    }

    const validMatchIds = new Set(GROUP_MATCHES.map((m) => m.matchId));
    const validPicks = ['home', 'draw', 'away'];
    const now = new Date();

    const upserts = [];

    for (const [matchId, pick] of Object.entries(picks)) {
      // Validate matchId
      if (!validMatchIds.has(matchId)) continue;
      // Validate pick value
      if (!validPicks.includes(pick)) continue;

      // Check if match is locked (already started)
      const match = GROUP_MATCHES.find((m) => m.matchId === matchId);
      if (match) {
        const matchDate = new Date(match.date + 'T00:00:00');
        if (matchDate <= now) {
          // Match has started - don't update pick
          continue;
        }
      }

      upserts.push(
        prisma.groupPick.upsert({
          where: {
            userId_matchId: { userId: user.userId, matchId },
          },
          update: { pick },
          create: { userId: user.userId, matchId, pick },
        })
      );
    }

    await prisma.$transaction(upserts);

    return NextResponse.json({ message: 'Picks saved', count: upserts.length });
  } catch (error) {
    console.error('Save group picks error:', error);
    return NextResponse.json({ error: 'Failed to save picks' }, { status: 500 });
  }
}
