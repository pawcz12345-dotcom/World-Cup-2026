import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GROUPS } from '@/lib/worldcup-data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  // Get current user's picks counts
  const [groupStandingPicksCount, bracketPicksCount] = await Promise.all([
    prisma.groupStandingPick.count({ where: { userId: user.userId } }),
    prisma.bracketPick.count({ where: { userId: user.userId } }),
  ]);

  // Champion is the Final bracket pick (slot 0)
  const finalPick = await prisma.bracketPick.findUnique({
    where: { userId_round_slot: { userId: user.userId, round: 'Final', slot: 0 } },
  });
  const championPick = finalPick?.team ?? null;

  // Get all match results
  const matchResults = await prisma.matchResult.findMany();
  const resultMap = new Map(matchResults.map((r) => [r.matchId, r]));

  // Score is 0 for now (no actual standings stored yet)
  const score = 0;

  // Get top 3 on leaderboard (scores all 0 for now)
  const allUsers = await prisma.user.findMany({
    include: {
      groupStandingPicks: true,
      bracketPicks: true,
    },
  });

  const leaderboard = allUsers
    .map((u) => ({
      username: u.username,
      score: 0,
      id: u.id,
    }))
    .sort((a, b) => b.score - a.score || a.username.localeCompare(b.username))
    .slice(0, 3);

  const totalGroups = GROUPS.length; // 12
  const completedGroupMatches = matchResults.filter(
    (r) => r.status === 'finished'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-wc-gold-400">{user.username}</span>!
          </h1>
          <p className="text-wc-green-300 mt-1">FIFA World Cup 2026 Pool</p>
        </div>
      </div>

      {/* Score + Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-4xl font-bold text-wc-gold-400">{score}</div>
          <div className="text-wc-green-300 text-sm mt-1">Your Points</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-white">{groupStandingPicksCount}</div>
          <div className="text-wc-green-300 text-sm mt-1">
            Groups Ranked
            <span className="text-wc-green-500 ml-1">/ {totalGroups}</span>
          </div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-white">{bracketPicksCount}</div>
          <div className="text-wc-green-300 text-sm mt-1">Bracket Picks</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-white">
            {completedGroupMatches}
          </div>
          <div className="text-wc-green-300 text-sm mt-1">Matches Played</div>
        </div>
      </div>

      {/* Picks Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-bold text-wc-gold-400 mb-3">Group Stage Rankings</h3>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-wc-green-300">Progress</span>
              <span className="text-white">
                {groupStandingPicksCount} / {totalGroups}
              </span>
            </div>
            <div className="w-full bg-wc-green-800 rounded-full h-2">
              <div
                className="bg-wc-gold-500 rounded-full h-2 transition-all"
                style={{
                  width: `${(groupStandingPicksCount / totalGroups) * 100}%`,
                }}
              />
            </div>
          </div>
          <Link href="/app/picks" className="btn-secondary text-sm block text-center mt-3">
            {groupStandingPicksCount === totalGroups ? 'Edit Picks' : 'Make Picks'}
          </Link>
        </div>

        <div className="card">
          <h3 className="font-bold text-wc-gold-400 mb-3">Bracket Picks</h3>
          <p className="text-wc-green-300 text-sm mb-3">
            {bracketPicksCount > 0
              ? `${bracketPicksCount} bracket picks made`
              : 'No bracket picks yet'}
          </p>
          <Link href="/app/picks" className="btn-secondary text-sm block text-center">
            {bracketPicksCount > 0 ? 'Edit Bracket' : 'Fill Bracket'}
          </Link>
        </div>

        <div className="card">
          <h3 className="font-bold text-wc-gold-400 mb-3">Champion Pick</h3>
          {championPick ? (
            <div>
              <div className="text-xl font-bold text-white mb-2">
                {championPick}
              </div>
              <p className="text-wc-green-300 text-sm">Your champion pick</p>
            </div>
          ) : (
            <p className="text-wc-green-300 text-sm mb-3">No champion picked yet</p>
          )}
          <Link href="/app/picks" className="btn-secondary text-sm block text-center mt-3">
            {championPick ? 'Change Pick' : 'Pick Champion'}
          </Link>
        </div>
      </div>

      {/* Top 3 Leaderboard */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-wc-gold-400 text-lg">Leaderboard</h3>
          <Link href="/app/standings" className="text-wc-green-300 hover:text-white text-sm">
            View All →
          </Link>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-wc-green-400 text-sm">No scores yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  entry.username === user.username
                    ? 'bg-wc-gold-500/20 border border-wc-gold-600'
                    : 'bg-wc-green-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </span>
                  <span className="font-medium text-white">{entry.username}</span>
                  {entry.username === user.username && (
                    <span className="text-xs text-wc-gold-400">(you)</span>
                  )}
                </div>
                <span className="font-bold text-wc-gold-400">{entry.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-bold text-wc-gold-400 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/app/picks" className="btn-secondary text-center text-sm">
            My Picks
          </Link>
          <Link href="/app/scores" className="btn-secondary text-center text-sm">
            Live Scores
          </Link>
          <Link href="/app/standings" className="btn-secondary text-center text-sm">
            Standings
          </Link>
          <Link href="/app/picks" className="btn-secondary text-center text-sm">
            Champion
          </Link>
        </div>
      </div>
    </div>
  );
}
