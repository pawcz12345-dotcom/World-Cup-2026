import { NextResponse } from 'next/server';

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

async function probe(label: string, url: string) {
  try {
    const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
    const rawText = await res.text();
    let parsed: unknown = null;
    try { parsed = JSON.parse(rawText); } catch { /* ignore */ }
    return { label, url, status: res.status, ok: res.ok, parsed };
  } catch (err) {
    return { label, url, fetchError: String(err) };
  }
}

// Try to find a Group F event by searching slug patterns
async function searchSlugs(codes: string[][], date: string) {
  const results = [];
  for (const [a, b] of codes) {
    const slug = `fifwc-${a}-${b}-${date}`;
    const url = `https://gamma-api.polymarket.com/events?slug=${slug}`;
    try {
      const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
      const text = await res.text();
      let parsed: unknown = null;
      try { parsed = JSON.parse(text); } catch { /* */ }
      const found = Array.isArray(parsed) && parsed.length > 0;
      results.push({ slug, status: res.status, found });
    } catch (err) {
      results.push({ slug, fetchError: String(err) });
    }
  }
  return results;
}

export async function GET() {
  // Group F matches:
  // F2: Tunisia vs Japan   2026-06-15
  // F3: Japan vs Sweden    2026-06-21
  // F6: Sweden vs Tunisia  2026-06-26

  // Code variants to try for Japan, Sweden, Tunisia
  const japanCodes   = ['jpn', 'jp', 'japan'];
  const swedenCodes  = ['swe', 'se', 'sweden'];
  const tunisiaCodes = ['tun', 'tn', 'tunisia'];

  // Build all slug combos for F2 (Tunisia vs Japan, 2026-06-15)
  const f2Combos: string[][] = [];
  for (const t of tunisiaCodes) for (const j of japanCodes) {
    f2Combos.push([t, j]);
    f2Combos.push([j, t]);
  }

  // Build all slug combos for F3 (Japan vs Sweden, 2026-06-21)
  const f3Combos: string[][] = [];
  for (const j of japanCodes) for (const s of swedenCodes) {
    f3Combos.push([j, s]);
    f3Combos.push([s, j]);
  }

  // Build all slug combos for F6 (Sweden vs Tunisia, 2026-06-26)
  const f6Combos: string[][] = [];
  for (const s of swedenCodes) for (const t of tunisiaCodes) {
    f6Combos.push([s, t]);
    f6Combos.push([t, s]);
  }

  // Also search for any fifwc event containing "japan", "swe", "tun"
  const [f2Results, f3Results, f6Results, allFifwcEvents] = await Promise.all([
    searchSlugs(f2Combos, '2026-06-15'),
    searchSlugs(f3Combos, '2026-06-21'),
    searchSlugs(f6Combos, '2026-06-26'),
    probe('all-fifwc-active', 'https://gamma-api.polymarket.com/events?tag_slug=fifwc&active=true&limit=200'),
  ]);

  // Extract Group F-related slugs from the full event list
  let groupFEvents: unknown[] = [];
  if (
    allFifwcEvents &&
    'parsed' in allFifwcEvents &&
    Array.isArray(allFifwcEvents.parsed)
  ) {
    groupFEvents = (allFifwcEvents.parsed as Array<{ slug?: string }>).filter((e) => {
      const s = (e.slug ?? '').toLowerCase();
      return (
        s.includes('jpn') || s.includes('jp-') || s.includes('-jp') ||
        s.includes('swe') || s.includes('se-') || s.includes('-se') ||
        s.includes('tun') || s.includes('tn-') || s.includes('-tn') ||
        s.includes('ned') || s.includes('japan') || s.includes('sweden') ||
        s.includes('tunisia')
      );
    }).map((e: { slug?: string }) => e.slug);
  }

  return NextResponse.json({
    f2_slugs_tried: f2Results,
    f3_slugs_tried: f3Results,
    f6_slugs_tried: f6Results,
    group_f_related_events_found: groupFEvents,
    all_fifwc_status: allFifwcEvents && 'status' in allFifwcEvents ? allFifwcEvents.status : 'error',
  });
}
