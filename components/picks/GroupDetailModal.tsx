'use client';

import { useEffect, useCallback } from 'react';
import {
  Group,
  getGroupMatches,
  getTeamMeta,
  getFlagUrl,
  computeMatchOdds,
  isMatchLocked,
} from '@/lib/worldcup-data';

interface GroupDetailModalProps {
  group: Group;
  matchPicks: Record<string, string>; // matchId -> "home"|"draw"|"away"
  onPickChange: (matchId: string, pick: string) => void;
  onClose: () => void;
}

function shortenName(name: string): string {
  const map: Record<string, string> = {
    'Bosnia and Herzegovina': 'Bosnia',
    'United States': 'USA',
    "Cote d'Ivoire": 'Ivory Coast',
    'Saudi Arabia': 'S. Arabia',
    'South Africa': 'S. Africa',
    'South Korea': 'S. Korea',
    'New Zealand': 'N. Zealand',
  };
  return map[name] ?? (name.length > 13 ? name.slice(0, 12) + '…' : name);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function GroupDetailModal({
  group,
  matchPicks,
  onPickChange,
  onClose,
}: GroupDetailModalProps) {
  const matches = getGroupMatches(group.id);
  const pickedCount = matches.filter((m) => matchPicks[m.matchId]).length;

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${group.name} match picks`}
        className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50 p-0 sm:p-4"
      >
        <div className="bg-green-950 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-xl max-h-[92vh] flex flex-col shadow-2xl">

          {/* Header */}
          <div className="sticky top-0 bg-green-950 border-b border-green-800 px-5 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
            <div>
              <h2 className="text-yellow-400 font-bold text-lg tracking-wide">{group.name}</h2>
              <p className="text-green-500 text-xs mt-0.5">
                {pickedCount}/{matches.length} picks made · correct result = 3 pts
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-green-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-green-800"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Match list */}
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {matches.map((match) => {
              const locked = isMatchLocked(match);
              const pick = matchPicks[match.matchId] ?? null;
              const odds = computeMatchOdds(match.home, match.away);
              const homeMeta = getTeamMeta(match.home);
              const awayMeta = getTeamMeta(match.away);

              return (
                <div
                  key={match.matchId}
                  className={`rounded-xl border p-4 transition-colors ${
                    locked
                      ? 'border-green-900 bg-green-900/30 opacity-70'
                      : pick
                      ? 'border-yellow-700/50 bg-green-900/60'
                      : 'border-green-800 bg-green-900/60'
                  }`}
                >
                  {/* Date + venue */}
                  <div className="flex justify-between items-center text-[11px] text-green-600 mb-3">
                    <span>{formatDate(match.date)}</span>
                    <span className="truncate ml-2">{match.city}</span>
                    {locked && <span className="ml-2 text-yellow-600 font-semibold">LOCKED</span>}
                  </div>

                  {/* Teams row */}
                  <div className="grid grid-cols-3 items-center gap-2 mb-4">
                    <div className="text-center">
                      <img src={getFlagUrl(homeMeta.flag)} alt={match.home} className="w-10 h-7 object-cover rounded mx-auto mb-1" />
                      <div className="text-sm font-semibold text-white leading-tight">{shortenName(match.home)}</div>
                      <div className="text-[11px] text-green-500">#{homeMeta.fifaRank}</div>
                    </div>
                    <div className="text-center text-green-600 font-bold text-xs">VS</div>
                    <div className="text-center">
                      <img src={getFlagUrl(awayMeta.flag)} alt={match.away} className="w-10 h-7 object-cover rounded mx-auto mb-1" />
                      <div className="text-sm font-semibold text-white leading-tight">{shortenName(match.away)}</div>
                      <div className="text-[11px] text-green-500">#{awayMeta.fifaRank}</div>
                    </div>
                  </div>

                  {/* Outcome buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { key: 'home' as const, label: shortenName(match.home), odd: odds.home },
                        { key: 'draw' as const, label: 'Draw',                  odd: odds.draw },
                        { key: 'away' as const, label: shortenName(match.away), odd: odds.away },
                      ]
                    ).map(({ key, label, odd }) => (
                      <button
                        key={key}
                        disabled={locked}
                        onClick={() => !locked && onPickChange(match.matchId, key)}
                        className={`py-2.5 px-1 rounded-lg text-center transition-all select-none ${
                          pick === key
                            ? 'bg-yellow-500 text-black font-bold shadow-lg shadow-yellow-900/40'
                            : locked
                            ? 'bg-green-800/40 text-green-600 cursor-not-allowed'
                            : 'bg-green-800 hover:bg-green-700 text-white cursor-pointer'
                        }`}
                      >
                        <div className="text-xs font-semibold truncate">{label}</div>
                        <div className={`text-[11px] font-mono mt-0.5 ${pick === key ? 'text-black/70' : 'text-green-400'}`}>
                          {odd}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-green-800 px-5 py-3 flex justify-between items-center">
            <span className="text-[11px] text-green-600">Odds based on FIFA rankings</span>
            <button
              onClick={onClose}
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-4 py-1.5 rounded-lg transition-colors text-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
