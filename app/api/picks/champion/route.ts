import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ALL_TEAMS } from '@/lib/worldcup-data';

// GET: fetch current user's champion pick
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pick = await prisma.championPick.findUnique({
    where: { userId: user.userId },
  });

  return NextResponse.json({ pick });
}

// POST: save/update champion pick
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { team } = body as { team: string };

    if (!team) {
      return NextResponse.json({ error: 'Team is required' }, { status: 400 });
    }

    if (!ALL_TEAMS.includes(team)) {
      return NextResponse.json({ error: 'Invalid team name' }, { status: 400 });
    }

    const pick = await prisma.championPick.upsert({
      where: { userId: user.userId },
      update: { team },
      create: { userId: user.userId, team },
    });

    return NextResponse.json({ message: 'Champion pick saved', pick });
  } catch (error) {
    console.error('Save champion pick error:', error);
    return NextResponse.json({ error: 'Failed to save pick' }, { status: 500 });
  }
}
