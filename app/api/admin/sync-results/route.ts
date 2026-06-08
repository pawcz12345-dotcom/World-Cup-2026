import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GROUP_MATCHES } from '@/lib/worldcup-data';
import { isAdminRequest } from '@/lib/admin-auth';

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';
const ESPN_HEADERS = { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' };

// Tournament date range
const TOURNAMENT_START = new Date('2026-06-11');

function normalizeTeam(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Pre-build normalized key → matchId + home/away lookup
const matchByKey = new Map<string, { matchId: string; home: string; away: string }>();
for (const m of GROUP_MATCHES) {
  matchByKey.set(normalizeTeam(m.home) + ':' + normalizeTeam(m.away), m);
  // Also index reversed in case ESPN flips them (shouldn't happen for group stage)
}

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

async function fetchESPNForDate(dateStr: string): Promise<
  Array<{ homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }>
> {
  try {
    const res = await fetch(`${ESPN_BASE}?dates=${dateStr}`, {
      headers: ESPN_HEADERS,
      next: { revalidate: 0 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results: Array<{ homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }> = [];
    for (const event of (data?.events ?? []) as Array<{
      competitions: Array<{
        competitors: Array<{ homeAway: string; team: { displayName: string }; score: string }>;
        status: { type: { state: string } };
      }>;
    }>) {
      const comp = event.competitions?.[0];
      if (!comp) continue;
      if (comp.status?.type?.state !== 'post') continue; // only finished
      const home = comp.competitors.find((c) => c.homeAway === 'home');
      const away = comp.competitors.find((c) => c.homeAway === 'away');
      if (!home || !away) continue;
      results.push({
        homeTeam: home.team.displayName,
        awayTeam: away.team.displayName,
        homeScore: parseInt(home.score || '0'),
        awayScore: parseInt(away.score || '0'),
      });
    }
    return results;
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // Collect all dates from tournament start up to today
  const dates: string[] = [];
  const cursor = new Date(TOURNAMENT_START);
  while (cursor <= today) {
    dates.push(toDateStr(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  // Fetch ESPN for each date
  const allFinished: Array<{ homeTeam: string; awayTeam: string; homeScore: number; awayScore: number }> = [];
  for (const dateStr of dates) {
    const day = await fetchESPNForDate(dateStr);
    allFinished.push(...day);
  }

  // Match ESPN results to our GROUP_MATCHES and upsert
  let synced = 0;
  const syncedMatches: string[] = [];
  const unmatched: string[] = [];

  for (const r of allFinished) {
    const key = normalizeTeam(r.homeTeam) + ':' + normalizeTeam(r.awayTeam);
    const match = matchByKey.get(key);
    if (!match) {
      unmatched.push(`${r.homeTeam} vs ${r.awayTeam}`);
      continue;
    }
    const result =
      r.homeScore > r.awayScore ? 'home'
      : r.awayScore > r.homeScore ? 'away'
      : 'draw';
    await prisma.matchResult.upsert({
      where: { matchId: match.matchId },
      update: { homeGoals: r.homeScore, awayGoals: r.awayScore, result, status: 'finished' },
      create: { matchId: match.matchId, homeGoals: r.homeScore, awayGoals: r.awayScore, result, status: 'finished' },
    });
    synced++;
    syncedMatches.push(`${match.home} ${r.homeScore}–${r.awayScore} ${match.away}`);
  }

  return NextResponse.json({ ok: true, synced, syncedMatches, unmatched });
}
