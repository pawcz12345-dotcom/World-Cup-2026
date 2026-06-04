'use client';

interface LiveScoreCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  clock: string;
  competition: string;
}

export default function LiveScoreCard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  status,
  clock,
  competition,
}: LiveScoreCardProps) {
  const isLive = status === 'in' || status === '1' || status === '2';
  const isFinal = status === 'post';
  const isPre = status === 'pre';

  return (
    <div className={`card border ${isLive ? 'border-red-600' : 'border-wc-green-700'}`}>
      {/* Competition label */}
      <div className="text-xs text-wc-green-400 mb-2 font-medium">{competition}</div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{homeTeam}</div>
        </div>

        <div className="px-4 text-center min-w-[80px]">
          {isPre ? (
            <div className="text-wc-green-400 text-sm font-medium">vs</div>
          ) : (
            <div className="text-2xl font-bold text-wc-gold-400">
              {homeScore} - {awayScore}
            </div>
          )}
        </div>

        <div className="flex-1 text-right">
          <div className="font-semibold text-white text-sm">{awayTeam}</div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-2 text-center">
        {isLive && (
          <span className="inline-flex items-center gap-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            LIVE {clock && `· ${clock}'`}
          </span>
        )}
        {isFinal && (
          <span className="text-xs text-wc-green-400">Full Time</span>
        )}
        {isPre && (
          <span className="text-xs text-wc-green-400">Upcoming</span>
        )}
        {!isLive && !isFinal && !isPre && (
          <span className="text-xs text-wc-green-400 capitalize">{status}</span>
        )}
      </div>
    </div>
  );
}
