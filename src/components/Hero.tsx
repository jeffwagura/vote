import React from 'react';
import { HERO_IMAGE } from '../data/awardsData';

interface HeroProps {
  totalVotes: number;
  onExploreNominees: () => void;
  onViewIntegration: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalVotes,
  onExploreNominees,
  onViewIntegration,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
              <span>Official 2026 People&apos;s Choice</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-400">Voting Window Open</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-emerald-400">Instant M-Pesa STK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Vote for your favorite stars with instant M-Pesa STK push.
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed">
              Empower your celebrated musicians, screen talents, and creators. Enter your Safaricom number to receive an encrypted STK prompt directly on your handset, key in your PIN, and count your votes in real time.
            </p>

            {/* Quick Metrics Strip with Tabular Numerals */}
            <div className="grid grid-cols-3 gap-4 pt-2 pb-2 border-y border-neutral-800/80 max-w-lg">
              <div>
                <p className="text-xs text-neutral-500 font-medium">Total Public Votes</p>
                <p className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
                  {totalVotes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Standard Fee</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono tabular-nums">
                  KES 10<span className="text-xs text-neutral-400 font-normal">/vote</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Confirmation</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                  &lt; 3s <span className="text-xs text-neutral-400 font-normal">STK</span>
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreNominees}
                className="px-6 py-3 text-sm font-semibold text-neutral-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
              >
                Browse Nominees &amp; Vote
              </button>
              <button
                onClick={onViewIntegration}
                className="px-5 py-3 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                How M-Pesa STK Push Works
              </button>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Stage Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src={HERO_IMAGE}
                alt="Annual Celebrity Awards Ceremony Stage with Golden Lights"
                referrerPolicy="no-referrer"
                className="w-full aspect-16/10 object-cover transform group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium text-white">Live Stage Broadcast</span>
                <span className="font-mono tabular-nums text-amber-400">Gala Closes in 18d 04h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
