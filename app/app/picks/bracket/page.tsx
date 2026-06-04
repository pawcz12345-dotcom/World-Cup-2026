'use client';

import { useState, useEffect, useCallback } from 'react';
import BracketSlot from '@/components/BracketSlot';
import { ALL_TEAMS, BRACKET_ROUNDS } from '@/lib/worldcup-data';

interface BracketPickMap {
  [key: string]: string; // key = "round-slot"
}

export default function BracketPicksPage() {
  const [picks, setPicks] = useState<BracketPickMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPicks = useCallback(async () => {
    try {
      const res = await fetch('/api/picks/bracket');
      const data = await res.json();
      if (data.picks) {
        const pickMap: BracketPickMap = {};
        for (const p of data.picks) {
          pickMap[`${p.round}-${p.slot}`] = p.team;
        }
        setPicks(pickMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPicks();
  }, [fetchPicks]);

  function handlePickChange(round: string, slot: number, team: string) {
    const key = `${round}-${slot}`;
    setPicks((prev) => ({
      ...prev,
      [key]: team,
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const bracketPicks = Object.entries(picks).map(([key, team]) => {
        const [round, slotStr] = key.split('-');
        return { round, slot: parseInt(slotStr), team };
      });

      const res = await fetch('/api/picks/bracket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ picks: bracketPicks }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Bracket picks saved!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to save');
      }
    } catch {
      setMessage('Error saving picks');
    } finally {
      setSaving(false);
    }
  }

  const totalPicked = Object.keys(picks).length;
  const totalSlots = BRACKET_ROUNDS.reduce((sum, r) => sum + r.slots, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-wc-green-300 text-lg">Loading bracket...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Knockout Bracket Picks</h1>
          <p className="text-wc-green-300 text-sm mt-1">
            Pick which team advances in each round ({totalPicked} / {totalSlots} picked)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-sm ${
                message.includes('saved') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {message}
            </span>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Bracket'}
          </button>
        </div>
      </div>

      {/* Scoring legend */}
      <div className="card bg-wc-green-900/50 border-wc-green-800">
        <div className="flex flex-wrap gap-4 text-sm">
          {BRACKET_ROUNDS.map((r) => (
            <div key={r.id}>
              <span className="text-wc-green-400">{r.name}:</span>{' '}
              <span className="text-wc-gold-400 font-bold">{r.points} pts</span>
            </div>
          ))}
        </div>
        <p className="text-wc-green-400 text-xs mt-2">
          Note: The knockout bracket starts after group stage concludes (June 28+). Bracket picks open now.
        </p>
      </div>

      {/* Rounds */}
      <div className="space-y-8">
        {BRACKET_ROUNDS.map((round) => {
          const roundPicks = Array.from(
            { length: round.slots },
            (_, i) => picks[`${round.id}-${i + 1}`] || null
          );
          const pickedCount = roundPicks.filter(Boolean).length;

          return (
            <div key={round.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-wc-gold-400 text-lg">{round.name}</h3>
                  <p className="text-wc-green-400 text-sm">
                    {pickedCount} / {round.slots} slots picked ·{' '}
                    <span className="text-wc-gold-500">+{round.points} pts each</span>
                  </p>
                </div>
                {pickedCount === round.slots && (
                  <span className="text-green-400 text-sm">All picked ✓</span>
                )}
              </div>

              <div
                className={`grid gap-3 ${
                  round.slots <= 4
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : round.slots <= 8
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}
              >
                {Array.from({ length: round.slots }, (_, i) => i + 1).map(
                  (slot) => (
                    <BracketSlot
                      key={`${round.id}-${slot}`}
                      round={round.id}
                      slot={slot}
                      currentPick={picks[`${round.id}-${slot}`] || null}
                      teams={ALL_TEAMS}
                      locked={false}
                      onPickChange={handlePickChange}
                    />
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : 'Save Bracket Picks'}
        </button>
      </div>
    </div>
  );
}
