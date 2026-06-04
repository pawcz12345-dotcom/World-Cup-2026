import { NextResponse } from 'next/server';

const ESPN_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

// Module-level cache
let cachedData: unknown = null;
let cacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

interface ESPNEvent {
  id: string;
  date: string;
  competitions: Array<{
    competitors: Array<{
      homeAway: string;
      team: { displayName: string };
      score: string;
    }>;
    status: {
      type: {
        name: string;
        state: string;
        completed: boolean;
      };
      displayClock: string;
    };
  }>;
  season?: {
    slug: string;
  };
}

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  clock: string;
  date: string;
  competition: string;
}

function parseESPNData(data: { events?: ESPNEvent[] }): Game[] {
  const events = data?.events || [];
  return events.map((event) => {
    const competition = event.competitions?.[0];
    const competitors = competition?.competitors || [];

    const home = competitors.find((c) => c.homeAway === 'home');
    const away = competitors.find((c) => c.homeAway === 'away');

    const statusType = competition?.status?.type;
    let status = 'pre';
    if (statusType?.state === 'in') status = 'in';
    else if (statusType?.state === 'post') status = 'post';
    else if (statusType?.name) status = statusType.name.toLowerCase();

    return {
      id: event.id,
      homeTeam: home?.team?.displayName || 'TBD',
      awayTeam: away?.team?.displayName || 'TBD',
      homeScore: parseInt(home?.score || '0'),
      awayScore: parseInt(away?.score || '0'),
      status,
      clock: competition?.status?.displayClock || '',
      date: event.date,
      competition: 'FIFA World Cup 2026',
    };
  });
}

export async function GET() {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedData && now - cacheTime < CACHE_TTL_MS) {
    return NextResponse.json(cachedData);
  }

  try {
    const res = await fetch(ESPN_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`ESPN API responded with ${res.status}`);
    }

    const data = await res.json();
    const games = parseESPNData(data);

    const responseData = {
      games,
      fetchedAt: new Date().toISOString(),
      cached: false,
    };

    // Update cache
    cachedData = responseData;
    cacheTime = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('ESPN API error:', error);

    // Return cached data even if stale on error
    if (cachedData) {
      return NextResponse.json({ ...(cachedData as object), cached: true, stale: true });
    }

    // Return empty games on error
    return NextResponse.json(
      {
        games: [],
        error: 'Unable to fetch live scores. The ESPN API may be temporarily unavailable.',
        fetchedAt: new Date().toISOString(),
      },
      { status: 200 } // Return 200 so client can show the error gracefully
    );
  }
}
