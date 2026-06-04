import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { GROUPS } from '@/lib/worldcup-data';

export const dynamic = 'force-dynamic';

// Helper: determine actual final standings for a group from match results.
// Returns null if not enough results to determine standings.
// For now, this is a placeholder since match results only track individual match
// outcomes (W/D/L), not actual group standings. We'll score based on
// admin-entered final standings if they are ever stored. For now we skip
// group scoring until a future "FinalStandings" table is added.
// The scoring below awards points by comparing picks to any stored standings.

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users with their picks
    const users = await prisma.user.findMany({
      include: {
        groupStandingPicks: true,
        bracketPicks: true,
      },
    });

    // Build bracket result map from BracketPick records for scoring
    // (In a real app, actual bracket results would come from a separate table.
    //  For now, bracket scoring deferred to when knockout results are available.)
    // We keep this extensible.

    // ----------------------------------------------------------------
    // Scoring: Group Stage
    // Points: rank1 correct = 4, rank2 = 3, rank3 = 2, rank4 = 1
    // We would need actual final standings per group to compare.
    // For now, we don't have a "FinalGroupStandings" table, so group scoring = 0
    // until an admin records actual final standings.
    // ----------------------------------------------------------------

    // ----------------------------------------------------------------
    // Scoring: Bracket (BracketPick)
    // R32 = 2 pts, R16 = 3 pts, QF = 5 pts, SF = 8 pts, Final = 13 pts
    // Champion (Final slot 0) = 20 pts
    // Actual bracket results would come from an admin-entered source.
    // For now, bracket scoring = 0 until results exist.
    // ----------------------------------------------------------------

    const ROUND_POINTS: Record<string, number> = {
      R32: 2,
      R16: 3,
      QF: 5,
      SF: 8,
      Final: 13,
    };

    const standings = users.map((u) => {
      let score = 0;

      // Group standing picks: score = 0 for now (no actual standings stored)
      // This will be wired up when admin can enter final group standings.
      const groupPicksCount = u.groupStandingPicks.length;

      // Bracket picks: score = 0 for now (no actual bracket results stored)
      const bracketPicksCount = u.bracketPicks.length;

      // Champion is determined by Final round, slot 0 bracket pick
      const championPick = u.bracketPicks.find(
        (p) => p.round === 'Final' && p.slot === 0
      )?.team ?? null;

      return {
        userId: u.id,
        username: u.username,
        score,
        groupPicksCount,
        bracketPicksCount,
        championPick,
      };
    });

    // Sort by score desc, then username asc
    standings.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));

    return NextResponse.json({ standings });
  } catch (error) {
    console.error('Standings error:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
