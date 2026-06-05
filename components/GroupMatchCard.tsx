'use client';

interface GroupMatchCardProps {
  matchId: string;
  home: string;
  away: string;
  date: string;
  venue: string;
  city: string;
  currentPick: string | null;
  locked: boolean;
  result: string | null;
  homeGoals: number | null;
  awayGoals: number | null;
  status: string;
  onPickChange: (matchId: string, pick: string) => void;
}

export default function GroupMatchCard({
  matchId,
  home,
  away,
  date,
  venue,
  city,
  currentPick,
  locked,
  result,
  homeGoals,
  awayGoals,
  status,
  onPickChange,
}: GroupMatchCardProps) {
  const isCorrect = result && currentPick === result;
  const isWrong = result && currentPick && currentPick !== result;

  const formatDate = (d: string) => {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const options = [
    { value: 'home', label: home },
    { value: 'draw', label: 'Draw' },
    { value: 'away', label: away },
  ];

  return (
    <div
      className={`card relative ${
        isCorrect
          ? 'border-wc-green-500'
          : isWrong
          ? 'border-wc-red-500'
          : 'border-wc-navy-700'
      }`}
    >
      {/* Status badges */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-wc-navy-400 font-mono">{matchId}</span>
        <div className="flex items-center gap-2">
          {status === 'live' && (
            <span className="flex items-center gap-1 text-xs bg-wc-red-500 text-white px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          {locked && (
            <span className="text-xs bg-wc-navy-800 text-wc-navy-400 px-2 py-0.5 rounded-full">
              🔒 Locked
            </span>
          )}
          {isCorrect && (
            <span className="text-xs bg-wc-green-800 text-wc-green-300 px-2 py-0.5 rounded-full">
              ✓ +1pt
            </span>
          )}
          {isWrong && (
            <span className="text-xs bg-wc-red-700 text-wc-red-300 px-2 py-0.5 rounded-full">
              ✗ -1pt
            </span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-white text-sm flex-1 text-right pr-2">
          {home}
        </span>
        {status === 'finished' || status === 'live' ? (
          <span className="text-wc-gold-400 font-bold text-lg px-2 min-w-[3rem] text-center">
            {homeGoals ?? 0} - {awayGoals ?? 0}
          </span>
        ) : (
          <span className="text-wc-navy-400 text-sm px-2">vs</span>
        )}
        <span className="font-semibold text-white text-sm flex-1 text-left pl-2">
          {away}
        </span>
      </div>

      {/* Date/Venue */}
      <div className="text-xs text-wc-navy-400 text-center mb-3">
        {formatDate(date)} · {city}
      </div>

      {/* Pick options */}
      <div className="grid grid-cols-3 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            disabled={locked}
            onClick={() => !locked && onPickChange(matchId, opt.value)}
            className={`py-1.5 px-1 rounded text-xs font-medium transition-colors duration-150 text-center ${
              currentPick === opt.value
                ? 'bg-wc-blue-500 text-white font-bold'
                : locked
                ? 'bg-wc-navy-800 text-wc-navy-600 cursor-not-allowed'
                : 'bg-wc-navy-700 text-wc-navy-200 hover:bg-wc-navy-600 hover:text-white cursor-pointer'
            }`}
          >
            {opt.value === 'home' ? home.split(' ')[0] : opt.value === 'away' ? away.split(' ')[0] : 'Draw'}
          </button>
        ))}
      </div>

      {/* Result label */}
      {result && (
        <div className="mt-2 text-xs text-center text-wc-navy-400">
          Result: {result === 'home' ? home + ' win' : result === 'away' ? away + ' win' : 'Draw'}
        </div>
      )}
    </div>
  );
}
