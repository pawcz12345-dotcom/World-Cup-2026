import { NextResponse } from 'next/server';
import { GROUP_MATCHES } from '@/lib/worldcup-data';

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

const MATCH_TEAM_NAMES = Array.from(
  new Set(GROUP_MATCHES.flatMap((m) => [m.home, m.away]))
);

async function probe(label: string, url: string) {
  try {
    const res = await fetch(url, { headers: HEADERS, cache: 'no-store' });
    const rawText = await res.text();
    let parsed: unknown = null;
    let parseError: string | null = null;
    try { parsed = JSON.parse(rawText); } catch (e) { parseError = String(e); }

    const items = Array.isArray(parsed) ? parsed as Record<string, unknown>[] : null;

    let threeOutcome = 0;
    let drawOutcome = 0;
    let teamMatch = 0;
    const samples: unknown[] = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let outcomes: string[] = [];
        let prices: number[] = [];
        try {
          outcomes = JSON.parse(item.outcomes as string) as string[];
          prices = (JSON.parse(item.outcomePrices as string) as string[]).map(Number);
        } catch { continue; }

        if (outcomes.length === 3) {
          threeOutcome++;
          const hasDraw = outcomes.some((o) => /^(draw|tie|draw\/tie)$/i.test(String(o).trim()));
          if (hasDraw) {
            drawOutcome++;
            const hasTeam = outcomes.some((o) =>
              MATCH_TEAM_NAMES.some((t) => t.toLowerCase() === String(o).toLowerCase().trim())
            );
            if (hasTeam) {
              teamMatch++;
              if (samples.length < 3) samples.push({ question: item.question, outcomes, prices });
            }
          }
        }
      }
    }

    return {
      label, url,
      status: res.status, ok: res.ok,
      contentType: res.headers.get('content-type'),
      rawSnippet: rawText.slice(0, 200),
      parseError,
      totalItems: items?.length ?? 0,
      threeOutcomeMarkets: threeOutcome,
      drawMarkets: drawOutcome,
      teamMatchedMarkets: teamMatch,
      samples,
      first2questions: items?.slice(0, 2).map((m) => m.question) ?? [],
    };
  } catch (err) {
    return { label, url, fetchError: String(err) };
  }
}

export async function GET() {
  const results = await Promise.all([
    // Original (broken) query approach
    probe('q-search', 'https://gamma-api.polymarket.com/markets?q=2026+FIFA+World+Cup&active=true&closed=false&limit=500'),
    // Date-range approach: WC group stage runs Jun 11 – Jul 2
    probe('date-range', 'https://gamma-api.polymarket.com/markets?endDateMin=2026-06-10&endDateMax=2026-07-20&active=true&closed=false&limit=500'),
    // Events endpoint
    probe('events-q', 'https://gamma-api.polymarket.com/events?q=FIFA+World+Cup+2026&limit=50&active=true'),
    // Tag-based
    probe('tag-soccer', 'https://gamma-api.polymarket.com/markets?tag_slug=soccer&active=true&closed=false&limit=500'),
  ]);

  return NextResponse.json(results);
}
