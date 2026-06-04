'use client';

import { useState, useEffect, useCallback } from 'react';
import { ALL_TEAMS } from '@/lib/worldcup-data';

export default function ChampionPickPage() {
  const [currentPick, setCurrentPick] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPick = useCallback(async () => {
    try {
      const res = await fetch('/api/picks/champion');
      const data = await res.json();
      if (data.pick) {
        setCurrentPick(data.pick.team);
        setSelectedTeam(data.pick.team);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPick();
  }, [fetchPick]);

  async function handleSave() {
    if (!selectedTeam) {
      setMessage('Please select a team');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/picks/champion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team: selectedTeam }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPick(selectedTeam);
        setMessage('Champion pick saved!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to save');
      }
    } catch {
      setMessage('Error saving pick');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-wc-green-300 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Pick Your Champion</h1>
        <p className="text-wc-green-300 text-sm mt-1">
          Who will lift the FIFA World Cup 2026 trophy?
        </p>
      </div>

      {/* Scoring info */}
      <div className="card bg-wc-green-900/50 border-wc-gold-700/50">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <div className="text-wc-gold-400 font-bold text-xl">+20 points</div>
            <div className="text-wc-green-300 text-sm">
              for correctly predicting the World Cup champion
            </div>
          </div>
        </div>
      </div>

      {/* Current pick display */}
      {currentPick && (
        <div className="card border-wc-gold-600">
          <div className="text-wc-green-400 text-sm mb-1">Your current pick:</div>
          <div className="text-2xl font-bold text-wc-gold-400">{currentPick}</div>
        </div>
      )}

      {/* Team selection */}
      <div className="card">
        <h3 className="font-bold text-white mb-4">Select Your Champion</h3>

        {/* Dropdown */}
        <div className="mb-4">
          <label className="block text-sm text-wc-green-300 mb-2">
            Search or select a team:
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="input-field"
          >
            <option value="">-- Select a team --</option>
            {ALL_TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Or click from grid */}
        <div className="mt-4">
          <p className="text-sm text-wc-green-400 mb-3">Or click a team:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {ALL_TEAMS.map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`py-2 px-2 rounded-lg text-sm font-medium transition-colors text-center ${
                  selectedTeam === team
                    ? 'bg-wc-gold-500 text-wc-green-950 font-bold'
                    : 'bg-wc-green-800 text-wc-green-200 hover:bg-wc-green-700 hover:text-white'
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving || !selectedTeam}
          className="btn-primary flex-1 py-3 text-lg"
        >
          {saving ? 'Saving...' : currentPick ? 'Update Champion Pick' : 'Save Champion Pick'}
        </button>
        {message && (
          <span
            className={`text-sm ${
              message.includes('saved') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </span>
        )}
      </div>

      {selectedTeam && (
        <div className="text-center text-wc-green-400 text-sm">
          Selected: <span className="text-white font-bold">{selectedTeam}</span>
        </div>
      )}
    </div>
  );
}
