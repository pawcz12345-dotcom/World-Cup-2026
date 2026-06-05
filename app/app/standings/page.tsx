import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface UserScore {
  id: number;
  username: string;
  score: number;
  groupPicksCount: number;
  bracketPicksCount: number;
  championPick: string | null;
}

const scoringRows = [
  { label: 'Correct pick',  pts: '+1 pt',   positive: true  },
  { label: 'Wrong pick',    pts: '−1 pt',   positive: false },
  { label: 'Round of 32',   pts: '2 pts',   positive: true  },
  { label: 'Round of 16',   pts: '3 pts',   positive: true  },
  { label: 'Quarter-final', pts: '5 pts',   positive: true  },
  { label: 'Semi-final',    pts: '8 pts',   positive: true  },
  { label: 'Final',         pts: '13 pts',  positive: true  },
  { label: 'Champion',      pts: '20 pts',  positive: true  },
] as const;

export default async function StandingsPage() {
  const currentUser = await getSessionUser();

  const matchResults = await prisma.matchResult.findMany();
  const users = await prisma.user.findMany({
    include: { matchPicks: true, bracketPicks: true },
    orderBy: { createdAt: 'asc' },
  });

  const scores: UserScore[] = users.map((user) => {
    const championPick = user.bracketPicks.find((p) => p.round === 'Final' && p.slot === 0)?.team ?? null;
    return {
      id: user.id,
      username: user.username,
      score: 0,
      groupPicksCount: user.matchPicks.length,
      bracketPicksCount: user.bracketPicks.length,
      championPick,
    };
  });

  scores.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));
  const finishedMatches = matchResults.filter((r) => r.status === 'finished').length;

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ─── Header ─── */}
      <div>
        <p className="eyebrow mb-1.5">Pool Leaderboard</p>
        <h1 className="text-3xl font-black text-white">Standings</h1>
        <p className="text-wc-navy-400 text-sm mt-1.5">
          {finishedMatches} match{finishedMatches !== 1 ? 'es' : ''} completed
          <span className="text-wc-navy-700 mx-2">·</span>
          {scores.length} player{scores.length !== 1 ? 's' : ''} in the pool
          <span className="text-wc-navy-700 mx-2">·</span>
          scores update automatically
        </p>
      </div>

      {/* ─── Podium (top 3) ─── */}
      {scores.length >= 1 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              data: scores[1] ?? null,
              medal: '🥈',
              rank: 2,
              borderStyle: 'border-wc-navy-600/50',
              bgStyle: 'bg-wc-navy-800/30',
              ringStyle: '',
              numColor: 'text-wc-navy-300',
              avatarBg: 'bg-gradient-to-br from-wc-navy-500 to-wc-navy-700',
            },
            {
              data: scores[0] ?? null,
              medal: '🥇',
              rank: 1,
              borderStyle: 'border-wc-gold-500/50',
              bgStyle: 'bg-wc-gold-400/5',
              ringStyle: 'ring-1 ring-wc-gold-500/20 shadow-2xl shadow-wc-gold-900/20',
              numColor: 'text-wc-gold-400',
              avatarBg: 'bg-gradient-to-br from-wc-gold-500 to-wc-gold-600',
            },
            {
              data: scores[2] ?? null,
              medal: '🥉',
              rank: 3,
              borderStyle: 'border-amber-800/40',
              bgStyle: 'bg-amber-900/5',
              ringStyle: '',
              numColor: 'text-amber-600',
              avatarBg: 'bg-gradient-to-br from-amber-700 to-amber-800',
            },
          ].map(({ data, medal, borderStyle, bgStyle, ringStyle, numColor, avatarBg }) =>
            data ? (
              <div key={data.id}
                className={`relative rounded-2xl border ${borderStyle} ${bgStyle} ${ringStyle} p-4 text-center transition-transform`}>
                <div className="text-3xl mb-2 leading-none">{medal}</div>
                <div className={`w-11 h-11 rounded-full ${avatarBg} border border-white/10 flex items-center justify-center mx-auto mb-2 shadow-md`}>
                  <span className="text-sm font-black text-white uppercase">{data.username[0]}</span>
                </div>
                <div className={`font-bold text-sm truncate px-1 ${data.username === currentUser?.username ? 'text-wc-gold-300' : 'text-white'}`}>
                  {data.username}
                  {data.username === currentUser?.username && (
                    <span className="ml-1 text-[10px] text-wc-gold-600 font-bold">(you)</span>
                  )}
                </div>
                <div className={`text-2xl font-black tabular-nums mt-2 ${numColor}`}>
                  {data.score}
                </div>
                <div className="text-wc-navy-600 text-[11px] font-semibold uppercase tracking-wider">pts</div>
              </div>
            ) : (
              <div key={`empty-${medal}`}
                className="rounded-2xl border border-wc-navy-800/40 bg-wc-navy-900/20 p-4 text-center opacity-30">
                <div className="text-3xl mb-2">{medal}</div>
                <div className="text-wc-navy-700 text-sm">—</div>
              </div>
            )
          )}
        </div>
      )}

      {/* ─── Scoring Reference ─── */}
      <div className="card">
        <h3 className="eyebrow mb-4">Scoring System</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scoringRows.map(({ label, pts, positive }) => (
            <div key={label}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${
                positive ? 'bg-wc-gold-400/7 border border-wc-gold-600/15' : 'bg-wc-red-500/8 border border-wc-red-600/15'
              }`}>
              <span className="text-wc-navy-300 text-xs font-medium">{label}</span>
              <span className={`font-black text-sm ml-2 ${positive ? 'text-wc-gold-400' : 'text-wc-red-400'}`}>{pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Full Table ─── */}
      <div className="card overflow-hidden p-0">
        {scores.length === 0 ? (
          <div className="text-center py-16 px-5">
            <div className="text-5xl mb-4">🏟️</div>
            <p className="text-white font-black text-lg mb-1">No players yet</p>
            <p className="text-wc-navy-400 text-sm">Invite friends to join the pool!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-wc-navy-700/60">
                  <th className="text-left py-3.5 px-5 eyebrow text-left w-16">#</th>
                  <th className="text-left py-3.5 px-4 eyebrow text-left">Player</th>
                  <th className="text-right py-3.5 px-4 eyebrow">Points</th>
                  <th className="text-right py-3.5 px-4 eyebrow hidden sm:table-cell">Groups</th>
                  <th className="text-right py-3.5 px-4 eyebrow hidden md:table-cell">Bracket</th>
                  <th className="text-right py-3.5 px-5 eyebrow hidden md:table-cell">Champion</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((u, index) => {
                  const isMe = u.username === currentUser?.username;
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
                  return (
                    <tr
                      key={u.id}
                      className={`border-b border-wc-navy-800/40 last:border-0 transition-colors ${
                        isMe ? 'bg-wc-gold-400/6' : 'hover:bg-wc-navy-800/30'
                      }`}
                    >
                      <td className="py-4 px-5">
                        {medal ? (
                          <span className="text-xl leading-none">{medal}</span>
                        ) : (
                          <span className="font-black text-xs text-wc-navy-600 tabular-nums">{index + 1}</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                            isMe
                              ? 'bg-gradient-to-br from-wc-gold-500 to-wc-gold-600 border border-wc-gold-400/30'
                              : 'bg-wc-navy-700 border border-wc-navy-600'
                          }`}>
                            <span className="text-[12px] font-black text-white uppercase">{u.username[0]}</span>
                          </div>
                          <span className={`font-bold ${isMe ? 'text-wc-gold-300' : 'text-white'}`}>
                            {u.username}
                          </span>
                          {isMe && (
                            <span className="tag bg-wc-gold-400/10 text-wc-gold-500 border border-wc-gold-600/20">
                              you
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-black text-xl tabular-nums ${index === 0 ? 'text-wc-gold-400' : 'text-white'}`}>
                          {u.score}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-wc-navy-500 hidden sm:table-cell tabular-nums text-xs font-medium">
                        {u.groupPicksCount}/72
                      </td>
                      <td className="py-4 px-4 text-right text-wc-navy-500 hidden md:table-cell tabular-nums text-xs font-medium">
                        {u.bracketPicksCount}
                      </td>
                      <td className="py-4 px-5 text-right hidden md:table-cell">
                        {u.championPick ? (
                          <span className="text-wc-gold-400 font-semibold text-xs">{u.championPick}</span>
                        ) : (
                          <span className="text-wc-navy-700 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
