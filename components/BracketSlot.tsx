'use client';

interface BracketSlotProps {
  round: string;
  slot: number;
  currentPick: string | null;
  teams: string[];
  locked: boolean;
  onPickChange: (round: string, slot: number, team: string) => void;
}

export default function BracketSlot({
  round,
  slot,
  currentPick,
  teams,
  locked,
  onPickChange,
}: BracketSlotProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-wc-green-500 w-8 text-right">#{slot}</span>
      <select
        value={currentPick || ''}
        disabled={locked}
        onChange={(e) => onPickChange(round, slot, e.target.value)}
        className={`flex-1 rounded-lg px-3 py-2 text-sm border transition-colors ${
          locked
            ? 'bg-wc-green-800 border-wc-green-700 text-wc-green-500 cursor-not-allowed'
            : currentPick
            ? 'bg-wc-green-800 border-wc-gold-600 text-wc-gold-300'
            : 'bg-wc-green-800 border-wc-green-600 text-wc-green-300'
        } focus:outline-none focus:ring-2 focus:ring-wc-gold-500`}
      >
        <option value="">-- Select team --</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
      {locked && (
        <span className="text-wc-green-600 text-xs">🔒</span>
      )}
    </div>
  );
}
