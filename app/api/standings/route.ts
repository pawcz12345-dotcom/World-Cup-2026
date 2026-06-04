import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all match results
    const matchResults = await prisma.matchResult.findMany();
    const resultMap = new Map(matchResults.map((r) => [r.matchId, r]));

    // Get all users with picks
    const users = await prisma.user.findMany({
      include: {
        groupPicks: true,
        bracketPicks: true,
        championPick: true,
      },
    });

    // Calculate scores for each user
    const standings = users.map((u) => {
      let score = 0;
      let groupCorrect = 0;

      // Group picks
      for (const gp of u.groupPicks) {
        const result = resultMap.get(gp.matchId);
        if (result?.result && result.result === gp.pick) {
          score += 3;
          groupCorrect++;
        }
      }

      // Note: Bracket and champion picks will score once the knockout stage begins.
      // The scoring logic is in lib/scoring.ts and can be wired in when results are available.

      return {
        userId: u.id,
        username: u.username,
        score,
        groupPicksCount: u.groupPicks.length,
        groupCorrect,
        bracketPicksCount: u.bracketPicks.length,
        hasChampionPick: !!u.championPick,
        championPick: u.championPick?.team || null,
      };
    });

    // Sort by score desc
    standings.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));

    return NextResponse.json({ standings });
  } catch (error) {
    console.error('Standings error:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
