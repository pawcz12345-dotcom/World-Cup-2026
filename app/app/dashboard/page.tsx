import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GROUP_MATCHES, getTeamMeta, getFlagUrl } from '@/lib/worldcup-data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const totalMatches = GROUP_MATCHES.length;

  const [matchPicksCount, bracketPicksCount] = await Promise.all([
    prisma.matchPick.count({ where: { userId: user.userId } }),
    prisma.bracketPick.count({ where: { userId: user.userId } }),
  ]);

  const finalPick = await prisma.bracketPick.findUnique({
    where: { userId_round_slot: { userId: user.userId, round: 'Final', slot: 0 } },
  });
  const championPick = finalPick?.team ?? null;
  const championMeta = championPick ? getTeamMeta(championPick) : null;

  const matchResults = await prisma.matchResult.findMany();
  const completedGroupMatches = matchResults.filter((r) => r.status === 'finished').length;

  const allUsers = await prisma.user.findMany({ select: { id: true, username: true } });
  const leaderboard = allUsers
    .map((u) => ({ username: u.username, score: 0, id: u.id }))
    .sort((a, b) => b.score - a.score || a.username.localeCompare(b.username))
    .slice(0, 5);

  const picksPct = Math.round((matchPicksCount / totalMatches) * 100);
  const groupsDone = matchPicksCount === totalMatches;

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ─── Hero Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl border border-wc-navy-700/60 p-6 sm:p-8"
           style={{ background: 'linear-gradient(135deg, #071540 0%, #040D28 60%, #02071A 100%)' }}>
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-wc-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-wc-gold-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="eyebrow text-wc-gold-500">FIFA World Cup 2026™</span>
                <span className="text-wc-navy-700">·</span>
                <span className="eyebrow">Pool Picks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Welcome back,{' '}
                <span className="text-wc-blue-300">{user.username}</span>
              </h1>
              <p className="text-wc-navy-400 text-sm mt-2">
                Group Stage · June 11 – July 19, 2026 · 48 teams · 104 matches
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2.5 flex-shrink-0">
              <div className="flex items-center gap-1.5 bg-wc-navy-800/70 border border-wc-navy-700/60 rounded-full px-3 py-1.5">
                <span className="text-base">🇺🇸</span>
                <span className="text-base">🇨🇦</span>
                <span className="text-base">🇲🇽</span>
                <span className="text-wc-navy-600 text-xs mx-0.5">·</span>
                <span className="text-xs text-wc-navy-400 font-medium">3 Host Nations</span>
              </div>
              <Link href="/app/picks" className="btn-primary text-sm whitespace-nowrap">
                Make Picks →
              </Link>
            </div>
          </div>

          {/* Progress stripe */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-xs text-wc-navy-500">
              <span>Your progress</span>
              <span>{picksPct}%</span>
            </div>
            <div className="relative h-1.5 bg-wc-navy-800 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                  groupsDone
                    ? 'bg-gradient-to-r from-wc-green-600 to-wc-green-400'
                    : 'bg-gradient-to-r from-wc-blue-600 to-wc-blue-400'
                }`}
                style={{ width: `${picksPct}%` }}
              />
            </div>
          </div>

          {/* Host nation gradient rule */}
          <div className="mt-5 h-px bg-gradient-to-r from-wc-blue-500 via-wc-green-500 to-wc-red-500 opacity-30 rounded-full" />
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Your Points',
            value: '0',
            sub: 'tournament score',
            iconBg: 'bg-wc-gold-400/15',
            iconColor: 'text-wc-gold-400',
            accentFrom: '#CC9520',
            accentTo: '#E0B040',
            icon: (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
            ),
          },
          {
            label: 'Group Picks',
            value: `${matchPicksCount}`,
            sub: `of ${totalMatches} matches`,
            iconBg: 'bg-wc-blue-500/15',
            iconColor: 'text-wc-blue-300',
            accentFrom: '#009DDA',
            accentTo: '#36CCFF',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: 'Bracket Picks',
            value: `${bracketPicksCount}`,
            sub: 'knockout slots filled',
            iconBg: 'bg-wc-blue-500/10',
            iconColor: 'text-wc-blue-400',
            accentFrom: '#1C4AA8',
            accentTo: '#009DDA',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
          },
          {
            label: 'Matches Played',
            value: `${completedGroupMatches}`,
            sub: 'group stage complete',
            iconBg: 'bg-wc-navy-700',
            iconColor: 'text-wc-navy-300',
            accentFrom: '#1C4AA8',
            accentTo: '#3065C8',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ].map(({ label, value, sub, iconBg, iconColor, accentFrom, accentTo, icon }) => (
          <div key={label} className="card relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
              style={{ background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})` }}
            />
            <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} mb-3`}>
              {icon}
            </div>
            <div className="text-3xl font-black text-white tabular-nums leading-none">{value}</div>
            <div className="text-wc-navy-300 text-xs font-bold uppercase tracking-wider mt-2">{label}</div>
            <div className="text-wc-navy-600 text-xs mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      {/* ─── Progress + Champion ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Progress card */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-white">Group Stage Picks</h3>
              <p className="text-wc-navy-500 text-xs mt-0.5">
                {totalMatches - matchPicksCount > 0 ? `${totalMatches - matchPicksCount} remaining` : 'All done!'}
              </p>
            </div>
            {groupsDone ? (
              <span className="tag bg-wc-green-500/15 text-wc-green-400 border border-wc-green-500/20">
                ✓ Complete
              </span>
            ) : (
              <span className="tag bg-wc-navy-800 text-wc-navy-400 border border-wc-navy-700">
                {matchPicksCount}/{totalMatches}
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between text-xs text-wc-navy-500 mb-1.5">
              <span>{picksPct}%</span>
            </div>
            <div className="relative h-2.5 bg-wc-navy-800 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                  groupsDone
                    ? 'bg-gradient-to-r from-wc-green-600 to-wc-green-400'
                    : 'bg-gradient-to-r from-wc-blue-600 to-wc-blue-400'
                }`}
                style={{ width: `${Math.max(picksPct, 3)}%` }}
              />
            </div>
            {/* Milestones */}
            <div className="flex justify-between text-[10px] text-wc-navy-700 mt-1">
              {[25, 50, 75, 100].map((m) => (
                <span key={m} className={picksPct >= m ? 'text-wc-navy-500' : ''}>{m}%</span>
              ))}
            </div>
          </div>

          <Link href="/app/picks" className="btn-secondary text-sm block text-center">
            {groupsDone ? 'Review picks' : 'Make picks →'}
          </Link>
        </div>

        {/* Champion card */}
        <div className="card relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, #CC9520, #E0B040)' }} />
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-black text-white">Champion Pick</h3>
              <p className="text-wc-navy-500 text-xs mt-0.5">Worth 20 pts if correct</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-wc-gold-400/12 flex items-center justify-center text-wc-gold-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V18H9v2h6v-2h-2v-2.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
              </svg>
            </div>
          </div>

          {championPick && championMeta ? (
            <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-wc-navy-800/60 border border-wc-navy-700">
              <img
                src={getFlagUrl(championMeta.flag)}
                alt={championPick}
                className="w-14 h-10 object-cover rounded-lg shadow-md flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-lg font-black text-white truncate">{championPick}</div>
                <div className="text-xs text-wc-navy-500 mt-0.5">FIFA Rank #{championMeta.fifaRank}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl border border-dashed border-wc-navy-700">
              <div className="w-10 h-10 rounded-xl bg-wc-gold-400/8 flex items-center justify-center flex-shrink-0">
                <span className="text-wc-gold-500 text-lg">?</span>
              </div>
              <div>
                <div className="text-wc-navy-300 text-sm font-semibold">No champion picked</div>
                <div className="text-wc-navy-600 text-xs">Pick the tournament winner</div>
              </div>
            </div>
          )}

          <Link href="/app/picks" className="btn-secondary text-sm block text-center">
            {championPick ? 'Change pick' : 'Pick champion →'}
          </Link>
        </div>
      </div>

      {/* ─── Leaderboard ─── */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-black text-white">Leaderboard</h3>
            <p className="text-wc-navy-500 text-xs mt-0.5">{leaderboard.length} player{leaderboard.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/app/standings"
            className="text-wc-blue-400 hover:text-wc-blue-300 text-xs font-bold transition-colors flex items-center gap-1">
            Full standings →
          </Link>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">👥</div>
            <p className="text-wc-navy-300 font-semibold">No players yet</p>
            <p className="text-wc-navy-500 text-sm mt-1">Invite friends to join the pool</p>
          </div>
        ) : (
          <div className="space-y-1">
            {leaderboard.map((entry, i) => {
              const isMe = entry.username === user.username;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;
              return (
                <div key={entry.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    isMe
                      ? 'bg-wc-gold-400/8 border border-wc-gold-600/20'
                      : 'hover:bg-wc-navy-800/50'
                  }`}>
                  {/* Rank */}
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                    {medal ? (
                      <span className="text-lg leading-none">{medal}</span>
                    ) : (
                      <span className="text-xs font-black text-wc-navy-600 tabular-nums">{i + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isMe
                      ? 'bg-gradient-to-br from-wc-gold-500 to-wc-gold-600 border-wc-gold-400/40'
                      : 'bg-wc-navy-700 border-wc-navy-600'
                  }`}>
                    <span className="text-[11px] font-black text-white uppercase">{entry.username[0]}</span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <span className={`font-semibold text-sm truncate block ${isMe ? 'text-wc-gold-300' : 'text-white'}`}>
                      {entry.username}
                    </span>
                  </div>

                  {isMe && (
                    <span className="tag bg-wc-gold-400/10 text-wc-gold-600 border border-wc-gold-600/20">you</span>
                  )}

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <span className={`font-black text-base tabular-nums ${isMe ? 'text-wc-gold-400' : 'text-white'}`}>
                      {entry.score}
                    </span>
                    <span className="text-wc-navy-600 text-xs ml-0.5">pts</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
