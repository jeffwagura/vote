import React from 'react';

interface FooterProps {
  onNavigate: (view: 'nominees' | 'leaderboard' | 'how-it-works' | 'developer-guide') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
        <div>
          <span className="text-sm font-bold text-white tracking-tight">StarVote Awards 2026</span>
          <p className="mt-1 text-neutral-500">
            Official public voting platform. Powered by Safaricom Daraja M-Pesa STK Push.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            onClick={() => onNavigate('nominees')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Nominees
          </button>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Leaderboard
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Payment Guide
          </button>
          <button
            onClick={() => onNavigate('developer-guide')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Daraja API Docs
          </button>
        </div>

        <p className="text-neutral-500 text-[11px]">
          &copy; {new Date().getFullYear()} StarVote. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
