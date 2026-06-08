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
    // If found, extract market slugs to verify team codes
    let markets: string[] = [];
    if (found && Array.isArray(parsed)) {
      const event = parsed[0] as { markets?: Array<{ slug?: string }> };
      markets = (event.markets ?? []).map((m) => m.slug ?? '').filter(Boolean);
    }
    return { slug, status: res.status, found, markets };
  } catch (err) {
    return { slug, status: 0, found: false, markets: [], error: String(err) };
  }
}

export async function GET() {
  // Corrected Group F schedule:
  // F1: NLD vs JPN  2026-06-14  (confirmed from embed)
  // F2: SWE vs TUN  2026-06-15
  // F3: NLD vs SWE  2026-06-21
  // F4: JPN vs TUN  2026-06-21
  // F5: NLD vs TUN  2026-06-26
  // F6: JPN vs SWE  2026-06-26

  const slugsToTry = [
    // F1 confirmed
    'fifwc-nld-jpn-2026-06-14',
    // F2 both orders
    'fifwc-swe-tun-2026-06-15',
    'fifwc-tun-swe-2026-06-15',
    // F3 both orders
    'fifwc-nld-swe-2026-06-21',
    'fifwc-swe-nld-2026-06-21',
    // F4 both orders
    'fifwc-jpn-tun-2026-06-21',
    'fifwc-tun-jpn-2026-06-21',
    // F5 both orders
    'fifwc-nld-tun-2026-06-26',
    'fifwc-tun-nld-2026-06-26',
    // F6 both orders
    'fifwc-jpn-swe-2026-06-26',
    'fifwc-swe-jpn-2026-06-26',
  ];

  const results = await Promise.all(slugsToTry.map(probe));
  const found = results.filter((r) => r.found);
  const notFound = results.filter((r) => !r.found).map((r) => r.slug);

  return NextResponse.json({ found, not_found: notFound });
}
