import { NextResponse } from 'next/server';
import { GROUP_MATCHES } from '@/lib/worldcup-data';
import { POLYMARKET_TEAM_CODES as TEAM_CODES, POLYMARKET_TEAM_ALT_CODES as ALT_CODES } from '@/lib/polymarket-codes';

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function allCodes(primary: string, team: string): string[] {
  const alts = ALT_CODES[team] ?? [];
  return [primary, ...alts].filter((v, i, a) => a.indexOf(v) === i);
}

async function probeSlug(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}`, {
      headers: HEADERS,
      cache: 'no-store',
    });
    const text = await res.text();
    const data = JSON.parse(text);
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

async function auditMatch(match: (typeof GROUP_MATCHES)[0]) {
  const hCode = TEAM_CODES[match.home];
  const aCode = TEAM_CODES[match.away];
  if (!hCode || !aCode) {
    return { matchId: match.matchId, error: `missing code: ${!hCode ? match.home : match.away}` };
  }

  const hCodes = allCodes(hCode, match.home);
  const aCodes = allCodes(aCode, match.away);

  // Try all code combinations × ±1 day × both orderings
  const candidates: { slug: string; date: string; hCode: string; aCode: string }[] = [];
  for (const h of hCodes) {
    for (const a of aCodes) {
      for (const delta of [-1, 0, 1]) {
        const d = shiftDate(match.date, delta);
        candidates.push({ slug: `fifwc-${h}-${a}-${d}`, date: d, hCode: h, aCode: a });
        candidates.push({ slug: `fifwc-${a}-${h}-${d}`, date: d, hCode: h, aCode: a });
      }
    }
  }

  const hits = await Promise.all(candidates.map(async (c) => ({ ...c, found: await probeSlug(c.slug) })));
  const found = hits.find((h) => h.found);

  if (!found) {
    return { matchId: match.matchId, home: match.home, away: match.away, listedDate: match.date, status: 'NOT_FOUND', triedCodes: { h: hCodes, a: aCodes } };
  }

  const dateOk = found.date === match.date;
  return {
    matchId: match.matchId,
    home: match.home,
    away: match.away,
    listedDate: match.date,
    foundSlug: found.slug,
    foundDate: found.date,
    status: dateOk ? 'OK' : 'DATE_MISMATCH',
  };
}

export async function GET() {
  const results = await Promise.all(GROUP_MATCHES.map(auditMatch));

  const ok = results.filter((r) => 'status' in r && r.status === 'OK');
  const dateMismatch = results.filter((r) => 'status' in r && r.status === 'DATE_MISMATCH');
  const notFound = results.filter((r) => 'status' in r && r.status === 'NOT_FOUND');
  const errors = results.filter((r) => 'error' in r);

  return NextResponse.json({ ok, date_mismatch: dateMismatch, not_found: notFound, errors });
}
