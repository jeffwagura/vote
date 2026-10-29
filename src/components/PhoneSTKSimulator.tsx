import React, { useState, useEffect } from 'react';
import { Nominee, VotePackage } from '../types';

interface PhoneSTKSimulatorProps {
  nominee: Nominee;
  selectedPackage: VotePackage | { votes: number; priceKes: number };
  phoneNumber: string;
  onSuccess: (receipt: string) => void;
  onCancel: () => void;
  isStandalone?: boolean;
}

export const PhoneSTKSimulator: React.FC<PhoneSTKSimulatorProps> = ({
  nominee,
  selectedPackage,
  phoneNumber,
  onSuccess,
  onCancel,
  isStandalone = false,
}) => {
  const [pin, setPin] = useState('');
  const [stage, setStage] = useState<'prompt' | 'processing' | 'confirmed' | 'cancelled'>('prompt');
  const [timer, setTimer] = useState(45);
  const [receiptCode, setReceiptCode] = useState('');

  // Generate random M-PESA receipt code (e.g. QK89LK41XP)
  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'QK';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setReceiptCode(code);
  }, []);

  // Countdown timer for STK prompt timeout
  useEffect(() => {
    if (stage !== 'prompt') return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStage('cancelled');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmitPin = () => {
    if (pin.length < 4) {
      // Auto-fill pin for easy testing if empty
      setPin('1234');
    }
    setStage('processing');

    setTimeout(() => {
      setStage('confirmed');
      setTimeout(() => {
        onSuccess(receiptCode);
      }, 1400);
    }, 1600);
  };

  // Format phone display
  const cleanPhone = phoneNumber || '0712 345 678';

  return (
    <div className={`flex flex-col items-center ${isStandalone ? 'p-4' : ''}`}>
      {/* Visual Indicator of what this is */}
      <div className="mb-3 text-center">
        <p className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Voter&apos;s Phone Screen (Live STK Push Outlook)
        </p>
        <p className="text-[11px] text-neutral-400">
          This is exactly what pops up on the voter&apos;s handset via Safaricom STK
        </p>
      </div>

      {/* Modern Smartphone Bezel Frame */}
      <div className="relative w-[310px] sm:w-[320px] bg-neutral-900 rounded-[44px] p-3 shadow-2xl border-4 border-neutral-700/80 ring-1 ring-neutral-800">
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-950 rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
        </div>

        {/* Screen Glass Area */}
        <div className="relative w-full h-[580px] bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 rounded-[34px] overflow-hidden flex flex-col justify-between p-4 text-white select-none">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-[11px] text-neutral-300 px-2 pt-1 z-10 font-mono">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-emerald-400 font-bold">Safaricom 5G</span>
              <span>88%</span>
            </div>
          </div>

          {/* Dimmed Phone Wallpaper / Background Content */}
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none p-6 text-center opacity-30">
            <div className="w-16 h-16 rounded-full bg-emerald-600/30 flex items-center justify-center mb-3 text-2xl">
              ⭐
            </div>
            <p className="text-xs text-neutral-300">StarVote Portal</p>
            <p className="text-[11px] text-neutral-500">Waiting for M-Pesa response...</p>
          </div>

          {/* 1. STK PROMPT MODAL (Safaricom SIM Toolkit Dialogue) */}
          {stage === 'prompt' && (
            <div className="relative z-20 my-auto bg-neutral-900/95 border border-neutral-700 rounded-2xl p-4 shadow-2xl text-neutral-100 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  SIM Tool Kit · M-PESA
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {timer}s left
                </span>
              </div>

              {/* The exact Safaricom STK prompt text */}
              <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                Do you want to pay <span className="font-bold text-white font-mono">KES {selectedPackage.priceKes}.00</span> to{' '}
                <span className="font-semibold text-emerald-400">STARVOTE AWARDS</span> (Paybill 892340 Acc: {nominee.shareCode}) for {selectedPackage.votes} vote{selectedPackage.votes > 1 ? 's' : ''}?
              </p>

              {/* PIN input display */}
              <div className="mt-4 mb-2">
                <label className="block text-[11px] text-neutral-400 mb-1 text-center font-medium">
                  Enter M-PESA PIN
                </label>
                <div className="flex items-center justify-center gap-3 py-2 bg-neutral-950 rounded-lg border border-neutral-700">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full transition-all ${
                        pin.length > idx
                          ? 'bg-emerald-400 scale-110 shadow-sm shadow-emerald-500/50'
                          : 'bg-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STK Dialog Buttons (Cancel & OK) */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setStage('cancelled');
                    setTimeout(onCancel, 600);
                  }}
                  className="py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800/80 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPin}
                  className="py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Send (OK)
                </button>
              </div>
            </div>
          )}

          {/* 2. PROCESSING STATE */}
          {stage === 'processing' && (
            <div className="relative z-20 my-auto bg-neutral-900/95 border border-neutral-700 rounded-2xl p-6 shadow-2xl text-center space-y-3">
              <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-white">Sending to M-PESA Network</p>
              <p className="text-[11px] text-neutral-400">Verifying PIN &amp; reserving KES {selectedPackage.priceKes}.00...</p>
            </div>
          )}

          {/* 3. CONFIRMED POPUP & SMS RECEIPT */}
          {stage === 'confirmed' && (
            <div className="relative z-20 my-auto bg-neutral-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 border-b border-neutral-800 pb-2">
                <span className="text-base">✓</span>
                <span className="text-xs font-bold uppercase tracking-wide">M-PESA Confirmed</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1.5 leading-relaxed">
                <p className="text-emerald-400 font-bold">{receiptCode} Confirmed.</p>
                <p>
                  Ksh {selectedPackage.priceKes}.00 sent to <span className="text-white font-semibold">STARVOTE AWARDS</span> for {selectedPackage.votes} vote(s) to <span className="text-amber-300 font-semibold">{nominee.name}</span>.
                </p>
                <p className="text-neutral-500 text-[10px]">
                  Ref: {nominee.shareCode} · Balance updated.
                </p>
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] text-emerald-400 font-medium">Votes successfully added to public tally!</span>
              </div>
            </div>
          )}

          {/* 4. CANCELLED STATE */}
          {stage === 'cancelled' && (
            <div className="relative z-20 my-auto bg-neutral-900/95 border border-red-500/40 rounded-2xl p-5 shadow-2xl text-center space-y-3">
              <div className="w-8 h-8 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center mx-auto text-sm font-bold">
                ✕
              </div>
              <p className="text-xs font-semibold text-white">Transaction Cancelled</p>
              <p className="text-[11px] text-neutral-400">Prompt was dismissed or timed out on phone.</p>
              <button
                onClick={() => {
                  setStage('prompt');
                  setTimer(45);
                  setPin('');
                }}
                className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded-md cursor-pointer"
              >
                Retry STK Push
              </button>
            </div>
          )}

          {/* Phone Simulated Keypad (Interactive for testing) */}
          {stage === 'prompt' && (
            <div className="relative z-20 pt-2 pb-1 border-t border-neutral-800/80">
              <div className="grid grid-cols-3 gap-2 px-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className="h-9 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 active:scale-95 text-white font-mono text-sm font-semibold transition-all flex items-center justify-center cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => setPin('1234')}
                  className="h-9 rounded-lg bg-neutral-800/40 hover:bg-neutral-800 text-[10px] text-neutral-400 flex items-center justify-center cursor-pointer"
                  title="Auto-fill 1234 demo PIN"
                >
                  Auto
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="h-9 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 active:scale-95 text-white font-mono text-sm font-semibold transition-all flex items-center justify-center cursor-pointer"
                >
                  0
                </button>
                <button
                  onClick={handleBackspace}
                  className="h-9 rounded-lg bg-neutral-800/40 hover:bg-neutral-800 text-xs text-neutral-300 flex items-center justify-center cursor-pointer"
                >
                  ⌫
                </button>
              </div>

              <div className="mt-2 text-center">
                <span className="text-[10px] text-neutral-500">
                  Active target: {cleanPhone}
                </span>
              </div>
            </div>
          )}

          {/* Phone Home Bar */}
          <div className="w-24 h-1 bg-neutral-600 rounded-full mx-auto mb-1 z-10" />
        </div>
      </div>
    </div>
  );
};
