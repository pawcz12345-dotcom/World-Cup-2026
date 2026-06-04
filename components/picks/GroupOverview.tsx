'use client';

import { Group, getGroupMatches, getTeamMeta, getFlagUrl } from '@/lib/worldcup-data';

interface GroupOverviewProps {
  groups: Group[];
  matchPicks: Record<string, string>; // matchId -> "home"|"draw"|"away"
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
  return map[name] ?? (name.length > 12 ? name.slice(0, 11) + '…' : name);
}

interface GroupMiniCardProps {
  group: Group;
  matchPicks: Record<string, string>;
  onClick: () => void;
}

function GroupMiniCard({ group, matchPicks, onClick }: GroupMiniCardProps) {
  const matches = getGroupMatches(group.id);
  const pickedCount = matches.filter((m) => matchPicks[m.matchId]).length;
  const total = matches.length;
  const complete = pickedCount === total;
  const started = pickedCount > 0;

  return (
    <div
      onClick={onClick}
      className="bg-green-950 border border-green-800 rounded-xl p-3 cursor-pointer hover:border-yellow-500 transition-colors group select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      aria-label={`${group.name} — click to pick matches`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-yellow-400 font-bold text-xs tracking-widest uppercase">
          {group.name}
        </span>
        {complete ? (
          <span className="text-green-400 text-xs font-bold">&#10003;</span>
        ) : started ? (
          <span className="text-yellow-500 text-[10px] font-semibold">{pickedCount}/{total}</span>
        ) : null}
      </div>

      <div className="border-t border-green-800 mb-2" />

      {/* Team rows */}
      <div className="space-y-1">
        {group.teams.map((team) => {
          const meta = getTeamMeta(team);
          return (
            <div key={team} className="flex items-center gap-1.5 min-w-0">
              <img
                src={getFlagUrl(meta.flag)}
                alt={team}
                className="w-6 h-4 object-cover rounded-sm flex-shrink-0"
                loading="lazy"
              />
              <span className="text-xs text-white truncate flex-1 min-w-0">{shortenName(team)}</span>
              <span className="text-[10px] text-green-600 flex-shrink-0 font-mono">#{meta.fifaRank}</span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-2.5 pt-2 border-t border-green-800/60">
        {started ? (
          <div className="space-y-1">
            <div className="w-full bg-green-900 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all ${complete ? 'bg-green-400' : 'bg-yellow-500'}`}
                style={{ width: `${(pickedCount / total) * 100}%` }}
              />
            </div>
            <span className={`text-xs font-semibold block text-center ${complete ? 'text-green-400' : 'text-yellow-500'} group-hover:text-yellow-300 transition-colors`}>
              {complete ? 'All picked — edit' : `${pickedCount}/${total} picked`}
            </span>
          </div>
        ) : (
          <span className="text-xs font-semibold w-full text-center block text-yellow-500 group-hover:text-yellow-300 transition-colors">
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
        <GroupMiniCard
          key={group.id}
          group={group}
          matchPicks={matchPicks}
          onClick={() => onSelectGroup(group.id)}
        />
      ))}
    </div>
  );
}
