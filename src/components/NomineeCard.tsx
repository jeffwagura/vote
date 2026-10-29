import React, { useState } from 'react';
import { Nominee } from '../types';

interface NomineeCardProps {
  nominee: Nominee;
  rank: number;
  totalCategoryVotes: number;
  onVote: (nominee: Nominee) => void;
  onPreviewSTK: (nominee: Nominee) => void;
}

export const NomineeCard: React.FC<NomineeCardProps> = ({
  nominee,
  rank,
  totalCategoryVotes,
  onVote,
  onPreviewSTK,
}) => {
  const [imgError, setImgError] = useState(false);
  const percentShare = totalCategoryVotes > 0
    ? ((nominee.votes / totalCategoryVotes) * 100).toFixed(1)
    : '0';

  return (
    <article className="flex flex-col bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-all duration-200">
      {/* Top Image Frame */}
      <div className="relative aspect-4/3 w-full bg-neutral-800 overflow-hidden">
        {!imgError ? (
          <img
            src={nominee.imageUrl}
            alt={`${nominee.name} - Nominee Portrait`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top hover:scale-103 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 text-center">
            <span className="text-3xl mb-2">⭐</span>
            <span className="text-base font-semibold text-white">{nominee.name}</span>
            <span className="text-xs text-neutral-400 mt-1">{nominee.category}</span>
          </div>
        )}

        {/* Clean Rank Badge & Share Code */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md text-amber-400 font-mono font-bold rounded-md border border-neutral-800">
            #{rank} Contender
          </span>
          <span className="px-2 py-0.5 bg-neutral-950/80 backdrop-blur-md text-neutral-300 font-mono text-[11px] rounded border border-neutral-800">
            {nominee.shareCode}
          </span>
        </div>

        {/* Gradient Scrim for baseline text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-xs text-amber-400/90 font-medium">{nominee.category}</p>
          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            {nominee.name}
          </h3>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {nominee.bio}
          </p>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-500">{nominee.notableWork}</span>
            <span className="text-neutral-400 font-mono tabular-nums">{percentShare}% share</span>
          </div>

          {/* Progress bar visual for vote weight */}
          <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(8, Number(percentShare)))}%` }}
            />
          </div>
        </div>

        {/* Live Vote Count & Action Block */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">Verified Votes</p>
            <p className="text-lg font-bold text-white font-mono tabular-nums">
              {nominee.votes.toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreviewSTK(nominee)}
              title="Preview exact phone prompt screen"
              className="px-2.5 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer border border-neutral-700/60"
            >
              Phone View
            </button>
            <button
              onClick={() => onVote(nominee)}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
            >
              Vote (M-Pesa)
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
