import { NextResponse } from 'next/server';

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

async function probe(slug: string) {
  try {
    const url = `https://gamma-api.polymarket.com/events?slug=${slug}`;
    const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
    const text = await res.text();
    let parsed: unknown = null;
    try { parsed = JSON.parse(text); } catch { /* */ }
    const found = Array.isArray(parsed) && parsed.length > 0;
    let markets: string[] = [];
    if (found && Array.isArray(parsed)) {
      const event = parsed[0] as { markets?: Array<{ slug?: string }> };
      markets = (event.markets ?? []).map((m) => m.slug ?? '').filter(Boolean);
    }
    return { slug, found, markets };
  } catch (err) {
    return { slug, found: false, markets: [], error: String(err) };
  }
}

export async function GET() {
  // All 6 Group F slugs — confirmed via Polymarket embeds / debug probing
  const slugs = [
    'fifwc-nld-jpn-2026-06-14', // F1
    'fifwc-swe-tun-2026-06-14', // F2
    'fifwc-nld-swe-2026-06-20', // F3
    'fifwc-tun-jpn-2026-06-21', // F4
    'fifwc-tun-nld-2026-06-25', // F5
    'fifwc-jpn-swe-2026-06-25', // F6
  ];

  const results = await Promise.all(slugs.map(probe));
  return NextResponse.json(results);
}
