'use client';

import { useState, useEffect, useCallback } from 'react';
import LiveScoreCard from '@/components/LiveScoreCard';

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  clock: string;
  date: string;
  competition: string;
}

export default function ScoresPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState('');

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch('/api/scores');
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGames(data.games || []);
        setLastUpdated(new Date());
        setError('');
      }
    } catch {
      setError('Failed to load scores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
    // Poll every 60 seconds
    const interval = setInterval(fetchScores, 60000);
    return () => clearInterval(interval);
  }, [fetchScores]);

  const liveGames = games.filter(
    (g) => g.status === 'in' || g.status === '1' || g.status === '2'
  );
  const finishedGames = games.filter((g) => g.status === 'post');
  const upcomingGames = games.filter((g) => g.status === 'pre');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Scores</h1>
          <p className="text-wc-green-300 text-sm mt-1">
            FIFA World Cup 2026 · Auto-refreshes every 60 seconds
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-wc-green-500">
              Updated {formatTime(lastUpdated)}
            </span>
          )}
          <button
            onClick={fetchScores}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            {loading ? '...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card border-red-700 bg-red-900/20">
          <p className="text-red-300 text-sm">{error}</p>
          <p className="text-wc-green-400 text-xs mt-1">
            The ESPN API may be temporarily unavailable. Try refreshing.
          </p>
        </div>
      )}

      {loading && !games.length ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-wc-green-300 text-lg">Loading scores...</div>
        </div>
      ) : (
        <>
          {/* Live Games */}
          {liveGames.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-lg font-bold text-red-400">Live Now</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveGames.map((game) => (
                  <LiveScoreCard key={game.id} {...game} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingGames.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-wc-green-300 mb-3">
                Upcoming
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingGames.map((game) => (
                  <LiveScoreCard key={game.id} {...game} />
                ))}
              </div>
            </div>
          )}

          {/* Finished */}
          {finishedGames.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-wc-green-300 mb-3">
                Final Results
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {finishedGames.map((game) => (
                  <LiveScoreCard key={game.id} {...game} />
                ))}
              </div>
            </div>
          )}

          {!loading && games.length === 0 && !error && (
            <div className="card text-center py-12">
              <div className="text-5xl mb-4">⚽</div>
              <h3 className="text-xl font-bold text-wc-green-300">
                No matches today
              </h3>
              <p className="text-wc-green-500 mt-2 text-sm">
                The World Cup group stage runs June 11 – June 27, 2026.
                Check back when matches begin!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
