'use client';

import { useState, useEffect, useCallback } from 'react';
import GroupMatchCard from '@/components/GroupMatchCard';
import { GROUPS, GROUP_MATCHES } from '@/lib/worldcup-data';

interface PickMap {
  [matchId: string]: string;
}

interface ResultMap {
  [matchId: string]: {
    result: string | null;
    homeGoals: number | null;
    awayGoals: number | null;
    status: string;
  };
}

export default function GroupPicksPage() {
  const [picks, setPicks] = useState<PickMap>({});
  const [results, setResults] = useState<ResultMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeGroup, setActiveGroup] = useState('A');

  const fetchPicksAndResults = useCallback(async () => {
    try {
      const [picksRes, resultsRes] = await Promise.all([
        fetch('/api/picks/groups'),
        fetch('/api/picks/groups?results=1'),
      ]);
      const picksData = await picksRes.json();
      if (picksData.picks) {
        const pickMap: PickMap = {};
        for (const p of picksData.picks) {
          pickMap[p.matchId] = p.pick;
        }
        setPicks(pickMap);
      }

      const resultsData = await resultsRes.json();
      if (resultsData.results) {
        const resMap: ResultMap = {};
        for (const r of resultsData.results) {
          resMap[r.matchId] = r;
        }
        setResults(resMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPicksAndResults();
  }, [fetchPicksAndResults]);

  function handlePickChange(matchId: string, pick: string) {
    setPicks((prev) => ({ ...prev, [matchId]: pick }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/picks/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picks }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Picks saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to save picks');
      }
    } catch {
      setMessage('Error saving picks');
    } finally {
      setSaving(false);
    }
  }

  const now = new Date();
  const isMatchLocked = (matchDate: string) => {
    return new Date(matchDate + 'T00:00:00') <= now;
  };

  const groupMatches = GROUP_MATCHES.filter((m) => m.group === activeGroup);
  const totalPicked = Object.keys(picks).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-wc-green-300 text-lg">Loading picks...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Group Stage Picks</h1>
          <p className="text-wc-green-300 text-sm mt-1">
            Predict the result of each group match ({totalPicked} / {GROUP_MATCHES.length} picked)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-sm ${
                message.includes('success') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? 'Saving...' : 'Save Picks'}
          </button>
        </div>
      </div>

      {/* Scoring info */}
      <div className="card bg-wc-green-900/50 border-wc-green-800">
        <p className="text-sm text-wc-green-300">
          <span className="text-wc-gold-400 font-bold">+3 points</span> for each correct group stage result (Win/Draw/Loss).
          Picks lock when a match begins.
        </p>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap gap-2">
        {GROUPS.map((group) => {
          const groupPicks = GROUP_MATCHES.filter((m) => m.group === group.id)
            .filter((m) => picks[m.matchId])
            .length;
          return (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeGroup === group.id
                  ? 'bg-wc-gold-500 text-wc-green-950'
                  : 'bg-wc-green-800 text-wc-green-200 hover:bg-wc-green-700'
              }`}
            >
              Group {group.id}
              {groupPicks === 6 && (
                <span className="ml-1 text-green-400">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Group info */}
      {GROUPS.filter((g) => g.id === activeGroup).map((group) => (
        <div key={group.id}>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-bold text-wc-gold-400">{group.name}</h2>
            <div className="flex gap-2 flex-wrap">
              {group.teams.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-wc-green-800 text-wc-green-300 px-2 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupMatches.map((match) => {
              const locked = isMatchLocked(match.date);
              const result = results[match.matchId];
              return (
                <GroupMatchCard
                  key={match.matchId}
                  matchId={match.matchId}
                  home={match.home}
                  away={match.away}
                  date={match.date}
                  venue={match.venue}
                  city={match.city}
                  currentPick={picks[match.matchId] ?? null}
                  locked={locked}
                  result={result?.result ?? null}
                  homeGoals={result?.homeGoals ?? null}
                  awayGoals={result?.awayGoals ?? null}
                  status={result?.status ?? 'scheduled'}
                  onPickChange={handlePickChange}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Save button at bottom */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save All Picks'}
        </button>
      </div>
    </div>
  );
}
