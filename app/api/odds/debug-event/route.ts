import { NextResponse } from 'next/server';

const FETCH_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') ?? 'fifwc-che-can-2026-06-24';

  const url = `https://gamma-api.polymarket.com/events?slug=${slug}`;
  const res = await fetch(url, { headers: FETCH_HEADERS, cache: 'no-store' });

  if (!res.ok) {
    return NextResponse.json({ error: `Polymarket returned ${res.status}` }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  if (!Array.isArray(data) || data.length === 0) {
    return NextResponse.json({ error: 'No events returned', raw: data });
  }

  const event = data[0];
  // Return the event with markets trimmed down so the response stays readable
  return NextResponse.json({
    slug: event.slug,
    // All top-level fields except markets
    topLevelFields: Object.fromEntries(
      Object.entries(event).filter(([k]) => k !== 'markets')
    ),
    // First market only (to see its fields)
    firstMarket: event.markets?.[0] ?? null,
    marketCount: event.markets?.length ?? 0,
  });
}
