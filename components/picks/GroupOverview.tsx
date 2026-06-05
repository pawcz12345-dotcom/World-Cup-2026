'use client';

import { Group, getGroupMatches, getTeamMeta, getFlagUrl, computeGroupStandings } from '@/lib/worldcup-data';

interface GroupOverviewProps {
  groups: Group[];
  matchPicks: Record<string, string>;
  onSelectGroup: (groupId: string) => void;
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
  return map[name] ?? (name.length > 11 ? name.slice(0, 10) + '…' : name);
}

function GroupMiniCard({ group, matchPicks, onClick }: {
  group: Group; matchPicks: Record<string, string>; onClick: () => void;
}) {
  const matches = getGroupMatches(group.id);
  const pickedCount = matches.filter((m) => matchPicks[m.matchId]).length;
  const total = matches.length;
  const complete = pickedCount === total;
  const started = pickedCount > 0;
  const standings = started ? computeGroupStandings(group.id, matchPicks) : null;

  return (
    <div
      onClick={onClick}
      className="bg-wc-navy-900 border border-wc-navy-700 rounded-xl p-3 cursor-pointer hover:border-wc-blue-600 transition-colors group select-none"
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      aria-label={`${group.name} — click to pick matches`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-wc-gold-400 font-bold text-xs tracking-widest uppercase">{group.name}</span>
        {complete ? (
          <span className="text-wc-green-400 text-xs font-bold">&#10003;</span>
        ) : started ? (
          <span className="text-wc-blue-400 text-[10px] font-semibold">{pickedCount}/{total}</span>
        ) : null}
      </div>

      <div className="border-t border-wc-navy-700 mb-2" />

      {started && standings ? (
        <div>
          <div className="grid text-[9px] text-wc-navy-500 mb-1 px-0.5" style={{ gridTemplateColumns: '12px 1fr 16px 16px 16px 20px' }}>
            <span></span><span>Team</span>
            <span className="text-center">W</span><span className="text-center">D</span>
            <span className="text-center">L</span><span className="text-right font-bold">Pts</span>
          </div>
          <div className="space-y-0.5">
            {standings.map((row, i) => {
              const meta = getTeamMeta(row.team);
              const autoAdvance = i < 2;
              const mayAdvance = i === 2 && row.pts > 0;
              return (
                <div key={row.team}
                  className={`grid items-center rounded px-0.5 py-0.5 ${autoAdvance ? 'bg-wc-gold-400/8' : mayAdvance ? 'bg-wc-blue-500/8' : ''}`}
                  style={{ gridTemplateColumns: '12px 1fr 16px 16px 16px 20px' }}
                >
                  <span className={`text-[10px] font-bold ${autoAdvance ? 'text-wc-gold-400' : mayAdvance ? 'text-wc-blue-400' : 'text-wc-navy-500'}`}>{i + 1}</span>
                  <div className="flex items-center gap-1 min-w-0">
                    <img src={getFlagUrl(meta.flag)} alt={row.team} className="w-4 h-3 object-cover rounded-sm flex-shrink-0" loading="lazy" />
                    <div className="min-w-0">
                      <span className={`text-[10px] truncate block leading-tight ${autoAdvance ? 'text-white font-medium' : mayAdvance ? 'text-wc-blue-200' : 'text-wc-navy-300'}`}>
                        {shortenName(row.team)}
                      </span>
                      <span className="text-[8px] text-wc-navy-500 leading-none">#{meta.fifaRank}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-center text-wc-navy-300">{row.w}</span>
                  <span className="text-[10px] text-center text-wc-navy-400">{row.d}</span>
                  <span className="text-[10px] text-center text-wc-navy-500">{row.l}</span>
                  <span className={`text-[11px] text-right font-bold ${autoAdvance ? 'text-wc-gold-400' : mayAdvance ? 'text-wc-blue-400' : 'text-wc-navy-500'}`}>{row.pts}</span>
                </div>
              );
            })}
          </div>
          {complete && (
            <div className="mt-1.5 text-[9px] text-wc-navy-500 leading-tight">
              <span className="text-wc-gold-500">■</span> advance · <span className="text-wc-blue-400">■</span> may qualify
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {group.teams.map((team) => {
            const meta = getTeamMeta(team);
            return (
              <div key={team} className="flex items-center gap-1.5 min-w-0">
                <img src={getFlagUrl(meta.flag)} alt={team} className="w-6 h-4 object-cover rounded-sm flex-shrink-0" loading="lazy" />
                <span className="text-xs text-white truncate flex-1 min-w-0">{shortenName(team)}</span>
                <span className="text-[10px] text-wc-navy-500 flex-shrink-0 font-mono">#{meta.fifaRank}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2.5 pt-2 border-t border-wc-navy-700/60">
        {started ? (
          <div className="space-y-1">
            <div className="w-full bg-wc-navy-800 rounded-full h-1">
              <div className={`h-1 rounded-full transition-all ${complete ? 'bg-wc-green-400' : 'bg-wc-blue-500'}`}
                style={{ width: `${(pickedCount / total) * 100}%` }} />
            </div>
            <span className={`text-xs font-semibold block text-center ${complete ? 'text-wc-green-400' : 'text-wc-blue-400'} group-hover:text-white transition-colors`}>
              {complete ? 'All picked — edit' : `${pickedCount}/${total} picked`}
            </span>
          </div>
        ) : (
          <span className="text-xs font-semibold w-full text-center block text-wc-navy-400 group-hover:text-white transition-colors">
            Pick matches →
          </span>
        )}
      </div>
    </div>
  );
}

export default function GroupOverview({ groups, matchPicks, onSelectGroup }: GroupOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {groups.map((group) => (
        <GroupMiniCard key={group.id} group={group} matchPicks={matchPicks} onClick={() => onSelectGroup(group.id)} />
      ))}
    </div>
  );
}
