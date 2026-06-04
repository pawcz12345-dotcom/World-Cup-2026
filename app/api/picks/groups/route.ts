import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { GROUPS } from '@/lib/worldcup-data';

const VALID_GROUPS = new Set(GROUPS.map((g) => g.id));
const ALL_TEAM_NAMES = new Set(GROUPS.flatMap((g) => g.teams));

// GET: return all GroupStandingPicks for current user as { [group]: { rank1, rank2, rank3, rank4 } }
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const picks = await prisma.groupStandingPick.findMany({
    where: { userId: user.userId },
  });

  const result: Record<string, { rank1: string; rank2: string; rank3: string; rank4: string }> = {};
  for (const p of picks) {
    result[p.group] = { rank1: p.rank1, rank2: p.rank2, rank3: p.rank3, rank4: p.rank4 };
  }

  return NextResponse.json({ picks: result });
}

// POST: upsert a GroupStandingPick for a single group
// Body: { group: "A", rank1: "Mexico", rank2: "...", rank3: "...", rank4: "..." }
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { group, rank1, rank2, rank3, rank4 } = body as {
      group: string;
      rank1: string;
      rank2: string;
      rank3: string;
      rank4: string;
    };

    if (!group || !VALID_GROUPS.has(group)) {
      return NextResponse.json({ error: 'Invalid group' }, { status: 400 });
    }

    // Validate all four teams are valid
    for (const team of [rank1, rank2, rank3, rank4]) {
      if (!team || !ALL_TEAM_NAMES.has(team)) {
        return NextResponse.json({ error: `Invalid team: ${team}` }, { status: 400 });
      }
    }

    // Validate the teams belong to this group and are all distinct
    const groupDef = GROUPS.find((g) => g.id === group);
    if (!groupDef) {
      return NextResponse.json({ error: 'Invalid group' }, { status: 400 });
    }
    const groupTeams = new Set(groupDef.teams);
    const submitted = [rank1, rank2, rank3, rank4];
    const unique = new Set(submitted);
    if (unique.size !== 4) {
      return NextResponse.json({ error: 'Duplicate teams in ranking' }, { status: 400 });
    }
    for (const team of submitted) {
      if (!groupTeams.has(team)) {
        return NextResponse.json({ error: `Team ${team} not in group ${group}` }, { status: 400 });
      }
    }

    const pick = await prisma.groupStandingPick.upsert({
      where: { userId_group: { userId: user.userId, group } },
      update: { rank1, rank2, rank3, rank4 },
      create: { userId: user.userId, group, rank1, rank2, rank3, rank4 },
    });

    return NextResponse.json({ message: 'Pick saved', pick });
  } catch (error) {
    console.error('Save group standing pick error:', error);
    return NextResponse.json({ error: 'Failed to save pick' }, { status: 500 });
  }
}
