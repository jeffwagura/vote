import React from 'react';

interface HowItWorksProps {
  onTryDemo: () => void;
  onOpenGuide: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onTryDemo,
  onOpenGuide,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Pick Your Star & Bundle',
      desc: 'Select your preferred nominee. Single vote costs KES 10, or choose discounted fan packages (e.g., 20 votes for KES 180, 50 votes for KES 400).',
      tag: '10 KES / vote',
    },
    {
      num: '02',
      title: 'Enter Safaricom Number',
      desc: 'Type your phone number (07XX... or 01XX...). StarVote transmits an encrypted STK request directly to Safaricom Daraja gateway.',
      tag: 'Instant Handshake',
    },
    {
      num: '03',
      title: 'STK Flash Prompt on Phone',
      desc: 'A pop-up modal appears directly on your mobile device screen with the exact fee and Paybill name. Enter your confidential 4-digit M-Pesa PIN.',
      tag: 'Secure & Direct',
    },
    {
      num: '04',
      title: 'Real-Time Vote Confirmation',
      desc: 'Safaricom sends an SMS receipt and webhooks StarVote. Your candidate’s vote counter and leaderboard standings increment immediately.',
      tag: 'Sub-second Tally',
    },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-b border-neutral-800">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          Payment Process
        </p>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          How M-Pesa STK Push Voting Operates
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          No manual Paybill typing or reference mistakes. The phone prompt does the heavy lifting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col justify-between hover:border-neutral-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold font-mono text-amber-400">
                  {step.num}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800">
                  {step.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Try Banner */}
      <div className="mt-10 p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-850 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Want to experience what the voter sees?</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Test the live smartphone SIM Toolkit dialog and PIN prompt simulator right now.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onTryDemo}
            className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            Launch Phone Screen Demo
          </button>
          <button
            onClick={onOpenGuide}
            className="px-4 py-2.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap border border-neutral-700"
          >
            Daraja Code Architecture
          </button>
        </div>
      </div>
    </section>
  );
};
