import { NextResponse } from 'next/server';
import { GROUP_MATCHES } from '@/lib/worldcup-data';

const HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  Referer: 'https://polymarket.com/',
};

const TEAM_CODES: Record<string, string> = {
  'Mexico': 'mex', 'South Africa': 'rsa', 'South Korea': 'kr', 'Czechia': 'cze',
  'Canada': 'can', 'Switzerland': 'che', 'Qatar': 'qat', 'Bosnia and Herzegovina': 'bih',
  'Brazil': 'bra', 'Morocco': 'mar', 'Haiti': 'hai', 'Scotland': 'sco',
  'United States': 'usa', 'Paraguay': 'par', 'Australia': 'aus', 'Turkey': 'tur',
  'Germany': 'ger', 'Curacao': 'kor', "Cote d'Ivoire": 'civ', 'Ecuador': 'ecu',
  'Netherlands': 'nld', 'Japan': 'jpn', 'Sweden': 'swe', 'Tunisia': 'tun',
  'Belgium': 'bel', 'Egypt': 'egy', 'Iran': 'irn', 'New Zealand': 'nzl',
  'Spain': 'esp', 'Cabo Verde': 'cvi', 'Saudi Arabia': 'ksa', 'Uruguay': 'ury',
  'France': 'fra', 'Senegal': 'sen', 'Norway': 'nor', 'Iraq': 'irq',
  'Argentina': 'arg', 'Algeria': 'alg', 'Austria': 'aut', 'Jordan': 'jor',
  'Portugal': 'prt', 'DR Congo': 'cdr', 'Uzbekistan': 'uzb', 'Colombia': 'col',
  'England': 'eng', 'Croatia': 'hrv', 'Ghana': 'gha', 'Panama': 'pan',
};

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
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

  // Try listed date ± 1 day, both orderings = 6 candidates
  const candidates: { slug: string; date: string }[] = [];
  for (const delta of [-1, 0, 1]) {
    const d = shiftDate(match.date, delta);
    candidates.push({ slug: `fifwc-${hCode}-${aCode}-${d}`, date: d });
    candidates.push({ slug: `fifwc-${aCode}-${hCode}-${d}`, date: d });
  }

  const hits = await Promise.all(candidates.map(async (c) => ({ ...c, found: await probeSlug(c.slug) })));
  const found = hits.find((h) => h.found);

  if (!found) {
    return { matchId: match.matchId, home: match.home, away: match.away, listedDate: match.date, status: 'NOT_FOUND' };
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
