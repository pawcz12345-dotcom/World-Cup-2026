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
  homeTeam, awayTeam, homeScore, awayScore, status, clock, competition,
}: LiveScoreCardProps) {
  const isLive   = status === 'in' || status === '1' || status === '2';
  const isFinal  = status === 'post';
  const isPre    = status === 'pre';

  return (
    <div className={`relative rounded-2xl border p-4 transition-all shadow-lg ${
      isLive
        ? 'border-wc-red-500/50 bg-gradient-to-br from-wc-navy-900 to-wc-navy-950 shadow-wc-red-900/20'
        : 'border-wc-navy-700/70 bg-wc-navy-900 shadow-black/20'
    }`}>
      {/* Live glow accent */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-wc-red-600 via-wc-red-500 to-wc-red-600" />
      )}

      {/* Competition badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-wc-navy-600 font-bold uppercase tracking-[0.12em] truncate flex-1">
          {competition}
        </span>
        {isLive && (
          <span className="flex items-center gap-1.5 text-[11px] bg-wc-red-500/15 text-wc-red-400 border border-wc-red-500/25 px-2 py-0.5 rounded-full font-black ml-2 flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-wc-red-400 rounded-full animate-pulse" />
            LIVE{clock ? ` ${clock}'` : ''}
          </span>
        )}
        {isFinal && (
          <span className="text-[11px] text-wc-navy-500 font-bold ml-2">FT</span>
        )}
        {isPre && (
          <span className="text-[11px] text-wc-navy-500 font-bold ml-2">PRE</span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="text-right">
          <div className="font-bold text-white text-sm leading-tight truncate">{homeTeam}</div>
        </div>

        <div className="px-2 text-center flex-shrink-0 min-w-[3.5rem]">
          {isPre ? (
            <div className="text-wc-navy-600 text-sm font-black">VS</div>
          ) : (
            <div className={`text-2xl font-black tabular-nums leading-none ${isLive ? 'text-wc-red-400' : 'text-wc-gold-400'}`}>
              {homeScore}–{awayScore}
            </div>
          )}
        </div>

        <div className="text-left">
          <div className="font-bold text-white text-sm leading-tight truncate">{awayTeam}</div>
        </div>
      </div>

      {/* Status footer */}
      {!isLive && (
        <div className="mt-3 pt-2.5 border-t border-wc-navy-800/60 text-center">
          {isFinal && <span className="text-xs text-wc-navy-500 font-semibold">Full Time</span>}
          {isPre && <span className="text-xs text-wc-navy-500 font-semibold">Upcoming</span>}
          {!isFinal && !isPre && (
            <span className="text-xs text-wc-navy-500 capitalize font-medium">{status}</span>
          )}
        </div>
      )}
    </div>
  );
}
