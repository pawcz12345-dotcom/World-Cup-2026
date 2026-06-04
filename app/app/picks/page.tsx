'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GroupOverview from '@/components/picks/GroupOverview';
import GroupDetailModal from '@/components/picks/GroupDetailModal';
import KnockoutBracket from '@/components/picks/KnockoutBracket';
import { GROUPS, GROUP_MATCHES, ALL_TEAMS } from '@/lib/worldcup-data';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function PicksPage() {
  // matchId -> "home"|"draw"|"away"
  const [matchPicks, setMatchPicks] = useState<Record<string, string>>({});
  // "round-slot" -> team
  const [bracketPicks, setBracketPicks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const bracketTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved picks on mount
  const fetchPicks = useCallback(async () => {
    try {
      const [groupRes, bracketRes] = await Promise.all([
        fetch('/api/picks/groups'),
        fetch('/api/picks/bracket'),
      ]);
      const groupData = await groupRes.json();
      if (groupData.picks) setMatchPicks(groupData.picks);

      const bracketData = await bracketRes.json();
      if (bracketData.picks) {
        const map: Record<string, string> = {};
        for (const p of bracketData.picks as { round: string; slot: number; team: string }[]) {
          map[`${p.round}-${p.slot}`] = p.team;
        }
        setBracketPicks(map);
      }
    } catch (err) {
      console.error('Error loading picks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPicks();
    return () => {
      bracketTimers.current.forEach((t) => clearTimeout(t));
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, [fetchPicks]);

  function showSaved() {
    setSaveStatus('saved');
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setSaveStatus('idle'), 2500);
  }
  function showError() {
    setSaveStatus('error');
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setSaveStatus('idle'), 3000);
  }

  // Save a single match pick immediately on click
  async function handleMatchPickChange(matchId: string, pick: string) {
    setMatchPicks((prev) => ({ ...prev, [matchId]: pick }));
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/picks/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, pick }),
      });
      res.ok ? showSaved() : showError();
    } catch {
      showError();
    }
  }

  // Bracket picks debounced 400ms
  function handleBracketChange(round: string, slot: number, team: string) {
    const key = `${round}-${slot}`;
    setBracketPicks((prev) => ({ ...prev, [key]: team }));
    const timerKey = `bracket-${key}`;
    const existing = bracketTimers.current.get(timerKey);
    if (existing) clearTimeout(existing);
    setSaveStatus('saving');
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/picks/bracket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ round, slot, team }),
        });
        res.ok ? showSaved() : showError();
      } catch { showError(); }
      bracketTimers.current.delete(timerKey);
    }, 400);
    bracketTimers.current.set(timerKey, t);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-green-300 text-lg animate-pulse">Loading picks...</div>
      </div>
    );
  }

  const totalMatches = GROUP_MATCHES.length;
  const pickedMatches = Object.keys(matchPicks).length;
  const bracketSlots = Object.keys(bracketPicks).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">My Picks</h1>
          <p className="text-green-400 text-sm mt-1">
            {pickedMatches}/{totalMatches} group matches · {bracketSlots} bracket slots
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {saveStatus === 'saving' && <span className="text-green-300 animate-pulse">Saving...</span>}
          {saveStatus === 'saved'  && <span className="text-green-400 font-medium">Saved ✓</span>}
          {saveStatus === 'error'  && <span className="text-red-400 font-medium">Save failed</span>}
        </div>
      </div>

      {/* Group Stage */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-yellow-400">Group Stage</h2>
          <p className="text-green-400 text-sm mt-1">
            Click a group to pick each match. Top 2 + 8 best 3rd-place teams advance to Round of 32.
          </p>
          <div className="mt-2 text-xs text-green-500">
            Correct result: <span className="text-yellow-400 font-semibold">+3 pts</span>
          </div>
        </div>

        <GroupOverview
          groups={GROUPS}
          matchPicks={matchPicks}
          onSelectGroup={setSelectedGroup}
        />

        {selectedGroup && (
          <GroupDetailModal
            group={GROUPS.find((g) => g.id === selectedGroup)!}
            matchPicks={matchPicks}
            onPickChange={handleMatchPickChange}
            onClose={() => setSelectedGroup(null)}
          />
        )}
      </section>

      {/* Knockout Bracket */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-yellow-400">Knockout Bracket</h2>
          <p className="text-green-400 text-sm mt-1">
            Pick the winner of each round. R32=2pts · R16=3pts · QF=5pts · SF=8pts · Final=13pts · Champion=20pts
          </p>
        </div>
        <div className="bg-green-900/50 border border-green-700 rounded-xl p-4">
          <KnockoutBracket
            picks={bracketPicks}
            onChange={handleBracketChange}
            locked={false}
            allTeams={ALL_TEAMS}
          />
        </div>
      </section>
    </div>
  );
}
