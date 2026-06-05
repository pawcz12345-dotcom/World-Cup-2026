'use client';

import { getTeamMeta, getFlagUrl } from '@/lib/worldcup-data';

export interface ThirdEntry {
  team: string;
  pts: number;
  group: string;
}

interface Props {
  thirds: ThirdEntry[];
  hasTieAtCut: boolean;
  tiebreakerOrder?: string[];
  onTiebreakerChange: (order: string[]) => void;
}

const SHORT_NAMES: Record<string, string> = {
  'Bosnia and Herzegovina': 'Bosnia',
  'United States': 'USA',
  "Cote d'Ivoire": 'Ivory Coast',
  'Saudi Arabia': 'S. Arabia',
  'South Africa': 'S. Africa',
  'South Korea': 'S. Korea',
  'New Zealand': 'N. Zealand',
};

function shortenName(name: string) {
  return SHORT_NAMES[name] ?? (name.length > 13 ? name.slice(0, 12) + '…' : name);
}

export default function ThirdsQualificationPanel({ thirds, hasTieAtCut, tiebreakerOrder, onTiebreakerChange }: Props) {
  const isResolved = !hasTieAtCut || !!tiebreakerOrder;

  function handleSwap(i: number, direction: 'up' | 'down') {
    const j = direction === 'up' ? i - 1 : i + 1;
    const newOrder = thirds.map((t) => t.team);
    const tmp = newOrder[i]; newOrder[i] = newOrder[j]; newOrder[j] = tmp;
    onTiebreakerChange(newOrder);
  }

  function isTiedWithPrev(i: number) {
    return i > 0 && thirds[i].pts === thirds[i - 1].pts;
  }

  function isTiedWithNext(i: number) {
    return i < thirds.length - 1 && thirds[i].pts === thirds[i + 1].pts;
  }

  const cutPts = thirds[7]?.pts;

  function isAtCutBoundary(i: number) {
    return hasTieAtCut && thirds[i].pts === cutPts;
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${hasTieAtCut && !isResolved ? 'border-amber-800/60' : 'border-green-800'}`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${hasTieAtCut && !isResolved ? 'bg-amber-900/30' : 'bg-green-900/50'}`}>
        <div>
          <h3 className="text-yellow-400 font-bold text-sm">3rd Place Qualification</h3>
          <p className="text-green-500 text-[11px] mt-0.5">Best 8 of 12 third-place teams advance to R32</p>
        </div>
        <span className={`text-xs font-bold ${isResolved ? 'text-green-400' : 'text-amber-300'}`}>
          {isResolved ? '✓ Resolved' : '⚠ Tiebreaker needed'}
        </span>
      </div>

      {/* Warning banner */}
      {hasTieAtCut && !isResolved && (
        <div className="px-4 py-2 bg-amber-900/20 text-amber-300 text-xs border-b border-amber-800/40">
          Teams are tied at the cut-off (position 8 vs 9). Use ▲▼ to set your preferred qualification order.
        </div>
      )}
      {hasTieAtCut && isResolved && (
        <div className="px-4 py-2 bg-green-900/20 text-green-400 text-xs border-b border-green-800/40">
          Tiebreaker set — tap ▲▼ to adjust.
        </div>
      )}

      {/* Table */}
      <table className="w-full text-xs">
        <thead>
          <tr className="text-green-500 border-b border-green-800/60 bg-green-900/20">
            <th className="text-left py-1.5 px-3 font-medium w-6">#</th>
            <th className="text-center py-1.5 font-medium w-8">Grp</th>
            <th className="text-left py-1.5 font-medium">Team</th>
            <th className="text-center py-1.5 pr-3 font-bold w-10">Pts</th>
            {hasTieAtCut && <th className="w-10" />}
          </tr>
        </thead>
        <tbody>
          {thirds.map((entry, i) => {
            const meta = getTeamMeta(entry.team);
            const qualifies = i < 8;
            const atBoundary = isAtCutBoundary(i);
            const tiedUp = isTiedWithPrev(i);
            const tiedDown = isTiedWithNext(i);
            const cutLine = i === 7;

            return (
              <tr
                key={entry.team}
                className={`transition-colors ${
                  cutLine && hasTieAtCut ? 'border-b-2 border-amber-600/60' : 'border-b border-green-800/30'
                } last:border-0 ${
                  atBoundary ? 'bg-amber-900/10' : qualifies ? 'bg-yellow-500/5' : ''
                }`}
              >
                <td className="py-1.5 px-3">
                  <span className={`font-bold ${atBoundary ? 'text-amber-400' : qualifies ? 'text-yellow-400' : 'text-green-600'}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="py-1.5 text-center">
                  <span className="text-green-500 font-mono font-semibold">{entry.group}</span>
                </td>
                <td className="py-1.5">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={getFlagUrl(meta.flag)}
                      alt={entry.team}
                      className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0"
                    />
                    <span className={`font-medium ${qualifies ? 'text-white' : 'text-green-400'}`}>
                      {shortenName(entry.team)}
                    </span>
                    {qualifies && i === 7 && !hasTieAtCut && (
                      <span className="text-[9px] text-yellow-600 ml-1">← last qualifier</span>
                    )}
                  </div>
                </td>
                <td className="py-1.5 text-center pr-3">
                  <span className={`font-bold font-mono ${atBoundary ? 'text-amber-300' : qualifies ? 'text-yellow-400' : 'text-green-500'}`}>
                    {entry.pts}
                  </span>
                </td>
                {hasTieAtCut && (
                  <td className="py-1 pr-2">
                    <div className="flex flex-col gap-0.5 items-center">
                      <button
                        onClick={() => handleSwap(i, 'up')}
                        disabled={!tiedUp}
                        className="text-[11px] leading-none px-1 py-0.5 rounded disabled:opacity-0 enabled:text-amber-400 enabled:hover:bg-amber-900/40 transition-colors"
                        aria-label="Move up"
                      >▲</button>
                      <button
                        onClick={() => handleSwap(i, 'down')}
                        disabled={!tiedDown}
                        className="text-[11px] leading-none px-1 py-0.5 rounded disabled:opacity-0 enabled:text-amber-400 enabled:hover:bg-amber-900/40 transition-colors"
                        aria-label="Move down"
                      >▼</button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="bg-green-900/30 px-3 py-1.5 text-[10px] text-green-600">
        <span className="text-yellow-500">■</span> Qualifies (top 8)
        <span className="mx-1.5">·</span>
        <span className="text-green-600">■</span> Eliminated
        {hasTieAtCut && !isResolved && (
          <span className="text-amber-500 ml-2">· R32 slots 6, 7, 14, 15 await tiebreaker</span>
        )}
      </div>
    </div>
  );
}
