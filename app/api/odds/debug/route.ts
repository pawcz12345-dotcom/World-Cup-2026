import { NextResponse } from 'next/server';

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

async function fetchJSON(label: string, url: string) {
  try {
    const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
    const text = await res.text();
    let parsed: unknown = null;
    try { parsed = JSON.parse(text); } catch { /* */ }
    return { label, url, status: res.status, parsed };
  } catch (err) {
    return { label, url, status: 0, parsed: null, error: String(err) };
  }
}

export async function GET() {
  const [
    fifwcTag,
    fifwcTagInactive,
    worldcupSearch,
    fifwcSearch,
    knownGood,
    groupFParent,
  ] = await Promise.all([
    // All active fifwc-tagged events (dump all slugs)
    fetchJSON('fifwc-tag-active', 'https://gamma-api.polymarket.com/events?tag_slug=fifwc&active=true&limit=200'),
    // Including inactive/closed
    fetchJSON('fifwc-tag-all', 'https://gamma-api.polymarket.com/events?tag_slug=fifwc&limit=200'),
    // Try searching by "world cup" keyword
    fetchJSON('search-worldcup', 'https://gamma-api.polymarket.com/events?q=world+cup+2026&limit=50'),
    // Try searching "fifwc"
    fetchJSON('search-fifwc', 'https://gamma-api.polymarket.com/events?q=fifwc&limit=50'),
    // A known-good slug to verify the endpoint works
    fetchJSON('known-good-che-can', 'https://gamma-api.polymarket.com/events?slug=fifwc-che-can-2026-06-24'),
    // Maybe there's a parent group F event
    fetchJSON('group-f-parent', 'https://gamma-api.polymarket.com/events?slug=fifwc-group-f-2026'),
  ]);

  // Extract just the slugs from each result to keep the response small
  function extractSlugs(r: { parsed: unknown }): string[] {
    if (!Array.isArray(r.parsed)) return [];
    return (r.parsed as Array<{ slug?: string }>).map((e) => e.slug ?? '(no slug)');
  }

  return NextResponse.json({
    known_good: {
      status: knownGood.status,
      found: Array.isArray(knownGood.parsed) && knownGood.parsed.length > 0,
      slug: Array.isArray(knownGood.parsed) && knownGood.parsed.length > 0
        ? (knownGood.parsed as Array<{ slug?: string }>)[0]?.slug
        : null,
    },
    fifwc_tag_active: {
      status: fifwcTag.status,
      count: Array.isArray(fifwcTag.parsed) ? fifwcTag.parsed.length : 0,
      slugs: extractSlugs(fifwcTag),
    },
    fifwc_tag_all: {
      status: fifwcTagInactive.status,
      count: Array.isArray(fifwcTagInactive.parsed) ? fifwcTagInactive.parsed.length : 0,
      slugs: extractSlugs(fifwcTagInactive),
    },
    worldcup_search: {
      status: worldcupSearch.status,
      count: Array.isArray(worldcupSearch.parsed) ? worldcupSearch.parsed.length : 0,
      slugs: extractSlugs(worldcupSearch),
    },
    fifwc_search: {
      status: fifwcSearch.status,
      count: Array.isArray(fifwcSearch.parsed) ? fifwcSearch.parsed.length : 0,
      slugs: extractSlugs(fifwcSearch),
    },
    group_f_parent: {
      status: groupFParent.status,
      found: Array.isArray(groupFParent.parsed) && groupFParent.parsed.length > 0,
    },
  });
}
