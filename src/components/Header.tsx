import React from 'react';

interface HeaderProps {
  activeView: 'nominees' | 'leaderboard' | 'how-it-works' | 'developer-guide';
  onNavigate: (view: 'nominees' | 'leaderboard' | 'how-it-works' | 'developer-guide') => void;
  onOpenQuickVote: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  onOpenQuickVote,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('nominees')}
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          StarVote Awards
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onNavigate('nominees')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'nominees' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Nominees
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'leaderboard' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'how-it-works' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            How to Vote
          </button>
          <button
            onClick={() => onNavigate('developer-guide')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'developer-guide' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            M-Pesa STK Setup
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuickVote}
            className="px-4 py-2 text-xs font-semibold tracking-wide text-neutral-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cast Vote (M-Pesa)
          </button>
        </div>
      </div>
    </header>
  );
};
