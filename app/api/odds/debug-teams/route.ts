import { NextResponse } from 'next/server';

const FETCH_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

export async function GET() {
  // Fetch all fifwc events (paginate if needed)
  const url = `https://gamma-api.polymarket.com/events?seriesSlug=soccer-fifwc&limit=300`;
  const res = await fetch(url, { headers: FETCH_HEADERS, cache: 'no-store' });
  if (!res.ok) return NextResponse.json({ error: `Polymarket returned ${res.status}` }, { status: 502 });

  const data = await res.json().catch(() => []);
  if (!Array.isArray(data)) return NextResponse.json({ error: 'Unexpected response' });

  // Build a map of team name → abbreviation from the teams array on each event
  const teamMap: Record<string, string> = {};
  const slugsSeen: string[] = [];

  for (const event of data) {
    slugsSeen.push(event.slug);
    if (Array.isArray(event.teams)) {
      for (const t of event.teams) {
        if (t.name && t.abbreviation) {
          teamMap[t.name] = t.abbreviation;
        }
      }
    }
  }

  return NextResponse.json({
    totalEvents: data.length,
    teamAbbreviations: teamMap,
    sampleSlugs: slugsSeen.slice(0, 10),
  });
}
