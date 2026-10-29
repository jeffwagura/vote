import React from 'react';
import { Nominee } from '../types';

interface LeaderboardProps {
  nominees: Nominee[];
  activeCategoryId: string;
  onVote: (nominee: Nominee) => void;
  onPreviewSTK: (nominee: Nominee) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  nominees,
  activeCategoryId,
  onVote,
  onPreviewSTK,
}) => {
  const filtered = activeCategoryId === 'all'
    ? nominees
    : nominees.filter((n) => n.categoryId === activeCategoryId);

  const sorted = [...filtered].sort((a, b) => b.votes - a.votes);
  const highestVotes = sorted.length > 0 ? sorted[0].votes : 1;
  const totalCategoryVotes = sorted.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <section className="py-12 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Verified Standings</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Real-Time Award Leaderboard
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Votes authenticated through Safaricom M-Pesa STK receipts.
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-neutral-500">Total Valid Ballots Cast</p>
          <p className="text-2xl font-bold text-white font-mono tabular-nums">
            {totalCategoryVotes.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-neutral-800/80">
          {sorted.map((nominee, idx) => {
            const rank = idx + 1;
            const voteShare = totalCategoryVotes > 0
              ? ((nominee.votes / totalCategoryVotes) * 100).toFixed(1)
              : '0';
            const barWidth = Math.max(5, (nominee.votes / highestVotes) * 100);

            return (
              <div
                key={nominee.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-850/50 transition-colors"
              >
                {/* Left: Rank, Avatar, Name & Category */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                      rank === 1
                        ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                        : rank === 2
                        ? 'bg-neutral-700 text-white'
                        : rank === 3
                        ? 'bg-amber-900/60 text-amber-200'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    #{rank}
                  </span>

                  <img
                    src={nominee.imageUrl}
                    alt={nominee.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-neutral-700"
                  />

                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">
                      {nominee.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {nominee.category} · <span className="font-mono text-neutral-500">{nominee.shareCode}</span>
                    </p>
                  </div>
                </div>

                {/* Middle: Vote Weight Bar */}
                <div className="flex-1 max-w-md w-full">
                  <div className="flex justify-between text-xs mb-1.5 font-mono">
                    <span className="text-neutral-300 font-semibold tabular-nums">
                      {nominee.votes.toLocaleString()} votes
                    </span>
                    <span className="text-neutral-500 tabular-nums">
                      {voteShare}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        rank === 1
                          ? 'bg-amber-400'
                          : rank === 2
                          ? 'bg-amber-200/80'
                          : 'bg-neutral-600'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    onClick={() => onPreviewSTK(nominee)}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Phone View
                  </button>
                  <button
                    onClick={() => onVote(nominee)}
                    className="px-4 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    Vote (M-Pesa)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
